import React from "react"
import { useLocation } from "react-router-dom"
import SEOHead from "../components/seo-head"
import PageHeader from "../components/layout/page-header"
import Section from "../components/ui/section"
import CNDShape from "../components/ui/cnd-shape"
import Button from "../components/ui/button"

interface FeatureStat {
  value: string
  label: string
  body: string
  color: string
}

const featureStats: FeatureStat[] = [
  {
    value: "500",
    label: "Attendees",
    body: "Room for the entire community",
    color: "var(--color-cnd-red)",
  },
  {
    value: "2",
    label: "Conference tracks",
    body: "Parallel sessions to choose from",
    color: "var(--color-cnd-coral)",
  },
  {
    value: "1",
    label: "Exhibition area",
    body: "Meet sponsors outside the auditoriums",
    color: "var(--color-cnd-amber)",
  },
]

interface SpaceCard {
  src: string
  alt: string
  title: string
  body: string
  accent: string
}

const spaces: SpaceCard[] = [
  {
    src: "/images/scandic-copenhagen/auditorium.webp",
    alt: "Main auditorium",
    title: "Main auditorium",
    body: "Primary stage for keynotes and main track sessions.",
    accent: "var(--color-cnd-red)",
  },
  {
    src: "/images/scandic-copenhagen/hall-1.webp",
    alt: "Conference hall",
    title: "Conference hall",
    body: "Second-track sessions and workshops.",
    accent: "var(--color-cnd-coral)",
  },
  {
    src: "/images/scandic-copenhagen/hall-2.webp",
    alt: "Break-out session room",
    title: "Exhibition area",
    body: "Meet sponsors and network with fellow attendees.",
    accent: "var(--color-cnd-electric)",
  },
  {
    src: "/images/scandic-copenhagen/restaurant.jpg",
    alt: "Restaurant area",
    title: "Restaurant & lounge",
    body: "Lunch, refreshments, and networking breaks.",
    accent: "var(--color-cnd-amber)",
  },
]

