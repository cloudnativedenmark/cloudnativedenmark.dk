/**
 * Who is where on the venue map at Scandic Copenhagen.
 *
 * To move a sponsor, change the `sponsor` on the stands involved. To change
 * a sponsor's tier, move its YAML into the other tier folder and update the
 * reference here. To rename a room, change its `name`.
 *
 * Where rooms and stands are drawn lives with the map itself, in
 * src/components/content/venue-map/plan.ts.
 */

export interface VenueRoom {
  id: string
  /** What attendees see, matching the room names in the schedule */
  name: string
  /** Scandic's own names for the rooms combined into this one, as signposted at the venue */
  venueRooms: string[]
  areaM2: number
}

export interface Stand {
  /** Stand number, as drawn on the map */
  id: string
  /** Sponsor YAML path under src/data/sponsors without extension, e.g. "gold/aws". The folder sets the stand colour. */
  sponsor?: string
}

export interface VenueMapConfig {
  rooms: VenueRoom[]
  stands: Stand[]
}

export const venueMap: VenueMapConfig = {
  rooms: [
    {
      id: "main-stage",
      name: "Main stage",
      venueRooms: [
        "Grand Ball",
        "Amalienborg",
        "Fredensborg",
        "Christiansborg",
      ],
      areaM2: 616,
    },
    {
      id: "breakout",
      name: "Breakout",
      venueRooms: ["Schackenborg", "Kronborg", "Marselisborg", "Rosenborg"],
      areaM2: 400,
    },
    {
      id: "workshop",
      name: "Workshop",
      venueRooms: ["Børsen"],
      areaM2: 72,
    },
  ],

  // Stands are numbered in walking order from the entrance. Each tier
  // gets the stands sized for it on Scandic's plan, earliest sponsors (by
  // the date they went live on the site) nearest the entrance. With a
  // single platinum sponsor, the second 5x3 m spot (6) goes to the earliest
  // bronze sponsor.
  stands: [
    { id: "1", sponsor: "gold/netic" },
    { id: "2", sponsor: "gold/suse" },
    { id: "3", sponsor: "gold/aws" },
    { id: "4", sponsor: "gold/exoscale" },
    { id: "5", sponsor: "platinum/scannet" },
    { id: "6", sponsor: "bronze/edb" },
    { id: "7", sponsor: "bronze/dash0" },
    { id: "8", sponsor: "bronze/chainguard" },
    { id: "9", sponsor: "bronze/everpure" },
    { id: "10", sponsor: "bronze/tigera" },
    { id: "11", sponsor: "bronze/systematic" },
  ],
}
