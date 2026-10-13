import { appendFile } from "node:fs/promises"
import { digest, fetchShareData } from "./share-data.mjs"

const data = await fetchShareData()
const currentHash = digest(data)
let deployedHash

try {
  const response = await fetch(
    `https://cloudnativedenmark.dk/share-data-hash.json?t=${Date.now()}`,
    {
      cache: "no-store",
    }
  )
  if (response.ok) deployedHash = (await response.json()).hash
} catch {
  // A missing or unreadable manifest must cause a build, not a skipped update.
}

const changed = currentHash !== deployedHash
console.log(
  changed
    ? "Share pages changed; build required"
    : "Share pages unchanged; skip build"
)

if (process.env.GITHUB_OUTPUT) {
  await appendFile(process.env.GITHUB_OUTPUT, `changed=${changed}\n`)
}
