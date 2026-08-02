#!/usr/bin/env node
// Generates src/companion/auth/auth-config.enc.json.
//
// The repo never stores role passphrases in cleartext, and never stores
// anything reversible either: each role gets a random salt + a SHA-256
// hash of (salt + passphrase). The whole {role: {salt, hash}} object is
// then AES-GCM encrypted with a key that is NOT committed — it's injected
// at build time via the VITE_AUTH_CONFIG_KEY env var (GH Secret in CI).
//
// Why encrypt hashes that are already one-way? Defense in depth for near
// to zero extra cost: it means a casual repo browse doesn't even see that
// a hash exists for a given role, let alone get a crack-able target.
//
// Usage:
//   node scripts/generate-companion-auth-config.mjs
//   node scripts/generate-companion-auth-config.mjs --key <existing-hex-key>
//
// Passphrases are read from ROLE_PASSPHRASE_ATTENDEE / _SPEAKER / _ADMIN
// env vars if set, otherwise fall back to the MVP defaults below (fine for
// a preview/demo, must be rotated before real conference use).

import { webcrypto as crypto } from "node:crypto"
import { writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const encoder = new TextEncoder()

function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

function hexToBuffer(hex) {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16)
  }
  return bytes
}

async function sha256Hex(input) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(input))
  return bufferToHex(digest)
}

function randomHexKey(bytes = 32) {
  return bufferToHex(crypto.getRandomValues(new Uint8Array(bytes)).buffer)
}

function randomSalt() {
  return bufferToHex(crypto.getRandomValues(new Uint8Array(16)).buffer)
}

async function importAesKey(keyHex) {
  return crypto.subtle.importKey("raw", hexToBuffer(keyHex), "AES-GCM", false, [
    "encrypt",
  ])
}

async function encryptJson(data, keyHex) {
  const key = await importAesKey(keyHex)
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const plaintext = encoder.encode(JSON.stringify(data))
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext)
  return { iv: bufferToHex(iv.buffer), ciphertext: bufferToHex(ciphertext) }
}

const DEFAULT_PASSPHRASES = {
  attendee: "harbor2026",
  speaker: "keynote2026",
  admin: "admin2026x7",
}

async function main() {
  const args = process.argv.slice(2)
  const keyArgIndex = args.indexOf("--key")
  const key =
    keyArgIndex !== -1 ? args[keyArgIndex + 1] : randomHexKey()

  const passphrases = {
    attendee: process.env.ROLE_PASSPHRASE_ATTENDEE || DEFAULT_PASSPHRASES.attendee,
    speaker: process.env.ROLE_PASSPHRASE_SPEAKER || DEFAULT_PASSPHRASES.speaker,
    admin: process.env.ROLE_PASSPHRASE_ADMIN || DEFAULT_PASSPHRASES.admin,
  }

  const roleHashes = {}
  for (const [role, passphrase] of Object.entries(passphrases)) {
    const salt = randomSalt()
    const hash = await sha256Hex(salt + passphrase)
    roleHashes[role] = { salt, hash }
  }

  const encrypted = await encryptJson(roleHashes, key)
  const outPath = join(__dirname, "../src/companion/auth/auth-config.enc.json")
  writeFileSync(outPath, JSON.stringify(encrypted, null, 2) + "\n")

  console.log("Wrote", outPath)
  console.log("")
  console.log("VITE_AUTH_CONFIG_KEY (set this as a GH Secret + local .env):")
  console.log(key)
  console.log("")
  console.log("Passphrases used (only shown here, never stored anywhere):")
  for (const [role, phrase] of Object.entries(passphrases)) {
    console.log(`  ${role}: ${phrase}`)
  }
}

main()
