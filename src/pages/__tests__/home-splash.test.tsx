import { render, screen, within } from "@testing-library/react"
import { HelmetProvider } from "react-helmet-async"
import { MemoryRouter } from "react-router-dom"
import IndexPage from "../index"
import Layout from "../../components/layout"
import { features } from "../../config/features"

jest.mock("../../components/header", () => ({
  __esModule: true,
  default: ({ menuLinks }: { menuLinks: { name: string; link: string }[] }) => (
    <nav aria-label="Main">
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

const original = { ...features }

afterEach(() => Object.assign(features, original))

const view = () =>
  render(
    <HelmetProvider>
      <MemoryRouter>
        <IndexPage />
      </MemoryRouter>
    </HelmetProvider>
  )

const expectExternal = (link: HTMLElement, href: string) => {
  expect(link).toHaveAttribute("href", href)
  expect(link).toHaveAttribute("target", "_blank")
  expect(link).toHaveAttribute("rel", "noopener noreferrer")
}

it("thanks attendees and sells 2027 Early Blind Bird tickets", () => {
  view()

  expect(
    screen.getByRole("heading", { level: 1, name: "THANK YOU." })
  ).toBeVisible()
  expect(
    screen.getByRole("heading", { name: "Early Blind Bird tickets" })
  ).toBeVisible()
  expect(screen.getByText("999")).toBeVisible()
  expect(screen.getByText("LIMITED DROP")).toBeVisible()
  expect(document.body).not.toHaveTextContent(/NOV 2027|16–18|TBA/)
  expectExternal(
    screen.getByRole("link", { name: /^Get Early Blind Bird →/ }),
    "https://cloudnativedenmark.ticketbutler.io/en/e/cloud-native-denmark-2027/"
  )
})

it("marks Early Blind Bird sold out when ticket sales are off", () => {
  Object.assign(features, { ticketSales: false })
  view()

  expect(screen.getByText("SOLD OUT")).toBeVisible()
  expect(screen.queryByText("LIMITED DROP")).toBeNull()
  expect(
    screen.queryByRole("link", { name: /^Get Early Blind Bird →/ })
  ).toBeNull()
})

it("links to the 2026 archive, feedback and photos only", () => {
  const { container } = view()

  expectExternal(
    screen.getByRole("link", { name: /Give feedback/ }),
    "https://forms.gle/4XVnmNoEa5koLV238"
  )
  expectExternal(
    screen.getByRole("link", { name: /Photo gallery/ }),
    "https://www.picdrop.com/kim-yennguyen/PtE1CyXcQm"
  )
  expectExternal(
    screen.getByRole("link", { name: /CND\/2026 website/ }),
    "https://2026.cloudnativedenmark.dk"
  )
  expect(screen.getAllByRole("listitem")).toHaveLength(3)
  expect(container.querySelector('a[href^="mailto:"]')).toBeNull()
  expect(container.querySelector('a[href^="/schedule"]')).toBeNull()
})

it("only offers the Team page in the menu", () => {
  window.scrollTo = jest.fn()
  render(
    <MemoryRouter>
      <Layout />
    </MemoryRouter>
  )

  const links = within(screen.getByRole("navigation", { name: "Main" }))
    .getAllByRole("link")
    .map((link) => link.textContent)
  expect(links).toEqual(["Team"])
})

it("tells screen readers which links open a new tab", () => {
  view()

  for (const label of [
    "Get Early Blind Bird →",
    "CND/2026 website",
    "Give feedback",
    "Photo gallery",
  ]) {
    const link = screen.getByRole("link", {
      name: new RegExp(`^${label} \\(opens in new tab\\)`),
    })
    expect(link).toHaveAttribute("target", "_blank")
  }
})

it("lists the CND/2026 website first", () => {
  view()

  const cards = screen
    .getAllByRole("listitem")
    .map((item) => item.querySelector("a")?.getAttribute("href"))
  expect(cards[0]).toBe("https://2026.cloudnativedenmark.dk")
})
