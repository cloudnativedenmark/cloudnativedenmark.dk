import { render, screen, within } from "@testing-library/react"
import { HelmetProvider } from "react-helmet-async"
import { MemoryRouter } from "react-router-dom"
import App from "../../App"

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

it("sends speakers to the guide they got by email", () => {
  renderAt("/speakers-guide")

  const page = screen.getByRole("region", { name: /check your inbox/i })
  expect(
    within(page).getByRole("heading", { level: 1, name: /check your inbox/i })
  ).toBeInTheDocument()
  expect(
    within(page).getByRole("link", { name: "contact@cloudnativedenmark.dk" })
  ).toHaveAttribute("href", "mailto:contact@cloudnativedenmark.dk")
})
