import React, { useState, useMemo } from "react"
import { useLocation } from "react-router-dom"
import SEOHead from "../components/seo-head"
import PageHeader from "../components/layout/page-header"
import Section from "../components/ui/section"
import { useSessionizeSchedule } from "../hooks/use-sessionize"
import { isAdminOnlySession } from "../utils/session-type"
import { useModalManagement } from "../hooks/use-modal-management"
import Fuse from "fuse.js"
import ArchiveSession from "../components/archive-session"
import SpeakerModal from "../components/speaker_modal"

const ArchivePage: React.FC = () => {
  const location = useLocation()
  const { schedule } = useSessionizeSchedule()
  const [searchQuery, setSearchQuery] = useState("")
  const { selectedSpeaker, handleSpeakerClick, handleCloseSpeakerModal } =
    useModalManagement()

  const sessions = useMemo(() => {
    if (!schedule.length) return []

    return schedule
      .flatMap((day) => day.timeSlots)
      .flatMap((slot) => slot.rooms)
      .map((room) => ({
        ...room.session,
        room: room.name,
      }))
      .filter(
        (session) =>
          !session.isServiceSession &&
          session.speakers &&
          session.speakers.length > 0 &&
          !isAdminOnlySession(session.speakers)
      )
  }, [schedule])

  const archivedSessions = useMemo(() => {
    if (!sessions.length) return []
    return sessions.map((session) => ({
      ...session,
      event: `CND ${session.startsAt.slice(0, 4)}`,
    }))
  }, [sessions])

  const fuse = useMemo(
    () =>
      new Fuse(archivedSessions, {
        keys: ["title", "description", "speakers.fullName"],
        threshold: 0.3,
        ignoreLocation: true,
      }),
    [archivedSessions]
  )

  const filteredSessions = useMemo(() => {
    if (!searchQuery) {
      return archivedSessions
    }
    return fuse.search(searchQuery).map((result) => result.item)
  }, [searchQuery, archivedSessions, fuse])

  return (
    <>
      <SEOHead title="Talk Archive" pathname={location.pathname} />
      <PageHeader
        eyebrow="TALK ARCHIVE"
        title="Catch up on every talk."
        description="Browse the sessions from this edition of Cloud Native Denmark. Slides and recordings are added as they become available."
        variant="dark"
        size="large"
      />
      <Section className="bg-cnd-bone pb-32 pt-16 lg:pt-20 lg:pb-40">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 max-w-lg mx-auto">
            <input
              type="search"
              aria-label="Search talks"
              placeholder="Search talks by title, speaker, description..."
              className="w-full rounded-lg border border-cnd-midnight/15 bg-white p-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="space-y-8">
            {!archivedSessions.length ? (
              <p className="text-center">Loading talks...</p>
            ) : !filteredSessions.length ? (
              <p className="text-center">No talks match your search.</p>
            ) : (
              filteredSessions.map((session) => (
                <ArchiveSession
                  key={session.id}
                  session={session}
                  onSpeakerClick={handleSpeakerClick}
                />
              ))
            )}
          </div>
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

export default ArchivePage
