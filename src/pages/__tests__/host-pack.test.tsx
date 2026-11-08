import { renderToStaticMarkup } from "react-dom/server"
import { within } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import HostPack from "../host-pack"
import {
  useSessionizeSchedule,
  type GridEntry,
  type Session,
} from "../../hooks/use-sessionize"

jest.mock("../../hooks/use-sessionize", () => ({
  useSessionizeSchedule: jest.fn(),
}))
jest.mock("../../images/logo.svg", () => "/logo.svg")

afterEach(() => document.body.replaceChildren())

const makeDay = (date: string): GridEntry => {
  const sessions = [
    {
      id: `${date}-main`,
      title: `Main talk ${date}`,
      roomId: 1,
      room: "Main stage",
    },
    {
      id: `${date}-breakout`,
      title: `Breakout talk ${date}`,
      roomId: 2,
      room: "Breakout",
    },
    {
      id: `${date}-coffee`,
      title: "Coffee break",
      roomId: 1,
      room: "Main stage",
      isServiceSession: true,
    },
  ].map(
    (entry): Session => ({
      name: entry.title,
      description: "Talk abstract",
      startsAt: `${date}T${entry.isServiceSession ? "11:00" : "10:25"}:00`,
      endsAt: `${date}T${entry.isServiceSession ? "11:20" : "11:00"}:00`,
      isServiceSession: false,
      isPlenumSession: false,
      speakers: [],
      questionAnswers: [],
      recordingUrl: "",
      slideDeck: "",
      video: "",
      rate: "",
      ...entry,
    })
  )

  return {
    date,
    rooms: [1, 2].map((id) => ({
      id,
      name: id === 1 ? "Main stage" : "Breakout",
      sessions: sessions.filter((session) => session.roomId === id),
      session: sessions.find((session) => session.roomId === id)!,
    })),
    timeSlots: sessions.map((session) => ({
      slotStart: session.startsAt,
      rooms: [
        {
          id: session.roomId,
          name: session.room,
          sessions: [session],
          session,
        },
      ],
    })),
  }
}

const view = (dates: string[]) => {
  jest.mocked(useSessionizeSchedule).mockReturnValue({
    schedule: dates.map(makeDay),
    isLoading: false,
  })
  const params = new URLSearchParams("room=1&room=2&format=compact")
  dates.forEach((date) => params.append("date", date))
  const root = document.createElement("div")
  document.body.append(root)
  root.innerHTML = renderToStaticMarkup(
    <MemoryRouter initialEntries={[`/host-pack?${params}`]}>
      <HostPack />
    </MemoryRouter>
  )
  return within(root)
}

it("combines Main stage and Breakout into one overview before either track's details", () => {
  const page = view(["2026-11-19"])
  const overviews = page.getAllByRole("region", { name: "Day overview" })
  expect(overviews).toHaveLength(1)

  const overview = overviews[0]
  expect(within(overview).getByText("Main talk 2026-11-19")).toBeInTheDocument()
  expect(
    within(overview).getByText("Breakout talk 2026-11-19")
  ).toBeInTheDocument()
  expect(within(overview).getAllByText("Coffee break")).toHaveLength(1)

  const tracks = page
    .getAllByRole("heading", { level: 2 })
    .filter((heading) => !overview.contains(heading))
  expect(tracks).toHaveLength(2)
  for (const track of tracks) {
    expect(
      overview.compareDocumentPosition(track) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()
  }
})

it("shows one combined overview per day instead of one per selected track", () => {
  const page = view(["2026-11-19", "2026-11-20"])
  const overviews = page.getAllByRole("region", { name: "Day overview" })
  expect(overviews).toHaveLength(2)

  for (const [index, date] of ["2026-11-19", "2026-11-20"].entries()) {
    const overview = within(overviews[index])
    expect(overview.getByText(`Main talk ${date}`)).toBeInTheDocument()
    expect(overview.getByText(`Breakout talk ${date}`)).toBeInTheDocument()
    expect(overview.getAllByText("Coffee break")).toHaveLength(1)
  }
})
