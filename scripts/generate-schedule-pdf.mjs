import { readFile } from "node:fs/promises"
import { chromium } from "playwright"
import { createServer } from "vite"

export async function generateSchedulePdf(data, outputPath) {
  // Render the existing print document locally, without publishing a print page.
  const template = (await readFile("index.html", "utf8")).replace(
    "/src/main.tsx",
    "/src/components/print/render-schedule.tsx"
  )
  const server = await createServer({
    server: { host: "127.0.0.1", port: 0, open: false, hmr: false },
    plugins: [
      {
        name: "schedule-pdf",
        configureServer(server) {
          server.middlewares.use("/__schedule-pdf", async (_req, res, next) => {
            try {
              const html = await server.transformIndexHtml(
                "/__schedule-pdf",
                template
              )
              res.setHeader("Content-Type", "text/html")
              res.end(html)
            } catch (error) {
              next(error)
            }
          })
        },
      },
    ],
  })
  let browser
  try {
    await server.listen()
    browser = await chromium.launch()
    const page = await browser.newPage()
    const errors = []
    page.on("pageerror", (error) => errors.push(error))
    // The PDF and share pages use the exact same Sessionize snapshot.
    await page.route("https://sessionize.com/api/v2/*/view/*", (route) => {
      const endpoint = new URL(route.request().url()).pathname.split("/").pop()
      return route.fulfill({ json: data[endpoint] })
    })
    await page.emulateMedia({ media: "print" })
    await page.goto(`${server.resolvedUrls.local[0]}__schedule-pdf`)
    await page.locator('[data-pdf-ready="true"]').waitFor()
    if (errors.length)
      throw new AggregateError(errors, "Schedule PDF rendering failed")
    await page.pdf({
      path: outputPath,
      format: "A4",
      preferCSSPageSize: true,
      printBackground: true,
      tagged: true,
    })
    console.log(`Generated ${outputPath}`)
  } finally {
    await browser?.close()
    await server.close()
  }
}
