import React from "react"
import { Link } from "react-router-dom"
import Button from "../ui/button"
import CNDShape from "../ui/cnd-shape"

interface HeroAction {
  text: string
  href?: string
  isExternal?: boolean
  variant?: "primary" | "secondary" | "ghost" | "light" | "midnight"
  onClick?: () => void
}

interface HeroSectionProps {
  logo?: {
    src: string
    alt: string
    width?: number
    height?: number | string
  }
  title: string | React.ReactNode
  subtitle?: string
  description?: string
  actions?: HeroAction[]
  /**
   * Eyebrow above the headline.
   */
  eyebrow?: string
  /**
   * Big date display block — shown as a prominent stamp in the hero.
   */
  dateStamp?: {
    label?: string
    dates: string
    venue?: string
  }
  /**
   * Optional callout block under the headline, e.g. CFP teaser.
   */
  callout?: {
    label: string
    title: string
    body?: string
  }
  /**
   * Bottom-right detail beneath the action buttons.
   */
  detail?: string
  /**
   * Kept for backwards compatibility — ignored in the new design.
   */
  backgroundElement?: React.ReactNode
}

const renderAction = (action: HeroAction, index: number) => {
  const button = (
    <Button variant={action.variant ?? "primary"} onClick={action.onClick}>
      {action.text}
    </Button>
  )
  if (action.onClick) {
    return <React.Fragment key={index}>{button}</React.Fragment>
  }
  if (!action.href) return null
  if (action.isExternal) {
    return (
      <a
        key={index}
        href={action.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {button}
      </a>
    )
  }
  return (
    <Link key={index} to={action.href}>
      {button}
    </Link>
  )
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  description,
  actions,
  eyebrow,
  callout,
  detail,
  dateStamp,
}) => {
  return (
    <section
      className="cnd-hero relative w-full overflow-hidden bg-cnd-sand text-cnd-midnight"
      aria-label="Cloud Native Denmark hero"
    >
      {/* Top red rule — design system signature */}
      <div className="cnd-top-rule" />

      {/* Giant CND shape watermark, top-right — Danish red */}
      <div
        className="pointer-events-none absolute hidden sm:block"
        style={{
          top: "-22%",
          right: "-26%",
          width: "min(70vw, 880px)",
          filter: "drop-shadow(0 30px 60px rgba(224,19,42,0.18))",
        }}
        aria-hidden="true"
      >
        <CNDShape
          size={880}
          fill="var(--color-cnd-red)"
          style={{ width: "100%", height: "auto" }}
        />
      </div>

      {/* Second shape watermark, bottom-left — midnight */}
      <div
        className="pointer-events-none absolute hidden md:block"
        style={{
          bottom: "-32%",
          left: "-18%",
          width: "min(40vw, 460px)",
          opacity: 0.92,
        }}
        aria-hidden="true"
      >
        <CNDShape
          size={460}
          fill="var(--color-cnd-midnight)"
          style={{ width: "100%", height: "auto" }}
        />
      </div>

      {/* Content layer */}
      <div className="relative z-10 mx-auto max-w-[1280px] px-6 pt-16 pb-20 lg:px-12 lg:pt-24 lg:pb-28">
        {/* Eyebrow */}
        {(eyebrow || subtitle) && (
          <div
            className="eyebrow cnd-rise cnd-rise-1 mb-6 text-cnd-red"
            style={{ letterSpacing: "0.18em" }}
          >
            {eyebrow ?? subtitle}
          </div>
        )}

        {/* Oversized stroked wordmark */}
        <h1
          className="display cnd-rise cnd-rise-2 text-cnd-midnight"
          style={{
            fontSize: "clamp(64px, 15vw, 240px)",
            lineHeight: 0.84,
            letterSpacing: "-0.06em",
            margin: 0,
          }}
        >
          {title}
        </h1>

        {/* Inline date / venue stamp under the wordmark */}
        {dateStamp && (
          <div className="cnd-rise cnd-rise-3 mt-7 flex flex-wrap items-center gap-x-5 gap-y-2">
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-2.5 rounded-full bg-cnd-red"
            />
            <span
              className="display text-cnd-midnight"
              style={{
                fontSize: "clamp(22px, 2.4vw, 32px)",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              {dateStamp.dates}
            </span>
            {dateStamp.venue && (
              <>
                <span
                  aria-hidden="true"
                  className="hidden h-px w-8 bg-cnd-midnight/30 sm:block"
                />
                <span
                  className="text-cnd-slate"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                  }}
                >
                  {dateStamp.venue}
                </span>
              </>
            )}
          </div>
        )}

        {/* Description */}
        {description && (
          <p
            className="cnd-rise cnd-rise-3 mt-8 max-w-xl text-cnd-slate"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(16px, 1.3vw, 19px)",
              lineHeight: 1.55,
              fontWeight: 500,
            }}
          >
            {description}
          </p>
        )}

        {/* Optional callout block */}
        {callout && (
          <div
            className="cnd-rise cnd-rise-3 mt-10 max-w-md rounded-xl bg-cnd-midnight p-6 text-white shadow-[0_18px_40px_rgba(11,30,63,0.22)]"
            style={{ borderRadius: 14 }}
          >
            <div
              className="eyebrow mb-2"
              style={{ color: "var(--color-cnd-coral)" }}
            >
              {callout.label}
            </div>
            <div
              className="display"
              style={{
                fontSize: 22,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              {callout.title}
            </div>
            {callout.body && (
              <p
                className="mt-3 text-cnd-fog"
                style={{ fontSize: 14, lineHeight: 1.5 }}
              >
                {callout.body}
              </p>
            )}
          </div>
        )}

        {/* Action row */}
        {actions && actions.length > 0 && (
          <div className="cnd-rise cnd-rise-4 mt-10 flex flex-wrap items-center gap-3">
            {actions.map(renderAction)}
            {detail && (
              <span
                className="eyebrow ml-2 text-cnd-ash"
                style={{ letterSpacing: "0.16em" }}
              >
                {detail}
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default HeroSection
