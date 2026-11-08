import { type GridEntry, type Session } from "../../hooks/use-sessionize"
import {
  hostTime,
  hostTimeline,
  hostTalks,
  hostSections,
  paginateHostCards,
} from "../host-pack"

const session = (
  id: string,
  roomId: number,
  startsAt: string,
  endsAt: string,
  extra: Partial<Session> = {}
): Session =>
  ({
    id,
    roomId,
    room: roomId === 1 ? "Main stage" : "Breakout",
    title: id,
    startsAt: `2026-11-19T${startsAt}:00`,
    endsAt: `2026-11-19T${endsAt}:00`,
    speakers: [],
    isServiceSession: false,
    ...extra,
  }) as Session

const dayWith = (sessions: Session[]): GridEntry =>
  ({
    date: "2026-11-19T00:00:00",
    timeSlots: sessions.map((item) => ({
      slotStart: item.startsAt.slice(11),
      rooms: [{ id: item.roomId, session: item }],
    })),
  }) as GridEntry

it("keeps each track talk once, in time order, without service items", () => {
  const later = session("later", 2, "11:20", "11:55")
  const first = session("first", 2, "10:25", "11:00")
  const day = dayWith([
    later,
    session("other track", 1, "10:25", "11:00"),
    first,
    later,
    session("coffee", 2, "11:00", "11:20", { isServiceSession: true }),
  ])

  expect(hostTalks(day, 2).map((item) => item.id)).toEqual(["first", "later"])
})

it("includes shared items with their location, but not breaks during a workshop", () => {
  const morning = session("morning", 1, "09:00", "09:25")
  const coffee = session("coffee", 1, "11:00", "11:20", {
    isServiceSession: true,
  })
  const lunch = session("lunch", 1, "12:00", "13:00", {
    isServiceSession: true,
  })
  const workshop = session("workshop", 2, "10:25", "11:55")
  const parallel = session("parallel", 1, "10:25", "11:00")
  const timeline = hostTimeline(
    dayWith([morning, coffee, lunch, workshop, parallel]),
    [2]
  )

  expect(timeline.map((item) => item.id)).toEqual([
    "morning",
    "workshop",
    "lunch",
  ])
  expect(timeline[0].room).toBe("Main stage")
})

it("shows an external break that starts exactly when a track talk ends", () => {
  const day = dayWith([
    session("talk", 2, "10:25", "11:00"),
    session("break", 1, "11:00", "11:20", { isServiceSession: true }),
  ])

  expect(hostTimeline(day, [2]).map((item) => item.id)).toEqual([
    "talk",
    "break",
  ])
})

it("combines selected concurrent tracks and lists a shared break only once", () => {
  const main = session("main", 1, "10:25", "11:00")
  const breakout = session("breakout", 2, "10:25", "11:00")
  const coffee = session("coffee", 1, "11:00", "11:20", {
    isServiceSession: true,
  })
  const workshop = session("workshop", 3, "10:25", "11:55")
  const day = dayWith([main, breakout, coffee, coffee, workshop])

  expect(hostTimeline(day, [1, 2]).map((item) => item.id)).toEqual([
    "main",
    "breakout",
    "coffee",
  ])
  expect(hostTimeline(day, [])).toEqual([])
})

it("preserves event-local times and converts offset timestamps to Copenhagen time", () => {
  expect(hostTime("2026-11-19T10:25:00")).toBe("10:25")
  expect(hostTime("2026-11-19T09:25:00Z")).toBe("10:25")
  expect(hostTime("2026-07-19T08:25:00Z")).toBe("10:25")
})

it("fits cards including gaps, and starts a new page before overflow", () => {
  expect(paginateHostCards([40, 50, 51, 30], 100, 10, Infinity)).toEqual([
    [0, 1],
    [2, 3],
  ])
})

it("limits paired pages and keeps an oversized abstract without dropping later talks", () => {
  expect(paginateHostCards([20, 20, 20, 150, 20], 100, 5, 2)).toEqual([
    [0, 1],
    [2],
    [3],
    [4],
  ])
})

it("selects all requested day and track combinations in schedule order", () => {
  const rooms = [
    { id: 1, name: "Main stage" },
    { id: 2, name: "Breakout" },
  ]
  const first = { ...dayWith([]), rooms } as GridEntry
  const second = { ...first, date: "2026-11-20T00:00:00" }
  const sections = hostSections(
    [second, first],
    ["2026-11-20", "2026-11-19", "2026-11-19"],
    [2, 1, 2]
  )

  expect(
    sections.map(({ day, room }) => [day.date.slice(0, 10), room.id])
  ).toEqual([
    ["2026-11-19", 1],
    ["2026-11-19", 2],
    ["2026-11-20", 1],
    ["2026-11-20", 2],
  ])
})

it("does not substitute another track when a selected track is absent on a day", () => {
  const first = {
    ...dayWith([]),
    rooms: [
      { id: 1, name: "Main stage" },
      { id: 2, name: "Breakout" },
    ],
  } as GridEntry
  const second = {
    ...first,
    date: "2026-11-20T00:00:00",
    rooms: first.rooms.slice(0, 1),
  }
  const sections = hostSections(
    [first, second],
    ["2026-11-19", "2026-11-20"],
    [2]
  )

  expect(
    sections.map(({ day, room }) => [day.date.slice(0, 10), room.id])
  ).toEqual([["2026-11-19", 2]])
  expect(hostSections([first, second], [], [1])).toEqual([])
  expect(hostSections([first, second], ["2026-11-19"], [])).toEqual([])
})
