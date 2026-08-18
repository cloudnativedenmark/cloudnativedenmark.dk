import { isExcludedSpeaker } from "../config/excluded-speakers"

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
 * Talk type is deduced rather than sourced from Sessionize directly:
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
}

/**
 * True when every listed speaker is an admin-only host (see
 * config/excluded-speakers) — e.g. welcome/keynote-wrap-up/closing-remarks
 * segments — rather than someone delivering an actual talk.
 */
export const isAdminOnlySession = (speakers?: SessionSpeakerRef[]): boolean => {
  if (!speakers || speakers.length === 0) return false
  return speakers.every((speaker) =>
    isExcludedSpeaker(speaker.fullName ?? speaker.name ?? "")
  )
}

/**
 * Same deduction as getSessionType, but for a full session/timing record:
 * - service sessions (breaks, registration, etc.) never get a type
 * - sessions hosted only by admin-only speakers (welcome, keynote wrap-ups,
 *   closing remarks) never get a type either, even if their duration happens
 *   to coincide with a real talk length (e.g. a 5 minute wrap-up otherwise
 *   reading as a Lightning Talk)
 */
export const deduceSessionType = (
  session: SessionTiming
): SessionType | null => {
  if (session.isServiceSession) return null
  if (isAdminOnlySession(session.speakers)) return null
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
 * sourced from Sessionize's own category assignments. Deliberately excludes
 * the "Session format" group (Session/Workshop/Lightning talk) — that's
 * already covered by deduceSessionType, and Keynote vs. Session there is a
 * duration distinction Sessionize doesn't model, so format categories aren't
 * used for the type badge.
 */
export const getSessionTags = (
  categories?: SessionCategoryGroup[] | null
): string[] => {
  if (!categories) return []
  return categories
    .filter((group) => !group.name.trim().toLowerCase().includes("format"))
    .flatMap((group) => group.categoryItems.map((item) => item.name))
}
