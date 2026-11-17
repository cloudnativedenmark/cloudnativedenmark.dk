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

it("disables home page ticket actions when sales are closed", () => {
  Object.assign(features, { ticketSales: false })
  view()

  expect(screen.getAllByRole("button", { name: "Sold out" })).toHaveLength(3)
  for (const button of screen.getAllByRole("button", { name: "Sold out" })) {
    expect(button).toBeDisabled()
  }
  expect(screen.queryByRole("button", { name: "Ticket rates →" })).toBeNull()
  expect(screen.queryByRole("link", { name: "Get your ticket →" })).toBeNull()
  expect(
    screen.getByText("Tickets are sold out. See you in Copenhagen.")
  ).toBeVisible()
  expect(screen.getAllByRole("link", { name: "Schedule →" })).toHaveLength(2)
})

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
