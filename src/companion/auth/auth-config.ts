import encryptedConfig from "./auth-config.enc.json"
import { decryptJson, sha256Hex } from "./crypto"

export type Role = "attendee" | "speaker" | "admin"

interface RoleHash {
  salt: string
  hash: string
}

type RoleHashes = Record<Role, RoleHash>

// MVP demo key — matches the key `scripts/generate-companion-auth-config.mjs`
// was run with, so this ships working out of the box with no setup.
//
// Before real conference use: rerun the generator with real passphrases
// (ROLE_PASSPHRASE_ATTENDEE / _SPEAKER / _ADMIN env vars), commit the new
// auth-config.enc.json, and set VITE_AUTH_CONFIG_KEY as a GH Secret so this
// fallback is never the one actually in effect for production. See
// src/companion/README.md.
const DEMO_KEY =
  "cbfc34eda68d6e8a2e2f49d61bdb097f73b1e67640ff686f43e31f27e39a5040"

function getConfigKey(): string {
  return import.meta.env.VITE_AUTH_CONFIG_KEY || DEMO_KEY
}

let cachedHashes: Promise<RoleHashes> | null = null

function loadRoleHashes(): Promise<RoleHashes> {
  if (!cachedHashes) {
    cachedHashes = decryptJson<RoleHashes>(encryptedConfig, getConfigKey())
  }
  return cachedHashes
}

export async function verifyPassphrase(
  passphrase: string
): Promise<Role | null> {
  const trimmed = passphrase.trim()
  if (!trimmed) return null

  const hashes = await loadRoleHashes()
  for (const role of Object.keys(hashes) as Role[]) {
    const { salt, hash } = hashes[role]
    const candidate = await sha256Hex(salt + trimmed)
    if (candidate === hash) {
      return role
    }
  }
  return null
}
