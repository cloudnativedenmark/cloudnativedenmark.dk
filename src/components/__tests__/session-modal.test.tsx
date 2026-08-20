import { render, screen } from "@testing-library/react"
import SessionModal from "../session_modal"
import { type Session } from "../../hooks/use-sessionize"

const session: Session = {
  id: "session-1",
  name: "A regular talk",
  title: "A regular talk",
  description: "",
  startsAt: "2026-11-19T09:00:00Z",
  endsAt: "2026-11-19T09:35:00Z",
  isServiceSession: false,
  isPlenumSession: false,
  speakers: [],
  roomId: 1,
  room: "Main stage",
  categories: [],
  questionAnswers: [],
  recordingUrl: "",
  slideDeck: "",
  video: "",
  rate: "",
}

const renderSessionModal = (description: string | null) =>
  render(
    <SessionModal
      session={{ ...session, description }}
      onClose={() => {}}
      onSpeakerClick={() => {}}
    />
  )

describe("SessionModal description", () => {
  it("renders CRLF-separated descriptions as two paragraphs", () => {
    renderSessionModal("First paragraph.\r\n\r\nSecond paragraph.")

    expect(document.body.querySelectorAll("p")).toHaveLength(2)
  })

  it("renders a dash list with the correct number of items", () => {
    renderSessionModal("- First item\n- Second item\n- Third item")

    const list = document.body.querySelector("ul")
    expect(list).not.toBeNull()
    expect(list?.querySelectorAll("li")).toHaveLength(3)
  })

  it("does not create an executable script element from a description", () => {
    const { container } = renderSessionModal("<script>alert(1)</script>")

    expect(container.querySelector("script")).toBeNull()
    expect(document.body.querySelector("script")).toBeNull()
  })

  it("does not render a Description heading for a null description", () => {
    renderSessionModal(null)

    expect(screen.queryByText("Description")).not.toBeInTheDocument()
  })
})
