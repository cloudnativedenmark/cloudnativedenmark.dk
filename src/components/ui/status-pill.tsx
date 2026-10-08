import React from "react"

interface StatusPillProps {
  children: React.ReactNode
  className?: string
}

const StatusPill: React.FC<StatusPillProps> = ({
  children,
  className = "",
}) => (
  <div
    className={`inline-flex items-center gap-2 rounded-full bg-cnd-coral/15 px-4 py-2 ${className}`}
  >
    <span
      aria-hidden="true"
      className="inline-block h-1.5 w-1.5 rounded-full bg-cnd-coral"
    />
    <span
      className="eyebrow"
      style={{
        fontSize: 11,
        letterSpacing: "0.18em",
        color: "var(--color-cnd-red)",
      }}
    >
      {children}
    </span>
  </div>
)

export default StatusPill
