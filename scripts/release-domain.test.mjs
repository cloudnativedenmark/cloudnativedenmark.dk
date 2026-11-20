import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import test from "node:test"
import { fileURLToPath } from "node:url"
import { attachReleaseDomain, releaseTargets } from "./release-domain.mjs"

const account = "acc"
const zone = "zone"
const domain = "2026.cloudnativedenmark.dk"
const target = "cloudnative-denmark-2026.pages.dev"
const projectPath = `/accounts/${account}/pages/projects/cloudnative-denmark-2026`
const domainsPath = `${projectPath}/domains`
const domainPath = `${domainsPath}/${domain}`
const recordsPath = `/zones/${zone}/dns_records`
const listRecords = `GET ${recordsPath}?name=${domain}`

const ok = (result) => ({ json: { success: true, result } })
const failure = (status, code, message) => ({
  status,
  json: { success: false, errors: [{ code, message }] },
})

const fakeCloudflare = (routes) => {
  const calls = []
  const fetchImpl = async (url, { method, body }) => {
    const key = `${method} ${url.replace("https://api.cloudflare.com/client/v4", "")}`
    calls.push({ key, body: body && JSON.parse(body) })
    const route = routes[key]
    const { status = 200, json } =
      (typeof route === "function" ? route() : route) ??
      failure(404, 7003, "no route")
    return { ok: status < 300, status, json: async () => json }
  }
  return { calls, fetchImpl }
}

const pagesCname = (overrides = {}) => ({
  id: "r1",
  type: "CNAME",
  content: target,
  proxied: true,
  ...overrides,
})

// An attached, active domain with a correct CNAME; tests override pieces.
const settled = (routes = {}, subdomain = target) => ({
  [`GET ${projectPath}`]: ok({ subdomain, production_branch: "release-2026" }),
  [`GET ${domainsPath}`]: ok([
    { name: "other.example", status: "active" },
    { name: domain, status: "active" },
  ]),
  [`GET ${domainPath}`]: ok({ name: domain, status: "active" }),
  [listRecords]: ok([pagesCname()]),
  ...routes,
})

const attach = (fetchImpl, options = {}) =>
  attachReleaseDomain("2026", {
    token: "t",
    accountId: account,
    zoneId: zone,
    fetchImpl,
    sleep: async () => {},
    log: () => {},
    ...options,
  })

const writes = (calls) =>
  calls.filter(({ key }) => !key.startsWith("GET ")).map(({ key }) => key)
const bodyOf = (calls, key) => calls.find((call) => call.key === key).body

test("derives branch, Pages project and domain from the year", () => {
  assert.deepEqual(releaseTargets("2026"), {
    name: "2026",
    branch: "release-2026",
    project: "cloudnative-denmark-2026",
    domain,
  })
})

test("only accepts four-digit years", () => {
  for (const name of ["", "www", "api", "2026x", "20261", "release-2026"]) {
    assert.throws(() => releaseTargets(name), /Invalid release name/, name)
  }
})

test("prints workflow outputs and fails on invalid names", () => {
  const script = fileURLToPath(new URL("./release-domain.mjs", import.meta.url))
  assert.equal(
    execFileSync("node", [script, "targets", "2026"], { encoding: "utf8" }),
    `name=2026\nbranch=release-2026\nproject=cloudnative-denmark-2026\ndomain=${domain}\n`
  )
  assert.throws(
    () =>
      execFileSync("node", [script, "targets", "2026\nbranch=main"], {
        stdio: "pipe",
      }),
    /Invalid release name/
  )
})

test("creates a proxied CNAME to the project's Pages address, then attaches the domain", async () => {
  let reads = 0
  const { calls, fetchImpl } = fakeCloudflare(
    settled(
      {
        [`GET ${domainsPath}`]: ok([]),
        [`POST ${domainsPath}`]: ok({ name: domain, status: "initializing" }),
        [`GET ${domainPath}`]: () =>
          ok({ status: ++reads > 1 ? "active" : "pending" }),
        [listRecords]: ok([]),
        [`POST ${recordsPath}`]: ok({ id: "r1" }),
      },
      "cloudnative-denmark-2026-x1y.pages.dev"
    )
  )

  await attach(fetchImpl)

  assert.equal(reads, 2)
  assert.deepEqual(writes(calls), [
    `POST ${recordsPath}`,
    `POST ${domainsPath}`,
  ])
  assert.deepEqual(bodyOf(calls, `POST ${domainsPath}`), { name: domain })
  assert.deepEqual(bodyOf(calls, `POST ${recordsPath}`), {
    type: "CNAME",
    name: domain,
    content: "cloudnative-denmark-2026-x1y.pages.dev",
    proxied: true,
    ttl: 1,
    comment: "Managed by .github/workflows/release.yml",
  })
})

