import { fontsUrl, jpegPdf, mapSvg } from "../venue-map/download"
import type { VenueMapConfig } from "../../../config/venue-map"
import type { SponsorData } from "../../../utils/data-loader"

const config: VenueMapConfig = {
  rooms: [
    {
      id: "main-stage",
      name: "Keynote Hall",
      venueRooms: ["Grand Ball"],
      areaM2: 223,
    },
  ],
  stands: [{ id: "1", sponsor: "gold/acme" }, { id: "2" }],
}

const sponsors: Record<string, SponsorData> = {
  "gold/acme": {
    id: "gold/acme",
    title: "Acme",
    url: "https://acme.test/",
    logo: { publicURL: "/assets/acme.svg" },
  },
}

const svgOf = (markup: string) =>
  new DOMParser().parseFromString(markup, "image/svg+xml")
    .documentElement as unknown as SVGSVGElement

const text = (pdf: Uint8Array) => String.fromCharCode(...pdf)

describe("jpegPdf", () => {
  const jpeg = Uint8Array.from([0xff, 0xd8, 0x00, 0xff, 0xd9])
  const pdf = text(jpegPdf(jpeg, 400, 300))

  it("puts the image on an A4 landscape page", () => {
    expect(pdf.startsWith("%PDF-1.4\n")).toBe(true)
    expect(pdf).toContain("/MediaBox [0 0 842 595]")
    expect(pdf).toContain("/Width 400 /Height 300")
    expect(pdf).toContain(`/Length 5 >>\nstream\n${text(jpeg)}\nendstream`)
  })

  it("points the cross-reference table at each object", () => {
    const xref = Number(pdf.match(/startxref\n(\d+)/)![1])
    expect(pdf.slice(xref).startsWith("xref\n0 6\n")).toBe(true)

    const offsets = [...pdf.matchAll(/(\d{10}) 00000 n /g)].map((match) =>
      Number(match[1])
    )
    expect(offsets).toHaveLength(5)
    offsets.forEach((offset, i) =>
      expect(pdf.slice(offset).startsWith(`${i + 1} 0 obj\n`)).toBe(true)
    )
  })
})

describe("fontsUrl", () => {
  it("asks only for the families, weights and characters in use", () => {
    const svg = svgOf(
      `<svg xmlns="http://www.w3.org/2000/svg">
        <text style="font-family: 'Space Grotesk', sans-serif" font-weight="700">Hall</text>
        <text style="font-family: 'JetBrains Mono', monospace" font-weight="600">EXIT</text>
        <text style="font-family: 'JetBrains Mono', monospace">1</text>
      </svg>`
    )

    const url = new URL(fontsUrl(svg)!)

    expect(url.searchParams.getAll("family")).toEqual([
      "Space Grotesk:wght@700",
      "JetBrains Mono:wght@400;600",
    ])
    expect([...url.searchParams.get("text")!].sort().join("")).toBe("1EHITXal")
  })
})

describe("mapSvg", () => {
  const response = (body: string, type: string) => ({
    ok: true,
    blob: async () => new Blob([body], { type }),
    text: async () => body,
  })

  beforeEach(() => {
    document.documentElement.style.setProperty(
      "--font-display",
      '"Space Grotesk", sans-serif'
    )
    global.fetch = jest.fn(async (url: string) =>
      url.startsWith("https://fonts.googleapis.com/")
        ? response(
            "@font-face { src: url(https://fonts.gstatic.test/a.woff2) }",
            "text/css"
          )
        : url.startsWith("https://fonts.gstatic.test/")
          ? response("font", "font/woff2")
          : response("<svg/>", "image/svg+xml")
    ) as unknown as typeof fetch
  })

  afterEach(() => {
    document.documentElement.removeAttribute("style")
  })

  it("draws a standalone plan with its logos and fonts embedded", async () => {
    const svg = svgOf(await mapSvg(config, sponsors, 1460))

    expect(svg.getAttribute("width")).toBe("1460")
    expect(svg.getAttribute("height")).toBe("1150")
    expect(svg.querySelector("image")!.getAttribute("href")).toMatch(
      /^data:image\/svg\+xml;base64,/
    )
    expect(svg.querySelector("style")!.textContent).toContain(
      "url(data:font/woff2;base64,"
    )
    expect(svg.outerHTML).not.toContain("var(--font-display)")
    expect(svg.outerHTML).toContain("Space Grotesk")
  })

  it("still draws the plan when the fonts can't be fetched", async () => {
    const fetchLogo = global.fetch
    global.fetch = jest.fn(async (url: string) =>
      url.startsWith("https://fonts.") ? { ok: false } : fetchLogo(url)
    ) as unknown as typeof fetch

    const svg = svgOf(await mapSvg(config, sponsors, 1460))

    expect(svg.querySelector("style")).toBeNull()
    expect(svg.querySelector("image")!.getAttribute("href")).toMatch(/^data:/)
  })
})
