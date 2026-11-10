import React from "react"
import { render, screen } from "@testing-library/react"
import TicketRatesSection from "../ticket-rates-section"

describe("TicketRatesSection", () => {
  afterEach(() => {
    jest.useRealTimers()
  })

  it("opens Late Bird sales on Nov 10", () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date("2026-11-10T12:00:00+01:00"))

    render(<TicketRatesSection sectionNumber={4} />)

    expect(screen.getByText("04 · ACTIVE")).toBeInTheDocument()
    expect(screen.getByText("ON SALE")).toBeInTheDocument()
    expect(screen.getByText("SELLING OUT FAST")).toBeInTheDocument()
    expect(screen.getByText("From Nov 10")).toBeInTheDocument()
    expect(screen.getAllByText("SOLD OUT")).toHaveLength(2)
    expect(screen.getByRole("link", { name: "Buy tickets →" })).toHaveAttribute(
      "href",
      "https://cloudnativedenmark.ticketbutler.io/da/e/cloud-native-denmark-26/"
    )
  })
})
