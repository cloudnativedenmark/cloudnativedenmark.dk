import React from "react"
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import VenueMap from "../venue-map"
import type { VenueMapConfig } from "../../../config/venue-map"
import type { SponsorData } from "../../../utils/data-loader"
import { mapPdf, mapSvg, saveFile } from "../venue-map/download"

jest.mock("../venue-map/download")

const config: VenueMapConfig = {
  rooms: [
    {
      id: "main-stage",
      name: "Keynote Hall",
      venueRooms: ["Grand Ball"],
      areaM2: 223,
    },
  ],
  stands: [
    { id: "1", sponsor: "gold/acme" },
    { id: "2", sponsor: "bronze/globex" },
    { id: "3" },
  ],
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

const standElements = (container: HTMLElement, id: string) =>
  Array.from(container.querySelectorAll(`[data-stand="${id}"]`))

const fullMap = (container: HTMLElement) =>
  container.querySelector('[data-variant="full"]') as HTMLElement

const exhibitors = () => screen.getByRole("region", { name: "Exhibitors" })

describe("VenueMap", () => {
  it("draws a desktop and a mobile version of the map", () => {
    const { container } = render(
      <VenueMap config={config} sponsors={sponsors} />
    )

    expect(container.querySelector('[data-variant="full"]')).not.toBeNull()
    expect(container.querySelector('[data-variant="compact"]')).not.toBeNull()
  })

  it("labels rooms with their configured names", () => {
    render(<VenueMap config={config} sponsors={sponsors} />)

    expect(screen.getAllByText("Keynote Hall").length).toBeGreaterThan(0)
  })

  it("marks the entrance, registration, toilets and emergency exits", () => {
    const { container } = render(
      <VenueMap config={config} sponsors={sponsors} />
    )
    const titles = Array.from(container.querySelectorAll("title")).map(
      (title) => title.textContent
    )

    expect(titles).toEqual(
      expect.arrayContaining([
        "Entrance",
        "Registration & help desk",
        "Toilets",
        "Emergency exit",
      ])
    )
  })

  it("shows the screen in the workshop room", () => {
    render(<VenueMap config={config} sponsors={sponsors} />)

    expect(screen.getByText("SCREEN")).toBeInTheDocument()
  })

  it("lists exhibitors in stand order with their tier", () => {
    render(<VenueMap config={config} sponsors={sponsors} />)

    const cards = within(exhibitors()).getAllByRole("button")
    expect(cards).toHaveLength(2)
    expect(cards[0]).toHaveAccessibleName("Stand 1: Acme, Gold")
    expect(cards[1]).toHaveAccessibleName("Stand 2: Globex, Bronze")
  })

  it("colours stands by the tier in their sponsor reference before sponsors load", () => {
    const { container } = render(<VenueMap config={config} sponsors={{}} />)

    for (const [id, tier] of [
      ["1", "gold"],
      ["2", "bronze"],
      ["3", "unassigned"],
    ]) {
      const stands = standElements(container, id)
      expect(stands).toHaveLength(2)
      stands.forEach((stand) =>
        expect(stand).toHaveAttribute("data-tier", tier)
      )
    }
  })

  it("highlights the stand on both maps when its exhibitor is hovered", () => {
    const { container } = render(
      <VenueMap config={config} sponsors={sponsors} />
    )

    fireEvent.mouseEnter(
      within(exhibitors()).getByRole("button", { name: /Globex/ })
    )

    standElements(container, "2").forEach((stand) =>
      expect(stand).toHaveAttribute("data-active", "true")
    )
    standElements(container, "1").forEach((stand) =>
      expect(stand).toHaveAttribute("data-active", "false")
    )
  })

  it("shows who is on a stand when it is selected on the map", () => {
    const { container } = render(
      <VenueMap config={config} sponsors={sponsors} />
    )
    const stand = within(fullMap(container)).getByRole("button", {
      name: "Stand 1: Acme, Gold",
    })

    fireEvent.click(stand)

    const selection = screen.getByRole("status")
    expect(selection).toHaveTextContent("Acme")
    expect(
      within(selection).getByRole("link", { name: "Visit Acme's website" })
    ).toHaveAttribute("href", "https://acme.test/")

    fireEvent.click(stand)

    expect(screen.getByRole("status")).not.toHaveTextContent("Acme")
  })

  it("downloads the map as an SVG file", async () => {
    jest.mocked(mapSvg).mockResolvedValue("<svg/>")
    render(<VenueMap config={config} sponsors={sponsors} />)

    fireEvent.click(screen.getByRole("button", { name: "SVG ↓" }))

    await waitFor(() =>
      expect(saveFile).toHaveBeenCalledWith(
        expect.any(Blob),
        "cloud-native-denmark-2026-conference-map.svg"
      )
    )
    expect(mapSvg).toHaveBeenCalledWith(config, sponsors, 1460)
  })

  it("says so when the PDF can't be made", async () => {
    jest.mocked(mapPdf).mockRejectedValue(new Error("no canvas"))
    render(<VenueMap config={config} sponsors={sponsors} />)

    fireEvent.click(screen.getByRole("button", { name: "PDF ↓" }))

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Couldn't create the file"
    )
    expect(screen.getByRole("button", { name: "PDF ↓" })).toBeEnabled()
  })
})
