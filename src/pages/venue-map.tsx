import React from "react"
import { Link, useLocation } from "react-router-dom"
import SEOHead from "../components/seo-head"
import VenueMap from "../components/content/venue-map"
import { venueMap } from "../config/venue-map"
import { useSponsors } from "../hooks/use-sponsors"
import type { SponsorData } from "../utils/data-loader"

interface Note {
  title: string
  body: React.ReactNode
  accent: string
}

const listRooms = (rooms: string[]) =>
  rooms.length > 1
    ? `${rooms.slice(0, -1).join(", ")} and ${rooms[rooms.length - 1]}`
    : rooms[0]

const notes: Note[] = [
  {
    title: "Registration",
    body: "Registration and the help desk are just inside the entrance, next to the conference office.",
    accent: "var(--color-cnd-electric)",
  },
  {
    title: "Toilets",
    body: "At the far end of the Vestlounge, go into the Mellemlounge past stand 6 and take the short corridor on your right.",
    accent: "var(--color-cnd-slate)",
  },
  {
    title: "Coffee, water & lunch",
    body: "Coffee and water stations line both lounges. Lunch is served from buffets between the stands.",
    accent: "var(--color-cnd-coral)",
  },
  {
    title: "Emergency exits",
    body: "Marked in green on the map. In an emergency, follow the green exit signs and the venue staff.",
    accent: "#00915a",
  },
  {
    title: "Wi-Fi",
    body: (
      <>
        Join the open{" "}
        <strong className="text-cnd-midnight">Scandic_easy</strong> network and
        open a browser. No password needed.
      </>
    ),
    accent: "var(--color-cnd-amber)",
  },
  {
    title: "Room signs",
    body: (
      <>
        Scandic signposts its own room names:{" "}
        {venueMap.rooms.map((room, i) => (
          <React.Fragment key={room.id}>
            {i > 0 && "; "}
            <strong className="text-cnd-midnight">{room.name}</strong> is{" "}
            {listRooms(room.venueRooms)}
          </React.Fragment>
        ))}
        .
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
        title="Conference Map"
        description="Find your way around Cloud Native Denmark 2026 at Scandic Copenhagen: stages, sponsor stands, registration, toilets, coffee and lunch."
        pathname={location.pathname}
      />

      <section className="bg-cnd-bone">
        <div className="mx-auto max-w-6xl px-4 pb-14 pt-6 sm:px-8 sm:pt-10">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
            <div>
              <div
                className="eyebrow text-cnd-red"
                style={{ letterSpacing: "0.22em" }}
              >
                Conference map · Scandic Copenhagen
              </div>
              <h1
                className="display mt-2 text-cnd-midnight"
                style={{
                  fontSize: "clamp(30px, 4.2vw, 46px)",
                  letterSpacing: "-0.035em",
                }}
              >
                Find your way.
              </h1>
            </div>
            <p className="text-sm text-cnd-slate">
              Vester Søgade 6, Copenhagen V ·{" "}
              <Link
                to="/venue"
                className="font-semibold text-cnd-red hover:text-cnd-coral"
              >
                Getting there →
              </Link>
            </p>
          </div>

          <VenueMap config={venueMap} sponsors={sponsorsById} />
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-8">
          <h2
            className="display text-cnd-midnight"
            style={{
              fontSize: "clamp(24px, 3vw, 32px)",
              letterSpacing: "-0.03em",
            }}
          >
            Good to know
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <div
                key={note.title}
                className="relative overflow-hidden rounded-2xl border-2 border-cnd-fog/40 bg-white p-5 pl-6"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-full w-1.5"
                  style={{ background: note.accent }}
                />
                <h3 className="font-semibold text-cnd-midnight">
                  {note.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-cnd-slate">
                  {note.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default VenueMapPage
