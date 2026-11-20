import React from "react"
import { render, screen } from "@testing-library/react"
import TicketRatesSection from "../ticket-rates-section"
import { features } from "../../../config/features"

const original = { ...features }

describe("TicketRatesSection", () => {
  afterEach(() => {
    jest.useRealTimers()
    Object.assign(features, original)
  })

  it("opens Late Bird sales on Nov 10", () => {
    Object.assign(features, { ticketSales: true })
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

  it.each(["2025-12-01", "2026-11-10"])(
    "shows sold out without sale badges or purchase links on %s",
    (date) => {
      Object.assign(features, { ticketSales: false })
      jest.useFakeTimers()
      jest.setSystemTime(new Date(date))

      render(<TicketRatesSection sectionNumber={4} />)

      expect(screen.getByRole("heading", { name: "Sold out." })).toBeVisible()
      expect(screen.queryByRole("button", { name: "Sold out" })).toBeNull()
      expect(screen.queryByRole("link", { name: "Buy tickets →" })).toBeNull()
      expect(screen.queryByText("ON SALE")).toBeNull()
      expect(screen.queryByText("SELLING OUT FAST")).toBeNull()
      expect(screen.getAllByText("SOLD OUT")).toHaveLength(4)
    }
  )
})
