import type { GridEntry, Session, Speaker } from "../../hooks/use-sessionize"

export function flattenDaySessions(day: GridEntry): Session[] {
  const seen = new Set<string>()
  const sessions: Session[] = []
  for (const slot of day.timeSlots) {
    for (const room of slot.rooms) {
      const session = room.session
      if (!session || !session.id || seen.has(session.id)) continue
      seen.add(session.id)
      sessions.push(session)
    }
  }
  return sessions.sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
  )
}

// Derived from the (offline-cached) schedule itself rather than a separate
// live-only speakers fetch, so the "which speaker are you" picker still
// works offline once the schedule has been downloaded once.
export function getAllSpeakersFromSchedule(schedule: GridEntry[]): Speaker[] {
  const seen = new Map<string, Speaker>()
  for (const day of schedule) {
    for (const session of flattenDaySessions(day)) {
      for (const speaker of session.speakers ?? []) {
        if (!seen.has(speaker.id)) {
          seen.set(speaker.id, speaker)
        }
      }
    }
  }
  return Array.from(seen.values()).sort((a, b) =>
    a.fullName.localeCompare(b.fullName)
  )
}

export function findSessionById(
  schedule: GridEntry[],
  sessionId: string
): Session | undefined {
  for (const day of schedule) {
    for (const slot of day.timeSlots) {
      for (const room of slot.rooms) {
        if (room.session?.id === sessionId) return room.session
      }
    }
  }
  return undefined
}
