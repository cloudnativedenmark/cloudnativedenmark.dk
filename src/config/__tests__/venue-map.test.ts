import { existsSync, readFileSync } from "fs"
import { join } from "path"
import yaml from "js-yaml"
import { venueMap } from "../venue-map"
import { plan } from "../../components/content/venue-map/plan"

const sponsorsDirectory = join(__dirname, "../../data/sponsors")

const assignedStands = venueMap.stands.filter((stand) => stand.sponsor)

describe("venue map config", () => {
  it("gives every stand a unique number", () => {
    const ids = venueMap.stands.map((stand) => stand.id)

    expect(new Set(ids).size).toBe(ids.length)
  })

  it("places each sponsor on at most one stand", () => {
    const sponsors = assignedStands.map((stand) => stand.sponsor)

    expect(new Set(sponsors).size).toBe(sponsors.length)
  })

  it.each(assignedStands.map((stand) => [stand.id, stand.sponsor]))(
    "stand %s points at an enabled sponsor (%s)",
    (_id, sponsor) => {
      const file = join(sponsorsDirectory, `${sponsor}.yaml`)

      expect(existsSync(file)).toBe(true)
      const data = yaml.load(readFileSync(file, "utf8")) as {
        enabled?: boolean
      }
      expect(data.enabled).toBe(true)
    }
  )

  it("names the rooms after the Sessionize schedule rooms", () => {
    expect(venueMap.rooms.map((room) => room.name)).toEqual([
      "Main stage",
      "Breakout",
      "Workshop",
    ])
  })

  it("lists exactly the stands drawn on the floor plan", () => {
    expect(venueMap.stands.map((stand) => stand.id).sort()).toEqual(
      Object.keys(plan.stands).sort()
    )
  })

  it("puts every gold sponsor on a 4x2 m stand", () => {
    const gold = assignedStands.filter((stand) =>
      stand.sponsor?.startsWith("gold/")
    )

    expect(gold.length).toBeGreaterThan(0)
    gold.forEach((stand) => expect(plan.stands[stand.id].size).toBe("4x2"))
  })

  it("gives the best 5x3 m stand to platinum and the other to bronze", () => {
    const large = venueMap.stands
      .filter((stand) => plan.stands[stand.id].size === "5x3")
      .sort((a, b) => Number(a.id) - Number(b.id))

    expect(large.map((stand) => stand.sponsor?.split("/")[0])).toEqual([
      "platinum",
      "bronze",
    ])
  })

  it("has a drawn position for every room", () => {
    for (const room of venueMap.rooms) {
      expect(plan.rooms[room.id]).toBeDefined()
    }
  })
})
