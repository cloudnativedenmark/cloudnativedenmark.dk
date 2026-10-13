import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { HelmetProvider } from "react-helmet-async"
import { MemoryRouter, useLocation } from "react-router-dom"
import IndexPage from "../index"
import { useSessionizeSpeakers } from "../../hooks/use-sessionize"
import { useSponsors } from "../../hooks/use-sponsors"

jest.mock("../../hooks/use-sessionize", () => ({
  useSessionizeSpeakers: jest.fn(),
}))
jest.mock("../../hooks/use-sponsors", () => ({
  useSponsors: jest.fn(),
}))

const Location = () => {
  const location = useLocation()
  return <output data-testid="path">{location.pathname}</output>
}

it("opens a featured speaker on the home page and copies the speaker link", async () => {
  jest.mocked(useSessionizeSpeakers).mockReturnValue({
    speakers: [
      {
        id: "speaker-1",
        fullName: "Jane Doe",
        name: "Jane Doe",
        firstName: "Jane",
        lastName: "Doe",
        tagLine: "Engineer",
        bio: "Biography",
        profilePicture: "https://example.com/jane.jpg",
        isTopSpeaker: true,
        sessions: [],
      },
    ],
  })
  jest.mocked(useSponsors).mockReturnValue({
    sponsors: {
      platinum: [],
      gold: [],
      bronze: [],
      community: [],
      partners: [],
    },
  })
  const writeText = jest.fn().mockResolvedValue(undefined)
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  })
  const pushState = jest.spyOn(window.history, "pushState")

  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={["/"]}>
        <IndexPage />
        <Location />
      </MemoryRouter>
    </HelmetProvider>
  )

  fireEvent.click(screen.getByText("Jane Doe"))
  fireEvent.click(
    await screen.findByRole("button", { name: "Copy speaker link" })
  )

  await waitFor(() =>
    expect(writeText).toHaveBeenCalledWith(
      `${window.location.origin}/speakers/jane-doe-speaker1/`
    )
  )
  expect(screen.getByTestId("path")).toHaveTextContent("/")
  expect(pushState).not.toHaveBeenCalled()

  fireEvent.click(screen.getByRole("button", { name: "Back" }))
  expect(
    screen.queryByRole("button", { name: "Link copied" })
  ).not.toBeInTheDocument()
  expect(screen.getByTestId("path")).toHaveTextContent("/")
  pushState.mockRestore()
})
