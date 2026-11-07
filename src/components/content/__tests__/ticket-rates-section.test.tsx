import React from "react"
import { render, screen } from "@testing-library/react"
import TicketRatesSection from "../ticket-rates-section"

describe("TicketRatesSection", () => {
  afterEach(() => {
    jest.useRealTimers()
  })

  it("marks every tier as sold out with nothing on sale", () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date("2026-11-07T12:00:00Z"))

    render(<TicketRatesSection sectionNumber={4} />)

    expect(screen.queryByText("ON SALE")).not.toBeInTheDocument()
    expect(screen.queryByText("SELLING OUT FAST")).not.toBeInTheDocument()
    expect(screen.queryByText(/UPCOMING/)).not.toBeInTheDocument()
    expect(screen.getAllByText("SOLD OUT")).toHaveLength(3)
    expect(screen.getByRole("button", { name: "Sold out" })).toBeDisabled()
    expect(
      screen.queryByRole("link", { name: "Buy tickets →" })
    ).not.toBeInTheDocument()
  })
})
