import React, { useId, useRef, useState } from "react"
import type { Stand, VenueMapConfig } from "../../../config/venue-map"
import type { SponsorData } from "../../../utils/data-loader"
import { mapPdf, mapSvg, saveFile } from "./download"
import FloorPlan from "./floor-plan"
import { GlyphIcon } from "./icons"
import { plan, type AmenityKind, type Zone } from "./plan"
import { amenityStyles, colors, styleOfTier, tierOf, tierStyles } from "./theme"

interface Exhibitor {
  stand: Stand
  sponsor: SponsorData
  zone: Zone
  tier: string
}

const StandBadge: React.FC<{ id: string; tier: string; large?: boolean }> = ({
  id,
  tier,
  large,
}) => {
  const style = styleOfTier(tier)
  return (
    <span
      aria-hidden="true"
      className={`display flex flex-shrink-0 items-center justify-center rounded-full ${
        large ? "h-11 w-11 text-base" : "h-9 w-9 text-sm"
      }`}
      style={{ background: style.color, color: style.text, lineHeight: 1 }}
    >
      {id}
    </span>
  )
}

const LegendMarker: React.FC<{
  color: string
  shape?: "circle" | "square"
  children: React.ReactNode
}> = ({ color, shape = "circle", children }) => (
  <span
    aria-hidden="true"
    className={`flex h-5 w-5 flex-shrink-0 items-center justify-center text-white ${
      shape === "circle" ? "rounded-full" : "rounded-[4px]"
    }`}
    style={{ background: color }}
  >
    {children}
  </span>
)

const Legend: React.FC<{ tiers: string[] }> = ({ tiers }) => {
  const amenities: AmenityKind[] = ["registration", "coffee", "water", "lunch"]
  return (
    <ul
      aria-label="Map legend"
      className="flex flex-wrap gap-x-4 gap-y-2.5 text-[13px] text-cnd-slate"
    >
      {tiers.map((tier) => (
        <li key={tier} className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="h-3.5 w-3.5 rounded-[4px]"
            style={{ background: tierStyles[tier].color }}
          />
          {tierStyles[tier].label}
        </li>
      ))}
      <li className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="h-3.5 w-1.5 rounded-sm"
          style={{ background: colors.red }}
        />
        Stage / screen
      </li>
      <li className="flex items-center gap-2">
        <LegendMarker color={colors.red}>
          <GlyphIcon name="entrance" className="h-3 w-3" />
        </LegendMarker>
        Entrance
      </li>
      {amenities.map((kind) => {
        const style = amenityStyles[kind]
        return (
          <li key={kind} className="flex items-center gap-2">
            <LegendMarker color={style.color}>
              <GlyphIcon name={kind} className="h-3 w-3" />
            </LegendMarker>
            {style.label}
          </li>
        )
      })}
      <li className="flex items-center gap-2">
        <LegendMarker color={colors.toilets}>
          <span className="display text-[8px]">WC</span>
        </LegendMarker>
        Toilets
      </li>
      <li className="flex items-center gap-2">
        <LegendMarker color={colors.exit} shape="square">
          <GlyphIcon name="exit" className="h-3 w-3" />
        </LegendMarker>
        Emergency exit
      </li>
    </ul>
  )
}

