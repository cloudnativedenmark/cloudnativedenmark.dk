import { useState, useEffect } from "react"
import { type Session, type Speaker, type GridEntry } from "./use-sessionize"

interface UseModalManagementProps {
  schedule?: GridEntry[]
  onSessionSelect?: (session: Session) => void
}

export const useModalManagement = ({
  schedule = [],
  onSessionSelect,
}: UseModalManagementProps = {}) => {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null)
  // Re-read on every render so the effect below also reacts to hash-only
  // navigations (e.g. a Link from the speaker modal to /schedule#<id> while
  // already on the schedule page), not just the initial mount.
  const currentHash = typeof window !== "undefined" ? window.location.hash : ""

  const clearHash = () => {
    if (typeof window !== "undefined") {
      window.history.pushState(
        null,
        "",
        window.location.pathname + window.location.search
      )
    }
  }

  // Session and speaker modals are mutually exclusive: opening one always
  // closes the other, so at most one backdrop is ever mounted at a time and
  // navigating deeper (session -> speaker -> a different session) replaces
  // rather than stacks.
  const handleSessionClick = (session: Session) => {
    if (session && session.id) {
      setSelectedSession(session)
      setSelectedSpeaker(null)
      onSessionSelect?.(session)
      if (typeof window !== "undefined") {
        window.history.pushState(null, "", `#${session.id}`)
      }
    }
  }

  const handleSpeakerClick = (speaker: Speaker) => {
    setSelectedSpeaker(speaker)
    setSelectedSession(null)
    clearHash()
  }

  const handleCloseSessionModal = () => {
    setSelectedSession(null)
    clearHash()
  }

  const handleCloseSpeakerModal = () => {
    setSelectedSpeaker(null)
  }

  // Handle session selection from the URL hash — both on initial mount and
  // on later hash-only navigations (deep links from the speaker modal).
  useEffect(() => {
    if (schedule.length > 0 && typeof window !== "undefined") {
      const hash = window.location.hash
      if (hash) {
        const sessionId = hash.substring(1)
        if (sessionId) {
          const allSessions = schedule.flatMap(
            (day) =>
              day.timeSlots?.flatMap((ts) => ts.rooms?.map((r) => r.session)) ||
              []
          )
          const session = allSessions.find((s) => s?.id === sessionId)
          if (session) {
            setSelectedSession(session)
            setSelectedSpeaker(null)
          }
        }
      }
    }
  }, [schedule, currentHash])

  return {
    selectedSession,
    selectedSpeaker,
    handleSessionClick,
    handleSpeakerClick,
    handleCloseSessionModal,
    handleCloseSpeakerModal,
  }
}
