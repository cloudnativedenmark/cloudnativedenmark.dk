import React from "react"
import { type Session } from "../hooks/use-sessionize"
import { deduceSessionType } from "../utils/session-type"
import SessionTypeBadge from "./session-type-badge"
import { calculateSessionDuration } from "../utils/time-formatting"

interface SessionCardProps {
  session: Session
  onClick?: () => void
  variant?: "schedule" | "archive" | "overlay" | "mobile"
  serviceSessions?: readonly Session[]
}

const SessionCard: React.FC<SessionCardProps> = ({
  session,
  onClick,
  variant = "schedule",
  serviceSessions,
}) => {
  if (!session || !session.id) {
    return null
  }

  const timeRange =
    variant !== "archive"
      ? `${session.startsAt.slice(11, 16)}–${session.endsAt.slice(11, 16)}`
      : undefined
  const sizeClass =
    (variant === "schedule" || variant === "overlay") &&
    calculateSessionDuration(session.startsAt, session.endsAt) > 60
      ? "min-h-48"
      : ""

  if (session.isServiceSession) {
    return (
      <div
        className={`${sizeClass} p-4 h-full flex flex-col items-center justify-center gap-2 text-center rounded-lg border ${
          variant === "overlay"
            ? "bg-gray-100/75 border-dashed border-gray-400"
            : "bg-gray-100 border-gray-300"
        }`}
      >
        {timeRange && (
          <p className="text-xs font-medium text-gray-600 tabular-nums">
            {timeRange}
          </p>
        )}
        <h3 className="font-bold text-lg text-gray-700">
          {session.title || session.name}
        </h3>
        {session.isPlenumSession && session.description && (
          <p className="text-sm text-gray-700 whitespace-pre-line">
            {session.description}
          </p>
        )}
      </div>
    )
  }

  if (variant === "archive") {
    return (
      <div className="p-6 border border-gray-200 rounded-lg text-left bg-white hover:shadow-md transition-shadow duration-200">
        <h3 className="text-2xl font-bold">{session.title}</h3>
        {session.speakers && session.speakers.length > 0 && (
          <div className="flex flex-wrap items-center gap-4 mt-3">
            {session.speakers.map((speaker) => (
              <div key={speaker.id} className="flex items-center gap-2">
                <img
                  src={speaker.profilePicture || "/default-avatar.jpg"}
                  alt={speaker.fullName}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <p className="text-md font-semibold">{speaker.fullName}</p>
              </div>
            ))}
          </div>
        )}
        <p className="mt-4 text-gray-700">{session.description}</p>
      </div>
    )
  }

  const sessionType = deduceSessionType({
    startsAt: session.startsAt,
    endsAt: session.endsAt,
    room: session.room,
    isServiceSession: session.isServiceSession,
    speakers: session.speakers,
    categories: session.categories,
  })

  // Schedule variant (default)
  return (
    <div
      className={`${sizeClass} bg-blue-50 hover:bg-blue-100 p-3 h-full flex flex-col justify-between rounded-lg shadow-sm border border-blue-200 transition-colors duration-200 cursor-pointer`}
      onClick={onClick}
    >
      <div>
        <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1">
          <SessionTypeBadge type={sessionType} compact />
          {timeRange && (
            <span className="text-xs font-medium text-gray-600 tabular-nums whitespace-nowrap">
              {timeRange}
            </span>
          )}
        </div>
        <h3 className="font-bold text-md text-primary">
          {session.title || session.name}
        </h3>
        {session.speakers && session.speakers.length > 0 && (
          <p className="text-sm text-gray-600 mt-2">
            <em>{session.speakers.map((s) => s.fullName).join(", ")}</em>
          </p>
        )}
        {variant === "mobile" &&
          sessionType === "Workshop" &&
          serviceSessions?.map((item) => {
            if (
              item.startsAt >= session.endsAt ||
              session.startsAt >= item.endsAt
            )
              return null

            return (
              <p key={item.id} className="mt-2 text-xs text-gray-600">
                Remember: {item.title || item.name} (
                {item.startsAt.slice(11, 16)}–{item.endsAt.slice(11, 16)})
              </p>
            )
          })}
      </div>
    </div>
  )
}

export default SessionCard
