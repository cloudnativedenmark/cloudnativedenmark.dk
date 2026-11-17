import { fireEvent, render, screen } from "@testing-library/react"
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
  it.each(["schedule", "mobile"] as const)(
    "opens feedback independently of the %s card",
    (variant) => {
      const onClick = jest.fn()
      render(
        <SessionCard
          session={{ ...session, id: "1148240" }}
          variant={variant}
          onClick={onClick}
        />
      )

      const link = screen.getByRole("link", {
        name: "Give feedback on A regular talk",
      })
      expect(link).toHaveAttribute("href", "https://sfeedback.com/NA4OI0")
      expect(link).toHaveAttribute("target", "_blank")
      expect(link).toHaveAttribute("rel", "noopener noreferrer nofollow")
      fireEvent.click(link)
      expect(onClick).not.toHaveBeenCalled()
      fireEvent.click(screen.getByText("A regular talk"))
      expect(onClick).toHaveBeenCalledTimes(1)
    }
  )

  it.each([
    { ...session },
    { ...session, id: "1148240", isServiceSession: true },
  ])("omits feedback when it is unavailable", (session) => {
    render(<SessionCard session={session} />)

    expect(
      screen.queryByRole("link", { name: /Give feedback/ })
    ).not.toBeInTheDocument()
  })

  it("shows sponsor logos on a service session", () => {
    const afterParty = {
      ...session,
      title: "After party - sponsored by Upwind",
      isServiceSession: true,
      isPlenumSession: true,
      speakers: [],
    }

    render(
      <SessionCard
        session={afterParty}
        sponsors={[
          {
            title: "Upwind",
            url: "https://upwind.io/",
            logo: { publicURL: "/assets/upwind.svg" },
          },
        ]}
      />
    )

    expect(screen.getByRole("img", { name: "Upwind" })).toHaveAttribute(
      "src",
      "/assets/upwind.svg"
    )
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "https://upwind.io/"
    )
  })

  it("renders the deduced session type in the schedule card", () => {
    render(<SessionCard session={session} />)

    expect(screen.getByText("Session")).toBeInTheDocument()
    expect(screen.getByText("A regular talk")).toBeInTheDocument()
  })

  it("prefers an explicit Sessionize format over duration inference", () => {
    const explicitKeynote = {
      ...session,
      startsAt: "2026-11-19T09:15:00Z",
      endsAt: "2026-11-19T09:25:00Z",
      categories: [
        {
          id: 115158,
          name: "Session format",
          categoryItems: [{ id: 511770, name: "Keynote" }],
          sort: 0,
        },
      ],
    }

    render(<SessionCard session={explicitKeynote} />)

    expect(screen.getByText("Keynote")).toBeInTheDocument()
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
