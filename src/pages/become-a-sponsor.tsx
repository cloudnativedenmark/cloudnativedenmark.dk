import React from "react"
import { useLocation } from "react-router-dom"
import SEOHead from "../components/seo-head"
import PageHeader from "../components/layout/page-header"
import Section from "../components/ui/section"
import Button from "../components/ui/button"
import CNDShape from "../components/ui/cnd-shape"

type TierType = "platinum" | "gold" | "bronze" | "community"

interface SponsorTier {
  name: string
  tier: TierType
  price: string
  description: string
  highlights: string[]
  availability?: string
  addons?: string[]
}

interface TierTheme {
  ring: string
  fill: string
  bandBg: string
  bandText: string
  priceText: string
  shapeFill: string
  cardBg: string
  cardBorder: string
}

const tierThemes: Record<TierType, TierTheme> = {
  platinum: {
    ring: "border-cnd-red",
    fill: "bg-cnd-red",
    bandBg: "bg-cnd-red",
    bandText: "text-white",
    priceText: "text-white",
    shapeFill: "var(--color-cnd-red)",
    cardBg: "bg-white",
    cardBorder: "border-cnd-red",
  },
  gold: {
    ring: "border-cnd-amber",
    fill: "bg-cnd-amber",
    bandBg: "bg-cnd-amber",
    bandText: "text-cnd-midnight",
    priceText: "text-cnd-midnight",
    shapeFill: "var(--color-cnd-amber)",
    cardBg: "bg-white",
    cardBorder: "border-cnd-amber/70",
  },
  bronze: {
    ring: "border-cnd-coral",
    fill: "bg-cnd-coral",
    bandBg: "bg-cnd-coral",
    bandText: "text-cnd-midnight",
    priceText: "text-cnd-midnight",
    shapeFill: "var(--color-cnd-coral)",
    cardBg: "bg-white",
    cardBorder: "border-cnd-coral/70",
  },
  community: {
    ring: "border-cnd-electric",
    fill: "bg-cnd-electric",
    bandBg: "bg-cnd-electric",
    bandText: "text-white",
    priceText: "text-white",
    shapeFill: "var(--color-cnd-electric)",
    cardBg: "bg-white",
    cardBorder: "border-cnd-electric/70",
  },
}

const sponsorTiers: SponsorTier[] = [
  {
    name: "Platinum",
    tier: "platinum",
    price: "180,000 DKK",
    description:
      "Platinum sponsors are the ones contributing the most to the conference. They represent companies for which Cloud Native approach is central in the way they implement their activity.",
    highlights: [
      "Extra Large booth*",
      "6 tickets",
      "15 minute keynote presentation",
      "30% discount for guests (10 tickets)**",
      "Lead scanner app",
      "Branding on swag and marketing material",
    ],
    addons: [
      "20,000 DKK: Promotion at the after party",
      "20,000 DKK: Logo on lanyard",
    ],
    availability: "Limited to 2 sponsorships or 1 sponsorship with 300,000 DKK",
  },
  {
    name: "Gold",
    tier: "gold",
    price: "100,000 DKK",
    description:
      "Gold sponsors form the backbone of the conference backers. They represent companies that believe strongly in the Cloud Native movement and have the financial means and the willingness to support it. Gold sponsors will be offered very high visibility during and after the event: a large sized booth, 2 minutes presentation during the keynote, and extended branding both onsite and offsite.",
    highlights: [
      "Large booth*",
      "4 tickets",
      "2 minutes keynote presence",
      "30% discount for guests (10 tickets)**",
      "Lead scanner app",
      "Branding on swag and marketing material",
    ],
    addons: ["20,000 DKK: Logo on lanyard"],
    availability: "Limited to 4 sponsorships",
  },
  {
    name: "Bronze",
    tier: "bronze",
    price: "65,000 DKK",
    description:
      "Bronze sponsors are important contributors to the conference. They represent companies who believe in cloud native technologies and experience daily their benefits for their software and platforms. Bronze sponsors will be offered strong visibility during the event: regular sized booth, branding onsite on common areas and welcome banner, keynote mention, logo on the website.",
    highlights: [
      "Regular booth*",
      "2 tickets",
      "30% discount for guests (4 tickets)**",
      "Lead scanner app",
      "Branding on marketing material",
    ],
    addons: ["20,000 DKK: Logo on lanyard"],
    availability: "Limited to 5 sponsorships",
  },
  {
    name: "Community",
    tier: "community",
    price: "15,000 DKK",
    description:
      "Community partners, such as cloud native project maintainers, tech community leaders in Open Source, DevOps, or Cloud Native technologies, and Open Source Evangelists, play a unique role as central contributors to our Cloud Native Denmark event. They have the opportunity to contribute to our community zone in a dedicated area of the venue.",
    highlights: [
      "5 tickets",
      "Keynote mention",
      "Branding in common areas and logo on website",
    ],
  },
]

