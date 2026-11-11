import { StrictMode } from "react"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import SchedulePrintPage from "../schedule-print"

it("starts one PDF download even when Strict Mode repeats effects", () => {
  const click = jest
    .spyOn(HTMLAnchorElement.prototype, "click")
    .mockImplementation(() => {})

  render(
    <StrictMode>
      <MemoryRouter initialEntries={["/schedule/print"]}>
        <SchedulePrintPage />
      </MemoryRouter>
    </StrictMode>
  )

  const link = screen.getByRole("link", { name: "Download schedule (PDF)" })
  expect(link).toHaveAttribute("href", "/schedule.pdf")
  expect(link).toHaveAttribute("download", "cloud-native-denmark-schedule.pdf")
  expect(click).toHaveBeenCalledTimes(1)

  click.mockRestore()
})
