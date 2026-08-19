import React, { useMemo } from "react"
import { useLocation } from "react-router-dom"
import SEOHead from "../components/seo-head"
import PageHeader from "../components/layout/page-header"
import Section from "../components/ui/section"
import SpeakerGrid from "../components/content/speaker-grid"
import SpeakerModal from "../components/speaker_modal"
import { useSessionizeSpeakers } from "../hooks/use-sessionize"
import { useModalManagement } from "../hooks/use-modal-management"

const SpeakersPage: React.FC = () => {
  const location = useLocation()
  const { speakers } = useSessionizeSpeakers()
  const { selectedSpeaker, handleSpeakerClick, handleCloseSpeakerModal } =
    useModalManagement()

  const sortedSpeakers = useMemo(
    () => [...speakers].sort((a, b) => a.fullName.localeCompare(b.fullName)),
    [speakers]
  )

  return (
    <>
      <SEOHead title="Speakers" pathname={location.pathname} />
      <PageHeader
        eyebrow="SPEAKERS"
        title="Who's on stage."
        description="Meet everyone speaking at Cloud Native Denmark 2026 — the platform engineers, SREs, and architects sharing what they've learned running cloud native systems in production."
        variant="dark"
        size="large"
      />
      <Section className="bg-cnd-bone pb-32 pt-16 lg:pt-20 lg:pb-40">
        <div className="mx-auto max-w-7xl">
          {sortedSpeakers.length > 0 ? (
            <SpeakerGrid
              speakers={sortedSpeakers}
              onSpeakerClick={handleSpeakerClick}
            />
          ) : (
            <p className="text-center text-cnd-slate">
              Speakers are being announced — check back soon.
            </p>
          )}
        </div>
      </Section>
      {selectedSpeaker && (
        <SpeakerModal
          speaker={selectedSpeaker}
          onClose={handleCloseSpeakerModal}
        />
      )}
    </>
  )
}

export default SpeakersPage