const benefits = [
  {
    title: "Brand visibility",
    body: "Reach highly engaged developers, system engineers, architects & technical leaders. Your brand will be seen by decision-makers who influence technology choices at their organizations.",
    accent: "var(--color-cnd-red)",
  },
  {
    title: "Talent recruitment",
    body: "Access a concentrated pool of skilled cloud-native professionals. The conference is an ideal venue to showcase your company culture and attract top engineering talent.",
    accent: "var(--color-cnd-coral)",
  },
  {
    title: "Lead generation",
    body: "Connect directly with potential customers through booth interactions, lead scanner apps, and networking opportunities. Build relationships that convert to business.",
    accent: "var(--color-cnd-amber)",
  },
  {
    title: "Community leadership",
    body: "Demonstrate your commitment to the cloud-native ecosystem. Establish your brand as a thought leader and trusted partner in the community.",
    accent: "var(--color-cnd-electric)",
  },
]

const stats = [
  { n: "~500", l: "Attendees", color: "var(--color-cnd-red)" },
  { n: "50+", l: "Speakers", color: "var(--color-cnd-coral)" },
  { n: "30+", l: "Sessions", color: "var(--color-cnd-amber)" },
  { n: "3", l: "Tracks", color: "var(--color-cnd-electric)" },
  { n: "2", l: "Days", color: "var(--color-cnd-harbor)" },
]

