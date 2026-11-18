import React from "react"
import type { VenueMapConfig } from "../../../config/venue-map"
import type { SponsorData } from "../../../utils/data-loader"
import Logo from "../../../images/logo.svg"
import FloorPlan from "./floor-plan"
import { Glyph } from "./icons"
import type { AmenityKind } from "./plan"
import { amenityStyles, colors, fonts, styleOfTier, tierOf } from "./theme"

/** 16:9, for the screen above the conference entrance */
export const posterSize = { width: 1920, height: 1080 }

const sidebar = { x: 80, right: 550 }
const card = { x: 610, y: 64, width: 1238, height: 952, padding: 32 }
const legendHeight = 48
const legendSize = 20

// Space Grotesk averages a little over half its size per character; legend
// items are spaced by this estimate since SVG text can't be measured here.
const textWidth = (text: string, size: number) => text.length * size * 0.56

interface LegendItem {
  label: string
  marker: React.ReactNode
}

const Legend: React.FC<{ items: LegendItem[]; y: number }> = ({ items, y }) => {
  const starts = items.map(
    (_, i) =>
      card.x +
      card.padding +
      8 +
      items
        .slice(0, i)
        .reduce((sum, item) => sum + 80 + textWidth(item.label, legendSize), 0)
  )
  return (
    <>
      {items.map((item, i) => (
        <g key={item.label} transform={`translate(${starts[i]} ${y})`}>
          {item.marker}
          <text
            x={40}
            dominantBaseline="central"
            fill={colors.slate}
            style={{ fontFamily: fonts.display }}
            fontSize={legendSize}
            fontWeight={500}
          >
            {item.label}
          </text>
        </g>
      ))}
    </>
  )
}

const circleMarker = (color: string, glyph: React.ReactNode) => (
  <>
    <circle cx={14} cy={0} r={14} fill={color} />
    {glyph}
  </>
)

interface PosterProps {
  config: VenueMapConfig
  sponsors: Record<string, SponsorData>
}

