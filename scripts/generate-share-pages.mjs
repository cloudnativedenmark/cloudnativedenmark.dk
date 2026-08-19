import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"

const distDirectory = "dist"
const siteUrl = "https://cloudnativedenmark.dk"
const imageUrl = `${siteUrl}/images/social-card.png`

const pages = [
  {
    pathname: "/",
    title: "Cloud Native Denmark 2026",
    description:
      "Two days in Copenhagen with the platform engineers, SREs, and architects shipping the Nordics' most demanding cloud native systems to production.",
  },
  {
    pathname: "/schedule",
    title: "Schedule | Cloud Native Denmark",
    description:
      "Plan your conference experience. Here’s the full schedule of talks and events.",
  },
  {
    pathname: "/speakers",
    title: "Speakers | Cloud Native Denmark",
    description:
      "Meet everyone speaking at Cloud Native Denmark 2026 — the platform engineers, SREs, and architects sharing what they've learned running cloud native systems in production.",
  },
]

const escapeHtml = (value) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;")

const createShareTags = ({ pathname, title, description }) => {
  const url = `${siteUrl}${pathname}`
  const escapedTitle = escapeHtml(title)
  const escapedDescription = escapeHtml(description)

  return `
    <meta property="og:type" content="website" data-rh="true" />
    <meta property="og:site_name" content="Cloud Native Denmark" data-rh="true" />
    <meta property="og:title" content="${escapedTitle}" data-rh="true" />
    <meta property="og:description" content="${escapedDescription}" data-rh="true" />
    <meta property="og:url" content="${url}" data-rh="true" />
    <meta property="og:image" content="${imageUrl}" data-rh="true" />
    <meta property="og:image:width" content="1200" data-rh="true" />
    <meta property="og:image:height" content="630" data-rh="true" />
    <meta property="og:image:alt" content="Cloud Native Denmark 2026" data-rh="true" />
    <meta name="twitter:card" content="summary_large_image" data-rh="true" />
    <meta name="twitter:title" content="${escapedTitle}" data-rh="true" />
    <meta name="twitter:description" content="${escapedDescription}" data-rh="true" />
    <meta name="twitter:image" content="${imageUrl}" data-rh="true" />
    <link rel="canonical" href="${url}" data-rh="true" />`
}

const createSharePage = (html, page) => {
  const title = escapeHtml(page.title)
  const description = escapeHtml(page.description)

  return html
    .replace(/<title>[^<]*<\/title>/, `<title data-rh="true">${title}</title>`)
    .replace(
      /<meta name="description" content="[^"]*"\s*\/>/,
      `<meta name="description" content="${description}" data-rh="true" />`
    )
    .replace("</head>", `${createShareTags(page)}\n</head>`)
}

const template = await readFile(join(distDirectory, "index.html"), "utf8")

for (const page of pages) {
  const outputPath =
    page.pathname === "/"
      ? join(distDirectory, "index.html")
      : join(distDirectory, page.pathname.slice(1), "index.html")

  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, createSharePage(template, page))
}