const Selection: React.FC<{
  standId: string | null
  exhibitor?: Exhibitor
}> = ({ standId, exhibitor }) => (
  <div
    role="status"
    aria-live="polite"
    className="flex min-h-[84px] items-center gap-4 rounded-2xl border-2 border-cnd-fog/40 bg-white p-4"
  >
    {exhibitor ? (
      <>
        <StandBadge id={exhibitor.stand.id} tier={exhibitor.tier} large />
        <span className="flex h-12 w-20 flex-shrink-0 items-center justify-center sm:w-28">
          <img
            src={exhibitor.sponsor.logo.publicURL}
            alt=""
            className="max-h-full max-w-full object-contain"
          />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold leading-snug text-cnd-midnight">
            {exhibitor.sponsor.title}
          </span>
          <span className="block text-xs uppercase tracking-widest text-cnd-ash">
            {styleOfTier(exhibitor.tier).label} · {exhibitor.zone}
          </span>
          <a
            href={exhibitor.sponsor.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${exhibitor.sponsor.title}'s website`}
            className="mt-1 inline-block text-sm font-semibold text-cnd-red hover:text-cnd-coral"
          >
            Website ↗
          </a>
        </span>
      </>
    ) : standId ? (
      <span className="text-sm text-cnd-slate">Stand {standId}</span>
    ) : (
      <span className="text-sm text-cnd-ash">
        Tap or hover over a stand to see who&apos;s there.
      </span>
    )}
  </div>
)

interface VenueMapProps {
  config: VenueMapConfig
  /** Loaded sponsors keyed by their id, e.g. "gold/aws" */
  sponsors: Record<string, SponsorData>
}

type DownloadFormat = "svg" | "pdf"

const Downloads: React.FC<VenueMapProps> = ({ config, sponsors }) => {
  const [preparing, setPreparing] = useState<DownloadFormat | null>(null)
  const [failed, setFailed] = useState(false)

  const download = async (format: DownloadFormat) => {
    setPreparing(format)
    setFailed(false)
    try {
      const file =
        format === "svg"
          ? new Blob([await mapSvg(config, sponsors, 1460)], {
              type: "image/svg+xml",
            })
          : await mapPdf(config, sponsors)
      saveFile(file, `cloud-native-denmark-2026-conference-map.${format}`)
    } catch {
      setFailed(true)
    } finally {
      setPreparing(null)
    }
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
      <span className="text-cnd-slate">Download the map:</span>
      {(["svg", "pdf"] as const).map((format) => (
        <button
          key={format}
          type="button"
          disabled={preparing !== null}
          onClick={() => download(format)}
          className="font-semibold text-cnd-red hover:text-cnd-coral disabled:text-cnd-ash"
        >
          {preparing === format ? "Preparing…" : `${format.toUpperCase()} ↓`}
        </button>
      ))}
      {failed && (
        <span role="alert" className="text-cnd-ash">
          Couldn&apos;t create the file. Please try again.
        </span>
      )}
    </div>
  )
}

const VenueMap: React.FC<VenueMapProps> = ({ config, sponsors }) => {
  const [hovered, setHovered] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const mapRef = useRef<HTMLDivElement | null>(null)
  const headingId = useId()
  const highlighted = hovered ?? selected

  const exhibitors: Exhibitor[] = config.stands.flatMap((stand) => {
    const sponsor = stand.sponsor ? sponsors[stand.sponsor] : undefined
    const shape = plan.stands[stand.id]
    return sponsor && shape
      ? [{ stand, sponsor, zone: shape.zone, tier: tierOf(stand) }]
      : []
  })

  const zones = Array.from(new Set(exhibitors.map((e) => e.zone))).map(
    (zone) => ({
      zone,
      exhibitors: exhibitors.filter((e) => e.zone === zone),
    })
  )

  const assignedTiers = new Set(
    config.stands.filter((stand) => stand.sponsor).map(tierOf)
  )
  const tiers = Object.keys(tierStyles).filter((tier) =>
    assignedTiers.has(tier)
  )

  const toggle = (id: string) =>
    setSelected((current) => (current === id ? null : id))

  const showOnMap = (id: string) => {
    toggle(id)
    const map = mapRef.current
    if (!map || selected === id) return
    const { top, bottom } = map.getBoundingClientRect()
    if (top < 80 || bottom > window.innerHeight) {
      const reduceMotion = window.matchMedia?.(
        "(prefers-reduced-motion: reduce)"
      ).matches
      map.scrollIntoView?.({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "center",
      })
    }
  }

  const planProps = {
    config,
    sponsors,
    highlighted,
    selected,
    onHover: setHovered,
    onToggle: toggle,
  }

  return (
    <div>
      <div
        ref={mapRef}
        className="-mx-4 border-y-2 border-cnd-fog/40 bg-white px-2 py-3 sm:mx-0 sm:rounded-3xl sm:border-2 sm:p-5"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(185,196,212,0.45) 1px, transparent 1.4px)",
          backgroundSize: "18px 18px",
        }}
      >
        <FloorPlan
          variant="full"
          className="hidden h-auto w-full md:block"
          {...planProps}
        />
        <FloorPlan
          variant="compact"
          className="mx-auto block h-auto w-full max-w-[520px] md:hidden"
          {...planProps}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-8">
        <Selection
          standId={highlighted}
          exhibitor={exhibitors.find((e) => e.stand.id === highlighted)}
        />
        <div className="px-1 lg:pt-2">
          <Legend tiers={tiers} />
          <p className="mt-3 text-xs text-cnd-ash">
            Schematic, not to scale. Stands are numbered in the order you pass
            them from the entrance.
          </p>
          <Downloads config={config} sponsors={sponsors} />
        </div>
      </div>

      <section aria-labelledby={headingId} className="mt-12">
        <h2
          id={headingId}
          className="display text-cnd-midnight"
          style={{
            fontSize: "clamp(24px, 3vw, 32px)",
            letterSpacing: "-0.03em",
          }}
        >
          Exhibitors
        </h2>
        <div className="mt-6 space-y-8">
          {zones.map(({ zone, exhibitors: inZone }) => (
            <div key={zone}>
              <h3
                className="eyebrow mb-3 text-cnd-ash"
                style={{ letterSpacing: "0.2em" }}
              >
                {zone} · Stands {inZone[0].stand.id}
                {inZone.length > 1
                  ? `–${inZone[inZone.length - 1].stand.id}`
                  : ""}
              </h3>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {inZone.map(({ stand, sponsor, tier }) => {
                  const active = highlighted === stand.id
                  const label = styleOfTier(tier).label
                  return (
                    <li
                      key={stand.id}
                      data-active={active}
                      className={`flex items-stretch overflow-hidden rounded-2xl border-2 bg-white transition-colors ${
                        active
                          ? "border-cnd-midnight"
                          : "border-cnd-fog/40 hover:border-cnd-midnight/60"
                      }`}
                    >
                      <button
                        type="button"
                        aria-label={`Stand ${stand.id}: ${sponsor.title}, ${label}`}
                        aria-pressed={selected === stand.id}
                        onMouseEnter={() => setHovered(stand.id)}
                        onMouseLeave={() => setHovered(null)}
                        onFocus={() => setHovered(stand.id)}
                        onBlur={() => setHovered(null)}
                        onClick={() => showOnMap(stand.id)}
                        className="flex min-w-0 flex-1 items-center gap-3 p-3 text-left focus-visible:outline-none"
                      >
                        <StandBadge id={stand.id} tier={tier} />
                        <span className="flex h-12 w-24 flex-shrink-0 items-center justify-center">
                          <img
                            src={sponsor.logo.publicURL}
                            alt=""
                            className="max-h-full max-w-full object-contain"
                            loading="lazy"
                          />
                        </span>
                        <span className="min-w-0">
                          <span className="line-clamp-2 block font-semibold leading-snug text-cnd-midnight">
                            {sponsor.title}
                          </span>
                          <span className="block text-xs uppercase tracking-widest text-cnd-ash">
                            {label}
                          </span>
                        </span>
                      </button>
                      <a
                        href={sponsor.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit ${sponsor.title}'s website`}
                        className="flex items-center border-l-2 border-cnd-fog/30 px-3 text-cnd-ash transition-colors hover:text-cnd-red"
                      >
                        ↗
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default VenueMap
