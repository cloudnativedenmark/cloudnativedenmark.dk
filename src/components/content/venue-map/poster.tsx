import React from "react"
import type { VenueMapConfig } from "../../../config/venue-map"
import type { SponsorData } from "../../../utils/data-loader"
import Logo from "../../../images/logo.svg"
import FloorPlan from "./floor-plan"
import { plan } from "./plan"
import { colors, fonts } from "./theme"

/** 16:9, for the screen above the conference entrance */
export const posterSize = { width: 1920, height: 1080 }

// The venue's screens show the door signs from the graphics repo, so the
// poster borrows their look: navy, cream type, the rose/peach/slate
// honeycomb on the right (brand/tokens.css and decks/shared/deck.js there).
const stage = {
  navy: "#19213C",
  cream: "#F2E6D5",
  rose: "#E07E77",
  peach: "#F0AD95",
  slate: "#858388",
}

// The map is the poster: its card takes the full height, centred, with the
// branding small in the margin to its left.
const margin = 28
const padding = 16
const mapHeight = posterSize.height - 2 * (margin + padding)
const mapWidth = Math.round((mapHeight * plan.view.width) / plan.view.height)
const card = {
  x: Math.round((posterSize.width - mapWidth - 2 * padding) / 2),
  y: margin,
  width: mapWidth + 2 * padding,
  height: mapHeight + 2 * padding,
}
const brand = { x: 40, y: 48 }

const HEX_D =
  "M 974.38 895.26 C 991.84 885.18 1005.99 860.67 1005.99 840.52 L 1005.99 333.21 C 1005.99 313.06 991.84 288.55 974.38 278.47 L 535.05 24.82 C 517.59 14.74 489.29 14.74 471.84 24.82 L 32.5 278.47 C 15.04 288.55 0.89 313.06 0.89 333.21 L 0.89 840.52 C 0.89 860.67 15.04 885.18 32.5 895.26 L 471.84 1148.91 C 489.29 1158.99 517.59 1158.99 535.05 1148.91 Z"
const HEX_VB = { x: 0.894, y: 17.3, w: 1005.1, h: 1139.1 }

const rng = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)))
  return t * t * (3 - 2 * t)
}

/** The deck's "right" field: same seed, cells and density as the door signs */
const honeycomb = (() => {
  const rand = rng(2026)
  const palette = [
    stage.rose,
    stage.peach,
    stage.slate,
    stage.slate,
    stage.rose,
    stage.peach,
  ]
  const h = 175
  const gap = 15
  const w = (h * HEX_VB.w) / HEX_VB.h
  const dx = w + gap
  const dy = h * 0.75 + gap * 0.87
  const cells = []
  for (let r = -1; r * dy < posterSize.height + h; r++) {
    for (let c = -1; c * dx < posterSize.width + w; c++) {
      const cx = c * dx + (r % 2 ? dx / 2 : 0)
      const cy = r * dy + h / 2 - 18
      const pick = rand()
      const tint = palette[Math.floor(rand() * palette.length)]
      const level = 0.55 + rand() * 0.45
      // The deck also draws each cell's breathing speed and phase
      rand()
      rand()
      const density = smooth(1240, 1640, cx) * 0.7
      if (pick < density) {
        cells.push({
          tint,
          opacity: 0.9 * level * (0.45 + 0.55 * density),
          transform: `translate(${cx - w / 2} ${cy - h / 2}) scale(${h / HEX_VB.h}) translate(${-HEX_VB.x} ${-HEX_VB.y})`,
        })
      }
    }
  }
  return cells
})()

interface PosterProps {
  config: VenueMapConfig
  sponsors: Record<string, SponsorData>
}

const Poster: React.FC<PosterProps> = ({ config, sponsors }) => (
  <svg
    viewBox={`0 0 ${posterSize.width} ${posterSize.height}`}
    role="img"
    aria-label="Cloud Native Denmark 2026 conference map"
  >
    <defs>
      <pattern
        id="poster-dots"
        width={22}
        height={22}
        patternUnits="userSpaceOnUse"
      >
        <circle cx={11} cy={11} r={1.4} fill={colors.fog} opacity={0.45} />
      </pattern>
    </defs>

    <rect
      width={posterSize.width}
      height={posterSize.height}
      fill={stage.navy}
    />
    {honeycomb.map((cell, i) => (
      <path
        key={i}
        d={HEX_D}
        transform={cell.transform}
        fill={cell.tint}
        opacity={cell.opacity}
      />
    ))}

    <image href={Logo} x={brand.x} y={brand.y} width={56} height={56} />
    <text
      y={brand.y + 22}
      fill={stage.cream}
      style={{ fontFamily: fonts.display }}
      fontSize={20}
      fontWeight={700}
      letterSpacing={-0.4}
    >
      <tspan x={brand.x + 68}>Cloud Native</tspan>
      <tspan x={brand.x + 68} dy={22}>
        Denmark 2026
      </tspan>
    </text>
    <text
      x={brand.x}
      y={brand.y + 104}
      fill={stage.rose}
      style={{ fontFamily: fonts.mono }}
      fontSize={13}
      fontWeight={700}
      letterSpacing={2.6}
    >
      CONFERENCE MAP
    </text>
    <text
      x={brand.x}
      y={posterSize.height - 64}
      fill={stage.cream}
      opacity={0.6}
      style={{ fontFamily: fonts.mono }}
      fontSize={12}
      fontWeight={600}
      letterSpacing={1.8}
    >
      <tspan x={brand.x}>19–20 NOV 2026</tspan>
      <tspan x={brand.x} dy={20}>
        CLOUDNATIVEDENMARK.DK
      </tspan>
    </text>

    <rect {...card} rx={24} fill="#ffffff" />
    <rect {...card} rx={24} fill="url(#poster-dots)" />
    <svg
      x={card.x + padding}
      y={card.y + padding}
      width={mapWidth}
      height={mapHeight}
    >
      <FloorPlan
        variant="full"
        config={config}
        sponsors={sponsors}
        highlighted={null}
        selected={null}
        onHover={() => {}}
        onToggle={() => {}}
      />
    </svg>
  </svg>
)

export default Poster
