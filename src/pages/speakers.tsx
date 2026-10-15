import React, { useEffect, useMemo } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import SEOHead from "../components/seo-head"
import PageHeader from "../components/layout/page-header"
import Section from "../components/ui/section"
import SpeakerGrid from "../components/content/speaker-grid"
import SpeakerModal from "../components/speaker_modal"
import { useSessionizeSpeakers } from "../hooks/use-sessionize"
import { useModalManagement } from "../hooks/use-modal-management"
import { speakerKey, speakerPath } from "../utils/speaker-link"

const SpeakersPage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { speakerId } = useParams()
  const { speakers } = useSessionizeSpeakers()
  const { selectedSpeaker, handleSpeakerClick, handleCloseSpeakerModal } =
    useModalManagement({ urlMode: "path" })

  useEffect(() => {
    if (!speakerId) {
      handleCloseSpeakerModal()
      return
    }

    const speaker = speakers.find(
      (item) =>
        item.id === speakerId || speakerId.endsWith(`-${speakerKey(item.id)}`)
    )
    if (speaker) handleSpeakerClick(speaker)
    // Only sync when the route or data changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speakerId, speakers])

  const openSpeaker = (speaker: (typeof speakers)[number]) => {
    handleSpeakerClick(speaker)
    navigate(speakerPath(speaker))
  }

  const closeSpeaker = () => {
    handleCloseSpeakerModal()
    navigate("/speakers")
  }

  const sortedSpeakers = useMemo(
    () => [...speakers].sort((a, b) => a.fullName.localeCompare(b.fullName)),
    [speakers]
  )

  return (
    <>
      <SEOHead
        title={selectedSpeaker?.fullName || "Speakers"}
        description={selectedSpeaker?.tagLine || undefined}
        pathname={location.pathname}
        image={selectedSpeaker?.profilePicture || undefined}
      />
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
              onSpeakerClick={openSpeaker}
            />
          ) : (
            <p className="text-center text-cnd-slate">
              Speakers are being announced — check back soon.
            </p>
          )}
        </div>
      </Section>
      {selectedSpeaker && (
        <SpeakerModal speaker={selectedSpeaker} onClose={closeSpeaker} />
      )}
    </>
  )
}

export default SpeakersPage
