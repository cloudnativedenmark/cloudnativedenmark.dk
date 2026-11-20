import { render, screen } from "@testing-library/react"
import { HelmetProvider } from "react-helmet-async"
import { MemoryRouter } from "react-router-dom"
import App from "../../App"
import { features } from "../../config/features"

jest.mock("../../hooks/use-sessionize", () => ({
  useSessionizeSpeakers: jest.fn(() => ({ speakers: [] })),
  useSessionizeSchedule: jest.fn(() => ({ schedule: [], isLoading: false })),
}))
jest.mock("../../hooks/use-sponsors", () => ({
  useSponsors: () => ({
    sponsors: {
      platinum: [],
      gold: [],
      bronze: [],
      afterparty: [],
      community: [],
      partners: [],
    },
  }),
}))
jest.mock("../../utils/data-loader", () => ({
  getTeamMembers: () => [],
}))
jest.mock("../../components/header", () => ({
  __esModule: true,
  default: () => null,
}))
jest.mock("../../components/footer", () => ({
  __esModule: true,
  default: () => null,
}))

const original = { ...features }

// jsdom can't navigate, so it reports location.replace() as a console error
let consoleError: jest.SpyInstance

beforeEach(() => {
  consoleError = jest.spyOn(console, "error").mockImplementation(() => {})
  window.scrollTo = jest.fn()
})

afterEach(() => {
  consoleError.mockRestore()
  Object.assign(features, original)
})

const navigated = () =>
  consoleError.mock.calls.some(([error]) =>
    String(error?.message ?? error).includes("Not implemented: navigation")
  )

const renderAt = (path: string) =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </HelmetProvider>
  )

it.each([
  "/schedule",
  "/schedule/talk/keynote-123/?utm=qr#day2",
  "/schedule/track-overview",
  "/speakers/jane-doe-1/",
])("sends %s to the 2026 archive when schedule pages are off", (path) => {
  Object.assign(features, { scheduleAndSpeakers: false })
  renderAt(path)

  expect(screen.getByRole("link")).toHaveAttribute(
    "href",
    `https://2026.cloudnativedenmark.dk${path}`
  )
  expect(navigated()).toBe(true)
})

it("keeps the schedule on the current site when schedule pages are on", () => {
  Object.assign(features, { scheduleAndSpeakers: true })
  renderAt("/schedule")

  expect(
    screen.queryByRole("link", { name: /2026\.cloudnativedenmark\.dk/ })
  ).toBeNull()
  expect(navigated()).toBe(false)
})
