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
const contactEmail = "contact@cloudnativedenmark.dk"

const actions = [
  {
    label: "Give feedback",
    detail: "Two minutes that shape CND/2027.",
    href: feedbackUrl,
    external: true,
  },
  {
    label: "📷 Photo gallery",
    detail: "Find yourself in the CND/2026 photos.",
    href: photosUrl,
    external: true,
  },
  {
    label: "CND/2026 website",
    detail: "Schedule, speakers and slides, archived.",
    href: siteConfig.previousEditionUrl,
    external: true,
  },
  {
    label: "Contact us",
    detail: contactEmail,
    href: `mailto:${contactEmail}`,
    external: false,
  },
]

const externalProps = { target: "_blank", rel: "noopener noreferrer" }

const IndexPage: React.FC = () => {
  const location = useLocation()

  return (
    <>
      <SEOHead title="Thank you, CND/2026" pathname={location.pathname} />
      <section
        className="cnd-hero relative w-full overflow-hidden bg-cnd-sand text-cnd-midnight"
        aria-labelledby="thank-you"
      >
        <div className="cnd-top-rule" />
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

        <div className="relative z-10 mx-auto max-w-[1280px] px-6 pt-14 pb-20 lg:px-12 lg:pt-20 lg:pb-24">
          <div
            className="eyebrow cnd-rise cnd-rise-1 mb-6 text-cnd-red"
            style={{ letterSpacing: "0.18em" }}
          >
            CND/2026 · COPENHAGEN · 19–20 NOV
          </div>
          <h1
            id="thank-you"
            className="display cnd-rise cnd-rise-2 text-cnd-midnight"
            style={{
              fontSize: "clamp(56px, 12vw, 192px)",
              lineHeight: 0.86,
              letterSpacing: "-0.06em",
              margin: 0,
            }}
          >
            THANK
            <br />
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
            className="cnd-rise cnd-rise-3 mt-8 max-w-xl text-cnd-slate"
            style={{
              fontSize: "clamp(17px, 1.4vw, 20px)",
              lineHeight: 1.55,
              fontWeight: 500,
            }}
          >
            To every attendee, speaker, sponsor and volunteer: thank you for
            making Cloud Native Denmark 2026. Let&apos;s do it again.
          </p>

          <div className="cnd-rise cnd-rise-4 mt-12 grid max-w-5xl gap-6 lg:grid-cols-[1.1fr_1fr]">
            <div className="relative flex flex-col rounded-2xl bg-cnd-midnight p-8 text-white shadow-[0_18px_40px_rgba(11,30,63,0.28)]">
              <span
                className="eyebrow absolute -top-3 left-8 flex items-center gap-2.5 rounded-full bg-cnd-red px-3.5 py-1.5 text-white shadow-[0_6px_16px_rgba(224,19,42,0.35)]"
                style={{ fontSize: 10, letterSpacing: "0.2em" }}
              >
                <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-white motion-safe:animate-ping" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
                </span>
                LIMITED DROP
              </span>
              <div
                className="eyebrow mt-2"
                style={{ color: "var(--color-cnd-coral)" }}
              >
                ANNOUNCING CND/2027 · 16–18 NOV 2027
              </div>
              <h2
                className="display mt-3"
                style={{ fontSize: 28, letterSpacing: "-0.02em" }}
              >
                Early Blind Bird tickets
              </h2>
              <div className="mt-4 flex items-baseline gap-2">
                <span
                  className="display"
                  style={{ fontSize: 64, letterSpacing: "-0.03em" }}
                >
                  999
                </span>
                <span className="eyebrow text-cnd-fog">DKK</span>
              </div>
              <p className="mt-2 text-sm text-cnd-fog">
                Venue and speakers to be announced. Includes 25% VAT;
                Ticketbutler fee added at checkout.
              </p>
              {features.ticketSales ? (
                <a
                  href={earlyBlindBirdUrl}
                  {...externalProps}
                  className={`btn-pill mt-8 self-start ${buttonVariants.primary}`}
                >
                  Get Early Blind Bird →
                </a>
              ) : (
                <p className="eyebrow mt-8 text-cnd-fog">SOLD OUT</p>
              )}
            </div>

            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {actions.map((action) => (
                <li key={action.label}>
                  <a
                    href={action.href}
                    {...(action.external ? externalProps : {})}
                    className="group flex h-full items-center justify-between gap-4 rounded-2xl border-[1.5px] border-cnd-midnight/15 bg-white/80 px-5 py-4 transition-colors hover:border-cnd-red"
                  >
                    <span>
                      <span className="block font-semibold text-cnd-midnight">
                        {action.label}
                      </span>
                      <span className="block text-sm text-cnd-ash">
                        {action.detail}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-cnd-red transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}

export default IndexPage
