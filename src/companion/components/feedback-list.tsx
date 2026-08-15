import React from "react"
import type { FeedbackEntry } from "../data/types"
import { StarRatingDisplay } from "./star-rating"

const FeedbackList: React.FC<{
  entries: FeedbackEntry[]
  canModerate: boolean
  onToggleHidden?: (attendeeId: string, hidden: boolean) => void
}> = ({ entries, canModerate, onToggleHidden }) => {
  const visible = canModerate ? entries : entries.filter((e) => !e.hidden)

  if (visible.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-cnd-ash">No feedback yet.</p>
    )
  }

  return (
    <div className="space-y-3">
      {visible.map((entry) => (
        <div
          key={entry.attendeeId}
          className={`rounded-xl border p-3 ${
            entry.hidden
              ? "border-cnd-coral/40 bg-cnd-coral/5"
              : "border-cnd-fog/40 bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <StarRatingDisplay value={entry.rating} />
            {canModerate && (
              <button
                onClick={() =>
                  onToggleHidden?.(entry.attendeeId, !entry.hidden)
                }
                className="text-xs font-semibold text-cnd-red"
              >
                {entry.hidden ? "Unhide" : "Hide"}
              </button>
            )}
          </div>
          {entry.comment && (
            <p className="mt-2 text-sm text-cnd-slate">{entry.comment}</p>
          )}
          {entry.hidden && (
            <p className="mt-1 text-xs font-semibold text-cnd-coral">
              Hidden — only admins can see this
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

export default FeedbackList