const BecomeASponsorPage: React.FC = () => {
  const location = useLocation()

  return (
    <>
      <SEOHead title="Become a Sponsor" pathname={location.pathname} />

      <PageHeader
        eyebrow="BECOME A SPONSOR"
        title="Partner with us."
        description="Connect with 500+ developers, engineers, and technical leaders at Copenhagen's premier Kubernetes and cloud-native conference."
        variant="dark"
        size="large"
      />

      {/* Intro CTAs */}
      <Section className="bg-cnd-bone py-12 lg:py-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <a href="mailto:sponsor@cloudnativedenmark.dk">
              <Button>Get in touch →</Button>
            </a>
            <a
              href="https://www.canva.com/design/DAG18lTHcrM/RZGm8CHGviE7ZRUBsupWOA/edit"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="midnight">View prospectus</Button>
            </a>
          </div>
          <div
            className="eyebrow mt-6 text-cnd-ash"
            style={{ letterSpacing: "0.18em" }}
          >
            NOVEMBER 19–20, 2026 · SCANDIC COPENHAGEN
          </div>
        </div>
      </Section>

      {/* Stats */}
      <Section className="bg-cnd-bone py-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {stats.map((s, i) => (
              <div
                key={s.l}
                className={`rounded-2xl border-2 border-cnd-fog/40 bg-white p-6 text-center transition-transform hover:-translate-y-1 ${
                  i === stats.length - 1 ? "col-span-2 md:col-span-1" : ""
                }`}
              >
                <p
                  className="display"
                  style={{
                    fontSize: 36,
                    color: s.color,
                    letterSpacing: "-0.025em",
                    lineHeight: 1,
                  }}
                >
                  {s.n}
                </p>
                <p
                  className="eyebrow mt-3 text-cnd-ash"
                  style={{ letterSpacing: "0.18em" }}
                >
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Why Sponsor */}
      <Section className="relative overflow-hidden bg-cnd-midnight py-20 text-white hex-bg">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute hidden md:block"
          style={{ top: 40, right: 40, opacity: 0.18 }}
        >
          <CNDShape size={140} fill="var(--color-cnd-coral)" />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute hidden md:block"
          style={{ bottom: 40, left: 40, opacity: 0.14 }}
        >
          <CNDShape size={110} fill="var(--color-cnd-amber)" />
        </div>
        <div className="relative mx-auto max-w-5xl">
          <div className="text-center">
            <div
              className="eyebrow mb-3"
              style={{ color: "var(--color-cnd-coral)" }}
            >
              WHY SPONSOR
            </div>
            <h2
              className="display"
              style={{
                fontSize: "clamp(32px, 5vw, 52px)",
                letterSpacing: "-0.035em",
              }}
            >
              Position your brand
              <br />
              at the front.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-cnd-fog text-lg">
              The Nordic cloud-native scene gathers in Copenhagen — meet the
              people building it.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {benefits.map((b, i) => (
              <div
                key={b.title}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm transition-transform hover:-translate-y-1"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-full w-1.5"
                  style={{ background: b.accent }}
                />
                <div
                  className="eyebrow mb-3"
                  style={{ color: b.accent, letterSpacing: "0.2em" }}
                >
                  0{i + 1}
                </div>
                <h3
                  className="display text-white"
                  style={{ fontSize: 22, letterSpacing: "-0.02em" }}
                >
                  {b.title}.
                </h3>
                <p
                  className="mt-3 text-cnd-fog"
                  style={{ fontSize: 15, lineHeight: 1.6 }}
                >
                  {b.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Sponsorship Packages */}
      <Section className="bg-cnd-bone py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <div
              className="eyebrow mb-3"
              style={{ color: "var(--color-cnd-red)" }}
            >
              PACKAGES
            </div>
            <h2
              className="display text-cnd-midnight"
              style={{
                fontSize: "clamp(32px, 5vw, 52px)",
                letterSpacing: "-0.035em",
              }}
            >
              Pick your tier.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-cnd-slate text-lg">
              Four packages, sliding visibility, every level of involvement.
              Booths, tickets, talks — choose what fits.
            </p>
          </div>

          <div className="mt-12 space-y-6">
            {sponsorTiers.map((tier) => {
              const t = tierThemes[tier.tier]
              return (
                <div
                  key={tier.name}
                  className={`relative overflow-hidden rounded-2xl border-2 ${t.cardBorder} ${t.cardBg} shadow-[0_18px_40px_rgba(11,30,63,0.06)] transition-transform hover:-translate-y-0.5`}
                >
                  {/* Decorative shape */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute hidden md:block"
                    style={{
                      top: -10,
                      right: -20,
                      opacity: 0.18,
                    }}
                  >
                    <CNDShape size={120} fill={t.shapeFill} />
                  </div>

                  <div
                    className={`relative ${t.bandBg} ${t.bandText} flex flex-col gap-2 px-6 py-5 sm:flex-row sm:items-center sm:justify-between`}
                  >
                    <div className="flex items-baseline gap-3">
                      <span
                        className="eyebrow"
                        style={{
                          letterSpacing: "0.22em",
                          opacity: 0.85,
                        }}
                      >
                        TIER · {tier.tier.toUpperCase()}
                      </span>
                      <h3
                        className="display"
                        style={{
                          fontSize: 28,
                          letterSpacing: "-0.025em",
                        }}
                      >
                        {tier.name}.
                      </h3>
                    </div>
                    <span
                      className={`display ${t.priceText}`}
                      style={{
                        fontSize: 28,
                        letterSpacing: "-0.025em",
                      }}
                    >
                      {tier.price}
                      <span
                        className="ml-1 text-base opacity-80"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        *
                      </span>
                    </span>
                  </div>
                  <div className="relative px-6 py-7 sm:px-8">
                    <p
                      className="text-cnd-slate"
                      style={{ fontSize: 15.5, lineHeight: 1.6 }}
                    >
                      {tier.description}
                    </p>

                    <div className="mt-7 grid gap-7 sm:grid-cols-2">
                      <div>
                        <div
                          className="eyebrow mb-3"
                          style={{
                            color: "var(--color-cnd-ash)",
                            letterSpacing: "0.22em",
                          }}
                        >
                          WHAT'S INCLUDED
                        </div>
                        <ul className="space-y-2">
                          {tier.highlights.map((highlight, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-3 text-cnd-slate"
                            >
                              <span
                                aria-hidden="true"
                                className={`mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${t.fill} text-white`}
                                style={{ fontSize: 11 }}
                              >
                                ✓
                              </span>
                              <span style={{ fontSize: 15 }}>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {tier.addons && tier.addons.length > 0 && (
                        <div>
                          <div
                            className="eyebrow mb-3"
                            style={{
                              color: "var(--color-cnd-ash)",
                              letterSpacing: "0.22em",
                            }}
                          >
                            OPTIONAL ADD-ONS
                          </div>
                          <ul className="space-y-2">
                            {tier.addons.map((addon, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-3 text-cnd-slate"
                              >
                                <span
                                  aria-hidden="true"
                                  className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-cnd-amber text-cnd-midnight font-bold"
                                  style={{ fontSize: 13 }}
                                >
                                  +
                                </span>
                                <span style={{ fontSize: 15 }}>{addon}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {tier.availability && (
                      <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-cnd-coral/15 px-4 py-2">
                        <span
                          aria-hidden="true"
                          className="inline-block h-1.5 w-1.5 rounded-full bg-cnd-coral"
                        />
                        <span
                          className="eyebrow text-cnd-coral"
                          style={{
                            fontSize: 11,
                            letterSpacing: "0.18em",
                            color: "var(--color-cnd-red)",
                          }}
                        >
                          {tier.availability}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-10 space-y-1 text-center text-sm italic text-cnd-ash">
            <p>*Prices exclude 25% VAT. Booths include standard furniture.</p>
            <p>
              **Subject to general availability of event tickets (if the event
              is sold out, the discount codes become invalid).
            </p>
          </div>

          {/* Final CTA */}
          <div className="mt-14 flex flex-col items-center gap-4 rounded-2xl bg-cnd-midnight p-10 text-center text-white">
            <div
              className="eyebrow"
              style={{
                color: "var(--color-cnd-coral)",
                letterSpacing: "0.22em",
              }}
            >
              READY TO TALK?
            </div>
            <h3
              className="display"
              style={{ fontSize: 32, letterSpacing: "-0.03em" }}
            >
              Let's build CND/2026 together.
            </h3>
            <p className="max-w-xl text-cnd-fog">
              Reach out and we'll send the latest prospectus and reserve your
              tier.
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              <a href="mailto:sponsor@cloudnativedenmark.dk">
                <Button>Get in touch →</Button>
              </a>
              <a
                href="https://www.canva.com/design/DAG18lTHcrM/RZGm8CHGviE7ZRUBsupWOA/edit"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost">View prospectus</Button>
              </a>
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}

export default BecomeASponsorPage
