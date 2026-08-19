import React from "react"
import {
  type SessionType,
  sessionTypeBadgeClasses,
} from "../utils/session-type"

interface SessionTypeBadgeProps {
  type?: SessionType | null
  compact?: boolean
  className?: string
}

const SessionTypeBadge: React.FC<SessionTypeBadgeProps> = ({
  type,
  compact = false,
  className = "",
}) => {
  if (!type) return null

  return (
    <span
      className={`inline-block rounded-full font-semibold uppercase tracking-wide ${
        compact
          ? "px-1.5 py-0.5 text-[10px] leading-none"
          : "px-2 py-0.5 text-xs"
      } ${sessionTypeBadgeClasses[type]} ${className}`}
    >
      {type}
    </span>
  )
}

export default SessionTypeBadge
