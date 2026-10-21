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
  stage?: Rect
  seats: Rect[]
  doors: Door[]
  label: Point
}

export type Zone = "Vestlounge" | "Mellemlounge" | "Nordlounge"

export interface StandShape extends Rect {
  zone: Zone
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
}

export const plan = {
  view: { x: -4, y: -4, width: 146, height: 114 } as Rect,

  // Nordlounge, Vestlounge and Mellemlounge as one outline
  floor: "M 0 0 H 30 V 60 H 128 V 86 H 42 V 105 H 16 V 86 H 0 Z",

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
        { x: 49.5, y: 60, wall: "horizontal" },
        { x: 67.5, y: 60, wall: "horizontal" },
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
      doors: [{ x: 85.5, y: 60, wall: "horizontal" }],
      label: { x: 90.25, y: 36 },
    },
    workshop: {
      x: 105,
      y: 34,
      width: 13,
      height: 26,
      seats: [{ x: 107, y: 40, width: 9, height: 17 }],
      doors: [{ x: 111.5, y: 60, wall: "horizontal" }],
      label: { x: 111.5, y: 45 },
    },
  } as Record<string, RoomShape>,

  // Venue rooms along the Vestlounge that the conference doesn't use
  closedRooms: [
    { x: 42, y: 86, width: 15, height: 12 },
    { x: 57, y: 86, width: 15, height: 12 },
    { x: 72, y: 86, width: 15, height: 12 },
  ] as Rect[],

  office: { x: 88, y: 86, width: 13, height: 12 } as Rect,

  toilets: {
    x: 1.5,
    y: 86,
    width: 13,
    height: 12.5,
    door: { x: 8, y: 86, wall: "horizontal" } as Door,
  },

  stands: {
    "1": { x: 87, y: 61.5, width: 15, height: 10, zone: "Vestlounge" },
    "2": { x: 69, y: 61.5, width: 15, height: 10, zone: "Vestlounge" },
    "3": { x: 51, y: 61.5, width: 15, height: 10, zone: "Vestlounge" },
    "4": { x: 33, y: 61.5, width: 15, height: 10, zone: "Vestlounge" },
    "5": { x: 2.5, y: 68, width: 20, height: 13, zone: "Vestlounge" },
    "6": { x: 21.5, y: 88.5, width: 16, height: 11, zone: "Mellemlounge" },
    "7": { x: 1.5, y: 44, width: 15, height: 10, zone: "Nordlounge" },
    "8": { x: 1.5, y: 30.5, width: 15, height: 10, zone: "Nordlounge" },
    "9": { x: 1.5, y: 17, width: 15, height: 10, zone: "Nordlounge" },
    "10": { x: 15.5, y: 1.5, width: 13, height: 9, zone: "Nordlounge" },
    "11": { x: 1.5, y: 1.5, width: 13, height: 9, zone: "Nordlounge" },
  } as Record<string, StandShape>,

  amenities: [
    { kind: "registration", x: 95, y: 81.5 },
    { kind: "coffee", x: 47.5, y: 82.3 },
    { kind: "water", x: 63.5, y: 82.3 },
    { kind: "coffee", x: 79, y: 82.3 },
    { kind: "lunch", x: 51, y: 76.5 },
    { kind: "lunch", x: 77, y: 76.5 },
    { kind: "coffee", x: 26, y: 29.5 },
    { kind: "coffee", x: 26, y: 40 },
    { kind: "water", x: 26, y: 51.5 },
    { kind: "lunch", x: 21, y: 34.5 },
    { kind: "lunch", x: 21, y: 47 },
  ] as Amenity[],

  // Outside doors on Scandic's stand plan
  exits: [
    { x: 0, y: 13.75, direction: "left" },
    { x: 0, y: 28.75, direction: "left" },
    { x: 0, y: 42.25, direction: "left" },
    { x: 0, y: 64, direction: "left" },
    { x: 41, y: 12, direction: "up" },
    { x: 62, y: 12, direction: "up" },
    { x: 88, y: 12, direction: "up" },
    { x: 40.5, y: 105, direction: "down" },
  ] as Exit[],

  entrance: {
    marker: { x: 133.5, y: 73 },
    opening: { x: 128, y: 67, width: 0, height: 12 },
    label: { x: 134.3, y: 79.6 },
    compactLabel: { x: 139.8, y: 73 },
  },

  labels: [
    { text: "NORDLOUNGE", x: 21, y: 21.5, angle: -90, compactAngle: 0 },
    { text: "VESTLOUNGE", x: 115, y: 66.5, angle: 0, compactAngle: -90 },
    { text: "MELLEMLOUNGE", x: 27.5, y: 101.8, angle: 0, compactAngle: -90 },
  ] as ZoneLabel[],
}
