import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { HelmetProvider } from "react-helmet-async"
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom"
import SchedulePage from "../schedule"
import { useSessionizeSchedule } from "../../hooks/use-sessionize"

jest.mock("../../hooks/use-sessionize", () => ({
  useSessionizeSchedule: jest.fn(),
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

const schedule = [
  {
    date: "2026-11-19",
    rooms: [{ id: 1, name: "Main stage", sessions: [session], session }],
    timeSlots: [
      {
        slotStart: session.startsAt,
        rooms: [{ id: 1, name: "Main stage", sessions: [session], session }],
      },
    ],
  },
]

const Back = () => {
  const navigate = useNavigate()
  return <button onClick={() => navigate(-1)}>Browser back</button>
}

const view = (path: string) =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>
        <Back />
        <Routes>
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/schedule/talk/:talkId" element={<SchedulePage />} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>
  )

describe("talk links", () => {
  beforeEach(() => {
    jest
      .mocked(useSessionizeSchedule)
      .mockReturnValue({ schedule, isLoading: false } as ReturnType<
        typeof useSessionizeSchedule
      >)
  })

  it("opens a linked talk modal", async () => {
    view("/schedule/talk/session-a-talk-talk-1/")
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Copy talk link" })
      ).toBeInTheDocument()
    )
  })

  it("opens an old ID-only link", async () => {
    view("/schedule/talk/talk-1/")
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Copy talk link" })
      ).toBeInTheDocument()
    )
  })

  it("closes a linked talk without losing the schedule", async () => {
    view("/schedule/talk/session-a-talk-talk-1/")
    fireEvent.click(
      await screen.findByRole("button", { name: "Back to Schedule" })
    )
    await waitFor(() =>
      expect(
        screen.queryByRole("button", { name: "Copy talk link" })
      ).not.toBeInTheDocument()
    )
    expect(
      screen.getByRole("heading", { name: "Schedule" })
    ).toBeInTheDocument()
  })

  it.each([false, true])(
    "closes a talk when browser history returns to a day link (plenary: %s)",
    async (isPlenumSession) => {
      const talk = { ...session, isPlenumSession }
      jest.mocked(useSessionizeSchedule).mockReturnValue({
        isLoading: false,
        schedule: [
          {
            ...schedule[0],
            timeSlots: [
              {
                ...schedule[0].timeSlots[0],
                rooms: [
                  { ...schedule[0].timeSlots[0].rooms[0], session: talk },
                ],
              },
            ],
          },
        ],
      })
      const scrollIntoView = jest.fn()
      HTMLElement.prototype.scrollIntoView = scrollIntoView
      view("/schedule#thursday")
      await waitFor(() => expect(scrollIntoView).toHaveBeenCalled())
      scrollIntoView.mockClear()
      fireEvent.click(screen.getAllByText("A talk")[0])
      expect(
        await screen.findByRole("button", { name: "Copy talk link" })
      ).toBeInTheDocument()

      fireEvent.click(screen.getByRole("button", { name: "Browser back" }))
      await waitFor(() =>
        expect(
          screen.queryByRole("button", { name: "Copy talk link" })
        ).not.toBeInTheDocument()
      )
      expect(
        screen.getByRole("heading", { name: "Schedule" })
      ).toBeInTheDocument()
      const { promise, resolve } = Promise.withResolvers<void>()
      window.requestAnimationFrame(() => resolve())
      await promise
      expect(scrollIntoView).not.toHaveBeenCalled()
    }
  )
})
