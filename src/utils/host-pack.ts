import { type GridEntry, type Session } from "../hooks/use-sessionize"
import { isAdminOnlySession } from "./session-type"

export const hostTime = (value: string): string => {
  // Sessionize's offset-free timestamps are event-local, not device-local.
  if (!/(Z|[+-]\d{2}:\d{2})$/i.test(value)) return value.slice(11, 16)

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Copenhagen",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value))
}

export const hostDate = (value: string): string =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Copenhagen",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value.slice(0, 10)}T12:00:00Z`))

const daySessions = (day: GridEntry): Session[] =>
  [
    ...new Map(
      day.timeSlots.flatMap((slot) =>
        slot.rooms.map(({ session }) => [session.id, session] as const)
      )
    ).values(),
  ].sort((a, b) => a.startsAt.localeCompare(b.startsAt))

const overlaps = (a: Session, b: Session): boolean =>
  a.startsAt < b.endsAt && b.startsAt < a.endsAt

export const hostTalks = (day: GridEntry, roomId: number): Session[] =>
  daySessions(day).filter(
    (session) =>
      session.roomId === roomId &&
      !session.isServiceSession &&
      !isAdminOnlySession(session.speakers)
  )

export const hostTimeline = (day: GridEntry, roomId: number): Session[] => {
  const all = daySessions(day)
  const own = all.filter((session) => session.roomId === roomId)

  return all.filter((session) => {
    if (session.roomId === roomId) return true
    if (own.some((item) => overlaps(item, session))) return false
    if (session.isServiceSession || session.isPlenumSession) return true

    return !all.some(
      (other) => other.roomId !== session.roomId && overlaps(other, session)
    )
  })
}

export const paginateHostCards = (
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
