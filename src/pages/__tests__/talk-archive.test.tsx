import { fireEvent, render, screen } from "@testing-library/react"
import { HelmetProvider } from "react-helmet-async"
import { MemoryRouter } from "react-router-dom"
import App from "../../App"
import { features } from "../../config/features"

const speaker = (id: string, fullName: string) => ({
  id,
  fullName,
  profilePicture: null,
  sessions: [],
})

const session = (id: string, title: string, extra: object = {}) => ({
  id,
  title,
  description: `${title} abstract`,
  startsAt: "2026-11-19T10:25:00",
  endsAt: "2026-11-19T11:00:00",
  isServiceSession: false,
  speakers: [speaker(`s-${id}`, `Speaker ${id}`)],
  slideDeck: "",
  video: "",
  ...extra,
})

const slides = "https://drive.google.com/file/d/abc/view"

const schedule = [
  {
    timeSlots: [
      {
        rooms: [
          {
            name: "Main stage",
            session: session("1", "Kyverno", { slideDeck: slides }),
          },
          { name: "Breakout", session: session("2", "Crossplane") },
          {
            name: "Main stage",
            session: session("3", "Welcome", {
              speakers: [speaker("host", "Kasper Borg Nissen")],
            }),
          },
          {
            name: "Main stage",
            session: session("4", "Lunch", {
              isServiceSession: true,
              speakers: [],
            }),
          },
        ],
      },
    ],
  },
]

const mockUseSessionizeSchedule = jest.fn((_id?: string) => ({
  schedule,
  isLoading: false,
}))

jest.mock("../../hooks/use-sessionize", () => ({
  useSessionizeSpeakers: jest.fn(() => ({ speakers: [] })),
  useSessionizeSchedule: (id?: string) => mockUseSessionizeSchedule(id),
}))
jest.mock("../../hooks/use-sponsors", () => ({
  useSponsors: jest.fn(() => ({
    sponsors: {
      platinum: [],
      gold: [],
      bronze: [],
      afterparty: [],
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
  default: ({
    menuLinks,
  }: {
    menuLinks: Array<{ name: string; link: string }>
  }) => (
    <nav>
      {menuLinks.map(({ name, link }) => (
        <a key={link} href={link}>
          {name}
        </a>
      ))}
    </nav>
  ),
}))
jest.mock("../../components/content/social-links", () => ({
  __esModule: true,
  default: () => null,
}))

const original = { ...features }

beforeEach(() =>
  Object.assign(features, { scheduleAndSpeakers: true, talkArchive: true })
)
afterEach(() => {
  Object.assign(features, original)
  mockUseSessionizeSchedule.mockReturnValue({ schedule, isLoading: false })
})

const renderAt = (path: string) =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </HelmetProvider>
  )

it.each(["/archive", "/talk-archive"])(
  "lists the current edition's talks at %s",
  (path) => {
    renderAt(path)

    expect(mockUseSessionizeSchedule).toHaveBeenCalledWith(undefined)
    expect(
      screen.getByRole("heading", { level: 1, name: "Catch up on every talk." })
    ).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Kyverno" })).toBeVisible()
    expect(screen.getByRole("heading", { name: "Crossplane" })).toBeVisible()
    expect(screen.queryByRole("heading", { name: "Welcome" })).toBeNull()
    expect(screen.queryByRole("heading", { name: "Lunch" })).toBeNull()
  }
)

it("links slides straight to where the speaker shared them", () => {
  renderAt("/archive")

  const links = screen.getAllByRole("link", { name: "Slides" })
  expect(links).toHaveLength(1)
  expect(links[0]).toHaveAttribute("href", slides)
})

it("filters talks by search", () => {
  renderAt("/archive")

  fireEvent.change(screen.getByRole("searchbox", { name: "Search talks" }), {
    target: { value: "Crossplane" },
  })

  expect(screen.getByRole("heading", { name: "Crossplane" })).toBeVisible()
  expect(screen.queryByRole("heading", { name: "Kyverno" })).toBeNull()

  fireEvent.change(screen.getByRole("searchbox", { name: "Search talks" }), {
    target: { value: "zzzzzz" },
  })

  expect(screen.getByText("No talks match your search.")).toBeVisible()
})

it("labels each talk with its edition", () => {
  renderAt("/archive")

  expect(screen.getAllByText("| CND 2026")).toHaveLength(2)
})

it("replaces the schedule with the talk archive in the menu", () => {
  renderAt("/archive")

  expect(screen.getByRole("link", { name: "Talk Archive" })).toHaveAttribute(
    "href",
    "/archive"
  )
  expect(screen.queryByRole("link", { name: "Schedule" })).toBeNull()
})

it("keeps the schedule in the menu while the talk archive is off", () => {
  Object.assign(features, { talkArchive: false })
  renderAt("/")

  expect(screen.getByRole("link", { name: "Schedule" })).toHaveAttribute(
    "href",
    "/schedule"
  )
  expect(screen.queryByRole("link", { name: "Talk Archive" })).toBeNull()
})

it.each([
  [true, "Loading talks..."],
  [false, "Talks are unavailable right now. Please try again later."],
])("explains an empty archive (loading: %s)", (isLoading, message) => {
  mockUseSessionizeSchedule.mockReturnValue({ schedule: [], isLoading })
  renderAt("/archive")

  expect(screen.getByRole("status")).toHaveTextContent(message)
})

it("opens a speaker from the keyboard-reachable speaker button", () => {
  renderAt("/archive")

  fireEvent.click(screen.getByRole("button", { name: "Speaker 1" }))

  expect(
    screen.getByRole("heading", { level: 2, name: "Speaker 1" })
  ).toBeVisible()
})
