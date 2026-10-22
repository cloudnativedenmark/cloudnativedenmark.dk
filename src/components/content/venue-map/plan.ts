/**
 * Drawing of Scandic Copenhagen's Grand Ball Complex, traced from the
 * venue's stand plan and floor plan. It is a schematic, not to scale:
 * lounges and stands are drawn larger than life so logos stay legible.
 *
 * Oriented like Scandic's floor plan: the stages sit top-middle, the
 * Nordlounge runs up their left side, the Vestlounge along their bottom,
 * and attendees enter from the right.
 */

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export interface Point {
  x: number
  y: number
}

/** An opening in a wall, centred on the given point */
export interface Door extends Point {
  wall: "horizontal" | "vertical"
}

export interface RoomShape extends Rect {
  /** Stage or screen, labelled "STAGE" unless given a label */
  stage?: Rect & { label?: string }
  seats: Rect[]
  doors: Door[]
  label: Point
}

export type Zone = "Vestlounge" | "Mellemlounge" | "Nordlounge"

export interface StandShape extends Rect {
  zone: Zone
  /** Stand size on Scandic's plan, in metres; absent for stands added since */
  size?: "5x3" | "4x2" | "3x2"
}

export type AmenityKind = "coffee" | "water" | "lunch" | "registration"

export interface Amenity extends Point {
  kind: AmenityKind
}

export interface Exit extends Point {
  /** Which way the exit leads out of the building */
  direction: "left" | "up" | "down"
}

export interface ZoneLabel extends Point {
  text: string
  /** Rotation on the desktop map */
  angle: number
  /** Rotation on the upright mobile map */
  compactAngle: number
  /** Font size on the mobile map, where the default doesn't fit */
  compactSize?: number
}

