import React, { useId } from "react"
import type { VenueMapConfig } from "../../../config/venue-map"
import type { SponsorData } from "../../../utils/data-loader"
import { plan, type Door, type Exit } from "./plan"
import { Glyph } from "./icons"
import { amenityStyles, colors, fonts, styleOfTier, tierOf } from "./theme"

export type FloorPlanVariant = "full" | "compact"

const sizes = {
  full: {
    amenity: 2.2,
    exit: 3.4,
    entrance: 3,
    roomName: 4.2,
    smallRoomName: 2.2,
    zone: 1.5,
    stand: 2.1,
  },
  compact: {
    amenity: 2.8,
    exit: 4.2,
    entrance: 3.6,
    roomName: 4.6,
    smallRoomName: 3.4,
    zone: 2.5,
    stand: 4.2,
  },
}

const exitAngles: Record<Exit["direction"], number> = {
  left: 180,
  up: -90,
  down: 90,
}

const doorRect = (door: Door) =>
  door.wall === "horizontal"
    ? { x: door.x - 1.3, y: door.y - 0.5, width: 2.6, height: 1 }
    : { x: door.x - 0.5, y: door.y - 1.3, width: 1, height: 2.6 }

const roundedTop = (
  x: number,
  y: number,
  width: number,
  height: number,
  r: number
) =>
  `M ${x} ${y + height} V ${y + r} Q ${x} ${y} ${x + r} ${y} H ${x + width - r} Q ${x + width} ${y} ${x + width} ${y + r} V ${y + height} Z`

interface FloorPlanProps {
  variant: FloorPlanVariant
  config: VenueMapConfig
  sponsors: Record<string, SponsorData>
  highlighted: string | null
  selected: string | null
  onHover: (id: string | null) => void
  onToggle: (id: string) => void
  className?: string
}