const VenuePage: React.FC = () => {
  const location = useLocation()

  return (
    <>
      <SEOHead
        title="Venue"
        description="Cloud Native Denmark 2026 takes place at Scandic Copenhagen — a modern venue in the heart of Copenhagen with capacity for 500 attendees."
        pathname={location.pathname}
      />
      <PageHeader
        eyebrow="VENUE"
        title="Where we land."
        description="In the heart of Copenhagen, a five-minute walk from Central Station."
        variant="dark"
        size="large"
      />

      {/* Venue Overview */}
      <Section className="relative overflow-hidden bg-cnd-bone py-16 lg:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute hidden md:block"
          style={{ top: 40, right: 40, opacity: 0.45 }}
        >
          <CNDShape size={120} fill="var(--color-cnd-coral)" />
        </div>
        <div className="relative mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col items-center gap-8 md:flex-row md:gap-12">
            <div className="relative flex-shrink-0 w-full md:w-2/5">
              <div
                aria-hidden="true"
                className="absolute -inset-3 rounded-3xl bg-cnd-red opacity-90"
                style={{ transform: "rotate(-1.6deg)" }}
              />
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src="/images/scandic-copenhagen/hotel-outside-2.jpg"
                  alt="Scandic Copenhagen exterior"
                  className="w-full h-80 md:h-[28rem] object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <div
                className="eyebrow mb-3"
                style={{
                  color: "var(--color-cnd-red)",
                  letterSpacing: "0.22em",
                }}
              >
                THE VENUE
              </div>
              <img
                src="/images/scandic-logo.png"
                alt="Scandic"
                className="h-12 md:h-14 mb-5 object-contain mx-auto md:mx-0"
                loading="lazy"
              />
              <h2
                className="display text-cnd-midnight"
                style={{
                  fontSize: "clamp(28px, 3.6vw, 44px)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.05,
                }}
              >
                Scandic Copenhagen.
              </h2>
              <p
                className="mt-5 text-cnd-slate"
                style={{ fontSize: 18, lineHeight: 1.6 }}
              >
                The event takes over the large auditoriums of Scandic
                Copenhagen, with room for all 500 attendees. The venue hosts
                attendees and sponsors together, with separate auditoriums for
                break-out sessions.
              </p>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-3">
            {featureStats.map((s) => (
              <div
                key={s.label}
                className="relative overflow-hidden rounded-2xl border-2 border-cnd-fog/40 bg-white p-7 transition-transform hover:-translate-y-1"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-full w-1.5"
                  style={{ background: s.color }}
                />
                <div
                  className="display"
                  style={{
                    fontSize: 56,
                    lineHeight: 1,
                    letterSpacing: "-0.04em",
                    color: s.color,
                  }}
                >
                  {s.value}
                </div>
                <div
                  className="eyebrow mt-3 text-cnd-midnight"
                  style={{ letterSpacing: "0.18em" }}
                >
                  {s.label}
                </div>
                <p className="mt-2 text-sm text-cnd-ash">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Photo Gallery */}
      <Section className="relative overflow-hidden bg-cnd-midnight py-20 text-white hex-bg">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute hidden md:block"
          style={{ top: 30, left: 30, opacity: 0.16 }}
        >
          <CNDShape size={120} fill="var(--color-cnd-coral)" />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute hidden md:block"
          style={{ bottom: 30, right: 30, opacity: 0.14 }}
        >
          <CNDShape size={140} fill="var(--color-cnd-electric)" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <div className="text-center">
            <div
              className="eyebrow mb-3"
              style={{
                color: "var(--color-cnd-coral)",
                letterSpacing: "0.22em",
              }}
            >
              THE SPACES
            </div>
            <h2
              className="display"
              style={{
                fontSize: "clamp(32px, 5vw, 52px)",
                letterSpacing: "-0.035em",
              }}
            >
              Inside the venue.
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {spaces.map((s, i) => (
              <div
                key={s.title}
                className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={s.src}
                    alt={s.alt}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 h-full w-1.5"
                    style={{ background: s.accent }}
                  />
                  <span
                    className="eyebrow absolute left-4 top-4 rounded-full px-3 py-1 text-cnd-midnight"
                    style={{
                      background: s.accent,
                      fontSize: 10,
                      letterSpacing: "0.18em",
                    }}
                  >
                    SPACE · {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="p-6">
                  <h3
                    className="display text-white"
                    style={{ fontSize: 20, letterSpacing: "-0.02em" }}
                  >
                    {s.title}.
                  </h3>
                  <p className="mt-2 text-cnd-fog text-sm">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Getting There */}
      <Section className="bg-cnd-bone py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <div
              className="eyebrow mb-3"
              style={{ color: "var(--color-cnd-red)", letterSpacing: "0.22em" }}
            >
              GETTING THERE
            </div>
            <h2
              className="display text-cnd-midnight"
              style={{
                fontSize: "clamp(32px, 5vw, 52px)",
                letterSpacing: "-0.035em",
              }}
            >
              Easy from anywhere.
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div className="space-y-7">
              <div className="relative rounded-2xl border-2 border-cnd-red/30 bg-white p-7">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-full w-1.5 bg-cnd-red"
                />
                <div
                  className="eyebrow mb-2 text-cnd-red"
                  style={{ letterSpacing: "0.22em" }}
                >
                  ADDRESS
                </div>
                <p
                  className="display text-cnd-midnight"
                  style={{ fontSize: 22 }}
                >
                  Scandic Copenhagen
                </p>
                <p className="text-cnd-slate">Vester Søgade 6</p>
                <p className="text-cnd-slate">1601 Copenhagen V · Denmark</p>
                <a
                  href="https://maps.google.com/?q=Scandic+Copenhagen,Vester+Søgade+6,1601+København,Denmark"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="eyebrow mt-4 inline-flex items-center gap-1 text-cnd-red hover:text-cnd-coral"
                >
                  OPEN IN GOOGLE MAPS →
                </a>
              </div>

              <div className="rounded-2xl border-2 border-cnd-coral/40 bg-white p-7">
                <div
                  className="eyebrow mb-3"
                  style={{
                    color: "var(--color-cnd-coral)",
                    letterSpacing: "0.22em",
                  }}
                >
                  BY PUBLIC TRANSPORT
                </div>
                <ul className="space-y-2 text-cnd-slate">
                  <li>
                    <strong className="text-cnd-midnight">Train:</strong>{" "}
                    Copenhagen Central Station (Kobenhavn H) — 5-minute walk.
                  </li>
                  <li>
                    <strong className="text-cnd-midnight">Metro:</strong>{" "}
                    Vesterport Station is nearby.
                  </li>
                  <li>
                    <strong className="text-cnd-midnight">Bus:</strong> Multiple
                    bus lines stop at Vesterport.
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border-2 border-cnd-amber/60 bg-white p-7">
                <div
                  className="eyebrow mb-3"
                  style={{
                    color: "var(--color-cnd-amber)",
                    letterSpacing: "0.22em",
                  }}
                >
                  FROM CPH AIRPORT
                </div>
                <ul className="space-y-2 text-cnd-slate">
                  <li>
                    Take the Metro or train to Copenhagen Central Station.
                  </li>
                  <li>Journey time: approximately 15-20 minutes.</li>
                  <li>
                    From the station, walk 5 minutes to Scandic Copenhagen.
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border-2 border-cnd-electric/40 bg-white p-7">
                <div
                  className="eyebrow mb-3"
                  style={{
                    color: "var(--color-cnd-electric)",
                    letterSpacing: "0.22em",
                  }}
                >
                  BY CAR
                </div>
                <p className="text-cnd-slate">
                  Limited parking at the hotel — we recommend public transport
                  or one of the nearby parking facilities.
                </p>
              </div>
            </div>

            {/* Map */}
            <div className="h-80 lg:min-h-[28rem] lg:h-full overflow-hidden rounded-2xl border-2 border-cnd-midnight/15 bg-cnd-fog/40">
              <iframe
                className="border-0"
                src="https://maps.google.com/maps?q=Scandic+Copenhagen,Vester+Søgade+6,1601+København,Denmark&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Scandic Copenhagen Location"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Accommodation */}
      <Section className="relative overflow-hidden bg-cnd-sand py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute hidden md:block"
          style={{ top: 40, left: 40, opacity: 0.5 }}
        >
          <CNDShape size={120} fill="var(--color-cnd-amber)" />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute hidden md:block"
          style={{ bottom: 40, right: 40, opacity: 0.5 }}
        >
          <CNDShape size={100} fill="var(--color-cnd-coral)" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <div
            className="eyebrow mb-3"
            style={{ color: "var(--color-cnd-red)", letterSpacing: "0.22em" }}
          >
            STAYING OVER
          </div>
          <h2
            className="display text-cnd-midnight"
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              letterSpacing: "-0.03em",
            }}
          >
            Accommodation.
          </h2>
          <p
            className="mx-auto mt-5 max-w-xl text-cnd-slate"
            style={{ fontSize: 17, lineHeight: 1.6 }}
          >
            Scandic Copenhagen offers comfortable rooms if you'd like to stay at
            the venue. Centrally located — many other hotels are within walking
            distance.
          </p>
          <div className="mt-8 flex justify-center">
            <a
              href="https://www.scandichotels.com/hotels/denmark/copenhagen/scandic-copenhagen"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button>Book at Scandic Copenhagen →</Button>
            </a>
          </div>
        </div>
      </Section>
    </>
  )
}

export default VenuePage
