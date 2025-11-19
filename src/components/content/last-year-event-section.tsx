import React from "react"
import Section from "../ui/section"
import VideoEmbed from "./video-embed"
import ExternalLink from "../ui/external-link"

const LastYearEventSection: React.FC = () => {
  return (
    <Section className="bg-background-dark">
      <div>
        <h2 className="text-4xl lg:text-5xl font-bold text-center text-white mb-8">
          Recap last years event
        </h2>
        <div className="mx-auto max-w-4xl text-center mb-12">
          <p className="text-lg lg:text-xl text-white">
            In 2024, we hosted{" "}
            <ExternalLink
              href="https://2024.kcddenmark.dk/"
              className="text-white underline decoration-dotted hover:text-gray-200"
            >
              Kubernetes Community Days Denmark
            </ExternalLink>{" "}
            at the Bella Center in Copenhagen, bringing together over 500
            attendees for two packed days of technical talks, community
            connection, and cloud native inspiration.
          </p>
          <p className="text-lg lg:text-xl text-white leading-relaxed mt-6">
            While we're not running under the official KCD banner this year due
            to a few logistical reasons, it's still the same event, organized by
            the same passionate community — just with a new name and a new city.
            This October in Aarhus, we're aiming even higher. Join us as we take
            things to the next level.
          </p>
        </div>
        <VideoEmbed
          src="https://www.youtube-nocookie.com/embed/eqqHVjg7FaU"
          title="KCD Denmark 2024 Highlights"
          maxWidth="4xl"
        />
      </div>
    </Section>
  )
}

export default LastYearEventSection
