import { type GridEntry, type Session } from "../hooks/use-sessionize"

export const daySessions = (day: GridEntry): Session[] =>
  [
    ...new Map(
      day.timeSlots.flatMap((slot) =>
        slot.rooms.map(({ session }) => [session.id, session] as const)
      )
    ).values(),
  ].sort((a, b) => a.startsAt.localeCompare(b.startsAt))

export interface TimetableCell {
  roomId: number
  session: Session | null
  continued: boolean
  rowSpan: number
}

export interface TimetableRow {
  startsAt: string
  endsAt: string
  cells: TimetableCell[]
}

export const timetableRows = (
  day: GridEntry,
  roomIds: number[]
): TimetableRow[] => {
  const sessions = daySessions(day).filter((session) =>
    roomIds.includes(session.roomId)
  )
  const times = [
    ...new Set(
      sessions.flatMap((session) => [session.startsAt, session.endsAt])
    ),
  ].sort()
  const timeIndex = new Map(times.map((time, index) => [time, index]))
  const tracks = roomIds.map((roomId) => ({
    roomId,
    sessions: sessions.filter((session) => session.roomId === roomId),
    cursor: 0,
  }))
  const rows: TimetableRow[] = []

  for (let index = 0; index < times.length - 1; index++) {
    const startsAt = times[index]
    const cells = tracks.map((track): TimetableCell => {
      while (
        track.cursor < track.sessions.length &&
        track.sessions[track.cursor].endsAt <= startsAt
      )
        track.cursor++
      const candidate = track.sessions[track.cursor]
      const session =
        candidate && candidate.startsAt <= startsAt ? candidate : null
      const continued = session !== null && session.startsAt < startsAt
      return {
        roomId: track.roomId,
        session,
        continued,
        rowSpan:
          session && !continued ? timeIndex.get(session.endsAt)! - index : 1,
      }
    })

    if (cells.some((cell) => cell.session))
      rows.push({ startsAt, endsAt: times[index + 1], cells })
  }

  return rows
}
