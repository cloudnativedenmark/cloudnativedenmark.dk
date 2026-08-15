import {
  sha256Hex,
  randomHexKey,
  randomSalt,
  encryptJson,
  decryptJson,
  bufferToHex,
  hexToBuffer,
} from "../crypto"

describe("sha256Hex", () => {
  it("is deterministic for the same input", async () => {
    const a = await sha256Hex("hello")
    const b = await sha256Hex("hello")
    expect(a).toBe(b)
  })

  it("differs for different input", async () => {
    const a = await sha256Hex("hello")
    const b = await sha256Hex("hello!")
    expect(a).not.toBe(b)
  })

  it("returns a 64-char hex string (SHA-256)", async () => {
    const hash = await sha256Hex("anything")
    expect(hash).toMatch(/^[0-9a-f]{64}$/)
  })
})

describe("hex helpers", () => {
  it("round-trips through bufferToHex/hexToBuffer", () => {
    const original = new Uint8Array([0, 1, 2, 254, 255, 16])
    const hex = bufferToHex(original.buffer)
    const back = hexToBuffer(hex)
    expect(Array.from(back)).toEqual(Array.from(original))
  })
})

describe("randomHexKey / randomSalt", () => {
  it("produce different values each call", () => {
    expect(randomHexKey()).not.toBe(randomHexKey())
    expect(randomSalt()).not.toBe(randomSalt())
  })

  it("randomHexKey defaults to 32 bytes (64 hex chars)", () => {
    expect(randomHexKey()).toHaveLength(64)
  })
})

describe("encryptJson / decryptJson", () => {
  it("round-trips arbitrary JSON data with the right key", async () => {
    const key = randomHexKey()
    const data = { role: "admin", nested: { n: 42 }, list: [1, 2, 3] }
    const encrypted = await encryptJson(data, key)
    const decrypted = await decryptJson<typeof data>(encrypted, key)
    expect(decrypted).toEqual(data)
  })

  it("produces different ciphertext each time (random IV)", async () => {
    const key = randomHexKey()
    const first = await encryptJson({ a: 1 }, key)
    const second = await encryptJson({ a: 1 }, key)
    expect(first.ciphertext).not.toBe(second.ciphertext)
  })

  it("fails to decrypt with the wrong key", async () => {
    const encrypted = await encryptJson({ secret: true }, randomHexKey())
    await expect(decryptJson(encrypted, randomHexKey())).rejects.toBeTruthy()
  })
})
