import { render, screen } from "@testing-library/react"
import SessionCard from "../session-card"
import { type Session, type Speaker } from "../../hooks/use-sessionize"

const speaker: Speaker = {
  id: "speaker-1",
  name: "Jane Doe",
  firstName: "Jane",
  lastName: "Doe",
  fullName: "Jane Doe",
  bio: "",
  tagLine: "",
  profilePicture: null,
  isTopSpeaker: false,
  sessions: [],
}

const session: Session = {
  id: "session-1",
  name: "A regular talk",
  title: "A regular talk",
  description: "",
  startsAt: "2026-11-19T09:00:00Z",
  endsAt: "2026-11-19T09:35:00Z",
  isServiceSession: false,
  isPlenumSession: false,
  speakers: [speaker],
  roomId: 1,
  room: "Main stage",
  categories: [],
  questionAnswers: [],
  recordingUrl: "",
  slideDeck: "",
  video: "",
  rate: "",
}

describe("SessionCard", () => {
  it("renders the deduced session type in the schedule card", () => {
    render(<SessionCard session={session} />)

    expect(screen.getByText("Session")).toBeInTheDocument()
    expect(screen.getByText("A regular talk")).toBeInTheDocument()
  })

  it("does not render a type for an administrative host segment", () => {
    const hostOnlySession = {
      ...session,
      speakers: [
        {
          ...speaker,
          fullName: "Allan Højgaard Jensen",
        },
      ],
    }

    render(<SessionCard session={hostOnlySession} />)

    expect(screen.queryByText("Session")).not.toBeInTheDocument()
  })
})
