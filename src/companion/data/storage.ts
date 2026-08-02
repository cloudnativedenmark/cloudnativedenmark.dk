// Namespaced localStorage helpers. Everything the companion app persists
// lives under this prefix so it's easy to spot/clear in devtools and never
// collides with anything the marketing site itself stores.
const PREFIX = "cnd-companion:"

export function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(PREFIX + key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function setItem<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // Storage full or unavailable (e.g. private browsing) — fail silently,
    // the app still works for the current session, just won't persist.
  }
}

export function removeItem(key: string): void {
  try {
    window.localStorage.removeItem(PREFIX + key)
  } catch {
    // ignore
  }
}

export const StorageKeys = {
  role: "role",
  deviceId: "device-id",
  speakerId: "speaker-id",
  favorites: "favorites",
  feedback: "feedback",
  scheduleCache: "schedule-cache",
  shoutCache: "shout-cache",
  pushSubscribed: "push-subscribed",
} as const
