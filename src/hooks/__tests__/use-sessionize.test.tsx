import { renderHook, waitFor } from "@testing-library/react"
import {
  type GridEntry,
  type Session,
  type Speaker,
  MainSessionizeId,
  useSessionizeSchedule,
  useSessionizeSpeakers,
} from "../use-sessionize"

const adminHostNames = [
  "Allan Højgaard Jensen",
  "Jinhong Brejnholt",
  "Kasper Borg Nissen",
]

const createSpeaker = (
  fullName: string,
  sessions: Speaker["sessions"]
): Speaker => {
  const [firstName, ...lastName] = fullName.split(" ")
  return {
    id: fullName,
    name: fullName,
    firstName,
    lastName: lastName.join(" "),
    fullName,
    bio: "",
    tagLine: "",
    profilePicture: null,
    isTopSpeaker: false,
    sessions,
  }
}

const hostSession = {
  id: 1,
  name: "Welcome to Cloud Native Denmark",
}
const regularSession = {
  id: 2,
  name: "A regular talk",
}

const speakers = [
  ...adminHostNames.map((name) => createSpeaker(name, [hostSession])),
  createSpeaker("Jane Doe", [regularSession]),
]

const createGridSession = (
  id: string,
  startsAt: string,
  endsAt: string,
  sessionSpeakers: Speaker[]
): Session => ({
  id,
  name: id,
  title: id,
  description: "",
  startsAt,
  endsAt,
  isServiceSession: false,
  isPlenumSession: false,
  speakers: sessionSpeakers,
  roomId: 1,
  room: "Main stage",
  questionAnswers: [],
  recordingUrl: "",
  slideDeck: "",
  video: "",
  rate: "",
})

const grid = [
  {
    rooms: [
      {
        sessions: [
          createGridSession(
            "1",
            "2026-11-19T09:00:00Z",
            "2026-11-19T09:35:00Z",
            speakers.slice(0, 3)
          ),
          createGridSession(
            "2",
            "2026-11-19T10:00:00Z",
            "2026-11-19T10:35:00Z",
            speakers.slice(3)
          ),
        ],
      },
    ],
  },
] as unknown as GridEntry[]

describe("useSessionizeSpeakers", () => {
  const fetchMock = jest.fn()

  beforeEach(() => {
    fetchMock.mockReset()
    global.fetch = fetchMock
  })

  it("shows administrative hosts while omitting their host-only sessions", async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => speakers,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => grid,
      })

    const { result } = renderHook(() => useSessionizeSpeakers("test-event"))

    await waitFor(() => expect(result.current.speakers).toHaveLength(4))

    for (const name of adminHostNames) {
      const host = result.current.speakers.find(
        (speaker) => speaker.fullName === name
      )
      expect(host).toEqual(
        expect.objectContaining({ fullName: name, sessions: [] })
      )
    }

    expect(
      result.current.speakers.find((speaker) => speaker.fullName === "Jane Doe")
        ?.sessions
    ).toEqual([{ ...regularSession, type: "Session" }])
  })
})

describe("useSessionizeSchedule slides", () => {
  const currentUrl = "https://example.org/current-slides.pdf"
  const archiveUrl = "https://example.org/archive-slides.pdf"

  const mockSchedule = (answer: string | null = currentUrl) => {
    const talk = createGridSession(
      "2",
      "2026-11-19T10:00:00",
      "2026-11-19T10:35:00",
      speakers.slice(3)
    )
    talk.slideDeck = "https://example.org/stale-slides.pdf"
    const responses: Record<string, unknown> = {
      Grid: [
        {
          date: "2026-11-19",
          rooms: [{ id: 1, name: "Main stage", sessions: [talk] }],
          timeSlots: [
            {
              slotStart: talk.startsAt,
              rooms: [{ id: 1, name: "Main stage", session: talk }],
            },
          ],
        },
      ],
      Speakers: speakers,
      Sessions: [
        {
          sessions: [
            {
              ...talk,
              questionAnswers: [
                { id: 99194, answer: archiveUrl },
                { id: 115164, answer },
              ],
            },
          ],
        },
      ],
    }
    global.fetch = jest.fn(async (input) => ({
      ok: true,
      json: async () => responses[String(input).split("/").pop()!],
    })) as jest.Mock
  }

  it.each([
    [MainSessionizeId, currentUrl],
    ["archive-event", archiveUrl],
  ])("uses the slide field for event %s", async (eventId, expected) => {
    mockSchedule()
    const { result } = renderHook(() => useSessionizeSchedule(eventId))

    await waitFor(() =>
      expect(
        result.current.schedule[0]?.timeSlots[0].rooms[0].session.slideDeck
      ).toBe(expected)
    )
  })

  it("clears stale slides when the current event's answer is empty", async () => {
    mockSchedule(null)
    const { result } = renderHook(() => useSessionizeSchedule())

    await waitFor(() =>
      expect(
        result.current.schedule[0]?.timeSlots[0].rooms[0].session.slideDeck
      ).toBe("")
    )
  })
})
