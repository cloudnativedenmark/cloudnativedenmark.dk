import React, { useId, useState } from "react"
import type {
  Amenity,
  AmenityKind,
  MapRect,
  Stand,
  VenueMapConfig,
} from "../../config/venue-map"
import type { SponsorData } from "../../utils/data-loader"

interface TierStyle {
  label: string
  color: string
  text: string
}

const tierStyles: Record<string, TierStyle> = {
  platinum: { label: "Platinum", color: "#e0132a", text: "#ffffff" },
  gold: { label: "Gold", color: "#f4b942", text: "#0b1e3f" },
  bronze: { label: "Bronze", color: "#ff6b4a", text: "#0b1e3f" },
  community: { label: "Community", color: "#1e4dd8", text: "#ffffff" },
  partner: { label: "Partner", color: "#7fb8c9", text: "#0b1e3f" },
  unassigned: { label: "Unassigned", color: "#b9c4d4", text: "#3a4558" },
}

const tierOf = (stand: Stand) => stand.sponsor?.split("/")[0] ?? "unassigned"

const styleOf = (stand: Stand) =>
  tierStyles[tierOf(stand)] ?? tierStyles.unassigned

interface AmenityStyle {
  label: string
  legend: string
  color: string
  text: string
}

const amenityStyles: Record<AmenityKind, AmenityStyle> = {
  coffee: {
    label: "COFFEE",
    legend: "Coffee",
    color: "#6f4e37",
    text: "#ffffff",
  },
  water: { label: "WATER", legend: "Water", color: "#7fb8c9", text: "#0b1e3f" },
  buffet: {
    label: "LUNCH",
    legend: "Lunch buffet",
    color: "#8aa04a",
    text: "#ffffff",
  },
  "help-desk": {
    label: "HELP DESK",
    legend: "Registration & help desk",
    color: "#1e4dd8",
    text: "#ffffff",
  },
  office: {
    label: "CONFERENCE OFFICE",
    legend: "Conference office",
    color: "#b9c4d4",
    text: "#3a4558",
  },
}

const COLORS = {
  midnight: "#0b1e3f",
  floor: "#f5e6d3",
  wall: "#0b1e3f",
  closed: "#e6e9ef",
  label: "#6b7689",
  red: "#e0132a",
}

const DISPLAY_FONT = "var(--font-display)"

const VIEW_BOX = { x: -11, y: -5, width: 64, height: 51 }

// Public floor: Nordlounge, Vestlounge and Mellemlounge as one outline.
const LOUNGE_OUTLINE =
  "M -9 -3 H 0 V 28 H 47 V 36 H 6.3 V 43.5 H -4.2 V 36 H -9 Z"

// Venue rooms off the Vestlounge that the conference doesn't use.
const CLOSED_ROOMS: MapRect[] = [
  { x: 6.3, y: 36, width: 8.4, height: 9 },
  { x: 14.7, y: 36, width: 7.6, height: 9 },
  { x: 22.3, y: 36, width: 7.7, height: 9 },
]

const LOUNGE_LABELS = [
  { text: "VESTLOUNGE", x: 19.5, y: 33.4, rotate: false },
  { text: "NORDLOUNGE", x: -3, y: 19, rotate: true },
  { text: "MELLEMLOUNGE", x: 4.4, y: 39.7, rotate: true },
]

const center = (rect: MapRect) => ({
  cx: rect.x + rect.width / 2,
  cy: rect.y + rect.height / 2,
})

const AmenityShape: React.FC<{ amenity: Amenity }> = ({ amenity }) => {
  const style = amenityStyles[amenity.kind]
  const { cx, cy } = center(amenity)
  const vertical = amenity.height > amenity.width
  const isOffice = amenity.kind === "office"

  return (
    <g>
      <title>{style.legend}</title>
      <rect
        x={amenity.x}
        y={amenity.y}
        width={amenity.width}
        height={amenity.height}
        rx={0.2}
        fill={style.color}
        stroke={isOffice ? COLORS.wall : "none"}
        strokeWidth={isOffice ? 0.12 : 0}
      />
      {isOffice ? (
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          fill={style.text}
          fontFamily={DISPLAY_FONT}
          fontSize={0.7}
          fontWeight={700}
          letterSpacing={0.08}
        >
          <tspan x={cx} dy={-0.2}>
            CONFERENCE
          </tspan>
          <tspan x={cx} dy={0.95}>
            OFFICE
          </tspan>
        </text>
      ) : (
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          fill={style.text}
          fontFamily={DISPLAY_FONT}
          fontSize={0.48}
          fontWeight={700}
          letterSpacing={0.06}
          transform={vertical ? `rotate(-90 ${cx} ${cy})` : undefined}
        >
          {style.label}
        </text>
      )}
    </g>
  )
}

