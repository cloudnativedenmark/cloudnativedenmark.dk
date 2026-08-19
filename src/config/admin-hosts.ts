/**
 * Hosts who appear in the Sessionize speaker list because they run
 * administrative segments (welcome, keynote wrap-ups, closing remarks, etc.)
 * rather than delivering a talk. They appear in public speaker listings, but
 * their host-only segments are omitted from their speaker-profile session list.
 *
 * Match on full name (case-insensitive). Add/remove names here to update the
 * host-only session handling — no other code changes needed.
 */
export const adminHostNames: string[] = [
  "Jinhong Brejnholt",
  "Allan Højgaard Jensen",
  "Kasper Borg Nissen",
]

const normalize = (name: string) => name.trim().toLowerCase()

export const isAdminHost = (fullName: string): boolean =>
  adminHostNames.some((name) => normalize(name) === normalize(fullName))
