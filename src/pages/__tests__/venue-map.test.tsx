import { render, screen } from "@testing-library/react"
import { HelmetProvider } from "react-helmet-async"
import { MemoryRouter } from "react-router-dom"
import App from "../../App"
import { useSponsors } from "../../hooks/use-sponsors"

jest.mock("../../hooks/use-sessionize", () => ({
  useSessionizeSpeakers: jest.fn(() => ({ speakers: [] })),
  useSessionizeSchedule: jest.fn(() => ({})),
}))
jest.mock("../../hooks/use-sponsors", () => ({
  useSponsors: jest.fn(),
}))
jest.mock("../../utils/data-loader", () => ({
  getTeamMembers: () => [],
}))
// The real header and footer render inline SVG components Jest can't load
jest.mock("../../components/header", () => ({
  __esModule: true,
  default: ({ menuLinks }: { menuLinks: { name: string; link: string }[] }) => (
    <nav>
      {menuLinks.map((link) => (
        <a key={link.link} href={link.link}>
          {link.name}
        </a>
      ))}
    </nav>
  ),
}))
jest.mock("../../components/footer", () => ({
  __esModule: true,
  default: () => null,
}))

beforeEach(() => {
  jest.mocked(useSponsors).mockReturnValue({
    sponsors: {
      platinum: [
        {
          id: "platinum/scannet",
          title: "team.blue (ScanNet)",
          url: "https://www.scannet.dk/",
          logo: { publicURL: "/assets/scannet.png" },
        },
      ],
      gold: [],
      bronze: [],
      community: [],
      partners: [],
    },
  })
})

const renderAt = (path: string) =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </HelmetProvider>
  )

it("shows the venue map with its exhibitors", () => {
  renderAt("/venue-map")

  expect(
    screen.getByRole("heading", { level: 1, name: /find your way/i })
  ).toBeInTheDocument()
  expect(
    screen.getByRole("link", { name: /team\.blue \(ScanNet\)/ })
  ).toBeInTheDocument()
})

it("redirects the old venue plan address", () => {
  renderAt("/venue-plan")

  expect(
    screen.getByRole("heading", { level: 1, name: /find your way/i })
  ).toBeInTheDocument()
})

it("links to the venue map from the navigation", () => {
  renderAt("/")

  expect(screen.getByRole("link", { name: "Venue Map" })).toHaveAttribute(
    "href",
    "/venue-map"
  )
})