export const plan = {
  view: { x: -4, y: -4, width: 146, height: 115 } as Rect,

  // Nordlounge, Vestlounge, Mellemlounge and the toilet corridor as one outline
  floor:
    "M 0 0 H 30 V 60 H 128 V 86 H 58 V 108 H 30 V 100.5 H 1 V 96.5 H 30 V 86 H 0 Z",

  rooms: {
    "main-stage": {
      x: 30,
      y: 12,
      width: 43,
      height: 48,
      stage: { x: 31.3, y: 21, width: 1.8, height: 30 },
      seats: [
        { x: 36.5, y: 14.5, width: 34, height: 19 },
        { x: 36.5, y: 38.5, width: 34, height: 19 },
      ],
      doors: [
        { x: 36.3, y: 60, wall: "horizontal" },
        { x: 67, y: 60, wall: "horizontal" },
        { x: 30, y: 16, wall: "vertical" },
        { x: 30, y: 56, wall: "vertical" },
      ],
      label: { x: 53.5, y: 36 },
    },
    breakout: {
      x: 73,
      y: 12,
      width: 30,
      height: 48,
      stage: { x: 74.3, y: 21, width: 1.8, height: 30 },
      seats: [
        { x: 79.5, y: 14.5, width: 21.5, height: 19 },
        { x: 79.5, y: 38.5, width: 21.5, height: 19 },
      ],
      doors: [
        { x: 81.3, y: 60, wall: "horizontal" },
        { x: 96.6, y: 60, wall: "horizontal" },
      ],
      label: { x: 90.25, y: 36 },
    },
    workshop: {
      x: 105,
      y: 34,
      width: 13,
      height: 26,
      // Screen on the short wall opposite the door
      stage: { x: 106.5, y: 34.7, width: 10, height: 1.4, label: "SCREEN" },
      seats: [{ x: 107, y: 38, width: 9, height: 19.5 }],
      doors: [{ x: 107.5, y: 60, wall: "horizontal" }],
      label: { x: 111.5, y: 47 },
    },
  } as Record<string, RoomShape>,

  // Venue rooms along the Vestlounge that the conference doesn't use
  closedRooms: [
    { x: 58, y: 86, width: 10.5, height: 12 },
    { x: 68.5, y: 86, width: 10, height: 12 },
    { x: 78.5, y: 86, width: 10, height: 12 },
    { x: 88.5, y: 86, width: 10.5, height: 12 },
  ] as Rect[],

  office: { x: 99, y: 86, width: 16, height: 12 } as Rect,

  // Behind the wall at the end of the Vestlounge, reached through the
  // Mellemlounge and a short corridor
  toilets: {
    rooms: [
      { x: 1, y: 86, width: 14, height: 10.5 },
      { x: 15, y: 86, width: 15, height: 10.5 },
    ] as Rect[],
    doors: [
      { x: 8, y: 96.5, wall: "horizontal" },
      { x: 22.5, y: 96.5, wall: "horizontal" },
    ] as Door[],
    label: { x: 15.5, y: 98.5 } as Point,
  },

  stands: {
    "1": {
      x: 87,
      y: 61.5,
      width: 15,
      height: 10,
      zone: "Vestlounge",
      size: "4x2",
    },
    "2": {
      x: 69,
      y: 61.5,
      width: 15,
      height: 10,
      zone: "Vestlounge",
      size: "4x2",
    },
    "3": {
      x: 51,
      y: 61.5,
      width: 15,
      height: 10,
      zone: "Vestlounge",
      size: "4x2",
    },
    "4": {
      x: 33,
      y: 61.5,
      width: 15,
      height: 10,
      zone: "Vestlounge",
      size: "4x2",
    },
    "5": {
      x: 6.5,
      y: 72.5,
      width: 20,
      height: 13,
      zone: "Vestlounge",
      size: "5x3",
    },
    "6": {
      x: 30.6,
      y: 87.2,
      width: 10.5,
      height: 8.8,
      zone: "Mellemlounge",
      size: "5x3",
    },
    // Facing stand 6 across the Mellemlounge
    "7": { x: 43.6, y: 87.2, width: 13.8, height: 8.8, zone: "Mellemlounge" },
    "8": {
      x: 1.5,
      y: 44.5,
      width: 14,
      height: 10,
      zone: "Nordlounge",
      size: "3x2",
    },
    "9": {
      x: 1.5,
      y: 31,
      width: 14,
      height: 10,
      zone: "Nordlounge",
      size: "3x2",
    },
    "10": {
      x: 1.5,
      y: 15.5,
      width: 14,
      height: 10,
      zone: "Nordlounge",
      size: "3x2",
    },
    "11": {
      x: 15.5,
      y: 1.5,
      width: 13,
      height: 9,
      zone: "Nordlounge",
      size: "3x2",
    },
    "12": {
      x: 1.5,
      y: 1.5,
      width: 13,
      height: 9,
      zone: "Nordlounge",
      size: "3x2",
    },
  } as Record<string, StandShape>,

  amenities: [
    { kind: "registration", x: 106, y: 77 },
    { kind: "coffee", x: 62, y: 82.3 },
    { kind: "water", x: 73.5, y: 82.3 },
    { kind: "coffee", x: 83.5, y: 82.3 },
    { kind: "lunch", x: 61, y: 76.2 },
    { kind: "lunch", x: 84, y: 76.2 },
    { kind: "coffee", x: 27, y: 29 },
    { kind: "coffee", x: 27, y: 37.7 },
    { kind: "water", x: 26.5, y: 51 },
    { kind: "lunch", x: 20, y: 34.8 },
    { kind: "lunch", x: 20, y: 55.5 },
  ] as Amenity[],

  // Outside doors on Scandic's stand plan: the Nordlounge's glass wall, the
  // Mellemlounge's double doors and the halls' back doors to the rear corridor
  exits: [
    { x: 0, y: 13.2, direction: "left" },
    { x: 0, y: 28.5, direction: "left" },
    { x: 0, y: 42.75, direction: "left" },
    { x: 0, y: 56.6, direction: "left" },
    { x: 0, y: 68.8, direction: "left" },
    { x: 36.3, y: 12, direction: "up" },
    { x: 52, y: 12, direction: "up" },
    { x: 66, y: 12, direction: "up" },
    { x: 80.5, y: 12, direction: "up" },
    { x: 96, y: 12, direction: "up" },
    { x: 44.6, y: 108, direction: "down" },
  ] as Exit[],

  entrance: {
    marker: { x: 133.5, y: 73 },
    opening: { x: 128, y: 67, width: 0, height: 12 },
    label: { x: 134.3, y: 79.6 },
    compactLabel: { x: 139.8, y: 73 },
  },

  labels: [
    { text: "NORDLOUNGE", x: 21, y: 21, angle: -90, compactAngle: 0 },
    { text: "VESTLOUNGE", x: 112, y: 66, angle: 0, compactAngle: -90 },
    {
      text: "MELLEMLOUNGE",
      x: 44,
      y: 104.2,
      angle: 0,
      compactAngle: -90,
      compactSize: 2.1,
    },
  ] as ZoneLabel[],
}
