import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useOfflineSchedule } from "../data/use-offline-schedule"
import { useFavorites } from "../data/use-favorites"
import { flattenDaySessions } from "../data/schedule-utils"
import { formatDate, formatTimeDetailed } from "../../utils/time-formatting"
import type { Session } from "../../hooks/use-sessionize"
import { getItem, setItem, StorageKeys } from "../data/storage"

const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg
    viewBox="0 0 20 20"
    width={22}
    height={22}
    fill={filled ? "var(--color-cnd-amber)" : "none"}
    stroke={filled ? "var(--color-cnd-amber)" : "var(--color-cnd-ash)"}
    strokeWidth={1.5}
  >
    <path
      d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.7z"
      strokeLinejoin="round"
    />
  </svg>
)

const SessionRow: React.FC<{
  session: Session
  favorited: boolean
  onToggleFavorite: () => void
  onOpen: () => void
}> = ({ session, favorited, onToggleFavorite, onOpen }) => (
  <div className="flex items-center gap-3 border-b border-cnd-fog/40 py-3">
    <button
      onClick={onOpen}
      className="min-w-0 flex-1 text-left"
      aria-label={`Open ${session.title || session.name}`}
    >
      <div className="text-xs font-semibold text-cnd-electric">
        {formatTimeDetailed(session.startsAt)} · {session.room}
      </div>
      <div className="truncate text-sm font-semibold text-cnd-midnight">
        {session.title || session.name}
      </div>
      {session.speakers?.length > 0 && (
        <div className="truncate text-xs text-cnd-ash">
          {session.speakers.map((s) => s.fullName).join(", ")}
        </div>
      )}
    </button>
    <button
      onClick={onToggleFavorite}
      aria-label={favorited ? "Remove from My Schedule" : "Add to My Schedule"}
      className="shrink-0 p-1"
    >
      <StarIcon filled={favorited} />
    </button>
  </div>
)

const CompanionSchedule: React.FC = () => {
  const { schedule, isOffline, isFromCache } = useOfflineSchedule()
  const { isFavorite, toggleFavorite } = useFavorites()
  const navigate = useNavigate()
  // Persisted across navigation (not just component state) — switching to
  // another tab and back used to always reset this to "Full schedule",
  // which was annoying for people who live on "My schedule".
  const [showFavoritesOnly, setShowFavoritesOnlyState] = useState(() =>
    getItem<boolean>(StorageKeys.scheduleShowFavoritesOnly, false)
  )
  const setShowFavoritesOnly = (value: boolean) => {
    setShowFavoritesOnlyState(value)
    setItem(StorageKeys.scheduleShowFavoritesOnly, value)
  }

  return (
    <div className="px-4 py-4">
      <div className="mb-4 rounded-lg bg-cnd-sand px-3 py-2 text-center text-xs font-semibold text-cnd-slate">
        Showcase preview — showing the 2025 schedule until 2026's is ready.
      </div>

      {(isOffline || isFromCache) && (
        <div className="mb-4 rounded-lg bg-cnd-sand px-3 py-2 text-center text-xs font-semibold text-cnd-slate">
          {isOffline ? "You're offline — " : ""}Showing the last downloaded
          schedule.
        </div>
      )}

      <div className="mb-4 flex rounded-xl bg-white p-1 shadow-sm">
        <button
          onClick={() => setShowFavoritesOnly(false)}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold ${
            !showFavoritesOnly ? "bg-cnd-midnight text-white" : "text-cnd-ash"
          }`}
        >
          Full schedule
        </button>
        <button
          onClick={() => setShowFavoritesOnly(true)}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold ${
            showFavoritesOnly ? "bg-cnd-midnight text-white" : "text-cnd-ash"
          }`}
        >
          My schedule
        </button>
      </div>

      {schedule.length === 0 && (
        <p className="py-12 text-center text-sm text-cnd-ash">
          No schedule downloaded yet — connect to the internet once to load it,
          then it'll work offline for the rest of the conference.
        </p>
      )}

      {schedule.map((day) => {
        const sessions = flattenDaySessions(day).filter(
          (s) => !showFavoritesOnly || isFavorite(s.id)
        )
        if (sessions.length === 0) return null
        return (
          <div key={day.date} className="mb-6">
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-cnd-ash">
              {formatDate(day.date)}
            </h2>
            <div className="rounded-xl bg-white px-3 shadow-sm">
              {sessions.map((session) => (
                <SessionRow
                  key={session.id}
                  session={session}
                  favorited={isFavorite(session.id)}
                  onToggleFavorite={() => toggleFavorite(session.id)}
                  onOpen={() => navigate(`/companion/session/${session.id}`)}
                />
              ))}
            </div>
          </div>
        )
      })}

      {showFavoritesOnly &&
        schedule.length > 0 &&
        schedule.every(
          (day) =>
            flattenDaySessions(day).filter((s) => isFavorite(s.id)).length === 0
        ) && (
          <p className="py-12 text-center text-sm text-cnd-ash">
            No favorites yet — tap the star on any session to build your own
            schedule.
          </p>
        )}
    </div>
  )
}

export default CompanionSchedule
