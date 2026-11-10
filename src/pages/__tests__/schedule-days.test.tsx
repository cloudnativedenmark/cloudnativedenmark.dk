import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { HelmetProvider } from "react-helmet-async"
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom"
import SchedulePage from "../schedule"
import { useSessionizeSchedule } from "../../hooks/use-sessionize"

jest.mock("../../hooks/use-sessionize", () => ({
  useSessionizeSchedule: jest.fn(),
}))

const schedule = ["2026-11-19T00:00:00", "2026-11-20T00:00:00"].map((date) => ({
  date,
  rooms: [],
  timeSlots: [],
}))
const session = {
  id: "talk-1",
  title: "A talk",
  name: "A talk",
  description: "Talk description",
  startsAt: "2026-11-19T09:00:00Z",
  endsAt: "2026-11-19T09:35:00Z",
  room: "Main stage",
  roomId: 1,
  isServiceSession: false,
  isPlenumSession: false,
  speakers: [],
  questionAnswers: [],
  recordingUrl: "",
  slideDeck: "",
  video: "",
  rate: "",
}
const sessionDay = {
  date: "2026-11-19",
  rooms: [{ id: 1, name: "Main stage", sessions: [session], session }],
  timeSlots: [
    {
      slotStart: session.startsAt,
      rooms: [{ id: 1, name: "Main stage", sessions: [session], session }],
    },
  ],
}

const expectSession = async () => {
  await waitFor(() => {
    expect(scrollIntoView.mock.contexts.at(-1)).toHaveAttribute(
      "data-now-session",
      "talk-1"
    )
  })
}

const scrollIntoView = jest.fn()

const Navigation = () => {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <>
      <output aria-label="Current URL">
        {location.pathname + location.search + location.hash}
      </output>
      <button onClick={() => navigate(-1)}>Back</button>
      <button onClick={() => navigate(1)}>Forward</button>
    </>
  )
}

const view = (path: string) =>
  render(<SchedulePage />, {
    wrapper: ({ children }) => (
      <HelmetProvider>
        <MemoryRouter initialEntries={[path]}>
          <Navigation />
          {children}
        </MemoryRouter>
      </HelmetProvider>
    ),
  })

const expectDay = async (date: string) => {
  await waitFor(() => {
    expect(scrollIntoView).toHaveBeenCalled()
    expect(scrollIntoView.mock.contexts.at(-1)).toBe(
      document.getElementById(date)
    )
  })
}

