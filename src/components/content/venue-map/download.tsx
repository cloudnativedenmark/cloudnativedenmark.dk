import React from "react"
import { flushSync } from "react-dom"
import { createRoot } from "react-dom/client"
import type { VenueMapConfig } from "../../../config/venue-map"
import type { SponsorData } from "../../../utils/data-loader"
import FloorPlan from "./floor-plan"

const xlink = "http://www.w3.org/1999/xlink"

const renderPlan = (
  config: VenueMapConfig,
  sponsors: Record<string, SponsorData>
) => {
  const container = document.createElement("div")
  const root = createRoot(container)
  flushSync(() =>
    root.render(
      <FloorPlan
        variant="full"
        config={config}
        sponsors={sponsors}
        highlighted={null}
        selected={null}
        onHover={() => {}}
        onToggle={() => {}}
      />
    )
  )
  const svg = container.querySelector("svg")!.cloneNode(true) as SVGSVGElement
  root.unmount()
  return svg
}

const toDataUrl = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Could not load ${url}`)
  const blob = await response.blob()
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

// The plan's fonts are CSS variables from the site's stylesheet, which
// nothing outside the page can resolve.
const resolveFontFamilies = (svg: SVGSVGElement) => {
  const root = getComputedStyle(document.documentElement)
  svg.querySelectorAll<SVGElement>("[style]").forEach((element) => {
    const variable = element.style.fontFamily.match(/^var\((--[\w-]+)\)$/)
    const family = variable && root.getPropertyValue(variable[1]).trim()
    if (family) element.style.fontFamily = family
  })
}

const inlineImages = (svg: SVGSVGElement) =>
  Promise.all(
    Array.from(svg.querySelectorAll("image")).map(async (image) => {
      const data = await toDataUrl(image.getAttribute("href")!)
      image.setAttribute("href", data)
      image.setAttributeNS(xlink, "xlink:href", data)
    })
  )

/** Google Fonts URL for just the families, weights and characters the plan uses */
export const fontsUrl = (svg: SVGSVGElement) => {
  const weights = new Map<string, Set<string>>()
  svg.querySelectorAll("text").forEach((text) => {
    const family = text.style.fontFamily.split(",")[0].replace(/["']/g, "")
    if (!family) return
    const familyWeights = weights.get(family) ?? new Set<string>()
    familyWeights.add(text.getAttribute("font-weight") ?? "400")
    weights.set(family, familyWeights)
  })
  if (weights.size === 0) return null
  const params = new URLSearchParams()
  weights.forEach((familyWeights, family) =>
    params.append(
      "family",
      `${family}:wght@${[...familyWeights].sort().join(";")}`
    )
  )
  const characters = new Set(
    Array.from(svg.querySelectorAll("text"), (text) => text.textContent).join(
      ""
    )
  )
  params.set("text", [...characters].join(""))
  return `https://fonts.googleapis.com/css2?${params}`
}

const embedFonts = async (svg: SVGSVGElement) => {
  const url = fontsUrl(svg)
  if (!url) return
  const response = await fetch(url)
  if (!response.ok) return
  let css = await response.text()
  const fontUrls = [...new Set(css.match(/https:[^)\s]+/g) ?? [])]
  const data = await Promise.all(fontUrls.map(toDataUrl))
  fontUrls.forEach((fontUrl, i) => {
    css = css.split(fontUrl).join(data[i])
  })
  const style = document.createElementNS("http://www.w3.org/2000/svg", "style")
  style.textContent = css
  svg.insertBefore(style, svg.firstChild)
}

/** The floor plan as a standalone SVG, with logos and fonts embedded */
export const mapSvg = async (
  config: VenueMapConfig,
  sponsors: Record<string, SponsorData>,
  width: number
) => {
  const svg = renderPlan(config, sponsors)
  const [, , viewWidth, viewHeight] = svg
    .getAttribute("viewBox")!
    .split(" ")
    .map(Number)
  svg.setAttribute("width", String(width))
  svg.setAttribute(
    "height",
    String(Math.round((width * viewHeight) / viewWidth))
  )
  resolveFontFamilies(svg)
  await Promise.all([
    inlineImages(svg),
    // Without the fonts the map still reads fine in system fonts.
    embedFonts(svg).catch(() => {}),
  ])
  return new XMLSerializer().serializeToString(svg)
}

const bytes = (part: string | Uint8Array) =>
  typeof part === "string"
    ? Uint8Array.from(part, (c) => c.charCodeAt(0))
    : part

/** A one-page A4 landscape PDF with the JPEG centred on it */
export const jpegPdf = (jpeg: Uint8Array, width: number, height: number) => {
  const page = { width: 842, height: 595, margin: 28 }
  const scale = Math.min(
    (page.width - 2 * page.margin) / width,
    (page.height - 2 * page.margin) / height
  )
  const [w, h] = [width * scale, height * scale]
  const [x, y] = [(page.width - w) / 2, (page.height - h) / 2]
  const content = `q ${w.toFixed(2)} 0 0 ${h.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)} cm /Map Do Q`
  const objects: (string | Uint8Array)[][] = [
    ["<< /Type /Catalog /Pages 2 0 R >>"],
    ["<< /Type /Pages /Kids [3 0 R] /Count 1 >>"],
    [
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${page.width} ${page.height}] /Resources << /XObject << /Map 4 0 R >> >> /Contents 5 0 R >>`,
    ],
    [
      `<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`,
      jpeg,
      "\nendstream",
    ],
    [`<< /Length ${content.length} >>\nstream\n${content}\nendstream`],
  ]

  const chunks: Uint8Array[] = []
  let length = 0
  const push = (part: string | Uint8Array) => {
    const chunk = bytes(part)
    chunks.push(chunk)
    length += chunk.length
  }
  push("%PDF-1.4\n")
  const offsets = objects.map((parts, i) => {
    const offset = length
    push(`${i + 1} 0 obj\n`)
    parts.forEach((part) => push(part))
    push("\nendobj\n")
    return offset
  })
  const xref = length
  push(
    `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n` +
      offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("") +
      `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`
  )

  const pdf = new Uint8Array(length)
  chunks.reduce((at, chunk) => {
    pdf.set(chunk, at)
    return at + chunk.length
  }, 0)
  return pdf
}

/** The floor plan as an A4 PDF, drawn at print resolution */
export const mapPdf = async (
  config: VenueMapConfig,
  sponsors: Record<string, SponsorData>
) => {
  const markup = await mapSvg(config, sponsors, 4000)
  const url = URL.createObjectURL(new Blob([markup], { type: "image/svg+xml" }))
  try {
    const image = new Image()
    image.src = url
    await image.decode()
    const canvas = document.createElement("canvas")
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    const context = canvas.getContext("2d")!
    context.fillStyle = "#ffffff"
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(image, 0, 0)
    const jpeg = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Empty canvas"))),
        "image/jpeg",
        0.92
      )
    )
    return new Blob(
      [
        jpegPdf(
          new Uint8Array(await jpeg.arrayBuffer()),
          canvas.width,
          canvas.height
        ),
      ],
      { type: "application/pdf" }
    )
  } finally {
    URL.revokeObjectURL(url)
  }
}

export const saveFile = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  // Safari drops the download if the URL is revoked in the same tick.
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
