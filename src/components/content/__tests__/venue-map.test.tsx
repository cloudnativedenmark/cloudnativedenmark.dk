import React from "react"
import { fireEvent, render, screen, within } from "@testing-library/react"
import VenueMap from "../venue-map"
import type { VenueMapConfig } from "../../../config/venue-map"
import type { SponsorData } from "../../../utils/data-loader"

const config: VenueMapConfig = {
  rooms: [
    {
      id: "keynote",
      name: "Keynote Hall",
      venueRooms: ["Grand Ball"],
      areaM2: 223,
      x: 0,
      y: 0,
      width: 15,
      height: 15,
    },
  ],
  stands: [
    { id: "1", sponsor: "gold/acme", x: 0, y: 16, width: 4, height: 2 },
    { id: "2", sponsor: "bronze/globex", x: 5, y: 16, width: 3, height: 2 },
    { id: "3", x: 9, y: 16, width: 3, height: 2 },
  ],
  amenities: [],
}

const sponsors: Record<string, SponsorData> = {
  "gold/acme": {
    id: "gold/acme",
    title: "Acme",
    url: "https://acme.test/",
    logo: { publicURL: "/assets/acme.svg" },
  },
  "bronze/globex": {
    id: "bronze/globex",
    title: "Globex",
    url: "https://globex.test/",
    logo: { publicURL: "/assets/globex.svg" },
  },
}

const exhibitorList = () =>
  screen.getByRole("list", { name: "Exhibitors by stand" })

describe("VenueMap", () => {
  it("labels rooms with their configured names", () => {
    render(<VenueMap config={config} sponsors={sponsors} />)

    expect(screen.getAllByText("Keynote Hall").length).toBeGreaterThan(0)
  })

  it("lists exhibitors in stand order with their tier", () => {
    render(<VenueMap config={config} sponsors={sponsors} />)

    const items = within(exhibitorList()).getAllByRole("listitem")
    expect(items).toHaveLength(2)
    expect(items[0]).toHaveTextContent("1")
    expect(items[0]).toHaveTextContent("Acme")
    expect(items[0]).toHaveTextContent("Gold")
    expect(items[1]).toHaveTextContent("2")
    expect(items[1]).toHaveTextContent("Globex")
    expect(items[1]).toHaveTextContent("Bronze")
  })

  it("colours a stand by the tier in its sponsor reference before sponsors load", () => {
    render(<VenueMap config={config} sponsors={{}} />)

    expect(screen.getByTestId("stand-1")).toHaveAttribute("data-tier", "gold")
    expect(screen.getByTestId("stand-2")).toHaveAttribute("data-tier", "bronze")
    expect(screen.getByTestId("stand-3")).toHaveAttribute(
      "data-tier",
      "unassigned"
    )
  })

  it("highlights the stand on the map when its exhibitor is focused", () => {
    render(<VenueMap config={config} sponsors={sponsors} />)

    fireEvent.focus(
      within(exhibitorList()).getByRole("link", { name: /Globex/ })
    )

    expect(screen.getByTestId("stand-2")).toHaveAttribute("data-active", "true")
    expect(screen.getByTestId("stand-1")).toHaveAttribute(
      "data-active",
      "false"
    )
  })
})
