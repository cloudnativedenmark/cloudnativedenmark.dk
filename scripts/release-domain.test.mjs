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
const notFound = {
  status: 404,
  json: { success: false, errors: [{ code: 8000007, message: "not found" }] },
}

const fakeCloudflare = (routes) => {
  const calls = []
  const fetchImpl = async (url, { method, body }) => {
    const key = `${method} ${url.replace("https://api.cloudflare.com/client/v4", "")}`
    calls.push({ key, body: body && JSON.parse(body) })
    const route = routes[key]
    const { status = 200, json } =
      (typeof route === "function" ? route() : route) ?? notFound
    return { ok: status < 300, status, json: async () => json }
  }
  return { calls, fetchImpl }
}

const withProject = (routes, subdomain = target) => ({
  [`GET ${projectPath}`]: ok({ subdomain }),
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

const pagesCname = (overrides = {}) => ({
  id: "r1",
  type: "CNAME",
  content: target,
  proxied: true,
  ...overrides,
})

test("derives branch, Pages project and domain from the release name", () => {
  assert.deepEqual(releaseTargets("2026"), {
    name: "2026",
    branch: "release-2026",
    project: "cloudnative-denmark-2026",
    domain,
  })
})

test("rejects names that can't be a Pages project or DNS label", () => {
  for (const name of ["", "2026_x", "Prod", "-2026", "2026-", "release-2026"]) {
    assert.throws(() => releaseTargets(name), /Invalid release name/, name)
  }
  assert.throws(() => releaseTargets("a".repeat(39)), /Invalid release name/)
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
    withProject(
      {
        [`GET ${domainPath}`]: () => {
          reads++
          if (reads === 1) return notFound
          return ok({ status: reads > 2 ? "active" : "pending" })
        },
        [`POST ${domainsPath}`]: ok({ status: "initializing" }),
        [listRecords]: ok([]),
        [`POST ${recordsPath}`]: ok({ id: "r1" }),
      },
      "cloudnative-denmark-2026-x1y.pages.dev"
    )
  )

  await attach(fetchImpl)

  assert.equal(reads, 3)
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
  const { calls, fetchImpl } = fakeCloudflare(
    withProject({
      [`GET ${domainPath}`]: ok({ status: "active" }),
      [listRecords]: ok([pagesCname()]),
    })
  )

  await attach(fetchImpl)

  assert.deepEqual(writes(calls), [])
})

test("repoints a CNAME that targets another Pages project", async () => {
  const { calls, fetchImpl } = fakeCloudflare(
    withProject({
      [`GET ${domainPath}`]: ok({ status: "active" }),
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
    withProject({
      [`GET ${domainPath}`]: ok({ status: "active" }),
      [listRecords]: ok([pagesCname({ proxied: false })]),
      [`PATCH ${recordsPath}/r1`]: ok({ id: "r1" }),
    })
  )

  await attach(fetchImpl)

  assert.deepEqual(writes(calls), [`PATCH ${recordsPath}/r1`])
})

test("refuses to repoint a CNAME that isn't a Pages project", async () => {
  const { calls, fetchImpl } = fakeCloudflare(
    withProject({
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
    withProject({
      [listRecords]: ok([{ id: "r1", type: "A", content: "192.0.2.1" }]),
    })
  )

  await assert.rejects(attach(fetchImpl), /already has A records/)
  assert.deepEqual(writes(calls), [])
})

test("looks up the zone by name when no zone id is given", async () => {
  const { calls, fetchImpl } = fakeCloudflare(
    withProject({
      [`GET ${domainPath}`]: ok({ status: "active" }),
      "GET /zones?name=cloudnativedenmark.dk": ok([{ id: zone }]),
      [listRecords]: ok([pagesCname()]),
    })
  )

  await attach(fetchImpl, { zoneId: "" })

  assert.ok(
    calls.some(({ key }) => key === "GET /zones?name=cloudnativedenmark.dk")
  )
})

test("retries validation of a domain in an error state", async () => {
  let reads = 0
  const { calls, fetchImpl } = fakeCloudflare(
    withProject({
      [`GET ${domainPath}`]: () =>
        ok({ status: reads++ === 0 ? "error" : "active" }),
      [`PATCH ${domainPath}`]: ok({ status: "pending" }),
      [listRecords]: ok([pagesCname()]),
    })
  )

  await attach(fetchImpl)

  assert.deepEqual(writes(calls), [`PATCH ${domainPath}`])
})

test("fails without attaching when the domain lookup errors", async () => {
  const { calls, fetchImpl } = fakeCloudflare(
    withProject({
      [`GET ${domainPath}`]: {
        status: 403,
        json: { success: false, errors: [{ code: 10000, message: "denied" }] },
      },
      [listRecords]: ok([pagesCname()]),
    })
  )

  await assert.rejects(attach(fetchImpl), /HTTP 403\) 10000: denied/)
  assert.deepEqual(writes(calls), [])
})

test("treats HTTP 200 with success: false as a failure", async () => {
  const { fetchImpl } = fakeCloudflare(
    withProject({
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
    withProject({
      [listRecords]: ok([pagesCname()]),
      [`POST ${domainsPath}`]: {
        status: 409,
        json: {
          success: false,
          errors: [
            { code: 8000018, message: "already added to another project" },
          ],
        },
      },
    })
  )

  await assert.rejects(
    attach(fetchImpl),
    /8000018: already added to another project/
  )
})

test("gives up when the domain never becomes active", async () => {
  let reads = 0
  const { fetchImpl } = fakeCloudflare(
    withProject({
      [`GET ${domainPath}`]: () => {
        reads++
        return ok({ status: "pending" })
      },
      [listRecords]: ok([pagesCname()]),
    })
  )

  await assert.rejects(
    attach(fetchImpl, { attempts: 3 }),
    /is "pending", not active/
  )
  assert.equal(reads, 4)
})

test("stops waiting when the domain is blocked", async () => {
  let reads = 0
  const { fetchImpl } = fakeCloudflare(
    withProject({
      [`GET ${domainPath}`]: () => {
        reads++
        return ok({ status: "blocked" })
      },
      [listRecords]: ok([pagesCname()]),
    })
  )

  await assert.rejects(attach(fetchImpl), /is "blocked", not active/)
  assert.equal(reads, 2)
})