const Poster: React.FC<PosterProps> = ({ config, sponsors }) => {
  const exhibitors = config.stands.flatMap((stand) => {
    const sponsor = stand.sponsor ? sponsors[stand.sponsor] : undefined
    return sponsor ? [{ stand, sponsor, tier: tierOf(stand) }] : []
  })
  const amenities: AmenityKind[] = ["registration", "coffee", "water", "lunch"]

  const legend: LegendItem[] = [
    ...amenities.map((kind) => ({
      label: amenityStyles[kind].label,
      marker: circleMarker(
        amenityStyles[kind].color,
        <Glyph name={kind} x={14} y={0} size={16} />
      ),
    })),
    {
      label: "Toilets",
      marker: circleMarker(
        colors.toilets,
        <text
          x={14}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#ffffff"
          style={{ fontFamily: fonts.display }}
          fontSize={10}
          fontWeight={700}
        >
          WC
        </text>
      ),
    },
  ]

  const legendTop = card.y + card.height - card.padding - legendHeight
  const map = {
    x: card.x + card.padding,
    y: card.y + card.padding,
    width: card.width - 2 * card.padding,
    height: legendTop - card.y - card.padding - 16,
  }

  return (
    <svg
      viewBox={`0 0 ${posterSize.width} ${posterSize.height}`}
      role="img"
      aria-label="Cloud Native Denmark 2026 conference map"
    >
      <defs>
        <pattern
          id="poster-dots"
          width={26}
          height={26}
          patternUnits="userSpaceOnUse"
        >
          <circle cx={13} cy={13} r={1.6} fill={colors.fog} opacity={0.5} />
        </pattern>
        <filter id="poster-shadow" x="-5%" y="-5%" width="110%" height="115%">
          <feDropShadow
            dx={0}
            dy={14}
            stdDeviation={18}
            floodColor={colors.midnight}
            floodOpacity={0.14}
          />
        </filter>
      </defs>

      <rect
        width={posterSize.width}
        height={posterSize.height}
        fill={colors.sand}
      />
      <rect width={posterSize.width} height={10} fill={colors.red} />

      <image href={Logo} x={sidebar.x} y={64} width={76} height={76} />
      <text
        x={sidebar.x + 94}
        y={92}
        fill={colors.midnight}
        style={{ fontFamily: fonts.display }}
        fontSize={28}
        fontWeight={700}
        letterSpacing={-0.6}
      >
        <tspan x={sidebar.x + 94}>Cloud Native</tspan>
        <tspan x={sidebar.x + 94} dy={30}>
          Denmark 2026
        </tspan>
      </text>

      <text
        x={sidebar.x}
        y={210}
        fill={colors.red}
        style={{ fontFamily: fonts.mono }}
        fontSize={17}
        fontWeight={700}
        letterSpacing={3.4}
      >
        CONFERENCE MAP
      </text>
      <text
        x={sidebar.x - 4}
        y={284}
        fill={colors.midnight}
        style={{ fontFamily: fonts.display }}
        fontSize={78}
        fontWeight={700}
        letterSpacing={-3.2}
      >
        <tspan x={sidebar.x - 4}>Find your</tspan>
        <tspan x={sidebar.x - 4} dy={72}>
          way.
        </tspan>
      </text>

      <circle cx={sidebar.x + 7} cy={409} r={7} fill={colors.red} />
      <text
        x={sidebar.x + 26}
        y={419}
        fill={colors.midnight}
        style={{ fontFamily: fonts.display }}
        fontSize={30}
        fontWeight={700}
        letterSpacing={-0.6}
      >
        19–20 NOV 2026
      </text>
      <text
        x={sidebar.x}
        y={454}
        fill={colors.slate}
        style={{ fontFamily: fonts.mono }}
        fontSize={14}
        fontWeight={600}
        letterSpacing={2.4}
      >
        SCANDIC COPENHAGEN
      </text>

      <line
        x1={sidebar.x}
        x2={sidebar.right}
        y1={490}
        y2={490}
        stroke={colors.midnight}
        strokeOpacity={0.15}
        strokeWidth={2}
      />
      <text
        x={sidebar.x}
        y={530}
        fill={colors.ash}
        style={{ fontFamily: fonts.mono }}
        fontSize={14}
        fontWeight={700}
        letterSpacing={3}
      >
        EXHIBITORS
      </text>
      {exhibitors.map(({ stand, sponsor, tier }, i) => {
        const y = 570 + i * 35
        const style = styleOfTier(tier)
        return (
          <g key={stand.id}>
            <circle cx={sidebar.x + 15} cy={y} r={15} fill={style.color} />
            <text
              x={sidebar.x + 15}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={style.text}
              style={{ fontFamily: fonts.display }}
              fontSize={stand.id.length > 1 ? 15 : 17}
              fontWeight={700}
            >
              {stand.id}
            </text>
            <text
              x={sidebar.x + 46}
              y={y}
              dominantBaseline="central"
              fill={colors.midnight}
              style={{ fontFamily: fonts.display }}
              fontSize={23}
              fontWeight={600}
            >
              {sponsor.title}
            </text>
          </g>
        )
      })}

      <text
        x={sidebar.x}
        y={card.y + card.height - 4}
        fill={colors.slate}
        style={{ fontFamily: fonts.mono }}
        fontSize={15}
        fontWeight={600}
        letterSpacing={1}
      >
        cloudnativedenmark.dk/conference-map
      </text>

      <rect
        x={card.x}
        y={card.y}
        width={card.width}
        height={card.height}
        rx={28}
        fill="#ffffff"
        filter="url(#poster-shadow)"
      />
      <rect
        x={card.x}
        y={card.y}
        width={card.width}
        height={card.height}
        rx={28}
        fill="url(#poster-dots)"
      />
      <svg {...map}>
        <FloorPlan
          variant="tv"
          config={config}
          sponsors={sponsors}
          highlighted={null}
          selected={null}
          onHover={() => {}}
          onToggle={() => {}}
        />
      </svg>
      <line
        x1={card.x + card.padding}
        x2={card.x + card.width - card.padding}
        y1={legendTop}
        y2={legendTop}
        stroke={colors.fog}
        strokeOpacity={0.6}
        strokeWidth={2}
      />
      <Legend items={legend} y={legendTop + 30} />
    </svg>
  )
}

export default Poster
