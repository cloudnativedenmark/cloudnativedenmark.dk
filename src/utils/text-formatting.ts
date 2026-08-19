export const formatPlainTextToHtml = (
  text: string | null | undefined
): string => {
  if (!text) {
    return ""
  }

  const escapedText = text
    .replace(/\r\n?/g, "\n")
    .trim()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")

  const runs: string[] = []

  escapedText.split(/\n{2,}/).forEach((block) => {
    const lines = block
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    let currentKind: "bullet" | "paragraph" | null = null
    let currentLines: string[] = []

    const emitRun = () => {
      if (currentLines.length === 0 || currentKind === null) {
        return
      }

      if (currentKind === "bullet") {
        runs.push(
          `<ul>${currentLines.map((line) => `<li>${line}</li>`).join("")}</ul>`
        )
      } else {
        runs.push(`<p>${currentLines.join("<br />")}</p>`)
      }
      currentLines = []
    }

    lines.forEach((line) => {
      const bullet = line.match(/^[-*\u2022]\s+/)
      const kind = bullet === null ? "paragraph" : "bullet"
      if (kind !== currentKind) {
        emitRun()
        currentKind = kind
      }
      currentLines.push(
        bullet === null ? line : line.replace(/^[-*\u2022]\s+/, "")
      )
    })

    emitRun()
  })

  return runs.join("")
}
