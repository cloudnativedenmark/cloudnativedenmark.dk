import { type GridEntry, type Session } from "../hooks/use-sessionize"
import { isAdminOnlySession } from "./session-type"
import { daySessions } from "./schedule-layout"

const overlaps = (a: Session, b: Session): boolean =>
  a.startsAt < b.endsAt && b.startsAt < a.endsAt

export const trackTalks = (day: GridEntry, roomId: number): Session[] =>
  daySessions(day).filter(
    (session) =>
      session.roomId === roomId &&
      !session.isServiceSession &&
      !isAdminOnlySession(session.speakers)
  )

export const trackTimeline = (day: GridEntry, roomIds: number[]): Session[] => {
  if (!roomIds.length) return []

  const all = daySessions(day)
  const own = all.filter((session) => roomIds.includes(session.roomId))

  return all.filter((session) => {
    if (roomIds.includes(session.roomId) || session.isPlenumSession) return true
    if (own.some((item) => overlaps(item, session))) return false
    if (session.isServiceSession) return true

    return !all.some(
      (other) => other.roomId !== session.roomId && overlaps(other, session)
    )
  })
}

export const trackSections = (
  schedule: GridEntry[],
  dates: string[],
  roomIds: number[]
) =>
  schedule
    .filter((day) => dates.includes(day.date.slice(0, 10)))
    .sort((a, b) => a.date.localeCompare(b.date))
    .flatMap((day) =>
      day.rooms
        .filter((room) => roomIds.includes(room.id))
        .map((room) => ({ day, room }))
    )

export const paginateTrackCards = (
  heights: number[],
  available: number,
  gap: number,
  limit: number
): number[][] => {
  const pages: number[][] = []
  let page: number[] = []
  let used = 0

  heights.forEach((height, index) => {
    const next = used + (page.length ? gap : 0) + height
    if (page.length && (page.length >= limit || next > available)) {
      pages.push(page)
      page = []
      used = 0
    }

    used += (page.length ? gap : 0) + height
    page.push(index)
  })

  if (page.length) pages.push(page)
  return pages
}
