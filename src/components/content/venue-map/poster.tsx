import React from "react"
import type { VenueMapConfig } from "../../../config/venue-map"
import type { SponsorData } from "../../../utils/data-loader"
import Logo from "../../../images/logo.svg"
import FloorPlan from "./floor-plan"
import { plan } from "./plan"
import { colors, fonts } from "./theme"

/** 16:9, for the screen above the conference entrance */
export const posterSize = { width: 1920, height: 1080 }

// The map is the poster: the website's map on its white, dotted ground,
// full height and centred, with the branding small in the left margin.
const margin = 44
const mapHeight = posterSize.height - 2 * margin
const mapWidth = Math.round((mapHeight * plan.view.width) / plan.view.height)
const mapX = Math.round((posterSize.width - mapWidth) / 2)
const brand = { x: 40, y: 48 }

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

    <rect width={posterSize.width} height={posterSize.height} fill="#ffffff" />
    <rect
      width={posterSize.width}
      height={posterSize.height}
      fill="url(#poster-dots)"
    />

    <image href={Logo} x={brand.x} y={brand.y} width={56} height={56} />
    <text
      y={brand.y + 22}
      fill={colors.midnight}
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
      fill={colors.red}
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
      fill={colors.ash}
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

    <svg x={mapX} y={margin} width={mapWidth} height={mapHeight}>
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
