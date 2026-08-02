import {
  flattenDaySessions,
  findSessionById,
  getAllSpeakersFromSchedule,
} from "../schedule-utils"
import type { GridEntry, Session, Speaker } from "../../../hooks/use-sessionize"

function makeSpeaker(id: string, fullName: string): Speaker {
  return {
    id,
    name: fullName,
    firstName: fullName.split(" ")[0],
    lastName: fullName.split(" ")[1] ?? "",
    fullName,
    bio: "",
    tagLine: "",
    profilePicture: null,
    isTopSpeaker: false,
    sessions: [],
  }
}

function makeSession(
  id: string,
  startsAt: string,
  speakers: Speaker[] = []
): Session {
  return {
    id,
    name: id,
    title: `Title for ${id}`,
    description: "",
    startsAt,
    endsAt: startsAt,
    isServiceSession: false,
    isPlenumSession: false,
    speakers,
    roomId: 1,
    room: "Main Hall",
    questionAnswers: [],
    recordingUrl: "",
    slideDeck: "",
    video: "",
    rate: "",
  }
}

const ada = makeSpeaker("spk-1", "Ada Lovelace")
const grace = makeSpeaker("spk-2", "Grace Hopper")

const day: GridEntry = {
  date: "2026-11-19T00:00:00",
  rooms: [],
  timeSlots: [
    {
      slotStart: "10:00:00",
      rooms: [
        {
          id: 1,
          name: "Main Hall",
          sessions: [],
          session: makeSession("sess-2", "2026-11-19T10:00:00", [grace]),
        },
      ],
    },
    {
      slotStart: "09:00:00",
      rooms: [
        {
          id: 1,
          name: "Main Hall",
          sessions: [],
          session: makeSession("sess-1", "2026-11-19T09:00:00", [ada]),
        },
        // Plenum session repeated across a second room reference —
        // should be deduped by session id, not counted twice.
        {
          id: 2,
          name: "Side Room",
          sessions: [],
          session: makeSession("sess-1", "2026-11-19T09:00:00", [ada]),
        },
      ],
    },
  ],
}

describe("flattenDaySessions", () => {
  it("dedupes repeated sessions across rooms and sorts by start time", () => {
    const result = flattenDaySessions(day)
    expect(result.map((s) => s.id)).toEqual(["sess-1", "sess-2"])
  })
})

describe("findSessionById", () => {
  it("finds a session across the schedule", () => {
    const found = findSessionById([day], "sess-2")
    expect(found?.title).toBe("Title for sess-2")
  })

  it("returns undefined for an unknown id", () => {
    expect(findSessionById([day], "does-not-exist")).toBeUndefined()
  })
})

describe("getAllSpeakersFromSchedule", () => {
  it("dedupes speakers appearing in multiple sessions and sorts by name", () => {
    const speakers = getAllSpeakersFromSchedule([day])
    expect(speakers.map((s) => s.fullName)).toEqual([
      "Ada Lovelace",
      "Grace Hopper",
    ])
  })
})