interface StandShapeProps {
  stand: Stand
  sponsor?: SponsorData
  active: boolean
  onActivate: (id: string | null) => void
}

const StandShape: React.FC<StandShapeProps> = ({
  stand,
  sponsor,
  active,
  onActivate,
}) => {
  const tier = tierOf(stand)
  const style = styleOf(stand)
  const padding = 0.3
  const badge = 0.62

  return (
    <g
      data-testid={`stand-${stand.id}`}
      data-tier={tier}
      data-active={active}
      onMouseEnter={() => onActivate(stand.id)}
      onMouseLeave={() => onActivate(null)}
      style={{ cursor: sponsor ? "pointer" : "default" }}
    >
      <title>
        {sponsor
          ? `Stand ${stand.id} · ${sponsor.title} (${style.label})`
          : `Stand ${stand.id}`}
      </title>
      <rect
        x={stand.x}
        y={stand.y}
        width={stand.width}
        height={stand.height}
        rx={0.25}
        fill="#ffffff"
        stroke={active ? COLORS.midnight : style.color}
        strokeWidth={active ? 0.35 : 0.22}
        strokeDasharray={tier === "unassigned" ? "0.4 0.3" : undefined}
      />
      {sponsor && (
        <image
          href={sponsor.logo.publicURL}
          x={stand.x + padding}
          y={stand.y + padding}
          width={stand.width - padding * 2}
          height={stand.height - padding * 2}
          preserveAspectRatio="xMidYMid meet"
        />
      )}
      <circle
        cx={stand.x}
        cy={stand.y}
        r={badge}
        fill={style.color}
        stroke="#ffffff"
        strokeWidth={0.12}
      />
      <text
        x={stand.x}
        y={stand.y}
        textAnchor="middle"
        dominantBaseline="central"
        fill={style.text}
        fontFamily={DISPLAY_FONT}
        fontSize={stand.id.length > 1 ? 0.55 : 0.7}
        fontWeight={700}
      >
        {stand.id}
      </text>
    </g>
  )
}

interface VenueMapProps {
  config: VenueMapConfig
  /** Loaded sponsors keyed by their id, e.g. "gold/aws" */
  sponsors: Record<string, SponsorData>
}

