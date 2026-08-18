import React from "react"
import { Link } from "react-router-dom"
import { useSessionizeSpeakers } from "../../hooks/use-sessionize"
import Section from "../ui/section"
import Button from "../ui/button"
import SpeakerCard from "./speaker-card"

interface FeaturedSpeakersSectionProps {
  sectionNumber: number
}

const FeaturedSpeakersSection: React.FC<FeaturedSpeakersSectionProps> = ({
  sectionNumber,
}) => {
  const { speakers } = useSessionizeSpeakers()
  const topSpeakers = speakers.filter((s) => s.isTopSpeaker && s.profilePicture)

  if (speakers.length === 0) return null

  return (
    <Section className="bg-cnd-bone py-16 lg:py-24">
      <div className="mb-12 text-center">
        <p
          className="eyebrow mb-3"
          style={{ color: "var(--color-cnd-red)", letterSpacing: "0.22em" }}
        >
          {String(sectionNumber).padStart(2, "0")} · SPEAKERS
        </p>
        <h2
          className="display text-cnd-midnight"
          style={{ fontSize: 40, letterSpacing: "-0.025em" }}
        >
          Featured speakers.
        </h2>
        <div className="mt-6 flex justify-center">
          <Link to="/speakers">
            <Button variant="midnight">View all speakers →</Button>
          </Link>
        </div>
      </div>
      {topSpeakers.length > 0 && (
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-14">
          {topSpeakers.map((speaker) => (
            <SpeakerCard key={speaker.id} speaker={speaker} />
          ))}
        </div>
      )}
    </Section>
  )
}

export default FeaturedSpeakersSection