const FloorPlan: React.FC<FloorPlanProps> = ({
  variant,
  config,
  sponsors,
  highlighted,
  selected,
  onHover,
  onToggle,
  className,
}) => {
  const compact = variant === "compact"
  const size = sizes[variant]
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "")
  const seatsId = `${uid}-seats`
  const hatchId = `${uid}-hatch`
  const shadowId = `${uid}-shadow`
  const { view } = plan

  // On mobile the whole plan is turned a quarter clockwise so the entrance
  // sits at the bottom; text and icons are turned back to stay level.
  const level = (x: number, y: number, angle = 0) => {
    const rotation = compact ? angle - 90 : angle
    return rotation ? `rotate(${rotation} ${x} ${y})` : undefined
  }

  const viewBox = compact
    ? `0 0 ${view.height} ${view.width}`
    : `${view.x} ${view.y} ${view.width} ${view.height}`
  const sceneTransform = compact
    ? `translate(${view.y + view.height} ${-view.x}) rotate(90)`
    : undefined

  const roomNames = Object.fromEntries(
    config.rooms.map((room) => [room.id, room])
  )

  return (
    <svg
      role="group"
      aria-label="Floor plan of the conference floor at Scandic Copenhagen"
      data-variant={variant}
      viewBox={viewBox}
      className={className}
    >
      <defs>
        <pattern
          id={seatsId}
          width={0.95}
          height={0.95}
          patternUnits="userSpaceOnUse"
        >
          <rect
            x={0.2}
            y={0.2}
            width={0.52}
            height={0.52}
            rx={0.14}
            fill="#ffffff"
            opacity={0.16}
          />
        </pattern>
        <pattern
          id={hatchId}
          width={1.4}
          height={1.4}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line
            x1={0}
            y1={0}
            x2={0}
            y2={1.4}
            stroke={colors.hatch}
            strokeWidth={0.45}
          />
        </pattern>
        <filter id={shadowId} x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow
            dx={0}
            dy={0.35}
            stdDeviation={0.45}
            floodColor={colors.midnight}
            floodOpacity={0.18}
          />
        </filter>
      </defs>

      <g transform={sceneTransform}>
        <path
          d={plan.floor}
          fill={colors.floor}
          stroke={colors.midnight}
          strokeWidth={0.55}
          strokeLinejoin="round"
        />
        <line
          x1={plan.entrance.opening.x}
          y1={plan.entrance.opening.y}
          x2={plan.entrance.opening.x}
          y2={plan.entrance.opening.y + plan.entrance.opening.height}
          stroke={colors.floor}
          strokeWidth={0.9}
        />

        {plan.closedRooms.map((room) => (
          <g key={`${room.x}-${room.y}`}>
            <rect {...room} fill="#ffffff" />
            <rect
              {...room}
              fill={`url(#${hatchId})`}
              stroke={colors.midnight}
              strokeWidth={0.3}
            />
          </g>
        ))}

        <rect
          {...plan.office}
          fill={colors.room}
          stroke={colors.midnight}
          strokeWidth={0.3}
        />
        {(() => {
          const cx = plan.office.x + plan.office.width / 2
          const cy = plan.office.y + plan.office.height / 2
          return (
            <text
              x={cx}
              y={cy}
              transform={level(cx, cy)}
              textAnchor="middle"
              fill={colors.slate}
              style={{ fontFamily: fonts.mono }}
              fontSize={compact ? 2 : 1.15}
              fontWeight={700}
              letterSpacing={0.12}
            >
              {compact ? (
                <tspan dominantBaseline="central">OFFICE</tspan>
              ) : (
                <>
                  <tspan x={cx} dy={-0.35}>
                    CONFERENCE
                  </tspan>
                  <tspan x={cx} dy={1.6}>
                    OFFICE
                  </tspan>
                </>
              )}
            </text>
          )
        })()}

        <g>
          <title>Toilets</title>
          {plan.toilets.rooms.map((room) => {
            const cx = room.x + room.width / 2
            const cy = room.y + room.height / 2
            const r = size.amenity * 1.05
            return (
              <g key={room.x}>
                <rect
                  {...room}
                  fill={colors.room}
                  stroke={colors.midnight}
                  strokeWidth={0.3}
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill={colors.toilets}
                  stroke="#ffffff"
                  strokeWidth={0.35}
                />
                <text
                  x={cx}
                  y={cy}
                  transform={level(cx, cy)}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#ffffff"
                  style={{ fontFamily: fonts.display }}
                  fontSize={r * 0.82}
                  fontWeight={700}
                >
                  WC
                </text>
              </g>
            )
          })}
          {plan.toilets.doors.map((door) => (
            <rect key={door.x} {...doorRect(door)} fill={colors.floor} />
          ))}
          {!compact && (
            <text
              x={plan.toilets.label.x}
              y={plan.toilets.label.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={colors.slate}
              style={{ fontFamily: fonts.mono }}
              fontSize={1.15}
              fontWeight={700}
              letterSpacing={0.3}
            >
              TOILETS
            </text>
          )}
        </g>

        {Object.entries(plan.rooms).map(([id, room]) => {
          const name = roomNames[id]
          const small = room.width < 20
          const nameSize = small ? size.smallRoomName : size.roomName
          return (
            <g key={id}>
              <rect
                x={room.x}
                y={room.y}
                width={room.width}
                height={room.height}
                fill={colors.midnight}
                stroke={colors.floor}
                strokeWidth={0.35}
              />
              {room.seats.map((seats) => (
                <rect
                  key={`${seats.x}-${seats.y}`}
                  {...seats}
                  fill={`url(#${seatsId})`}
                />
              ))}
              {room.stage && (
                <>
                  <rect {...room.stage} rx={0.3} fill={colors.red} />
                  {!compact &&
                    (() => {
                      const { stage } = room
                      const cx = stage.x + stage.width / 2
                      const cy = stage.y + stage.height / 2
                      const vertical = stage.height > stage.width
                      return (
                        <text
                          x={cx}
                          y={cy}
                          transform={
                            vertical ? `rotate(-90 ${cx} ${cy})` : undefined
                          }
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill="#ffffff"
                          style={{ fontFamily: fonts.mono }}
                          fontSize={Math.min(
                            1,
                            Math.min(stage.width, stage.height) * 0.65
                          )}
                          fontWeight={700}
                          letterSpacing={0.5}
                        >
                          {stage.label ?? "STAGE"}
                        </text>
                      )
                    })()}
                </>
              )}
              {room.doors.map((door) => (
                <rect
                  key={`${door.x}-${door.y}`}
                  {...doorRect(door)}
                  fill={colors.floor}
                />
              ))}
              {name && (
                <g transform={level(room.label.x, room.label.y)}>
                  <text
                    x={room.label.x}
                    y={room.label.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#ffffff"
                    style={{ fontFamily: fonts.display }}
                    fontSize={nameSize}
                    fontWeight={700}
                    letterSpacing={-0.04 * nameSize}
                  >
                    {name.name}
                  </text>
                  {!compact && (
                    <text
                      x={room.label.x}
                      y={room.label.y + nameSize * 0.95}
                      textAnchor="middle"
                      fill={colors.fog}
                      style={{ fontFamily: fonts.mono }}
                      fontSize={small ? 1.15 : 1.5}
                      letterSpacing={0.15}
                    >
                      {name.areaM2} m²
                    </text>
                  )}
                </g>
              )}
            </g>
          )
        })}

        {plan.labels.map((label) => {
          const fontSize = compact
            ? (label.compactSize ?? size.zone)
            : size.zone
          return (
            <text
              key={label.text}
              x={label.x}
              y={label.y}
              transform={`rotate(${compact ? label.compactAngle - 90 : label.angle} ${label.x} ${label.y})`}
              textAnchor="middle"
              dominantBaseline="central"
              fill={colors.ash}
              style={{ fontFamily: fonts.mono }}
              fontSize={fontSize}
              fontWeight={600}
              letterSpacing={fontSize * (compact ? 0.14 : 0.25)}
            >
              {label.text}
            </text>
          )
        })}

        {plan.amenities.map((amenity) => {
          const style = amenityStyles[amenity.kind]
          const r = size.amenity
          return (
            <g key={`${amenity.kind}-${amenity.x}-${amenity.y}`}>
              <title>{style.label}</title>
              <circle
                cx={amenity.x}
                cy={amenity.y}
                r={r}
                fill={style.color}
                stroke="#ffffff"
                strokeWidth={0.35}
              />
              <Glyph
                name={amenity.kind}
                x={amenity.x}
                y={amenity.y}
                size={r * 1.2}
                transform={level(amenity.x, amenity.y)}
              />
              {amenity.kind === "registration" && !compact && (
                <text
                  x={amenity.x + r + 0.9}
                  y={amenity.y}
                  dominantBaseline="central"
                  fill={style.color}
                  style={{ fontFamily: fonts.mono }}
                  fontSize={1.3}
                  fontWeight={700}
                  letterSpacing={0.15}
                >
                  REGISTRATION
                </text>
              )}
            </g>
          )
        })}

        {plan.exits.map((exit) => (
          <g key={`${exit.x}-${exit.y}`}>
            <title>Emergency exit</title>
            <rect
              x={exit.x - size.exit / 2}
              y={exit.y - size.exit / 2}
              width={size.exit}
              height={size.exit}
              rx={0.5}
              fill={colors.exit}
              stroke="#ffffff"
              strokeWidth={0.3}
            />
            <Glyph
              name="exit"
              x={exit.x}
              y={exit.y}
              size={size.exit * 0.68}
              transform={`rotate(${exitAngles[exit.direction]} ${exit.x} ${exit.y})`}
            />
          </g>
        ))}

        {(() => {
          const { marker } = plan.entrance
          const label = compact
            ? plan.entrance.compactLabel
            : plan.entrance.label
          return (
            <g>
              <title>Entrance</title>
              <circle
                cx={marker.x}
                cy={marker.y}
                r={size.entrance}
                fill={colors.red}
                stroke="#ffffff"
                strokeWidth={0.4}
              />
              <Glyph
                name="entrance"
                x={marker.x}
                y={marker.y}
                size={size.entrance * 1.25}
              />
              <text
                x={label.x}
                y={label.y}
                transform={level(label.x, label.y)}
                textAnchor="middle"
                dominantBaseline="central"
                fill={colors.red}
                style={{ fontFamily: fonts.mono }}
                fontSize={compact ? 2.2 : 1.4}
                fontWeight={700}
                letterSpacing={compact ? 0.4 : 0.25}
              >
                ENTRANCE
              </text>
            </g>
          )
        })()}

        {config.stands.map((stand) => {
          const shape = plan.stands[stand.id]
          if (!shape) return null
          const tier = tierOf(stand)
          const style = styleOfTier(tier)
          const sponsor = stand.sponsor ? sponsors[stand.sponsor] : undefined
          const active = highlighted === stand.id
          const dimmed = highlighted !== null && !active
          const cx = shape.x + shape.width / 2
          const cy = shape.y + shape.height / 2
          const interactive = Boolean(stand.sponsor)

          return (
            <g
              key={stand.id}
              data-stand={stand.id}
              data-tier={tier}
              data-active={active}
              role={interactive ? "button" : undefined}
              tabIndex={interactive ? 0 : undefined}
              aria-label={
                sponsor
                  ? `Stand ${stand.id}: ${sponsor.title}, ${style.label}`
                  : `Stand ${stand.id}`
              }
              aria-pressed={interactive ? selected === stand.id : undefined}
              onMouseEnter={() => onHover(stand.id)}
              onMouseLeave={() => onHover(null)}
              onFocus={() => onHover(stand.id)}
              onBlur={() => onHover(null)}
              onClick={interactive ? () => onToggle(stand.id) : undefined}
              onKeyDown={(event) => {
                if (
                  interactive &&
                  (event.key === "Enter" || event.key === " ")
                ) {
                  event.preventDefault()
                  onToggle(stand.id)
                }
              }}
              style={{
                cursor: interactive ? "pointer" : "default",
                opacity: dimmed ? 0.3 : 1,
                transition: "opacity 150ms ease",
                outline: "none",
              }}
            >
              <title>
                {sponsor
                  ? `Stand ${stand.id} · ${sponsor.title}`
                  : `Stand ${stand.id}`}
              </title>
              {compact ? (
                <>
                  <rect
                    x={shape.x}
                    y={shape.y}
                    width={shape.width}
                    height={shape.height}
                    rx={0.9}
                    fill={style.color}
                    fillOpacity={active ? 1 : 0.28}
                    stroke={active ? colors.midnight : style.color}
                    strokeWidth={active ? 0.8 : 0.5}
                    strokeDasharray={interactive ? undefined : "1 0.8"}
                  />
                  <text
                    x={cx}
                    y={cy}
                    transform={level(cx, cy)}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={active ? style.text : colors.midnight}
                    style={{ fontFamily: fonts.display }}
                    fontSize={size.stand}
                    fontWeight={700}
                  >
                    {stand.id}
                  </text>
                </>
              ) : (
                <>
                  <rect
                    x={shape.x}
                    y={shape.y}
                    width={shape.width}
                    height={shape.height}
                    rx={1}
                    fill="#ffffff"
                    stroke={active ? colors.midnight : style.color}
                    strokeWidth={active ? 0.7 : 0.45}
                    strokeDasharray={interactive ? undefined : "1 0.8"}
                    filter={`url(#${shadowId})`}
                  />
                  <path
                    d={roundedTop(shape.x, shape.y, shape.width, 1.1, 1)}
                    fill={style.color}
                  />
                  {sponsor && (
                    <image
                      href={sponsor.logo.publicURL}
                      x={shape.x + 1}
                      y={shape.y + 2.2}
                      width={shape.width - 2}
                      height={shape.height - 3.4}
                      preserveAspectRatio="xMidYMid meet"
                    />
                  )}
                  <circle
                    cx={shape.x + 0.6}
                    cy={shape.y + 0.6}
                    r={size.stand}
                    fill={style.color}
                    stroke="#ffffff"
                    strokeWidth={0.4}
                  />
                  <text
                    x={shape.x + 0.6}
                    y={shape.y + 0.6}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={style.text}
                    style={{ fontFamily: fonts.display }}
                    fontSize={stand.id.length > 1 ? 1.75 : 2.1}
                    fontWeight={700}
                  >
                    {stand.id}
                  </text>
                </>
              )}
            </g>
          )
        })}
      </g>
    </svg>
  )
}

export default FloorPlan
