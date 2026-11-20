import { fireEvent, render, screen, waitFor } from "@testing-library/react"
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

describe("SessionModal sharing", () => {
  it("links to the selected session's feedback without closing the modal", () => {
    const onClose = jest.fn()
    render(
      <SessionModal
        session={{ ...session, id: "1168958" }}
        onClose={onClose}
        onSpeakerClick={() => {}}
      />
    )

    const link = screen.getByRole("link", {
      name: "Give feedback on A regular talk",
    })
    expect(link).toHaveAttribute("href", "https://sfeedback.com/gA4U6a")
    fireEvent.click(link)
    expect(onClose).not.toHaveBeenCalled()
  })

  it("copies a path-based talk link", async () => {
    const writeText = jest.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    })

    renderSessionModal("Talk")
    fireEvent.click(screen.getByRole("button", { name: /Copy talk link/ }))

    await waitFor(() =>
      expect(writeText).toHaveBeenCalledWith(
        `${window.location.origin}/schedule/talk/session-a-regular-talk-session-1/`
      )
    )
  })
})

describe("SessionModal slides", () => {
  it("opens Show slides without closing the talk", () => {
    const onClose = jest.fn()
    render(
      <SessionModal
        session={{
          ...session,
          description: "Talk details",
          slideDeck: "https://drive.google.com/file/d/public-pdf/view",
        }}
        onClose={onClose}
        onSpeakerClick={() => {}}
      />
    )

    const link = screen.getByRole("link", { name: "Show slides" })
    expect(link).toHaveAttribute(
      "href",
      "https://drive.google.com/file/d/public-pdf/view"
    )
    expect(link).toHaveAttribute("target", "_blank")
    fireEvent.click(link)
    expect(onClose).not.toHaveBeenCalled()
  })

  it("has no slide link when no URL is available", () => {
    renderSessionModal("Talk details")

    expect(
      screen.queryByRole("link", { name: "Show slides" })
    ).not.toBeInTheDocument()
  })
})

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
