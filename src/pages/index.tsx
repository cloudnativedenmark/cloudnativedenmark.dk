import React from "react"
import { useLocation } from "react-router-dom"
import SEOHead from "../components/seo-head"
import CNDShape from "../components/ui/cnd-shape"
import { buttonVariants } from "../components/ui/button"
import { siteConfig } from "../config/site"
import { features } from "../config/features"

const earlyBlindBirdUrl =
  "https://cloudnativedenmark.ticketbutler.io/en/e/cloud-native-denmark-2027/"
const feedbackUrl = "https://forms.gle/4XVnmNoEa5koLV238"
const photosUrl = "https://www.picdrop.com/kim-yennguyen/PtE1CyXcQm"

const actions = [
  {
    label: "CND/2026 website",
    detail: "Schedule, speakers and slides.",
    href: siteConfig.previousEditionUrl,
  },
  {
    label: "Give feedback",
    detail: "Tell us how CND/2026 went.",
    href: feedbackUrl,
  },
  {
    label: "Photo gallery",
    emoji: "📷",
    detail: "Find yourself in the photos.",
    href: photosUrl,
  },
]

const externalProps = { target: "_blank", rel: "noopener noreferrer" }

const ExternalIcon = () => (
  <svg
    width={20}
    height={20}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
)

const IndexPage: React.FC = () => {
  const location = useLocation()

  return (
    <>
      <SEOHead title="Thank you, CND/2026" pathname={location.pathname} />
      <section
        className="cnd-hero relative flex min-h-[calc(100svh-var(--site-header-height,84px))] w-full flex-col justify-center overflow-hidden bg-cnd-sand text-cnd-midnight"
        aria-labelledby="thank-you"
      >
        <div className="cnd-top-rule" />
        <div
          className="pointer-events-none absolute hidden lg:block"
          style={{
            top: "-30%",
            right: "-22%",
            width: "min(60vw, 820px)",
            filter: "drop-shadow(0 30px 60px rgba(224,19,42,0.18))",
          }}
          aria-hidden="true"
        >
          <CNDShape
            size={820}
            fill="var(--color-cnd-red)"
            style={{ width: "100%", height: "auto" }}
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 pt-8 pb-12 lg:px-12 lg:pt-14 lg:pb-16">
          <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-12">
            <div>
              <div
                className="eyebrow cnd-rise cnd-rise-1 mb-4 text-cnd-red"
                style={{ letterSpacing: "0.18em" }}
              >
                CND/2026 · COPENHAGEN · 19–20 NOV
              </div>
              <h1
                id="thank-you"
                className="display cnd-rise cnd-rise-2 text-cnd-midnight"
                style={{
                  fontSize: "clamp(52px, 9vw, 136px)",
                  lineHeight: 0.88,
                  letterSpacing: "-0.06em",
                  margin: 0,
                }}
              >
                THANK{" "}
                <span
                  style={{
                    WebkitTextStroke: "3px var(--color-cnd-midnight)",
                    color: "transparent",
                  }}
                >
                  YOU.
                </span>
              </h1>
              <p
                className="cnd-rise cnd-rise-3 mt-5 max-w-xl text-cnd-slate"
                style={{
                  fontSize: "clamp(16px, 1.3vw, 19px)",
                  lineHeight: 1.5,
                  fontWeight: 500,
                }}
              >
                To every attendee, speaker, sponsor and volunteer: thank you for
                making Cloud Native Denmark 2026. Let&apos;s do it again in
                2027.
              </p>
            </div>

            <div className="cnd-rise cnd-rise-3 relative flex flex-col rounded-2xl bg-cnd-midnight p-6 text-white shadow-[0_18px_40px_rgba(11,30,63,0.28)] lg:p-8">
              {features.ticketSales && (
                <span
                  className="eyebrow absolute -top-3 left-6 flex items-center gap-2.5 rounded-full bg-cnd-red px-3.5 py-1.5 text-white shadow-[0_6px_16px_rgba(224,19,42,0.35)] lg:left-8"
                  style={{ fontSize: 10, letterSpacing: "0.2em" }}
                >
                  <span
                    className="relative flex h-2.5 w-2.5"
                    aria-hidden="true"
                  >
                    <span className="absolute inline-flex h-full w-full rounded-full bg-white motion-safe:animate-ping" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
                  </span>
                  LIMITED DROP
                </span>
              )}
              <div
                className="eyebrow mt-2"
                style={{ color: "var(--color-cnd-coral)" }}
              >
                ANNOUNCING CND/2027
              </div>
              <h2
                className="display mt-2"
                style={{ fontSize: 26, letterSpacing: "-0.02em" }}
              >
                Early Blind Bird tickets
              </h2>
              <div className="mt-2 flex items-baseline gap-2">
                <span
                  className="display"
                  style={{ fontSize: 56, letterSpacing: "-0.03em" }}
                >
                  999
                </span>
                <span className="eyebrow text-cnd-fog">DKK</span>
              </div>
              <p className="mt-1 text-sm text-cnd-fog">
                Includes 25% VAT; Ticketbutler fee added at checkout.
              </p>
              {features.ticketSales ? (
                <a
                  href={earlyBlindBirdUrl}
                  {...externalProps}
                  className={`btn-pill mt-6 self-start ${buttonVariants.primary}`}
                >
                  Get Early Blind Bird →
                </a>
              ) : (
                <p className="eyebrow mt-6 text-cnd-fog">SOLD OUT</p>
              )}
            </div>
          </div>

          <ul className="cnd-rise cnd-rise-4 mt-8 grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-3 lg:mt-10">
            {actions.map((action) => (
              <li key={action.label} className="min-w-0">
                <a
                  href={action.href}
                  {...externalProps}
                  className="group flex h-full items-center justify-between gap-4 rounded-2xl border-[1.5px] border-cnd-midnight/15 bg-white px-5 py-4 transition-colors hover:border-cnd-red"
                >
                  <span className="min-w-0">
                    <span className="block font-semibold text-cnd-midnight">
                      {action.emoji && (
                        <span aria-hidden="true">{action.emoji} </span>
                      )}
                      {action.label}
                      <span className="sr-only"> (opens in new tab)</span>
                    </span>
                    <span className="block break-words text-sm text-cnd-slate">
                      {action.detail}
                    </span>
                  </span>
                  <span className="shrink-0 text-cnd-red transition-transform group-hover:-translate-y-0.5">
                    <ExternalIcon />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

export default IndexPage
