import { render, screen } from "@testing-library/react"
import { HelmetProvider } from "react-helmet-async"
import { MemoryRouter } from "react-router-dom"
import IndexPage from "../index"
import { features } from "../../config/features"

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
jest.mock(
  "../../components/content/featured-speakers-section",
  () => () => null
)
jest.mock("../../components/content/talks-carousel-section", () => () => null)

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

it("links to the photo gallery instead of ticket sales when sales are closed", () => {
  Object.assign(features, { ticketSales: false })
  view()

  expect(screen.queryByRole("button", { name: "Sold out" })).toBeNull()
  const galleryLinks = screen.getAllByRole("link", { name: /Photo gallery/ })
  expect(galleryLinks).toHaveLength(3)
  for (const link of galleryLinks) {
    expect(link).toHaveAttribute(
      "href",
      "https://www.picdrop.com/kim-yennguyen/PtE1CyXcQm"
    )
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")
  }
  expect(screen.queryByRole("button", { name: "Ticket rates →" })).toBeNull()
  expect(screen.queryByRole("link", { name: "Get your ticket →" })).toBeNull()
  expect(
    screen.getByText("Tickets are sold out. See you in Copenhagen.")
  ).toBeVisible()
  expect(screen.getAllByRole("link", { name: "Schedule →" })).toHaveLength(2)
})

it.each([false, true])(
  "controls merchandise links independently of ticket sales (%s)",
  (ticketSales) => {
    Object.assign(features, { ticketSales, merchandise: false })
    const { container, rerender } = view()

    expect(screen.queryAllByRole("link", { name: "Merch →" })).toHaveLength(0)
    expect(container.querySelector('a[href*="extras_flow"]')).toBeNull()

    Object.assign(features, { merchandise: true })
    rerender(
      <HelmetProvider>
        <MemoryRouter>
          <IndexPage />
        </MemoryRouter>
      </HelmetProvider>
    )

    const links = screen.getAllByRole("link", { name: "Merch →" })
    expect(links).toHaveLength(2)
    for (const link of links) {
      expect(link).toHaveAttribute(
        "href",
        "https://cloudnativedenmark.ticketbutler.io/en/e/cloud-native-denmark-26/?extras_flow=true"
      )
    }
  }
)

it("restores home page ticket actions when sales are open", () => {
  Object.assign(features, { ticketSales: true })
  view()

  expect(screen.getByRole("button", { name: "Ticket rates →" })).toBeEnabled()
  expect(
    screen.getByRole("link", { name: "Get your ticket →" })
  ).toHaveAttribute(
    "href",
    "https://cloudnativedenmark.ticketbutler.io/en/e/cloud-native-denmark-26/"
  )
  expect(screen.queryByRole("button", { name: "Sold out" })).toBeNull()
})
