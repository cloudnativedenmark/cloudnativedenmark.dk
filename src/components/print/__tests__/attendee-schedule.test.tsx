import { renderToStaticMarkup } from "react-dom/server"
import { within } from "@testing-library/react"
import AttendeeScheduleDocument from "../attendee-schedule"
import { type GridEntry, type Session } from "../../../hooks/use-sessionize"

jest.mock("../../../images/logo.svg", () => "/logo.svg")

afterEach(() => document.body.replaceChildren())

const main: Session = {
  id: "main",
  name: "Main talk",
  title: "A complete talk title that must not be shortened in print",
  roomId: 1,
  room: "Main stage",
  description: "An abstract that is not part of the attendee timetable.",
  startsAt: "2026-11-19T10:25:00",
  endsAt: "2026-11-19T11:00:00",
  isServiceSession: false,
  isPlenumSession: false,
  speakers: [
    { id: "speaker", fullName: "Main Speaker" },
  ] as Session["speakers"],
  questionAnswers: [],
  recordingUrl: "",
  slideDeck: "",
  video: "",
  rate: "",
}
const breakout: Session = {
  ...main,
  id: "breakout",
  title: "Parallel breakout talk",
  roomId: 2,
  room: "Breakout",
  speakers: [],
}
const workshop: Session = {
  ...main,
  id: "workshop",
  title: "A ninety-minute practical workshop",
  roomId: 3,
  room: "Workshop",
  endsAt: "2026-11-19T11:55:00",
  speakers: [],
}
const coffee: Session = {
  ...main,
  id: "coffee",
  title: "Coffee break",
  startsAt: "2026-11-19T11:00:00",
  endsAt: "2026-11-19T11:20:00",
  isServiceSession: true,
  speakers: [],
}

const view = (sessions: Session[]) => {
  const day: GridEntry = {
    date: "2026-11-19",
    rooms: [1, 2, 3].map((id) => ({
      id,
      name: ["Main stage", "Breakout", "Workshop"][id - 1],
      sessions: sessions.filter((entry) => entry.roomId === id),
      session: sessions.find((entry) => entry.roomId === id)!,
    })),
    timeSlots: sessions.map((entry) => ({
      slotStart: entry.startsAt.slice(11),
      rooms: [
        {
          id: entry.roomId,
          name: entry.room,
          sessions: [entry],
          session: entry,
        },
      ],
    })),
  }
  const root = document.createElement("div")
  document.body.append(root)
  root.innerHTML = renderToStaticMarkup(
    <AttendeeScheduleDocument
      days={[day]}
      fetchedAt={new Date("2026-11-08T10:00:00Z")}
    />
  )
  return within(root)
}

it("prints full titles and speaker names, with workshops outside the parallel talk table", () => {
  const page = view([main, breakout, workshop, coffee])
  const table = page.getByRole("table")
  const workshopPanel = page.getByRole("region", { name: "Workshops" })

  expect(within(table).getByText(main.title)).toBeInTheDocument()
  expect(within(table).getByText("Main Speaker")).toBeInTheDocument()
  expect(within(table).getByText(breakout.title)).toBeInTheDocument()
  expect(within(table).queryByText(workshop.title)).toBeNull()
  expect(within(workshopPanel).getByText(workshop.title)).toBeInTheDocument()
  expect(within(workshopPanel).getByText("10:25–11:55")).toBeInTheDocument()
  expect(page.queryByText(main.description!)).toBeNull()
  expect(page.getAllByText(workshop.title)).toHaveLength(1)
})

it("uses a full-width break without treating an ongoing workshop as interrupted", () => {
  const page = view([main, breakout, workshop, coffee])
  const breakCell = within(page.getByRole("table"))
    .getByText("Coffee break")
    .closest("td")!

  expect(breakCell.colSpan).toBe(2)
  expect(
    within(page.getByRole("region", { name: "Workshops" })).getByText(
      "10:25–11:55"
    )
  ).toBeInTheDocument()
})

it("does not merge a long talk across another track's later start", () => {
  const long = { ...main, endsAt: "2026-11-19T11:20:00" }
  const later = {
    ...breakout,
    startsAt: "2026-11-19T11:00:00",
    endsAt: "2026-11-19T11:20:00",
  }
  const page = view([long, later])
  const table = within(page.getByRole("table"))
  const longCell = table.getByText(long.title).closest("td")!

  expect(longCell.colSpan).toBe(1)
  expect(longCell.rowSpan).toBe(2)
  expect(table.getByText(later.title)).toBeInTheDocument()
})
