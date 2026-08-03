import React, { useMemo, useState } from "react"
import { useOfflineSchedule } from "../data/use-offline-schedule"
import { findSessionById } from "../data/schedule-utils"
import { useAllFeedback } from "../data/use-feedback"
import type { FeedbackEntry } from "../data/types"
import { StarRatingDisplay } from "../components/star-rating"
import FeedbackList from "../components/feedback-list"

interface SessionGroup {
  sessionId: string
  title: string
  speakerNames: string[]
  startsAt: string | undefined
  entries: FeedbackEntry[]
  averageRating: number
  hasHidden: boolean
}

const CompanionAdmin: React.FC = () => {
  const { entries, loading, connected, setHidden } = useAllFeedback()
  const { schedule } = useOfflineSchedule()
  const [query, setQuery] = useState("")
  // Collapsed by default — with a lot of sessions/entries, showing
  // everything expanded at once gets unwieldy fast.
  const [openSessionIds, setOpenSessionIds] = useState<Set<string>>(new Set())

  const groups = useMemo<SessionGroup[]>(() => {
    const bySession = new Map<string, FeedbackEntry[]>()
    for (const entry of entries ?? []) {
      const list = bySession.get(entry.sessionId) ?? []
      list.push(entry)
      bySession.set(entry.sessionId, list)
    }
    const q = query.trim().toLowerCase()
    return Array.from(bySession.entries())
      .map(([sessionId, sessionEntries]) => {
        const session = findSessionById(schedule, sessionId)
        const averageRating =
          sessionEntries.reduce((sum, e) => sum + e.rating, 0) /
          sessionEntries.length
        return {
          sessionId,
          title: session?.title || session?.name || sessionId,
          speakerNames: session?.speakers?.map((s) => s.fullName) ?? [],
          startsAt: session?.startsAt,
          entries: sessionEntries,
          averageRating,
          hasHidden: sessionEntries.some((e) => e.hidden),
        }
      })
      .filter((g) => {
        if (!q) return true
        if (g.title.toLowerCase().includes(q)) return true
        return g.speakerNames.some((name) => name.toLowerCase().includes(q))
      })
      .sort((a, b) => {
        // Chronological, matching the schedule itself — stable regardless
        // of moderation actions or new feedback coming in, so admins can
        // scan through sessions in a consistent order. Flagged entries are
        // still called out with a badge, just not used to reorder things.
        const aTime = a.startsAt
          ? new Date(a.startsAt).getTime()
          : Number.POSITIVE_INFINITY
        const bTime = b.startsAt
          ? new Date(b.startsAt).getTime()
          : Number.POSITIVE_INFINITY
        if (aTime !== bTime) return aTime - bTime
        return a.title.localeCompare(b.title)
      })
  }, [entries, schedule, query])

  const toggleOpen = (sessionId: string) => {
    setOpenSessionIds((prev) => {
      const next = new Set(prev)
      if (next.has(sessionId)) next.delete(sessionId)
      else next.add(sessionId)
      return next
    })
  }

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

      {connected && !loading && entries && entries.length > 0 && (
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search sessions or speakers"
          className="mb-4 w-full rounded-lg border border-cnd-fog/60 px-3 py-2.5 text-base outline-none focus:border-cnd-electric"
        />
      )}

      {connected && !loading && groups.length === 0 && (
        <p className="py-12 text-center text-sm text-cnd-ash">
          {entries && entries.length > 0
            ? "No sessions match your search."
            : "No feedback submitted yet."}
        </p>
      )}

      {connected &&
        !loading &&
        groups.map((group) => {
          const isOpen = openSessionIds.has(group.sessionId)
          return (
            <div
              key={group.sessionId}
              className="mb-3 overflow-hidden rounded-xl border border-cnd-fog/40 bg-white"
            >
              <button
                onClick={() => toggleOpen(group.sessionId)}
                className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left"
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-cnd-midnight">
                    {group.title}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <StarRatingDisplay
                      value={Math.round(group.averageRating)}
                      size={12}
                    />
                    <span className="text-xs text-cnd-ash">
                      {group.entries.length} response
                      {group.entries.length === 1 ? "" : "s"}
                    </span>
                    {group.hasHidden && (
                      <span className="text-xs font-semibold text-cnd-coral">
                        Hidden entry
                      </span>
                    )}
                  </div>
                </div>
                <span className="shrink-0 text-xs font-semibold text-cnd-electric">
                  {isOpen ? "Hide" : "View"}
                </span>
              </button>

              {isOpen && (
                <div className="border-t border-cnd-fog/40 px-3 py-3">
                  <FeedbackList
                    entries={group.entries}
                    canModerate
                    onToggleHidden={(attendeeId, hidden) =>
                      setHidden(group.sessionId, attendeeId, hidden)
                    }
                  />
                </div>
              )}
            </div>
          )
        })}
    </div>
  )
}

export default CompanionAdmin
