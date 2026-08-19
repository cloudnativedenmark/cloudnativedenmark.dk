import { renderHook, waitFor } from "@testing-library/react"
import {
  type GridEntry,
  type Session,
  type Speaker,
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
