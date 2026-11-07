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
})

it("tells people how to get help", () => {
  renderAt("/code-of-conduct")

  const help = screen.getByRole("region", { name: /need help/i })
  expect(within(help).getByRole("link", { name: "112" })).toHaveAttribute(
    "href",
    "tel:112"
  )
  expect(
    within(help).getByRole("link", { name: "contact@cloudnativedenmark.dk" })
  ).toHaveAttribute("href", "mailto:contact@cloudnativedenmark.dk")
})

it("attributes the CC BY 4.0 source it adapts", () => {
  renderAt("/code-of-conduct")

  expect(
    screen.getByRole("link", { name: "CNCF Community Code of Conduct" })
  ).toBeInTheDocument()
  expect(screen.getByRole("link", { name: "CC BY 4.0" })).toHaveAttribute(
    "href",
    "https://creativecommons.org/licenses/by/4.0/"
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
