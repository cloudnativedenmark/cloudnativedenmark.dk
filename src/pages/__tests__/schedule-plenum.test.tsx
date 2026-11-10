import { render, screen, within } from "@testing-library/react"
import { HelmetProvider } from "react-helmet-async"
import { MemoryRouter } from "react-router-dom"
import SchedulePage from "../schedule"
import {
  type GridEntry,
  type Session,
  useSessionizeSchedule,
} from "../../hooks/use-sessionize"

jest.mock("../../hooks/use-sessionize", () => ({
  useSessionizeSchedule: jest.fn(),
}))

const session = (
  title: string,
  start: string,
  end: string,
  roomId: number,
  extra: Partial<Session> = {}
): Session => ({
  id: title.toLowerCase().replaceAll(" ", "-"),
  name: title,
  title,
  description: null,
  startsAt: `2026-11-19T${start}:00`,
  endsAt: `2026-11-19T${end}:00`,
  roomId,
  room: ["Main stage", "Breakout", "Workshop"][roomId - 1],
  isServiceSession: false,
  isPlenumSession: false,
  speakers: [],
  questionAnswers: [],
  recordingUrl: "",
  slideDeck: "",
  video: "",
  rate: "",
  ...extra,
})

const keynote = session("Keynote", "09:00", "09:30", 1, {
  isPlenumSession: true,
})
const workshop = session("Long workshop", "09:30", "11:00", 3)
const coffee = session("Coffee break", "10:00", "10:15", 1, {
  isServiceSession: true,
  isPlenumSession: true,
  description: "Coffee is in the foyer.",
})
const lunch = session("Lunch", "11:00", "12:00", 1, {
  isServiceSession: true,
  isPlenumSession: true,
})
const slot = (time: string, sessions: Session[]) => ({
  slotStart: `${time}:00`,
  rooms: sessions.map((session) => ({
    id: session.roomId,
    name: session.room,
    session,
    sessions: [session],
  })),
})
const day: GridEntry = {
  date: "2026-11-19T00:00:00",
  rooms: [1, 2, 3].map((id) => ({
    id,
    name: ["Main stage", "Breakout", "Workshop"][id - 1],
    session: keynote,
    sessions: [],
  })),
  timeSlots: [
    slot("08:00", [
      session("Registration", "08:00", "09:00", 1, {
        isServiceSession: true,
      }),
    ]),
    slot("09:00", [keynote]),
    slot("09:30", [session("A talk", "09:30", "10:00", 1), workshop]),
    slot("10:00", [coffee]),
    slot("10:15", [session("Next talk", "10:15", "11:00", 1)]),
    slot("11:00", [lunch]),
  ],
}

const view = (schedule = [day]) => {
  jest.mocked(useSessionizeSchedule).mockReturnValue({
    schedule,
    isLoading: false,
  })
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={["/schedule"]}>
        <SchedulePage />
      </MemoryRouter>
    </HelmetProvider>
  )
}

describe("plenary schedule", () => {
  it("hides mobile locations only for plenary service sessions and shows their description", () => {
    const { container } = view()
    const mobile = container.querySelector(".md\\:hidden") as HTMLElement
    const coffeeSlot = within(mobile).getByRole("heading", {
      name: "10:00",
    }).parentElement!
    expect(within(coffeeSlot).queryByText("Main stage")).not.toBeInTheDocument()
    expect(
      within(coffeeSlot).getByText("Coffee is in the foyer.")
    ).toBeInTheDocument()
    const keynoteSlot = within(mobile).getByRole("heading", {
      name: "09:00",
    }).parentElement!
    expect(within(keynoteSlot).getByText("Main stage")).toBeInTheDocument()
    const registrationSlot = within(mobile).getByRole("heading", {
      name: "08:00",
    }).parentElement!
    expect(within(registrationSlot).getByText("Main stage")).toBeInTheDocument()
  })

  it("keeps a workshop continuous under a full-width break", () => {
    view()
    const grid = screen.getByText("Time").closest(".md\\:grid")!
    const coffeeCell = Array.from(grid.children).find((element) =>
      within(element as HTMLElement).queryByRole("heading", {
        name: "Coffee break",
      })
    ) as HTMLElement
    const workshopCell = Array.from(grid.children).find((element) =>
      within(element as HTMLElement).queryByRole("heading", {
        name: "Long workshop",
      })
    ) as HTMLElement
    expect(coffeeCell).toHaveStyle({ gridColumn: "2 / -1", gridRow: "5" })
    expect(workshopCell).toHaveStyle({ gridColumn: "4", gridRow: "4 / span 3" })
  })

  it("shows mobile start and end times on presentations, workshops, and breaks", () => {
    const { container } = view()
    const mobile = container.querySelector(".md\\:hidden") as HTMLElement
    const keynoteCard = within(mobile).getByRole("heading", {
      name: "Keynote",
    }).parentElement!
    expect(within(keynoteCard).getByText("09:00–09:30")).toBeInTheDocument()
    const workshopCard = within(mobile).getByRole("heading", {
      name: "Long workshop",
    }).parentElement!
    expect(within(workshopCard).getByText("09:30–11:00")).toBeInTheDocument()
    expect(
      within(workshopCard).getByText(/Coffee break.*10:00–10:15/)
    ).toBeInTheDocument()
    expect(within(workshopCard).queryByText(/Lunch/)).not.toBeInTheDocument()
    const coffeeCard = within(mobile).getByRole("heading", {
      name: "Coffee break",
    }).parentElement!
    expect(within(coffeeCard).getByText("10:00–10:15")).toBeInTheDocument()
  })

  it.each<[string, string, boolean]>([
    ["09:30", "10:00", false],
    ["10:15", "11:00", false],
    ["09:30", "10:01", true],
    ["10:14", "11:00", true],
  ])(
    "marks a workshop from %s to %s only when it overlaps a break",
    (start, end, overlaps) => {
      const timedWorkshop = {
        ...workshop,
        startsAt: `2026-11-19T${start}:00`,
        endsAt: `2026-11-19T${end}:00`,
      }
      const { container } = view([
        {
          ...day,
          timeSlots: [
            slot(start, [timedWorkshop]),
            slot("10:00", [coffee]),
          ].sort((a, b) => a.slotStart.localeCompare(b.slotStart)),
        },
      ])
      const mobile = container.querySelector(".md\\:hidden") as HTMLElement
      const workshopCard = within(mobile).getByRole("heading", {
        name: "Long workshop",
      }).parentElement!
      const label = within(workshopCard).queryByText(
        /Coffee break.*10:00–10:15/
      )
      if (overlaps) {
        expect(label).toBeInTheDocument()
        return
      }
      expect(label).not.toBeInTheDocument()
    }
  )
})
