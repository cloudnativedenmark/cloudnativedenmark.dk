import { existsSync, readFileSync } from "fs"
import { join } from "path"
import yaml from "js-yaml"
import { venueMap } from "../venue-map"

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
})
