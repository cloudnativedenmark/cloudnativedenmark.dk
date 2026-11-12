import { render, screen, within } from "@testing-library/react"
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

it("shows the conference map with its exhibitors", () => {
  renderAt("/conference-map")

  expect(
    screen.getByRole("heading", { level: 1, name: /find your way/i })
  ).toBeInTheDocument()
  expect(
    within(screen.getByRole("region", { name: "Exhibitors" })).getByRole(
      "button",
      { name: "Stand 5: team.blue (ScanNet), Platinum" }
    )
  ).toBeInTheDocument()
})

it("puts the map before the practical information", () => {
  renderAt("/conference-map")

  const map = screen.getAllByRole("group", { name: /floor plan/i })[0]
  const notes = screen.getByRole("heading", { name: /good to know/i })
  expect(
    map.compareDocumentPosition(notes) & Node.DOCUMENT_POSITION_FOLLOWING
  ).toBeTruthy()
})

it.each(["/venue-plan", "/venue-map"])(
  "redirects the old %s address",
  (path) => {
    renderAt(path)

    expect(
      screen.getByRole("heading", { level: 1, name: /find your way/i })
    ).toBeInTheDocument()
  }
)

it("links to the conference map from the navigation", () => {
  renderAt("/")

  expect(screen.getByRole("link", { name: "Conference Map" })).toHaveAttribute(
    "href",
    "/conference-map"
  )
})
