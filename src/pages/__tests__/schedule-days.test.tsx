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

  it("does not scroll for an unknown day", () => {
    view("/schedule#2026-11-21")
    expect(scrollIntoView).not.toHaveBeenCalled()
    expect(screen.getByRole("heading", { name: "Schedule" })).toBeVisible()
  })
})
