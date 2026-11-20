import { pathToFileURL } from "node:url"

const api = "https://api.cloudflare.com/client/v4"
export const zoneName = "cloudnativedenmark.dk"

export const releaseTargets = (name) => {
  if (!/^\d{4}$/.test(name)) {
    throw new Error(
      `Invalid release name "${name}". Use the conference year, e.g. 2026.`
    )
  }
  return {
    name,
    branch: `release-${name}`,
    project: `cloudnative-denmark-${name}`,
    domain: `${name}.${zoneName}`,
  }
}

export const cloudflare =
  (token, fetchImpl = fetch) =>
  async (method, path, body) => {
    const response = await fetchImpl(`${api}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    const json = await response.json().catch(() => ({}))
    return {
      ok: response.ok && json.success === true,
      status: response.status,
      result: json.result,
      errors: json.errors ?? [],
    }
  }

const must = (response, action) => {
  if (!response.ok) {
    const reason = response.errors
      .map(({ code, message }) => `${code}: ${message}`)
      .join("; ")
    throw new Error(
      `Cloudflare: ${action} failed (HTTP ${response.status}) ${reason}`
    )
  }
  return response.result
}

export const findZoneId = async (call) => {
  const zones = must(
    await call("GET", `/zones?name=${zoneName}`),
    `look up zone ${zoneName}`
  )
  if (!zones?.length) throw new Error(`Cloudflare: zone ${zoneName} not found`)
  return zones[0].id
}

export const pagesSubdomain = async (call, accountId, { project }) =>
  must(
    await call("GET", `/accounts/${accountId}/pages/projects/${project}`),
    `read Pages project ${project}`
  ).subdomain

export const ensureCname = async (call, zoneId, { domain }, target) => {
  const records = must(
    await call("GET", `/zones/${zoneId}/dns_records?name=${domain}`),
    `list DNS records for ${domain}`
  )
  const conflicts = records.filter((record) => record.type !== "CNAME")
  if (conflicts.length) {
    throw new Error(
      `DNS: ${domain} already has ${conflicts.map((r) => r.type).join(", ")} records. Remove them and rerun.`
    )
  }
  const [cname] = records
  if (cname?.content === target && cname.proxied) return "unchanged"
  if (cname && !cname.content.endsWith(".pages.dev")) {
    throw new Error(
      `DNS: ${domain} points at ${cname.content}, not a Pages project. Refusing to change it.`
    )
  }
  if (cname) {
    must(
      await call("PATCH", `/zones/${zoneId}/dns_records/${cname.id}`, {
        content: target,
        proxied: true,
      }),
      `update CNAME ${domain}`
    )
    return "updated"
  }
  must(
    await call("POST", `/zones/${zoneId}/dns_records`, {
      type: "CNAME",
      name: domain,
      content: target,
      proxied: true,
      ttl: 1,
      comment: "Managed by .github/workflows/release.yml",
    }),
    `create CNAME ${domain}`
  )
  return "created"
}

const retryableStatuses = ["error", "deactivated"]

export const ensurePagesDomain = async (
  call,
  accountId,
  { project, domain }
) => {
  const path = `/accounts/${accountId}/pages/projects/${project}/domains`
  const existing = must(
    await call("GET", path),
    `list domains of Pages project ${project}`
  ).find(({ name }) => name === domain)
  if (!existing) {
    must(
      await call("POST", path, { name: domain }),
      `attach ${domain} to Pages project ${project}`
    )
    return "created"
  }
  const { status } = existing
  if (retryableStatuses.includes(status)) {
    must(
      await call("PATCH", `${path}/${domain}`),
      `retry validation of ${domain}`
    )
    return `retried (was ${status})`
  }
  return "unchanged"
}

export const waitForActiveDomain = async (
  call,
  accountId,
  { project, domain },
  {
    attempts = 40,
    sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  } = {}
) => {
  const path = `/accounts/${accountId}/pages/projects/${project}/domains/${domain}`
  let status
  for (let attempt = 1; attempt <= attempts; attempt++) {
    const response = await call("GET", path)
    const transient = response.status === 429 || response.status >= 500
    if (!transient) status = must(response, `read ${domain} status`).status
    if (status === "active") return status
    if (status === "blocked") break
    if (attempt < attempts) await sleep(15_000)
  }
  throw new Error(`Pages: ${domain} is "${status}", not active`)
}

export const attachReleaseDomain = async (
  name,
  { token, accountId, zoneId, fetchImpl, sleep, attempts, log = console.log }
) => {
  const targets = releaseTargets(name)
  const call = cloudflare(token, fetchImpl)
  const target = await pagesSubdomain(call, accountId, targets)
  const zone = zoneId || (await findZoneId(call))
  const dns = await ensureCname(call, zone, targets, target)
  log(`CNAME ${targets.domain} -> ${target}: ${dns}`)
  const pages = await ensurePagesDomain(call, accountId, targets)
  log(`Pages domain ${targets.domain}: ${pages}`)
  await waitForActiveDomain(call, accountId, targets, { sleep, attempts })
  log(`Pages domain ${targets.domain}: active`)
}

const main = async ([command, name]) => {
  if (command === "targets") {
    for (const [key, value] of Object.entries(releaseTargets(name))) {
      console.log(`${key}=${value}`)
    }
    return
  }
  if (command === "attach") {
    const { CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_ZONE_ID } =
      process.env
    if (!CLOUDFLARE_API_TOKEN || !CLOUDFLARE_ACCOUNT_ID) {
      throw new Error(
        "CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID are required"
      )
    }
    await attachReleaseDomain(name, {
      token: CLOUDFLARE_API_TOKEN,
      accountId: CLOUDFLARE_ACCOUNT_ID,
      zoneId: CLOUDFLARE_ZONE_ID,
    })
    return
  }
  throw new Error("Usage: release-domain.mjs <targets|attach> <release-name>")
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error.message)
    process.exit(1)
  })
}
