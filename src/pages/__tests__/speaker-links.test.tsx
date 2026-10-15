import { render, screen, waitFor, fireEvent } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
import SpeakersPage from "../speakers"
import { useSessionizeSpeakers } from "../../hooks/use-sessionize"

jest.mock("../../hooks/use-sessionize", () => ({
  useSessionizeSpeakers: jest.fn(),
}))

const speaker = {
  id: "speaker-1",
  fullName: "Jane Doe",
  name: "Jane Doe",
  firstName: "Jane",
  lastName: "Doe",
  tagLine: "Engineer",
  bio: "Bio",
  profilePicture: null,
  isTopSpeaker: false,
  sessions: [],
}

const view = (path: string) =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/speakers" element={<SpeakersPage />} />
          <Route path="/speakers/:speakerId" element={<SpeakersPage />} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>
  )

describe("speaker links", () => {
  beforeEach(() => {
    jest
      .mocked(useSessionizeSpeakers)
      .mockReturnValue({ speakers: [speaker] } as ReturnType<
        typeof useSessionizeSpeakers
      >)
  })

  it("opens a linked speaker modal", async () => {
    view("/speakers/jane-doe-speaker1")
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Copy speaker link" })
      ).toBeInTheDocument()
    )
  })

  it("opens an old name slug using the stable short id", async () => {
    view("/speakers/old-name-speaker1/")
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Copy speaker link" })
      ).toBeInTheDocument()
    )
  })

  it("copies the linked speaker URL", async () => {
    const writeText = jest.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    })

    view("/speakers/jane-doe-speaker1/")
    fireEvent.click(
      await screen.findByRole("button", { name: "Copy speaker link" })
    )

    await waitFor(() =>
      expect(writeText).toHaveBeenCalledWith(
        `${window.location.origin}/speakers/jane-doe-speaker1/`
      )
    )
  })

  it("opens a link when a speaker is selected", async () => {
    view("/speakers")
    fireEvent.click(screen.getByText("Jane Doe"))
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Copy speaker link" })
      ).toBeInTheDocument()
    )
  })
})
