// Isomorphic Web Crypto helpers (runs unmodified in the browser bundle and
// in the Node generation script — Node has had a global `crypto.subtle`
// since v19). Kept dependency-free on purpose.

const encoder = new TextEncoder()

export function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export function hexToBuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16)
  }
  return bytes
}

export async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(input))
  return bufferToHex(digest)
}

export function randomHexKey(bytes = 32): string {
  return bufferToHex(
    crypto.getRandomValues(new Uint8Array(bytes)).buffer as ArrayBuffer
  )
}

export function randomSalt(): string {
  return bufferToHex(
    crypto.getRandomValues(new Uint8Array(16)).buffer as ArrayBuffer
  )
}

async function importAesKey(keyHex: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    hexToBuffer(keyHex) as BufferSource,
    "AES-GCM",
    false,
    ["encrypt", "decrypt"]
  )
}

export interface EncryptedPayload {
  iv: string
  ciphertext: string
}

export async function encryptJson(
  data: unknown,
  keyHex: string
): Promise<EncryptedPayload> {
  const key = await importAesKey(keyHex)
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const plaintext = encoder.encode(JSON.stringify(data))
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    plaintext
  )
  return {
    iv: bufferToHex(iv.buffer as ArrayBuffer),
    ciphertext: bufferToHex(ciphertext),
  }
}

export async function decryptJson<T>(
  payload: EncryptedPayload,
  keyHex: string
): Promise<T> {
  const key = await importAesKey(keyHex)
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: hexToBuffer(payload.iv) as BufferSource },
    key,
    hexToBuffer(payload.ciphertext) as BufferSource
  )
  return JSON.parse(new TextDecoder().decode(plaintext)) as T
}
