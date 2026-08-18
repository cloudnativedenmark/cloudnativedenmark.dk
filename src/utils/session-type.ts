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
