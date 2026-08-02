import encryptedConfig from "../auth-config.enc.json"
import { decryptJson, sha256Hex } from "../crypto"

// auth-config.ts itself can't be imported directly under ts-jest — it
// reads `import.meta.env.VITE_AUTH_CONFIG_KEY`, and `import.meta` isn't
// supported under the CommonJS module target ts-jest uses (same
// constraint src/utils/data-loader.ts hits with `import.meta.glob`, see
// that file's test for the same workaround: exercise the underlying
// logic directly instead of importing the module that touches
// `import.meta`).
//
// This still validates the thing that actually matters: that the real
// committed auth-config.enc.json decrypts with the documented demo key,
// and that the real demo passphrases resolve to the roles they're meant
// to. If someone regenerates the config and forgets to update the demo
// key fallback in auth-config.ts, this test catches it.

const DEMO_KEY =
  "cbfc34eda68d6e8a2e2f49d61bdb097f73b1e67640ff686f43e31f27e39a5040"

type Role = "attendee" | "speaker" | "admin"
type RoleHashes = Record<Role, { salt: string; hash: string }>

async function verify(passphrase: string): Promise<Role | null> {
  const hashes = await decryptJson<RoleHashes>(encryptedConfig, DEMO_KEY)
  for (const role of Object.keys(hashes) as Role[]) {
    const { salt, hash } = hashes[role]
    if ((await sha256Hex(salt + passphrase)) === hash) {
      return role
    }
  }
  return null
}

describe("committed auth-config.enc.json + demo key", () => {
  it("resolves the documented demo passphrases to the right role", async () => {
    expect(await verify("harbor2026")).toBe("attendee")
    expect(await verify("keynote2026")).toBe("speaker")
    expect(await verify("admin2026x7")).toBe("admin")
  })

  it("rejects an unrecognized passphrase", async () => {
    expect(await verify("not-a-real-passphrase")).toBeNull()
  })

  it("is case- and whitespace-sensitive", async () => {
    expect(await verify("Harbor2026")).toBeNull()
    expect(await verify(" harbor2026 ")).toBeNull()
  })
})
