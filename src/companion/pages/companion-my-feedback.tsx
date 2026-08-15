import React from "react"
import { Link } from "react-router-dom"
import { useOfflineSchedule } from "../data/use-offline-schedule"
import { useMyFeedback } from "../data/use-feedback"
import { findSessionById } from "../data/schedule-utils"
import { StarRatingDisplay } from "../components/star-rating"
import { formatDate, formatTimeDetailed } from "../../utils/time-formatting"

const CompanionMyFeedback: React.FC = () => {
  const { schedule } = useOfflineSchedule()
  const { allEntries } = useMyFeedback()

  return (
    <div className="px-4 py-4">
      <h1 className="mb-4 text-lg font-bold text-cnd-midnight">My feedback</h1>

      {allEntries.length === 0 && (
        <p className="py-12 text-center text-sm text-cnd-ash">
          You haven't rated any sessions yet — open a session and leave a rating
          to see it here.
        </p>
      )}

      <div className="space-y-3">
        {allEntries.map((entry) => {
          const session = findSessionById(schedule, entry.sessionId)
          return (
            <Link
              key={entry.sessionId}
              to={`/companion/session/${entry.sessionId}`}
              className="block rounded-xl bg-white p-3 shadow-sm"
            >
              <div className="text-sm font-semibold text-cnd-midnight">
                {session ? session.title || session.name : "Session"}
              </div>
              {session && (
                <div className="text-xs text-cnd-ash">
                  {formatDate(session.startsAt)} ·{" "}
                  {formatTimeDetailed(session.startsAt)}
                </div>
              )}
              <div className="mt-2">
                <StarRatingDisplay value={entry.rating} />
              </div>
              {entry.comment && (
                <p className="mt-2 text-sm text-cnd-slate">{entry.comment}</p>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default CompanionMyFeedback
