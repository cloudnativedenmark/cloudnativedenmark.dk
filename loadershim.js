const { TextEncoder, TextDecoder } = require('util')
const { webcrypto } = require('node:crypto')

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// jsdom's built-in `crypto` global has getRandomValues but not `.subtle`,
// and defines the property as a read-only getter — a plain assignment is
// silently ignored, so this needs defineProperty to actually replace it
// with Node's real WebCrypto implementation (companion app auth needs
// crypto.subtle to be testable under jest).
Object.defineProperty(global, 'crypto', {
  value: webcrypto,
  configurable: true,
})

global.___loader = {
  enqueue: jest.fn(),
}