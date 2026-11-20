import assert from "node:assert/strict"
import test from "node:test"
import { attachReleaseDomain, releaseTargets } from "./release-domain.mjs"

const account = "acc"
const zone = "zone"
const domainPath = `/accounts/${account}/pages/projects/cloudnative-denmark-2027/domains`

const fakeCloudflare = (routes) => {
  const calls = []
  const fetchImpl = async (url, { method, body }) => {
    const path = url.replace("https://api.cloudflare.com/client/v4", "")
    const key = `${method} ${path}`
    calls.push({ key, body: body && JSON.parse(body) })
    const route = routes[key]
    const reply = typeof route === "function" ? route() : route
    const { status = 200, json } = reply ?? {
      status: 404,
      json: { success: false, errors: [{ code: 404, message: "not found" }] },
    }
    return { ok: status < 300, status, json: async () => json }
  }
  return { calls, fetchImpl }
}

const ok = (result) => ({ json: { success: true, result } })

const attach = (fetchImpl, zoneId = zone) =>
  attachReleaseDomain("2027", {
    token: "t",
    accountId: account,
    zoneId,
    fetchImpl,
    sleep: async () => {},
    log: () => {},
  })

const writes = (calls) =>
  calls.filter(({ key }) => !key.startsWith("GET ")).map(({ key }) => key)

test("derives branch, Pages project and domain from the release name", () => {
  assert.deepEqual(releaseTargets("2027"), {
    name: "2027",
    branch: "release-2027",
    project: "cloudnative-denmark-2027",
    domain: "2027.cloudnativedenmark.dk",
  })
})

test("rejects names that can't be a Pages project or DNS label", () => {
  for (const name of ["", "2027_x", "Prod", "-2027", "2027-", "release-2027"]) {
    assert.throws(() => releaseTargets(name), /Invalid release name/, name)
  }
  assert.throws(() => releaseTargets("a".repeat(39)), /Invalid release name/)
})

test("attaches the domain and creates a proxied CNAME for a new release", async () => {
  let reads = 0
  const { calls, fetchImpl } = fakeCloudflare({
    [`GET ${domainPath}/2027.cloudnativedenmark.dk`]: () => {
      reads++
      if (reads === 1) return undefined
      return ok({ status: reads > 2 ? "active" : "pending" })
    },
    [`POST ${domainPath}`]: ok({ status: "initializing" }),
    [`GET /zones/${zone}/dns_records?name=2027.cloudnativedenmark.dk`]: ok([]),
    [`POST /zones/${zone}/dns_records`]: ok({ id: "r1" }),
  })

  await attach(fetchImpl)

  assert.equal(reads, 3)
  assert.deepEqual(writes(calls), [
    `POST ${domainPath}`,
    `POST /zones/${zone}/dns_records`,
  ])
  assert.deepEqual(calls.find(({ key }) => key === `POST ${domainPath}`).body, {
    name: "2027.cloudnativedenmark.dk",
  })
  assert.deepEqual(
    calls.find(({ key }) => key === `POST /zones/${zone}/dns_records`).body,
    {
      type: "CNAME",
      name: "2027.cloudnativedenmark.dk",
      content: "cloudnative-denmark-2027.pages.dev",
      proxied: true,
      ttl: 1,
      comment: "Managed by .github/workflows/release.yml",
    }
  )
})

test("changes nothing when the domain and CNAME are already in place", async () => {
  const { calls, fetchImpl } = fakeCloudflare({
    [`GET ${domainPath}/2027.cloudnativedenmark.dk`]: ok({ status: "active" }),
    [`GET /zones/${zone}/dns_records?name=2027.cloudnativedenmark.dk`]: ok([
      {
        id: "r1",
        type: "CNAME",
        content: "cloudnative-denmark-2027.pages.dev",
        proxied: true,
      },
    ]),
  })

  await attach(fetchImpl)

  assert.deepEqual(writes(calls), [])
})

test("updates a CNAME that points elsewhere or isn't proxied", async () => {
  const { calls, fetchImpl } = fakeCloudflare({
    [`GET ${domainPath}/2027.cloudnativedenmark.dk`]: ok({ status: "active" }),
    [`GET /zones/${zone}/dns_records?name=2027.cloudnativedenmark.dk`]: ok([
      { id: "r1", type: "CNAME", content: "other.pages.dev", proxied: false },
    ]),
    [`PATCH /zones/${zone}/dns_records/r1`]: ok({ id: "r1" }),
  })

  await attach(fetchImpl)

  assert.deepEqual(writes(calls), [`PATCH /zones/${zone}/dns_records/r1`])
  assert.deepEqual(calls.find(({ key }) => key.startsWith("PATCH ")).body, {
    content: "cloudnative-denmark-2027.pages.dev",
    proxied: true,
  })
})

test("refuses to touch a name that has other record types", async () => {
  const { calls, fetchImpl } = fakeCloudflare({
    [`GET ${domainPath}/2027.cloudnativedenmark.dk`]: ok({ status: "active" }),
    [`GET /zones/${zone}/dns_records?name=2027.cloudnativedenmark.dk`]: ok([
      { id: "r1", type: "A", content: "192.0.2.1", proxied: true },
    ]),
  })

  await assert.rejects(attach(fetchImpl), /already has A records/)
  assert.deepEqual(writes(calls), [])
})

test("looks up the zone by name when no zone id is given", async () => {
  const { calls, fetchImpl } = fakeCloudflare({
    [`GET ${domainPath}/2027.cloudnativedenmark.dk`]: ok({ status: "active" }),
    "GET /zones?name=cloudnativedenmark.dk": ok([{ id: zone }]),
    [`GET /zones/${zone}/dns_records?name=2027.cloudnativedenmark.dk`]: ok([]),
    [`POST /zones/${zone}/dns_records`]: ok({ id: "r1" }),
  })

  await attach(fetchImpl, "")

  assert.ok(
    calls.some(({ key }) => key === "GET /zones?name=cloudnativedenmark.dk")
  )
  assert.deepEqual(writes(calls), [`POST /zones/${zone}/dns_records`])
})

test("fails when Cloudflare rejects the domain", async () => {
  const { fetchImpl } = fakeCloudflare({
    [`POST ${domainPath}`]: {
      status: 409,
      json: {
        success: false,
        errors: [
          { code: 8000018, message: "already added to another project" },
        ],
      },
    },
  })

  await assert.rejects(
    attach(fetchImpl),
    /8000018: already added to another project/
  )
})

test("fails when the domain ends in an error state", async () => {
  const { fetchImpl } = fakeCloudflare({
    [`GET ${domainPath}/2027.cloudnativedenmark.dk`]: ok({ status: "error" }),
    [`GET /zones/${zone}/dns_records?name=2027.cloudnativedenmark.dk`]: ok([
      {
        id: "r1",
        type: "CNAME",
        content: "cloudnative-denmark-2027.pages.dev",
        proxied: true,
      },
    ]),
  })

  await assert.rejects(attach(fetchImpl), /is "error", not active/)
})
