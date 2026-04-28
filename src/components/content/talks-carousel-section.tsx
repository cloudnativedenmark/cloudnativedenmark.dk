import React, { useRef, useState, useEffect } from "react"
import Section from "../ui/section"
import ExternalLink from "../ui/external-link"

interface Talk {
  id: string
  title: string
}

const PLAYLIST_ID = "PL09s8ZalKQe_vMQ54NcLnMx7qhFjXjTU2"
const PLAYLIST_URL = `https://youtube.com/playlist?list=${PLAYLIST_ID}`

// Sourced from the public CND 2025 playlist. Refresh by re-running the
// playlist scraper (see /tmp/cnd-playlist.html in the design system handoff
// notes) — order preserved as listed on YouTube.
const TALKS: Talk[] = [
  {
    id: "7VXnrd8bIA4",
    title: "Kubernetes is too complex for startups. WRONG!",
  },
  {
    id: "IbWm0xPHgVo",
    title: "Testing Metal3 with 1000 Clusters at Zero Infrastructure Cost",
  },
  { id: "HNsEFNPHFLg", title: "Platform Engineering Beyond the Tools" },
  {
    id: "2P6Doe-eccI",
    title: "The Good, The Bad and The Ugly: The Gory Details of an IDP",
  },
  {
    id: "-9ijsskqp2E",
    title: "Kubernetes at the Edge — Come See It In Action!",
  },
  { id: "Mfmf0KQEzEY", title: "Pragmatic Guide to Platforms and Compliance" },
  {
    id: "jovh3u7CaIw",
    title: "Build a Cloud-Native Developer Platform for IO Interactive",
  },
  {
    id: "NjWCiRly9vM",
    title: "Adopt the Bill of Behaviour into your daily workflow: bobctl",
  },
  {
    id: "fkRmopLyEK4",
    title: "This Lying Has To Stop: Keeping AI Honest with OpenTelemetry",
  },
  {
    id: "AZXEXR90Kpw",
    title: "From Anxiety to Action: A Guide to Bringing Workloads Back Home",
  },
  {
    id: "UOFwb7MYQ20",
    title: "Developer Experience for Platform Engineers in 2025",
  },
  { id: "bgHRuLhdLKI", title: "The Hitchhiker's Practical Guide to MLOps" },
  { id: "8fB3k95dCRE", title: "Yes, You Can Run LLMs on Kubernetes" },
  { id: "PQI2JRy42_g", title: "Driving Platform Adoption with Embedded SREs" },
  { id: "3gliyWYpmi8", title: "Multi-Site CSI for Kubernetes" },
  {
    id: "nJX465BAO_M",
    title: "Not Forking Around: Leveraging NRI to extend Kubernetes at scale",
  },
  {
    id: "n3H8tnqIeEU",
    title: "KRO-nicles of Kubernetes: Taming Resources the Open Source Way",
  },
  { id: "BD-KV92UQAc", title: "Kubernetes and AI to Protect Our Forests" },
]

const TalkCard: React.FC<{ talk: Talk; index: number }> = ({ talk, index }) => {
  // Use maxresdefault.jpg (1280x720) with sddefault.jpg fallback.
  const thumb = `https://i.ytimg.com/vi/${talk.id}/maxresdefault.jpg`
  const href = `https://www.youtube.com/watch?v=${talk.id}&list=${PLAYLIST_ID}`

  return (
    <ExternalLink
      href={href}
      className="group relative flex w-[280px] flex-shrink-0 flex-col overflow-hidden rounded-2xl border-2 border-cnd-fog/40 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-cnd-coral hover:shadow-[0_18px_40px_rgba(11,30,63,0.14)] sm:w-[320px]"
      aria-label={`${talk.title} — open on YouTube`}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-cnd-fog/20">
        <img
          src={thumb}
          alt=""
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cnd-red shadow-lg ring-4 ring-white/30 transition-transform duration-200 group-hover:scale-110">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="ml-0.5 text-white"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <span
          className="eyebrow absolute left-3 top-3 rounded-full bg-cnd-midnight/90 px-3 py-1 text-cnd-coral backdrop-blur-sm"
          style={{ fontSize: 9, letterSpacing: "0.16em" }}
        >
          TALK · {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 px-5 py-4">
        <span
          className="display text-cnd-midnight"
          style={{
            fontSize: 15,
            lineHeight: 1.3,
            letterSpacing: "-0.005em",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {talk.title}
        </span>
      </div>
    </ExternalLink>
  )
}

const TalksCarouselSection: React.FC = () => {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateScrollState = () => {
    const el = scrollerRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 8)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)
  }

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener("scroll", updateScrollState, { passive: true })
    window.addEventListener("resize", updateScrollState)
    return () => {
      el.removeEventListener("scroll", updateScrollState)
      window.removeEventListener("resize", updateScrollState)
    }
  }, [])

  const scrollBy = (dx: number) => {
    scrollerRef.current?.scrollBy({ left: dx, behavior: "smooth" })
  }

  return (
    <Section className="bg-cnd-bone py-16 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col items-baseline gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div
              className="eyebrow mb-2"
              style={{ color: "var(--color-cnd-red)" }}
            >
              06 · TALK ARCHIVE · CND 2025
            </div>
            <h2
              className="display"
              style={{
                fontSize: "clamp(28px, 3.6vw, 42px)",
                letterSpacing: "-0.03em",
                color: "var(--color-cnd-midnight)",
              }}
            >
              Watch every session.
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <ExternalLink
              href={PLAYLIST_URL}
              className="eyebrow text-cnd-red hover:text-cnd-coral"
            >
              OPEN PLAYLIST →
            </ExternalLink>
            <div className="hidden items-center gap-2 md:flex">
              <button
                type="button"
                onClick={() => scrollBy(-340)}
                disabled={!canScrollLeft}
                aria-label="Scroll talks left"
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-cnd-midnight/15 bg-white text-cnd-midnight transition-all hover:border-cnd-midnight enabled:hover:bg-cnd-midnight enabled:hover:text-white disabled:opacity-30"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => scrollBy(340)}
                disabled={!canScrollRight}
                aria-label="Scroll talks right"
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-cnd-midnight/15 bg-white text-cnd-midnight transition-all hover:border-cnd-midnight enabled:hover:bg-cnd-midnight enabled:hover:text-white disabled:opacity-30"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ scrollPadding: "0 1rem" }}
        >
          {TALKS.map((talk, i) => (
            <div key={talk.id} className="snap-start">
              <TalkCard talk={talk} index={i} />
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

export default TalksCarouselSection
