import React, { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { useOfflineSchedule } from "../data/use-offline-schedule"
import { findSessionById } from "../data/schedule-utils"
import { useAuth } from "../auth/auth-context"
import { useMyFeedback, useAllFeedback } from "../data/use-feedback"
import { StarRatingInput } from "../components/star-rating"
import FeedbackList from "../components/feedback-list"
import { formatTimeDetailed } from "../../utils/time-formatting"

const CompanionSessionDetail: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>()
  const { schedule } = useOfflineSchedule()
  const { role, speakerId } = useAuth()
  const session = sessionId ? findSessionById(schedule, sessionId) : undefined

  const { myFeedbackFor, submitFeedback } = useMyFeedback()
  const existing = session ? myFeedbackFor(session.id) : undefined
  const [rating, setRating] = useState(existing?.rating ?? 0)
  const [comment, setComment] = useState(existing?.comment ?? "")
  const [saved, setSaved] = useState(false)
  // Tracks the comment as last persisted, separate from the live textarea
  // draft — so rating an unrelated star doesn't accidentally save an
  // in-progress, unsaved comment edit.
  const savedCommentRef = useRef(existing?.comment ?? "")

  useEffect(() => {
    setRating(existing?.rating ?? 0)
    setComment(existing?.comment ?? "")
    savedCommentRef.current = existing?.comment ?? ""
  }, [existing])

  const isOwnSession =
    role === "speaker" &&
    !!speakerId &&
    !!session?.speakers?.some((s) => s.id === speakerId)

  const canGiveFeedback =
    !!session && (role === "attendee" || (role === "speaker" && !isOwnSession))

  const handleRate = (value: number) => {
    setRating(value)
    if (!session) return
    submitFeedback(session.id, value, savedCommentRef.current)
  }

  const handleSaveComment = async () => {
    if (!session || rating === 0) return
    await submitFeedback(session.id, rating, comment)
    savedCommentRef.current = comment
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!session) {
    return (
      <div className="px-4 py-12 text-center text-sm text-cnd-ash">
        Session not found — try reconnecting once to refresh the schedule.
      </div>
    )
  }

  return (
    <div className="px-4 py-4">
      <div className="text-xs font-semibold text-cnd-electric">
        {formatTimeDetailed(session.startsAt)}–
        {formatTimeDetailed(session.endsAt)} · {session.room}
      </div>
      <h1 className="mt-1 text-xl font-bold text-cnd-midnight">
        {session.title || session.name}
      </h1>
      {session.speakers?.length > 0 && (
        <p className="mt-1 text-sm text-cnd-ash">
          {session.speakers.map((s) => s.fullName).join(", ")}
        </p>
      )}
      {session.description && (
        <p className="mt-4 text-sm leading-relaxed text-cnd-slate">
          {session.description}
        </p>
      )}

      <div className="my-6 h-px bg-cnd-fog/40" />

      {canGiveFeedback && (
        <div>
          <h2 className="mb-3 text-sm font-bold text-cnd-midnight">
            Your feedback
          </h2>
          <StarRatingInput value={rating} onChange={handleRate} />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Optional comment"
            rows={3}
            className="mt-3 w-full rounded-lg border border-cnd-fog/60 p-3 text-sm outline-none focus:border-cnd-electric"
          />
          <button
            onClick={handleSaveComment}
            disabled={rating === 0}
            className="mt-3 rounded-lg bg-cnd-red px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
          >
            {saved
              ? "Saved ✓"
              : existing?.comment
                ? "Update comment"
                : "Save comment"}
          </button>
          <p className="mt-2 text-xs text-cnd-ash">
            Your star rating saves right away. Comments save when you tap this
            button.
          </p>
        </div>
      )}

      {role === "speaker" && isOwnSession && (
        <SpeakerFeedbackSection sessionId={session.id} />
      )}

      {role === "admin" && <AdminFeedbackSection sessionId={session.id} />}
    </div>
  )
}

const SpeakerFeedbackSection: React.FC<{ sessionId: string }> = ({
  sessionId,
}) => {
  const { entries, loading, connected } = useAllFeedback()
  const mine = (entries ?? []).filter((e) => e.sessionId === sessionId)

  return (
    <div>
      <h2 className="mb-3 text-sm font-bold text-cnd-midnight">
        Feedback on your session
      </h2>
      {!connected && (
        <p className="mb-3 text-xs text-cnd-ash">
          Feedback syncing isn't connected yet in this preview — this will fill
          in once the companion-api backend is deployed.
        </p>
      )}
      {connected && loading && <p className="text-sm text-cnd-ash">Loading…</p>}
      {connected && !loading && (
        <FeedbackList entries={mine} canModerate={false} />
      )}
    </div>
  )
}

const AdminFeedbackSection: React.FC<{ sessionId: string }> = ({
  sessionId,
}) => {
  const { entries, loading, connected, setHidden } = useAllFeedback()
  const forSession = (entries ?? []).filter((e) => e.sessionId === sessionId)

  return (
    <div>
      <h2 className="mb-3 text-sm font-bold text-cnd-midnight">
        Moderate feedback
      </h2>
      {!connected && (
        <p className="mb-3 text-xs text-cnd-ash">
          Feedback syncing isn't connected yet in this preview — this will fill
          in once the companion-api backend is deployed.
        </p>
      )}
      {connected && loading && <p className="text-sm text-cnd-ash">Loading…</p>}
      {connected && !loading && (
        <FeedbackList
          entries={forSession}
          canModerate
          onToggleHidden={(attendeeId, hidden) =>
            setHidden(sessionId, attendeeId, hidden)
          }
        />
      )}
    </div>
  )
}

export default CompanionSessionDetail
