import { render, screen, within } from "@testing-library/react"
import { HelmetProvider } from "react-helmet-async"
import { MemoryRouter } from "react-router-dom"
import App from "../../App"
import Footer from "../../components/footer"

jest.mock("../../hooks/use-sessionize", () => ({
  useSessionizeSpeakers: jest.fn(() => ({ speakers: [] })),
  useSessionizeSchedule: jest.fn(() => ({})),
}))
jest.mock("../../hooks/use-sponsors", () => ({
  useSponsors: jest.fn(() => ({
    sponsors: {
      platinum: [],
      gold: [],
      bronze: [],
      community: [],
      partners: [],
    },
  })),
}))
jest.mock("../../utils/data-loader", () => ({
  getTeamMembers: () => [],
}))
// The real header and social links render inline SVG components Jest can't load
jest.mock("../../components/header", () => ({
  __esModule: true,
  default: () => null,
}))
jest.mock("../../components/content/social-links", () => ({
  __esModule: true,
  default: () => null,
}))

const renderAt = (path: string) =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </HelmetProvider>
  )

it("shows the code of conduct", () => {
  renderAt("/code-of-conduct")

  expect(
    screen.getByRole("heading", { level: 1, name: /code of conduct/i })
  ).toBeInTheDocument()
  for (const section of [
    "Scope",
    "Expected behavior",
    "Unacceptable behavior",
    "Reporting",
    "Pre-event concerns",
    "Enforcement",
    "Acknowledgements",
  ]) {
    expect(
      screen.getByRole("heading", { level: 2, name: section })
    ).toBeInTheDocument()
  }
})

it("tells people how to get help", () => {
  renderAt("/code-of-conduct")

  const help = screen.getByRole("region", { name: /need help/i })
  expect(
    within(help).getByRole("link", { name: "contact@cloudnativedenmark.dk" })
  ).toHaveAttribute("href", "mailto:contact@cloudnativedenmark.dk")
  expect(within(help).getByText("112")).toBeInTheDocument()
})

it("credits the codes of conduct it is adapted from", () => {
  renderAt("/code-of-conduct")

  expect(
    screen.getByRole("link", { name: "CNCF Community Code of Conduct" })
  ).toHaveAttribute(
    "href",
    "https://github.com/cncf/foundation/blob/main/code-of-conduct.md"
  )
  expect(
    screen.getByRole("link", {
      name: "Linux Foundation Events Code of Conduct",
    })
  ).toHaveAttribute(
    "href",
    "https://events.linuxfoundation.org/about/code-of-conduct/"
  )
})

it("links to the code of conduct from the footer", () => {
  render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>
  )

  expect(screen.getByRole("link", { name: "Code of Conduct" })).toHaveAttribute(
    "href",
    "/code-of-conduct"
  )
})
