import React, { useMemo } from "react"
import { useOfflineSchedule } from "../data/use-offline-schedule"
import { findSessionById } from "../data/schedule-utils"
import { useAllFeedback } from "../data/use-feedback"
import FeedbackList from "../components/feedback-list"

const CompanionAdmin: React.FC = () => {
  const { entries, loading, connected, setHidden } = useAllFeedback()
  const { schedule } = useOfflineSchedule()

  const grouped = useMemo(() => {
    const bySession = new Map<string, typeof entries>()
    for (const entry of entries ?? []) {
      const list = bySession.get(entry.sessionId) ?? []
      list.push(entry)
      bySession.set(entry.sessionId, list)
    }
    return Array.from(bySession.entries())
  }, [entries])

  return (
    <div className="px-4 py-4">
      <h1 className="mb-1 text-lg font-bold text-cnd-midnight">
        Moderate feedback
      </h1>
      <p className="mb-4 text-sm text-cnd-ash">
        Hide anything harmful — hidden entries stay visible to you only.
      </p>

      {!connected && (
        <div className="rounded-xl bg-cnd-sand px-3 py-3 text-sm text-cnd-slate">
          The feedback backend isn't connected in this preview yet — this view
          will populate once companion-api is deployed. See
          workers/companion-api/README.md.
        </div>
      )}

      {connected && loading && (
        <p className="py-12 text-center text-sm text-cnd-ash">Loading…</p>
      )}

      {connected && !loading && grouped.length === 0 && (
        <p className="py-12 text-center text-sm text-cnd-ash">
          No feedback submitted yet.
        </p>
      )}

      {connected &&
        !loading &&
        grouped.map(([sessionId, sessionEntries]) => {
          const session = findSessionById(schedule, sessionId)
          return (
            <div key={sessionId} className="mb-6">
              <h2 className="mb-2 text-sm font-bold text-cnd-midnight">
                {session?.title || session?.name || sessionId}
              </h2>
              <FeedbackList
                entries={sessionEntries ?? []}
                canModerate
                onToggleHidden={(attendeeId, hidden) =>
                  setHidden(sessionId, attendeeId, hidden)
                }
              />
            </div>
          )
        })}
    </div>
  )
}

export default CompanionAdmin
