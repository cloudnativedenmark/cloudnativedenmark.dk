// Thin wrapper around the companion-api Cloudflare Worker (see
// workers/companion-api/). Returns null whenever the backend isn't
// configured or isn't reachable, so callers can fall back to local-only
// behaviour instead of crashing — the Worker needs a one-time deploy this
// automated run couldn't do (no Cloudflare provisioning credentials), see
// workers/companion-api/README.md.

const BASE_URL = import.meta.env.VITE_API_BASE_URL
const ADMIN_KEY = import.meta.env.VITE_ADMIN_API_KEY

export function isApiConfigured(): boolean {
  return Boolean(BASE_URL)
}

// Admin-only writes (send shout, hide/unhide feedback) are checked by the
// Worker against this header. The client-side passphrase gate is what a
// real attendee interacts with — this is a second, independent check so
// the write endpoints aren't wide open to anyone who finds the API URL.
export function adminHeaders(): HeadersInit {
  return ADMIN_KEY ? { "X-Admin-Key": ADMIN_KEY } : {}
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T | null> {
  if (!BASE_URL) return null
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })
    if (!response.ok) return null
    if (response.status === 204) return null
    return (await response.json()) as T
  } catch {
    // Offline, CORS misconfigured, worker down, etc — degrade quietly.
    return null
  }
}
