import React from "react"
import { useSessionizeSpeakers, type Speaker } from "../../hooks/use-sessionize"
import CNDPortrait from "../ui/cnd-portrait"
import Section from "../ui/section"

const ACCENT_COLORS = [
  "var(--color-cnd-electric)",
  "var(--color-cnd-coral)",
  "var(--color-cnd-amber)",
  "var(--color-cnd-sky)",
  "var(--color-cnd-harbor)",
  "var(--color-cnd-red)",
]

const accentFor = (name: string) => {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0
  return ACCENT_COLORS[Math.abs(h) % ACCENT_COLORS.length]
}

const SpeakerCard: React.FC<{ speaker: Speaker }> = ({ speaker }) => {
  const accent = accentFor(speaker.fullName)
  return (
    <div className="flex w-full max-w-[280px] flex-col items-center text-center">
      <CNDPortrait
        src={speaker.profilePicture!}
        alt={speaker.fullName}
        size={240}
        fallbackFill={accent}
        ringColor={accent}
        ringOffset={6}
      />
      <h3
        className="display mt-6 text-cnd-midnight"
        style={{ fontSize: 20, letterSpacing: "-0.015em", lineHeight: 1.15 }}
      >
        {speaker.fullName}
      </h3>
      {speaker.tagLine && (
        <p className="mt-2 text-cnd-slate" style={{ fontSize: 14, lineHeight: 1.45 }}>
          {speaker.tagLine}
        </p>
      )}
    </div>
  )
}

interface FeaturedSpeakersSectionProps {
  sectionNumber: number
}

const FeaturedSpeakersSection: React.FC<FeaturedSpeakersSectionProps> = ({ sectionNumber }) => {
  const { speakers } = useSessionizeSpeakers()
  const topSpeakers = speakers.filter((s) => s.isTopSpeaker)

  if (topSpeakers.length === 0) return null

  return (
    <Section className="bg-cnd-bone py-16 lg:py-24">
      <div className="mb-12 text-center">
        <p
          className="eyebrow mb-3"
          style={{ color: "var(--color-cnd-red)", letterSpacing: "0.22em" }}
        >
          {String(sectionNumber).padStart(2, "0")} · FEATURED SPEAKERS
        </p>
        <h2
          className="display text-cnd-midnight"
          style={{ fontSize: 40, letterSpacing: "-0.025em" }}
        >
          Meet the speakers.
        </h2>
      </div>
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-14">
        {topSpeakers.map((speaker) => (
          <SpeakerCard key={speaker.id} speaker={speaker} />
        ))}
      </div>
    </Section>
  )
}

export default FeaturedSpeakersSection
