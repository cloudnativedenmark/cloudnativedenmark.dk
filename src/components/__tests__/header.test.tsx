import { fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import Header from "../header"

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
  render(
    <MemoryRouter>
      <Header menuLinks={[]} />
    </MemoryRouter>
  )

  expect(screen.getAllByRole("link", { name: "Buy tickets →" })).toHaveLength(1)

  fireEvent.click(screen.getByRole("button", { name: "Toggle navigation" }))

  expect(screen.getAllByRole("link", { name: "Buy tickets →" })).toHaveLength(2)
})
