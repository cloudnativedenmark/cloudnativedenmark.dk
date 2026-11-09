import { type GridEntry, type Session } from "../../hooks/use-sessionize"
import { daySessions, timetableRows } from "../schedule-layout"

const session = (
  id: string,
  roomId: number,
  start: string,
  end: string
): Session => ({
  id,
  roomId,
  name: id,
  title: id,
  room: String(roomId),
  description: null,
  startsAt: `2026-11-19T${start}:00`,
  endsAt: `2026-11-19T${end}:00`,
  isServiceSession: false,
  isPlenumSession: false,
  speakers: [],
  questionAnswers: [],
  recordingUrl: "",
  slideDeck: "",
  video: "",
  rate: "",
})

const dayWith = (sessions: Session[]): GridEntry => ({
  date: "2026-11-19",
  rooms: [],
  timeSlots: sessions.map((entry) => ({
    slotStart: entry.startsAt.slice(11),
    rooms: [
      { id: entry.roomId, name: entry.room, sessions: [entry], session: entry },
    ],
  })),
})

it("keeps a workshop running through parallel talks and a coffee break", () => {
  const workshop = session("workshop", 3, "10:25", "11:55")
  const main = session("main", 1, "10:25", "11:00")
  const breakout = session("breakout", 2, "10:25", "11:00")
  const coffee = {
    ...session("coffee", 1, "11:00", "11:20"),
    isServiceSession: true,
  }
  const next = session("next", 1, "11:20", "11:55")
  const rows = timetableRows(
    dayWith([main, breakout, workshop, coffee, next]),
    [1, 2, 3]
  )

  expect(rows.map((row) => row.startsAt.slice(11, 16))).toEqual([
    "10:25",
    "11:00",
    "11:20",
  ])
  expect(rows[0].cells[0].session?.id).toBe("main")
  expect(rows[0].cells[1].session?.id).toBe("breakout")
  expect(rows[0].cells[2]).toMatchObject({
    session: workshop,
    rowSpan: 3,
    continued: false,
  })
  expect(rows[1].cells[2]).toMatchObject({ session: workshop, continued: true })
  expect(rows[2].cells[2]).toMatchObject({ session: workshop, continued: true })
  expect(rows[1].cells[0].session?.id).toBe("coffee")
  expect(rows[2].cells[0].session?.id).toBe("next")
})

it("does not split the talk grid at times that only belong to an omitted workshop", () => {
  const main = session("main", 1, "10:25", "11:00")
  const breakout = session("breakout", 2, "10:25", "11:00")
  const workshop = session("workshop", 3, "10:40", "11:30")
  const rows = timetableRows(dayWith([main, breakout, workshop]), [1, 2])

  expect(
    rows.map((row) => [row.startsAt.slice(11, 16), row.endsAt.slice(11, 16)])
  ).toEqual([["10:25", "11:00"]])
  expect(rows[0].cells.map((cell) => cell.session?.id)).toEqual([
    "main",
    "breakout",
  ])
})

it("starts the next session when the previous one ends, without a false continuation", () => {
  const first = session("first", 1, "10:25", "11:00")
  const second = session("second", 1, "11:00", "11:20")
  const rows = timetableRows(dayWith([second, first]), [1])

  expect(rows[0].cells[0]).toMatchObject({
    session: first,
    rowSpan: 1,
    continued: false,
  })
  expect(rows[1].cells[0]).toMatchObject({
    session: second,
    rowSpan: 1,
    continued: false,
  })
})

it("deduplicates continued grid entries without changing the source schedule", () => {
  const talk = session("talk", 1, "10:25", "11:55")
  const day = dayWith([talk, talk])
  const original = JSON.parse(JSON.stringify(day))

  expect(daySessions(day).map((entry) => entry.id)).toEqual(["talk"])
  expect(timetableRows(day, [1])[0].cells[0].rowSpan).toBe(1)
  expect(day).toEqual(original)
  expect(timetableRows(day, [])).toEqual([])
})
