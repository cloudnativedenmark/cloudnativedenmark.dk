import { isAdminHost } from "../config/admin-hosts"

export type SessionType = "Keynote" | "Session" | "Workshop" | "Lightning Talk"

/** Duration, in whole minutes, between two ISO timestamps. */
export const getSessionDurationMinutes = (
  startsAt: string,
  endsAt: string
): number => {
  const start = new Date(startsAt).getTime()
  const end = new Date(endsAt).getTime()
  return Math.round((end - start) / 60000)
}

/**
 * Fallback classification for sessions without an explicit Sessionize format:
 * - anything scheduled in the "Workshop" track/room is a Workshop
 * - a 5 minute slot is a Lightning Talk
 * - a 25 minute slot is a Keynote
 * - a 35 minute slot is a (regular) Session
 * Anything else (breaks, etc.) has no deducible type.
 */
export const getSessionType = (
  durationMinutes: number,
  room?: string | null
): SessionType | null => {
  if (room && room.trim().toLowerCase() === "workshop") return "Workshop"
  if (durationMinutes === 5) return "Lightning Talk"
  if (durationMinutes === 25) return "Keynote"
  if (durationMinutes === 35) return "Session"
  return null
}
const SESSION_TYPE_BY_FORMAT: Record<string, SessionType> = {
  keynote: "Keynote",
  session: "Session",
  workshop: "Workshop",
  "lightning talk": "Lightning Talk",
}

const getExplicitSessionType = (
  categories?: SessionCategoryGroup[] | null
): SessionType | null => {
  const formatItems =
    categories?.find(
      (category) => category.name.trim().toLowerCase() === "session format"
    )?.categoryItems ?? []

  for (const item of formatItems) {
    const type = SESSION_TYPE_BY_FORMAT[item.name.trim().toLowerCase()]
    if (type) return type
  }
  return null
}

export interface SessionSpeakerRef {
  fullName?: string
  name?: string
}

export interface SessionTiming {
  startsAt: string
  endsAt: string
  room?: string | null
  isServiceSession?: boolean
  speakers?: SessionSpeakerRef[]
  categories?: SessionCategoryGroup[] | null
}

/**
 * True when every listed speaker is an administrative host (see
 * config/admin-hosts) — e.g. welcome/keynote-wrap-up/closing-remarks
 * segments — rather than someone delivering an actual talk.
 */
export const isAdminOnlySession = (speakers?: SessionSpeakerRef[]): boolean => {
  if (!speakers || speakers.length === 0) return false
  return speakers.every((speaker) =>
    isAdminHost(speaker.fullName ?? speaker.name ?? "")
  )
}

/**
 * Classifies a full session/timing record:
 * - service sessions (breaks, registration, etc.) never get a type
 * - sessions hosted only by administrative hosts (welcome, keynote wrap-ups,
 *   closing remarks) never get a type either
 * - an explicit Sessionize "Session format" is authoritative
 * - duration and room inference is retained as a fallback for unclassified data
 */
export const deduceSessionType = (
  session: SessionTiming
): SessionType | null => {
  if (session.isServiceSession) return null
  if (isAdminOnlySession(session.speakers)) return null
  const explicitType = getExplicitSessionType(session.categories)
  if (explicitType) return explicitType
  const duration = getSessionDurationMinutes(session.startsAt, session.endsAt)
  return getSessionType(duration, session.room)
}

/** Shared badge styling for a deduced session type, keyed by SessionType. */
export const sessionTypeBadgeClasses: Record<SessionType, string> = {
  Keynote: "bg-cnd-red/10 text-cnd-red",
  Session: "bg-cnd-electric/10 text-cnd-electric",
  Workshop: "bg-cnd-amber/10 text-cnd-amber",
  "Lightning Talk": "bg-cnd-sky/10 text-cnd-harbor",
}

export interface SessionCategoryItem {
  id: number
  name: string
}

export interface SessionCategoryGroup {
  id: number
  name: string
  categoryItems: SessionCategoryItem[]
  sort: number
}

/**
 * Topic/level tags for a session (e.g. "Platform Engineering", "Beginner"),
 * sourced from Sessionize's own category assignments. Excludes the
 * "Session format" group because that is represented by the type badge.
 */
export const getSessionTags = (
  categories?: SessionCategoryGroup[] | null
): string[] => {
  if (!categories) return []
  return categories
    .filter((group) => !group.name.trim().toLowerCase().includes("format"))
    .flatMap((group) => group.categoryItems.map((item) => item.name))
}
