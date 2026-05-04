import React from "react"
import Section from "../ui/section"
import VideoEmbed from "./video-embed"
import ExternalLink from "../ui/external-link"
import CNDShape from "../ui/cnd-shape"

const LastYearEventSection: React.FC<{ sectionNumber: number }> = ({ sectionNumber }) => {
  return (
    <Section className="relative overflow-hidden bg-cnd-ink hex-bg text-white">
      {/* Subtle red side rule echoing the hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 h-full w-[5px] bg-cnd-red"
      />
      {/* CND shape accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute hidden md:block"
        style={{ top: 32, right: 32, opacity: 0.16 }}
      >
        <CNDShape size={140} fill="var(--color-cnd-coral)" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute hidden md:block"
        style={{ bottom: 32, left: 32, opacity: 0.12 }}
      >
        <CNDShape size={110} fill="var(--color-cnd-electric)" />
      </div>

      <div className="relative">
        <div className="mx-auto max-w-4xl text-center">
          <div
            className="eyebrow mb-4"
            style={{ color: "var(--color-cnd-coral)" }}
          >
            {String(sectionNumber).padStart(2, "0")} · RECAP · 2025
          </div>
          <h2
            className="display text-white"
            style={{
              fontSize: "clamp(32px, 5vw, 56px)",
              letterSpacing: "-0.03em",
            }}
          >
            We did it once.
            <br />
            Now we go again.
          </h2>
          <p
            className="mt-8 text-cnd-fog"
            style={{ fontSize: 18, lineHeight: 1.6 }}
          >
            Last year, we hosted{" "}
            <ExternalLink
              href="https://2025.cloudnativedenmark.dk/"
              className="text-white underline decoration-cnd-coral decoration-2 underline-offset-4 hover:text-cnd-coral"
            >
              Cloud Native Denmark 2025
            </ExternalLink>{" "}
            at the Savværket in Aarhus, bringing together over 450 attendees for
            two packed days of technical talks, community connection, and cloud
            native inspiration.
          </p>
          <p
            className="mt-5 text-cnd-fog"
            style={{ fontSize: 18, lineHeight: 1.6 }}
          >
            While we're not running under the official KCD banner this year due
            to a few logistical reasons, it's still the same event, organized by
            the same passionate community. Join us as we take things to the next
            level in 2026.
          </p>
        </div>

        <div className="mt-12">
          <VideoEmbed
            src="https://www.youtube-nocookie.com/embed/BCYvLADtKjE"
            title="Cloud Native Denmark 2025 Aarhus Reel"
            maxWidth="4xl"
          />
        </div>

        {/* Stat strip */}
        <div className="mt-12 flex flex-wrap items-baseline gap-x-10 gap-y-4 border-t border-white/10 pt-8 justify-center">
          {[
            { n: "450+", l: "ATTENDEES" },
            { n: "2", l: "DAYS" },
            { n: "Aarhus", l: "2025 EDITION" },
          ].map((s) => (
            <div key={s.l} className="flex items-baseline gap-3">
              <div
                className="display text-white"
                style={{ fontSize: 36, letterSpacing: "-0.02em" }}
              >
                {s.n}
              </div>
              <div
                className="eyebrow text-cnd-sky"
                style={{ letterSpacing: "0.18em" }}
              >
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

export default LastYearEventSection
