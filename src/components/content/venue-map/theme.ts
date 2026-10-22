import type { Stand } from "../../../config/venue-map"
import type { AmenityKind } from "./plan"

export interface TierStyle {
  label: string
  color: string
  /** Text colour on top of `color` */
  text: string
}

export const tierStyles: Record<string, TierStyle> = {
  platinum: { label: "Platinum", color: "#e0132a", text: "#ffffff" },
  gold: { label: "Gold", color: "#f4b942", text: "#0b1e3f" },
  bronze: { label: "Bronze", color: "#ff6b4a", text: "#0b1e3f" },
  community: { label: "Community", color: "#1e4dd8", text: "#ffffff" },
  partner: { label: "Partner", color: "#7fb8c9", text: "#0b1e3f" },
  unassigned: { label: "Unassigned", color: "#b9c4d4", text: "#3a4558" },
}

export const tierOf = (stand: Stand) =>
  stand.sponsor?.split("/")[0] ?? "unassigned"

export const styleOfTier = (tier: string) =>
  tierStyles[tier] ?? tierStyles.unassigned

export const amenityStyles: Record<
  AmenityKind,
  { label: string; color: string }
> = {
  registration: { label: "Registration & help desk", color: "#1e4dd8" },
  coffee: { label: "Coffee", color: "#6f4e37" },
  water: { label: "Water", color: "#2b8fb3" },
  lunch: { label: "Lunch", color: "#0b1e3f" },
}

export const colors = {
  midnight: "#0b1e3f",
  slate: "#3a4558",
  ash: "#6b7689",
  fog: "#b9c4d4",
  floor: "#f6ecdf",
  room: "#eef1f6",
  hatch: "#d3dae5",
  red: "#e0132a",
  exit: "#00915a",
  toilets: "#3a4558",
}

export const fonts = {
  display: "var(--font-display)",
  mono: "var(--font-mono)",
}