describe("schedule day links", () => {
  beforeEach(() => {
    scrollIntoView.mockClear()
    HTMLElement.prototype.scrollIntoView = scrollIntoView
    jest.mocked(useSessionizeSchedule).mockReturnValue({
      schedule,
      isLoading: false,
    })
  })

  it.each([
    ["2026-11-20", "2026-11-20"],
    ["day1", "2026-11-19"],
    ["day2", "2026-11-20"],
    ["thursday", "2026-11-19"],
    ["friday", "2026-11-20"],
  ])("scrolls to #%s after the schedule loads", async (hash, date) => {
    jest.mocked(useSessionizeSchedule).mockReturnValue({
      schedule: [],
      isLoading: true,
    })
    const { rerender } = view(`/schedule#${hash}`)
    expect(scrollIntoView).not.toHaveBeenCalled()

    jest.mocked(useSessionizeSchedule).mockReturnValue({
      schedule,
      isLoading: false,
    })
    rerender(<SchedulePage />)

    await expectDay(date)
  })

  it("updates the URL and scrolls through day links and browser history", async () => {
    view("/schedule?source=email#thursday")
    await expectDay("2026-11-19")

    fireEvent.click(screen.getByRole("link", { name: "Friday, November 20" }))
    expect(screen.getByLabelText("Current URL")).toHaveTextContent(
      "/schedule?source=email#day2"
    )
    await expectDay("2026-11-20")

    fireEvent.click(screen.getByRole("button", { name: "Back" }))
    await expectDay("2026-11-19")

    fireEvent.click(screen.getByRole("button", { name: "Forward" }))
    await expectDay("2026-11-20")

    scrollIntoView.mockClear()
    fireEvent.click(screen.getByRole("link", { name: "Friday, November 20" }))
    await expectDay("2026-11-20")
  })

  it("keeps each desktop day heading with its sticky column labels", () => {
    view("/schedule")

    for (const day of schedule) {
      const section = document.getElementById(day.date.slice(0, 10))!
      const grid = section.querySelector(".md\\:grid")!
      const heading = grid.querySelector("h2")!
      const header = heading.parentElement!

      expect(header).toHaveClass("sticky")
      expect(heading).toHaveTextContent(
        day.date.startsWith("2026-11-19")
          ? "Thursday, November 19"
          : "Friday, November 20"
      )
      expect(header).toHaveTextContent("Time")
      expect(section.querySelector(".md\\:hidden h2")).toHaveTextContent(
        heading.textContent!
      )
    }
  })

  it("does not scroll for an unknown day", () => {
    view("/schedule#2026-11-21")
    expect(scrollIntoView).not.toHaveBeenCalled()
    expect(screen.getByRole("heading", { name: "Schedule" })).toBeVisible()
  })

  it("uses a simulated local time from the now hash to scroll to the active session", async () => {
    jest.mocked(useSessionizeSchedule).mockReturnValue({
      schedule: [sessionDay],
      isLoading: false,
    })

    view("/schedule#now-2026-11-19_10:00")

    await expectSession()
    expect(screen.getAllByText("Happening now")).toHaveLength(2)
  })

  it("aligns the active section below the sticky menu", async () => {
    jest.mocked(useSessionizeSchedule).mockReturnValue({
      schedule: [sessionDay],
      isLoading: false,
    })

    const siteHeader = document.createElement("header")
    siteHeader.className = "sticky"
    document.body.appendChild(siteHeader)
    const originalRect = HTMLElement.prototype.getBoundingClientRect
    const rects = jest
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockImplementation(function (this: HTMLElement) {
        if (this === siteHeader) {
          return { top: 0, bottom: 73 } as DOMRect
        }
        if (this.classList.contains("sticky")) {
          return { top: 73, bottom: 170 } as DOMRect
        }
        if (this.dataset.nowSession === "talk-1") {
          return { top: 90, bottom: 120 } as DOMRect
        }
        return originalRect.call(this)
      })
    const scrollBy = jest.spyOn(window, "scrollBy").mockImplementation(() => {})

    try {
      view("/schedule#now-2026-11-19_10:00")

      await waitFor(() => {
        expect(scrollBy).toHaveBeenCalledWith(0, -80)
      })
    } finally {
      rects.mockRestore()
      scrollBy.mockRestore()
      siteHeader.remove()
    }
  })

  it("stops highlighting a session at its end time", () => {
    jest.mocked(useSessionizeSchedule).mockReturnValue({
      schedule: [sessionDay],
      isLoading: false,
    })

    view("/schedule#now-2026-11-19_10:35")

    expect(screen.queryByText("Happening now")).not.toBeInTheDocument()
  })

  it("shows go to now in simulation mode and keeps the simulated time", () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date("2026-11-10T09:15:00Z"))
    jest.mocked(useSessionizeSchedule).mockReturnValue({
      schedule: [sessionDay],
      isLoading: false,
    })

    view("/schedule#now-2026-11-19_10:00")

    const button = screen.getByRole("button", { name: "Go to now" })
    expect(button).toBeVisible()
    fireEvent.click(button)
    expect(screen.getByLabelText("Current URL")).toHaveTextContent(
      "/schedule#now-2026-11-19_10:00"
    )
    jest.advanceTimersByTime(50)
    expect(scrollIntoView.mock.contexts.at(-1)).toHaveAttribute(
      "data-now-session",
      "talk-1"
    )

    jest.useRealTimers()
  })

  it("shows go to now on an event day and scrolls using the real current time", () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date("2026-11-19T09:15:00Z"))
    jest.mocked(useSessionizeSchedule).mockReturnValue({
      schedule: [sessionDay],
      isLoading: false,
    })

    view("/schedule#day1")

    const button = screen.getByRole("button", { name: "Go to now" })
    expect(button).toBeVisible()
    fireEvent.click(button)
    expect(screen.getByLabelText("Current URL")).toHaveTextContent("/schedule")
    jest.advanceTimersByTime(20)
    expect(scrollIntoView.mock.contexts.at(-1)).toHaveAttribute(
      "data-now-session",
      "talk-1"
    )
    expect(screen.getAllByText("Happening now")).toHaveLength(2)

    jest.useRealTimers()
  })

  it("does not show go to now outside the scheduled event dates", () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date("2026-11-18T09:15:00Z"))
    jest.mocked(useSessionizeSchedule).mockReturnValue({
      schedule: [sessionDay],
      isLoading: false,
    })

    view("/schedule")

    expect(
      screen.queryByRole("button", { name: "Go to now" })
    ).not.toBeInTheDocument()

    jest.useRealTimers()
  })
})