const VenueMap: React.FC<VenueMapProps> = ({ config, sponsors }) => {
  const [activeStand, setActiveStand] = useState<string | null>(null)
  const seatsId = `seats-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`

  const exhibitors = config.stands.flatMap((stand) => {
    const sponsor = stand.sponsor ? sponsors[stand.sponsor] : undefined
    return sponsor ? [{ stand, sponsor }] : []
  })

  const assignedTiers = new Set(
    config.stands.filter((s) => s.sponsor).map(tierOf)
  )
  const tiersOnMap = Object.keys(tierStyles).filter((tier) =>
    assignedTiers.has(tier)
  )
  const amenitiesOnMap = Array.from(
    new Set(config.amenities.map((a) => a.kind))
  )

  return (
    <div>
      <ul
        aria-label="Map legend"
        className="mb-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-cnd-slate"
      >
        {tiersOnMap.map((tier) => (
          <li key={tier} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block h-3.5 w-3.5 rounded-full"
              style={{ background: tierStyles[tier]?.color }}
            />
            {tierStyles[tier]?.label} stand
          </li>
        ))}
        {amenitiesOnMap.map((kind) => (
          <li key={kind} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block h-3.5 w-3.5 rounded-sm"
              style={{ background: amenityStyles[kind].color }}
            />
            {amenityStyles[kind].legend}
          </li>
        ))}
      </ul>

      <div className="overflow-x-auto rounded-2xl border-2 border-cnd-fog/40 bg-white p-3 sm:p-5">
        <svg
          role="img"
          aria-labelledby={`${seatsId}-title`}
          viewBox={`${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.width} ${VIEW_BOX.height}`}
          className="block h-auto w-full min-w-[720px]"
        >
          <title id={`${seatsId}-title`}>
            Floor plan of the conference area at Scandic Copenhagen
          </title>
          <defs>
            <pattern
              id={seatsId}
              width={0.9}
              height={0.9}
              patternUnits="userSpaceOnUse"
            >
              <rect
                x={0.18}
                y={0.18}
                width={0.5}
                height={0.5}
                rx={0.12}
                fill="#ffffff"
                opacity={0.13}
              />
            </pattern>
          </defs>

          <path
            d={LOUNGE_OUTLINE}
            fill={COLORS.floor}
            stroke={COLORS.wall}
            strokeWidth={0.18}
            strokeLinejoin="round"
          />

          {CLOSED_ROOMS.map((room) => (
            <rect
              key={`${room.x}-${room.y}`}
              x={room.x}
              y={room.y}
              width={room.width}
              height={room.height}
              fill={COLORS.closed}
              stroke={COLORS.wall}
              strokeWidth={0.12}
            />
          ))}

          {LOUNGE_LABELS.map((label) => (
            <text
              key={label.text}
              x={label.x}
              y={label.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={COLORS.label}
              fontFamily={DISPLAY_FONT}
              fontSize={0.7}
              fontWeight={700}
              letterSpacing={0.25}
              transform={
                label.rotate ? `rotate(-90 ${label.x} ${label.y})` : undefined
              }
            >
              {label.text}
            </text>
          ))}

          {config.rooms.map((room) => {
            const { cx, cy } = center(room)
            const seatsFrom = room.stage
              ? room.stage.x + room.stage.width + 1.6
              : room.x + 1
            const nameSize = Math.min(2, room.width / 6.2)

            return (
              <g key={room.id}>
                <rect
                  x={room.x}
                  y={room.y}
                  width={room.width}
                  height={room.height}
                  fill={COLORS.midnight}
                  stroke="#ffffff"
                  strokeWidth={0.15}
                />
                {room.stage && (
                  <>
                    <rect
                      x={seatsFrom}
                      y={room.y + 2}
                      width={room.x + room.width - 1.5 - seatsFrom}
                      height={room.height - 4}
                      fill={`url(#${seatsId})`}
                    />
                    <rect
                      x={room.stage.x}
                      y={room.stage.y}
                      width={room.stage.width}
                      height={room.stage.height}
                      rx={0.2}
                      fill={COLORS.red}
                    />
                  </>
                )}
                <text
                  x={cx}
                  y={cy - nameSize * 0.2}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontFamily={DISPLAY_FONT}
                  fontSize={nameSize}
                  fontWeight={700}
                  letterSpacing={-0.04}
                >
                  {room.name}
                </text>
                <text
                  x={cx}
                  y={cy + nameSize * 0.75}
                  textAnchor="middle"
                  fill="#b9c4d4"
                  fontFamily={DISPLAY_FONT}
                  fontSize={nameSize * 0.42}
                  fontWeight={600}
                  letterSpacing={0.1}
                >
                  {room.areaM2} m²
                </text>
              </g>
            )
          })}

          {config.amenities.map((amenity) => (
            <AmenityShape
              key={`${amenity.kind}-${amenity.x}-${amenity.y}`}
              amenity={amenity}
            />
          ))}

          {config.stands.map((stand) => (
            <StandShape
              key={stand.id}
              stand={stand}
              sponsor={stand.sponsor ? sponsors[stand.sponsor] : undefined}
              active={activeStand === stand.id}
              onActivate={setActiveStand}
            />
          ))}

          <g aria-label="Entrance">
            <path
              d="M 50.6 32 H 47.6 M 48.6 31 L 47.6 32 L 48.6 33"
              fill="none"
              stroke={COLORS.red}
              strokeWidth={0.35}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text
              x={49.6}
              y={30.2}
              textAnchor="middle"
              fill={COLORS.red}
              fontFamily={DISPLAY_FONT}
              fontSize={0.75}
              fontWeight={700}
              letterSpacing={0.15}
            >
              ENTRANCE
            </text>
          </g>
        </svg>
      </div>

      <ol
        aria-label="Exhibitors by stand"
        className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        {exhibitors.map(({ stand, sponsor }) => {
          const style = styleOf(stand)
          const active = activeStand === stand.id

          return (
            <li key={stand.id} data-active={active}>
              <a
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setActiveStand(stand.id)}
                onMouseLeave={() => setActiveStand(null)}
                onFocus={() => setActiveStand(stand.id)}
                onBlur={() => setActiveStand(null)}
                className={`flex items-center gap-4 rounded-xl border-2 bg-white p-3 transition-colors ${
                  active
                    ? "border-cnd-midnight"
                    : "border-cnd-fog/40 hover:border-cnd-midnight"
                }`}
              >
                <span
                  className="display flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm"
                  style={{ background: style.color, color: style.text }}
                >
                  {stand.id}
                </span>
                <span className="flex h-10 w-20 flex-shrink-0 items-center justify-center">
                  <img
                    src={sponsor.logo.publicURL}
                    alt=""
                    className="max-h-full max-w-full object-contain"
                    loading="lazy"
                  />
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-cnd-midnight">
                    {sponsor.title}
                  </span>
                  <span className="block text-xs uppercase tracking-widest text-cnd-ash">
                    {style.label}
                  </span>
                </span>
              </a>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export default VenueMap
