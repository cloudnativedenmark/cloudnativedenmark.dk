import { fireEvent, render, screen } from "@testing-library/react"
import { Link, MemoryRouter, Route, Routes } from "react-router-dom"
import Layout from "../layout"

jest.mock("../header", () => ({ __esModule: true, default: () => null }))
jest.mock("../footer", () => ({ __esModule: true, default: () => null }))

const scrollTo = jest.fn()

const view = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="*"
            element={
              <nav>
                <Link to="/schedule/talk/a-talk/">Open talk</Link>
                <Link to="/schedule/">Close talk</Link>
                <Link to="/venue/">Open venue</Link>
              </nav>
            }
          />
        </Route>
      </Routes>
    </MemoryRouter>
  )

beforeEach(() => {
  scrollTo.mockClear()
  window.scrollTo = scrollTo
})

it.each(["/schedule", "/schedule/"])(
  "keeps the scroll position across modal URLs from %s",
  (path) => {
    view(path)
    scrollTo.mockClear()
    fireEvent.click(screen.getByRole("link", { name: "Open talk" }))
    expect(scrollTo).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole("link", { name: "Close talk" }))
    expect(scrollTo).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole("link", { name: "Open venue" }))
    expect(scrollTo).toHaveBeenCalledWith(0, 0)
  }
)

it("starts a directly loaded talk at the top", () => {
  view("/schedule/talk/a-talk/")
  expect(scrollTo).toHaveBeenCalledWith(0, 0)
})
