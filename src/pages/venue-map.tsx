import React from "react"
import { Link, useLocation } from "react-router-dom"
import SEOHead from "../components/seo-head"
import PageHeader from "../components/layout/page-header"
import Section from "../components/ui/section"
import Button from "../components/ui/button"
import VenueMap from "../components/content/venue-map"
import { venueMap } from "../config/venue-map"
import { useSponsors } from "../hooks/use-sponsors"
import type { SponsorData } from "../utils/data-loader"

const roomAccents = [
  "var(--color-cnd-red)",
  "var(--color-cnd-coral)",
  "var(--color-cnd-amber)",
]

interface InfoCard {
  title: string
  body: React.ReactNode
  accent: string
}

const goodToKnow: InfoCard[] = [
  {
    title: "Registration & help desk",
    body: "Just inside the entrance, next to the conference office. Head here when you arrive and whenever you need a hand.",
    accent: "var(--color-cnd-electric)",
  },
  {
    title: "Coffee & water",
    body: "Stations along the Vestlounge and in the Nordlounge, right outside the main stage.",
    accent: "var(--color-cnd-coral)",
  },
  {
    title: "Lunch",
    body: "Served from buffets in the Vestlounge and the Nordlounge, right between the sponsor stands.",
    accent: "var(--color-cnd-amber)",
  },
  {
    title: "Wi-Fi",
    body: (
      <>
        Free throughout the venue. Join the open{" "}
        <strong className="text-cnd-midnight">Scandic_easy</strong> network and
        open a browser. No password needed.
      </>
    ),
    accent: "var(--color-cnd-red)",
  },
]

const VenueMapPage: React.FC = () => {
  const location = useLocation()
  const { sponsors } = useSponsors()

  const sponsorsById: Record<string, SponsorData> = Object.fromEntries(
    Object.values(sponsors)
      .flat()
      .map((sponsor) => [sponsor.id, sponsor])
  )

  return (
    <>
      <SEOHead
        title="Venue Map"
        description="Find your way around Cloud Native Denmark 2026 at Scandic Copenhagen: the stages, the workshop room, sponsor stands, coffee and lunch."
        pathname={location.pathname}
      />
      <PageHeader
        eyebrow="VENUE MAP"
        title="Find your way."
        description="Both stages, the workshop room and every sponsor stand sit on a single floor of Scandic Copenhagen."
        variant="dark"
        size="large"
      />

      {/* Venue overview */}
      <Section className="bg-cnd-bone py-16 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div
                className="eyebrow mb-3"
                style={{
                  color: "var(--color-cnd-red)",
                  letterSpacing: "0.22em",
                }}
              >
                THE FLOOR
              </div>
              <h2
                className="display text-cnd-midnight"
                style={{
                  fontSize: "clamp(28px, 3.6vw, 44px)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.05,
                }}
              >
                The Grand Ball Complex.
              </h2>
              <p
                className="mt-5 text-cnd-slate"
                style={{ fontSize: 17, lineHeight: 1.6 }}
              >
                We take over the Grand Ball Complex at Scandic Copenhagen, the
                hotel&apos;s main conference floor at Vester Søgade 6, a
                five-minute walk from Copenhagen Central Station. Scandic opens
                up its meeting rooms into two large halls for the stages, and
                the lounges around them hold the sponsor stands, coffee and
                lunch.
              </p>
              <Link
                to="/venue"
                className="eyebrow mt-5 inline-flex items-center gap-1 text-cnd-red hover:text-cnd-coral"
              >
                TRAVEL & ACCOMMODATION →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-3">
              {venueMap.rooms.map((room, i) => (
                <div
                  key={room.id}
                  className="relative overflow-hidden rounded-2xl border-2 border-cnd-fog/40 bg-white p-6"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 h-full w-1.5"
                    style={{ background: roomAccents[i % roomAccents.length] }}
                  />
                  <div
                    className="display"
                    style={{
                      fontSize: 40,
                      lineHeight: 1,
                      letterSpacing: "-0.04em",
                      color: roomAccents[i % roomAccents.length],
                    }}
                  >
                    {room.areaM2}
                    <span style={{ fontSize: 18 }}> m²</span>
                  </div>
                  <h3
                    className="display mt-3 text-cnd-midnight"
                    style={{ fontSize: 20, letterSpacing: "-0.02em" }}
                  >
                    {room.name}
                  </h3>
                  <p className="mt-2 text-sm text-cnd-ash">
                    {room.venueRooms.join(" · ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Map */}
      <Section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <div
              className="eyebrow mb-3"
              style={{
                color: "var(--color-cnd-red)",
                letterSpacing: "0.22em",
              }}
            >
              FLOOR PLAN
            </div>
            <h2
              className="display text-cnd-midnight"
              style={{
                fontSize: "clamp(32px, 5vw, 52px)",
                letterSpacing: "-0.035em",
              }}
            >
              Stages, stands and coffee.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-cnd-slate">
              Stands are numbered from the entrance. Hover over an exhibitor to
              find their stand.
            </p>
          </div>
          <VenueMap config={venueMap} sponsors={sponsorsById} />
        </div>
      </Section>

      {/* Good to know */}
      <Section className="bg-cnd-bone py-16 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <div
              className="eyebrow mb-3"
              style={{
                color: "var(--color-cnd-red)",
                letterSpacing: "0.22em",
              }}
            >
              ON SITE
            </div>
            <h2
              className="display text-cnd-midnight"
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                letterSpacing: "-0.03em",
              }}
            >
              Good to know.
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {goodToKnow.map((card) => (
              <div
                key={card.title}
                className="relative overflow-hidden rounded-2xl border-2 border-cnd-fog/40 bg-white p-6"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-full w-1.5"
                  style={{ background: card.accent }}
                />
                <h3
                  className="display text-cnd-midnight"
                  style={{ fontSize: 18, letterSpacing: "-0.02em" }}
                >
                  {card.title}
                </h3>
                <p className="mt-2 text-sm text-cnd-slate">{card.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link to="/venue">
              <Button variant="primary">Getting to the venue →</Button>
            </Link>
          </div>
        </div>
      </Section>
    </>
  )
}

export default VenueMapPage