test("changes nothing when the domain and CNAME are already in place", async () => {
  const { calls, fetchImpl } = fakeCloudflare(settled())

  await attach(fetchImpl)

  assert.deepEqual(writes(calls), [])
})

test("repoints a CNAME that targets another Pages project", async () => {
  const { calls, fetchImpl } = fakeCloudflare(
    settled({
      [listRecords]: ok([pagesCname({ content: "old.pages.dev" })]),
      [`PATCH ${recordsPath}/r1`]: ok({ id: "r1" }),
    })
  )

  await attach(fetchImpl)

  assert.deepEqual(writes(calls), [`PATCH ${recordsPath}/r1`])
  assert.deepEqual(bodyOf(calls, `PATCH ${recordsPath}/r1`), {
    content: target,
    proxied: true,
  })
})

test("turns on the proxy for a DNS-only CNAME", async () => {
  const { calls, fetchImpl } = fakeCloudflare(
    settled({
      [listRecords]: ok([pagesCname({ proxied: false })]),
      [`PATCH ${recordsPath}/r1`]: ok({ id: "r1" }),
    })
  )

  await attach(fetchImpl)

  assert.deepEqual(writes(calls), [`PATCH ${recordsPath}/r1`])
})

test("refuses to repoint a CNAME that isn't a Pages project", async () => {
  const { calls, fetchImpl } = fakeCloudflare(
    settled({
      [listRecords]: ok([
        pagesCname({ content: "cloudnativedenmark.github.io", proxied: false }),
      ]),
    })
  )

  await assert.rejects(attach(fetchImpl), /not a Pages project/)
  assert.deepEqual(writes(calls), [])
})

test("refuses to touch a name that has other record types", async () => {
  const { calls, fetchImpl } = fakeCloudflare(
    settled({
      [listRecords]: ok([{ id: "r1", type: "A", content: "192.0.2.1" }]),
    })
  )

  await assert.rejects(attach(fetchImpl), /already has A records/)
  assert.deepEqual(writes(calls), [])
})

test("looks up the zone by name when no zone id is given", async () => {
  const { calls, fetchImpl } = fakeCloudflare(
    settled({ "GET /zones?name=cloudnativedenmark.dk": ok([{ id: zone }]) })
  )

  await attach(fetchImpl, { zoneId: "" })

  assert.ok(
    calls.some(({ key }) => key === "GET /zones?name=cloudnativedenmark.dk")
  )
})

for (const status of ["error", "deactivated"]) {
  test(`retries validation of a domain that is ${status}`, async () => {
    const { calls, fetchImpl } = fakeCloudflare(
      settled({
        [`GET ${domainsPath}`]: ok([{ name: domain, status }]),
        [`PATCH ${domainPath}`]: ok({ status: "pending" }),
      })
    )

    await attach(fetchImpl)

    assert.deepEqual(writes(calls), [`PATCH ${domainPath}`])
  })
}

test("fails when Cloudflare refuses to retry validation", async () => {
  const { fetchImpl } = fakeCloudflare(
    settled({
      [`GET ${domainsPath}`]: ok([{ name: domain, status: "error" }]),
      [`PATCH ${domainPath}`]: failure(400, 8000000, "cannot retry"),
    })
  )

  await assert.rejects(attach(fetchImpl), /8000000: cannot retry/)
})

test("fails without attaching when listing domains errors", async () => {
  const { calls, fetchImpl } = fakeCloudflare(
    settled({ [`GET ${domainsPath}`]: failure(403, 10000, "denied") })
  )

  await assert.rejects(attach(fetchImpl), /HTTP 403\) 10000: denied/)
  assert.deepEqual(writes(calls), [])
})

