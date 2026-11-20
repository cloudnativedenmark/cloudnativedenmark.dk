import { fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import Header from "../header"
import { features } from "../../config/features"

const original = { ...features }

afterEach(() => Object.assign(features, original))

jest.mock("../../images/logo.svg", () => ({
  __esModule: true,
  default: "svg-mock",
}))

class ResizeObserverMock {
  observe() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver

it("shows the ticket action in desktop and mobile navigation", () => {
  Object.assign(features, { ticketSales: true })
  render(
    <MemoryRouter>
      <Header menuLinks={[]} />
    </MemoryRouter>
  )

  expect(screen.getByRole("link", { name: "Buy tickets →" })).toHaveAttribute(
    "href",
    "https://cloudnativedenmark.ticketbutler.io/en/e/cloud-native-denmark-2027/"
  )

  fireEvent.click(screen.getByRole("button", { name: "Toggle navigation" }))

  expect(screen.getAllByRole("link", { name: "Buy tickets →" })).toHaveLength(2)
})

it("hides ticket actions in both menus when sales are disabled", () => {
  Object.assign(features, { ticketSales: false })
  render(
    <MemoryRouter>
      <Header menuLinks={[{ name: "Schedule", link: "/schedule" }]} />
    </MemoryRouter>
  )

  expect(screen.queryByRole("link", { name: "Buy tickets →" })).toBeNull()
  fireEvent.click(screen.getByRole("button", { name: "Toggle navigation" }))
  expect(screen.queryByRole("link", { name: "Buy tickets →" })).toBeNull()
  expect(screen.getAllByRole("link", { name: "Schedule" })).toHaveLength(2)
})
