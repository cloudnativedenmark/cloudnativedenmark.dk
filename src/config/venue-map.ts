/**
 * Venue map for Scandic Copenhagen's Grand Ball Complex.
 *
 * Everything here is in metres, oriented like Scandic's own floor plan:
 * the stages sit top-left, the Vestlounge runs along the bottom of them,
 * the Nordlounge up their left side, and attendees enter from the right.
 *
 * To move a sponsor, change the `sponsor` on the stands involved. To change
 * a sponsor's tier, move its YAML into the other tier folder and update the
 * reference here. To rename a room, change its `name`.
 */

export interface MapRect {
  x: number
  y: number
  width: number
  height: number
}

export interface VenueRoom extends MapRect {
  id: string
  /** What attendees see, matching the room names in the schedule */
  name: string
  /** Scandic's own names for the rooms combined into this one */
  venueRooms: string[]
  areaM2: number
  stage?: MapRect
}

export interface Stand extends MapRect {
  id: string
  /** Sponsor YAML path under src/data/sponsors without extension, e.g. "gold/aws". The folder sets the stand colour. */
  sponsor?: string
}

export type AmenityKind = "coffee" | "water" | "buffet" | "help-desk" | "office"

export interface Amenity extends MapRect {
  kind: AmenityKind
}

export interface VenueMapConfig {
  rooms: VenueRoom[]
  stands: Stand[]
  amenities: Amenity[]
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
      x: 0,
      y: 0,
      width: 22.6,
      height: 28,
      stage: { x: 0.6, y: 9, width: 1.4, height: 10 },
    },
    {
      id: "breakout",
      name: "Breakout",
      venueRooms: ["Schackenborg", "Kronborg", "Marselisborg", "Rosenborg"],
      areaM2: 400,
      x: 22.6,
      y: 0,
      width: 15.4,
      height: 28,
      stage: { x: 23.2, y: 9, width: 1.4, height: 10 },
    },
    {
      id: "workshop",
      name: "Workshop",
      venueRooms: ["Børsen"],
      areaM2: 72,
      x: 39,
      y: 15.3,
      width: 5.7,
      height: 12.7,
    },
  ],

  // Numbered in walking order from the entrance. Sponsors were placed tier
  // first, then by the date they went live on the site, so earlier sponsors
  // sit nearer the entrance. With a single platinum sponsor, the spare 5x3 m
  // spot (6) went to the earliest gold sponsor and the 4x2 m spot that freed
  // up (4) to the earliest bronze sponsor.
  stands: [
    { id: "1", sponsor: "gold/suse", x: 27, y: 28.3, width: 4, height: 2 },
    { id: "2", sponsor: "gold/aws", x: 19.7, y: 28.3, width: 4, height: 2 },
    {
      id: "3",
      sponsor: "gold/exoscale",
      x: 11.7,
      y: 28.3,
      width: 4,
      height: 2,
    },
    { id: "4", sponsor: "bronze/edb", x: 4, y: 28.3, width: 4, height: 2 },
    {
      id: "5",
      sponsor: "platinum/scannet",
      x: -7.5,
      y: 32.5,
      width: 5,
      height: 3,
    },
    { id: "6", sponsor: "gold/netic", x: -0.5, y: 37.2, width: 3, height: 5 },
    { id: "7", sponsor: "bronze/dash0", x: -8.8, y: 19.8, width: 2, height: 3 },
    {
      id: "8",
      sponsor: "bronze/chainguard",
      x: -8.8,
      y: 11.8,
      width: 2,
      height: 3,
    },
    {
      id: "9",
      sponsor: "bronze/everpure",
      x: -8.8,
      y: 3.8,
      width: 2,
      height: 3,
    },
    {
      id: "10",
      sponsor: "bronze/tigera",
      x: -5.3,
      y: -2.7,
      width: 3,
      height: 2,
    },
    {
      id: "11",
      sponsor: "bronze/systematic",
      x: -8.6,
      y: -2.7,
      width: 3,
      height: 2,
    },
  ],

  amenities: [
    { kind: "help-desk", x: 31, y: 34.4, width: 5, height: 1.2 },
    { kind: "office", x: 30.5, y: 37, width: 6.5, height: 7 },
    { kind: "coffee", x: 8, y: 35, width: 3, height: 1 },
    { kind: "water", x: 16.5, y: 35, width: 2, height: 1 },
    { kind: "coffee", x: 24, y: 35, width: 3, height: 1 },
    { kind: "coffee", x: -1.2, y: 8.3, width: 1, height: 3.5 },
    { kind: "coffee", x: -1.2, y: 14, width: 1, height: 3.5 },
    { kind: "water", x: -1.2, y: 24.3, width: 1, height: 2.5 },
    { kind: "buffet", x: 8.3, y: 32.2, width: 4.7, height: 1.1 },
    { kind: "buffet", x: 23, y: 32.2, width: 4.7, height: 1.1 },
    { kind: "buffet", x: -5.3, y: 11, width: 1.1, height: 4.5 },
    { kind: "buffet", x: -5.3, y: 22.8, width: 1.1, height: 4.5 },
  ],
}
