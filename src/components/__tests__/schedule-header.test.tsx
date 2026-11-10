import { fireEvent, render, screen } from "@testing-library/react"
import ScheduleHeader from "../schedule-header"

const rooms = [
  { id: 1, name: "Main stage" },
  { id: 2, name: "Workshop" },
]

let top = 200
let inset = 80
let rem = 16
let bottom = 1000

const view = (date = "2026-11-19T00:00:00") =>
  render(
    <div>
      <ScheduleHeader date={date} rooms={rooms} />
    </div>
  )

beforeEach(() => {
  top = 200
  inset = 80
  rem = 16
  bottom = 1000
  const getStyle = window.getComputedStyle
  jest.spyOn(window, "getComputedStyle").mockImplementation((element) => {
    const style = getStyle(element)
    style.fontSize = `${rem}px`
    const shifted = (element as HTMLElement).style.top.includes("calc")
    style.top = `${inset - (shifted ? 3.75 * rem : 0)}px`
    return style
  })
  jest
    .spyOn(HTMLElement.prototype, "getBoundingClientRect")
    .mockImplementation(function (this: HTMLElement) {
      const shifted = this.style.top.includes("calc")
      const limit = inset - (shifted ? 3.75 * rem : 0)
      const compact = this.querySelector("h2")?.classList.contains("text-base")
      const height = (compact ? 6 : 9.75) * rem + 1
      const margin = parseFloat(this.style.marginBottom) * rem || 0
      return {
        top: this.classList.contains("sticky")
          ? Math.min(Math.max(top, limit), bottom - height - margin)
          : top,
        bottom,
        height,
      } as DOMRect
    })
})

afterEach(() => jest.restoreAllMocks())

it("keeps the date and column labels in one sticky header", () => {
  view()
  const heading = screen.getByRole("heading", { name: "Thursday, November 19" })
  const header = heading.parentElement!

  expect(header).toHaveClass("sticky")
  expect(header).toHaveStyle({ gridColumn: "1 / -1" })
  expect(header).toContainElement(screen.getByText("Time"))
  expect(header).toContainElement(screen.getByText("Main stage"))
  expect(header).toContainElement(screen.getByText("Workshop"))
})

it("waits until the table meets the compact header before shrinking", () => {
  view()
  const heading = screen.getByRole("heading", { name: "Thursday, November 19" })
  expect(heading).toHaveClass("text-3xl")

  top = 80
  fireEvent.scroll(window)
  expect(heading).toHaveClass("text-3xl")

  top = 20.5
  fireEvent.scroll(window)
  expect(heading).toHaveClass("text-3xl")

  top = 20
  fireEvent.scroll(window)
  expect(heading).toHaveClass("text-base")
  const header = heading.parentElement!
  expect(header.style.marginBottom).toBe("")
  expect(
    header.parentElement!.querySelector('[aria-hidden="true"]')
  ).toHaveStyle({
    height: "157px",
    gridRow: "1",
  })
})

it("restores the large title at the same point on scroll up", () => {
  top = 0
  view()
  const heading = screen.getByRole("heading", { name: "Thursday, November 19" })
  expect(heading).toHaveClass("text-base")

  top = 20
  fireEvent.scroll(window)
  expect(heading).toHaveClass("text-base")

  top = 20.5
  fireEvent.scroll(window)
  expect(heading).toHaveClass("text-3xl")
  expect(heading.parentElement!.style.marginBottom).toBe("")
})

it("keeps the header bottom at the table edge when the title shrinks", () => {
  top = 20.5
  view()
  const heading = screen.getByRole("heading", { name: "Thursday, November 19" })
  const header = heading.parentElement!
  const labelsHeight = 56
  const fullHeight = 101 + labelsHeight
  const compactHeight = 41 + labelsHeight
  expect(header.getBoundingClientRect().top + fullHeight).toBe(top + fullHeight)

  top = 20
  fireEvent.scroll(window)
  expect(heading).toHaveClass("text-base")
  expect(header.getBoundingClientRect().top + compactHeight).toBe(
    top + fullHeight
  )
})

it("lets the table bottom push the compact header up without an extra gap", () => {
  top = -500
  view()
  const heading = screen.getByRole("heading", { name: "Thursday, November 19" })
  const header = heading.parentElement!
  expect(heading).toHaveClass("text-base")

  bottom = 177
  fireEvent.scroll(window)
  expect(header.getBoundingClientRect().top).toBe(80)

  bottom = 160
  fireEvent.scroll(window)
  expect(header.getBoundingClientRect().top).toBe(63)
  expect(header.getBoundingClientRect().top + 97).toBe(bottom)
  expect(heading).toHaveClass("text-base")

  bottom = 80
  fireEvent.scroll(window)
  expect(header.getBoundingClientRect().top + 97).toBe(bottom)

  bottom = 300
  fireEvent.scroll(window)
  expect(header.getBoundingClientRect().top).toBe(80)
})

it("updates the switch point when the site header height changes", () => {
  top = 40
  view("2026-11-20T00:00:00")
  const heading = screen.getByRole("heading", { name: "Friday, November 20" })
  expect(heading).toHaveClass("text-3xl")

  inset = 100
  fireEvent.resize(window)
  expect(heading).toHaveClass("text-base")
})

it("uses the current root font size to find the switch point", () => {
  rem = 20
  top = 5.5
  view()
  const heading = screen.getByRole("heading", { name: "Thursday, November 19" })
  expect(heading).toHaveClass("text-3xl")

  top = 5
  fireEvent.scroll(window)
  expect(heading).toHaveClass("text-base")
})