test("treats HTTP 200 with success: false as a failure", async () => {
  const { fetchImpl } = fakeCloudflare(
    settled({
      [listRecords]: {
        json: {
          success: false,
          errors: [{ code: 9109, message: "bad token" }],
        },
      },
    })
  )

  await assert.rejects(attach(fetchImpl), /9109: bad token/)
})

test("fails when Cloudflare rejects the domain", async () => {
  const { fetchImpl } = fakeCloudflare(
    settled({
      [`GET ${domainsPath}`]: ok([]),
      [`POST ${domainsPath}`]: failure(
        409,
        8000018,
        "already added to another project"
      ),
    })
  )

  await assert.rejects(
    attach(fetchImpl),
    /8000018: already added to another project/
  )
})

test("keeps polling through rate limits and server errors", async () => {
  const replies = [
    failure(429, 10429, "rate limited"),
    failure(503, 10503, "unavailable"),
    ok({ status: "active" }),
  ]
  const { fetchImpl } = fakeCloudflare(
    settled({ [`GET ${domainPath}`]: () => replies.shift() })
  )

  await attach(fetchImpl)

  assert.equal(replies.length, 0)
})

test("gives up when the domain never becomes active", async () => {
  let reads = 0
  const { fetchImpl } = fakeCloudflare(
    settled({
      [`GET ${domainPath}`]: () => {
        reads++
        return ok({ status: "pending" })
      },
    })
  )

  await assert.rejects(
    attach(fetchImpl, { attempts: 3 }),
    /is "pending", not active/
  )
  assert.equal(reads, 3)
})

test("stops waiting when the domain is blocked", async () => {
  let reads = 0
  const { fetchImpl } = fakeCloudflare(
    settled({
      [`GET ${domainPath}`]: () => {
        reads++
        return ok({ status: "blocked" })
      },
    })
  )

  await assert.rejects(attach(fetchImpl), /is "blocked", not active/)
  assert.equal(reads, 1)
})

test("sends an explicit body when retrying validation", async () => {
  const { calls, fetchImpl } = fakeCloudflare(
    settled({
      [`GET ${domainsPath}`]: ok([{ name: domain, status: "error" }]),
      [`PATCH ${domainPath}`]: ok({ status: "pending" }),
    })
  )

  await attach(fetchImpl)

  assert.deepEqual(bodyOf(calls, `PATCH ${domainPath}`), {})
})

test("refuses a Pages project whose production branch is another branch", async () => {
  const { calls, fetchImpl } = fakeCloudflare(
    settled({
      [`GET ${projectPath}`]: ok({
        subdomain: target,
        production_branch: "main",
      }),
    })
  )

  await assert.rejects(attach(fetchImpl), /serves production from "main"/)
  assert.deepEqual(writes(calls), [])
})

test("keeps polling through network errors", async () => {
  let reads = 0
  const { fetchImpl } = fakeCloudflare(settled())
  const flaky = async (url, init) => {
    if (url.endsWith(domainPath) && init.method === "GET" && reads++ < 2) {
      throw new Error("ECONNRESET")
    }
    return fetchImpl(url, init)
  }

  await attach(flaky)

  assert.equal(reads, 3)
})

test("reports an unreachable API instead of an undefined status", async () => {
  const { fetchImpl } = fakeCloudflare(settled())
  const down = async (url, init) => {
    if (url.endsWith(domainPath) && init.method === "GET") {
      throw new Error("ECONNRESET")
    }
    return fetchImpl(url, init)
  }

  await assert.rejects(attach(down, { attempts: 2 }), /is "unreachable"/)
})

test("sends every request with a timeout and names failed calls", async () => {
  const signals = []
  const { fetchImpl } = fakeCloudflare(settled())
  const hung = async (url, init) => {
    signals.push(init.signal)
    if (url.endsWith("/pages/projects/cloudnative-denmark-2026")) {
      throw new DOMException(
        "The operation was aborted due to timeout",
        "TimeoutError"
      )
    }
    return fetchImpl(url, init)
  }

  await assert.rejects(
    attach(hung),
    /Cloudflare: GET \/accounts\/acc\/pages\/projects\/cloudnative-denmark-2026 failed: The operation was aborted due to timeout/
  )
  assert.ok(signals.length > 0)
  assert.ok(signals.every((signal) => signal instanceof AbortSignal))
})
