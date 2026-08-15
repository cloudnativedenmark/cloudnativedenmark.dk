// Minimal hand-written service worker (no build-step precache manifest —
// see src/companion/README.md for why vite-plugin-pwa was dropped in
// favor of this). Strategy: cache-as-you-go. Every successful same-origin
// GET gets cached; when a request fails (offline), serve the cached copy,
// falling back to the cached app shell ("/") for unknown navigations so
// client-side routing can still take over.
const CACHE_NAME = "cnd-companion-shell-v1"

self.addEventListener("install", () => {
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener("fetch", (event) => {
  const { request } = event
  if (request.method !== "GET") return

  const url = new URL(request.url)
  // Cross-origin requests (Sessionize API, fonts, etc.) are left alone —
  // the app itself already caches Sessionize data to localStorage, and
  // opaque cross-origin responses aren't reliably re-servable offline
  // anyway.
  if (url.origin !== self.location.origin) return

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
        }
        return response
      })
      .catch(async () => {
        const cached = await caches.match(request)
        if (cached) return cached
        if (request.mode === "navigate") {
          const shell = await caches.match("/")
          if (shell) return shell
        }
        return Response.error()
      })
  )
})
