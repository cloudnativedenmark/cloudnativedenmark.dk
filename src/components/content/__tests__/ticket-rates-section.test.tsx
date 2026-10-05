import React from "react"
import { render, screen, within } from "@testing-library/react"
import TicketRatesSection from "../ticket-rates-section"

const raffleUrl =
  "https://docs.google.com/forms/d/e/1FAIpQLSdsjLcbFPb0YO5uc6PdgHX2apbfxVFsEcucuaLEnB4Zkhp3jg/viewform"

describe("TicketRatesSection", () => {
  afterEach(() => {
    jest.useRealTimers()
  })

  it("shows a short raffle notice below the purchase link", () => {
    render(<TicketRatesSection sectionNumber={4} id="ticket-rates" />)

    const notice = screen.getByRole("complementary", {
      name: "Student or unemployed?",
    })
    expect(
      within(notice).getByText("Enter our raffle for a free conference ticket.")
    ).toBeInTheDocument()
    expect(document.getElementById("ticket-rates")).toContainElement(notice)

    const purchaseLink = screen.getByRole("link", { name: "Buy tickets →" })
    expect(purchaseLink.compareDocumentPosition(notice)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    )
  })

  it("links to the application form in a safe new tab", () => {
    render(<TicketRatesSection sectionNumber={4} />)

    const link = screen.getByRole("link", { name: "Enter the raffle →" })
    expect(link).toHaveAttribute("href", raffleUrl)
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")
  })

  it("keeps the notice visible after the notification date", () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date("2026-11-03T12:00:00Z"))

    render(<TicketRatesSection sectionNumber={4} />)

    expect(
      screen.getByRole("link", { name: "Enter the raffle →" })
    ).toBeInTheDocument()
  })
})
