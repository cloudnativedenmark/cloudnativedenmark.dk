import React from "react"
import type { VenueMapConfig } from "../../../config/venue-map"
import type { SponsorData } from "../../../utils/data-loader"
import Logo from "../../../images/logo.svg"
import FloorPlan from "./floor-plan"
import { plan } from "./plan"
import { colors, fonts } from "./theme"

/** 16:9, for the screen above the conference entrance */
export const posterSize = { width: 1920, height: 1080 }

// Laid out like the website's map page: eyebrow and headline on the bone
// background, the map on its white, dotted card. The header is kept short
// so the map gets as much of the screen's height as it can.
const bone = "#f7f5f0"
const side = 48
const card = {
  x: side,
  y: 104,
  width: posterSize.width - 2 * side,
  height: posterSize.height - 104 - 16,
}
const inset = 12
// The plan's view keeps margins the card doesn't need: nothing is drawn
// above y -0.5 or below y 110 (the Mellemlounge exit).
const trim = { top: 3.5, bottom: 1 }
const scale =
  (card.height - 2 * inset) / (plan.view.height - trim.top - trim.bottom)
const map = {
  width: plan.view.width * scale,
  height: plan.view.height * scale,
  x: card.x + (card.width - plan.view.width * scale) / 2,
  y: card.y + inset - trim.top * scale,
}

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
        width={18}
        height={18}
        patternUnits="userSpaceOnUse"
      >
        <circle cx={9} cy={9} r={1.2} fill={colors.fog} opacity={0.45} />
      </pattern>
      <clipPath id="poster-card">
        <rect {...card} rx={24} />
      </clipPath>
    </defs>

    <rect width={posterSize.width} height={posterSize.height} fill={bone} />

    <text
      x={side}
      y={38}
      fill={colors.red}
      style={{ fontFamily: fonts.mono }}
      fontSize={15}
      fontWeight={600}
      letterSpacing={3.3}
    >
      CONFERENCE MAP · SCANDIC COPENHAGEN
    </text>
    <text
      x={side - 2}
      y={84}
      fill={colors.midnight}
      style={{ fontFamily: fonts.display }}
      fontSize={46}
      fontWeight={700}
      letterSpacing={-1.6}
    >
      Find your way.
    </text>

    <image
      href={Logo}
      x={posterSize.width - side - 196}
      y={30}
      width={52}
      height={52}
    />
    <text
      y={52}
      fill={colors.midnight}
      style={{ fontFamily: fonts.display }}
      fontSize={19}
      fontWeight={700}
    >
      <tspan x={posterSize.width - side - 132}>CLOUD NATIVE</tspan>
      <tspan x={posterSize.width - side - 132} dy={21}>
        DENMARK
      </tspan>
    </text>

    <rect {...card} rx={24} fill="#ffffff" />
    <rect {...card} rx={24} fill="url(#poster-dots)" />
    <rect
      {...card}
      rx={24}
      fill="none"
      stroke={colors.fog}
      strokeOpacity={0.4}
      strokeWidth={2}
    />
    <g clipPath="url(#poster-card)">
      <svg {...map}>
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
    </g>
  </svg>
)

export default Poster
