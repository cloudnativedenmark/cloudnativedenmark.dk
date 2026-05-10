import React from "react"
import ExternalLink from "../ui/external-link"
import CNDPortrait from "../ui/cnd-portrait"
import { teamImages } from "../../utils/team-images"

interface TeamMemberProps {
  name: string
  position: string
  image: string
  linkedin?: string
  variant?: "default" | "compact"
}

// Rotating accent colors so the team grid feels lively
// without being noisy. Order matches the design's "confetti cluster" palette.
const ACCENT_COLORS = [
  "var(--color-cnd-electric)",
  "var(--color-cnd-coral)",
  "var(--color-cnd-amber)",
  "var(--color-cnd-sky)",
  "var(--color-cnd-harbor)",
  "var(--color-cnd-red)",
]

const accentFor = (name: string) => {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0
  return ACCENT_COLORS[Math.abs(h) % ACCENT_COLORS.length]
}

const TeamMember: React.FC<TeamMemberProps> = ({
  name,
  position,
  image,
  linkedin,
  variant = "default",
}) => {
  const portraitSize = variant === "compact" ? 200 : 240
  const accent = accentFor(name)
  const src = teamImages[image] || `/images/${image}`

  return (
    <div className="group flex w-full max-w-[280px] flex-col items-center text-center">
      <div className="relative">
        {/* Soft drop shadow on hover */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 transition-transform duration-300 group-hover:translate-y-1"
        />
        <CNDPortrait
          src={src}
          alt={name}
          size={portraitSize}
          fallbackFill={accent}
          ringColor={accent}
          ringOffset={6}
        />
      </div>

      <h3
        className="display mt-6 text-cnd-midnight"
        style={{ fontSize: 20, letterSpacing: "-0.015em", lineHeight: 1.15 }}
      >
        {name}
      </h3>
      {position && (
        <p
          className="mt-2 text-cnd-slate"
          style={{ fontSize: 14, lineHeight: 1.45 }}
        >
          {position}
        </p>
      )}
      {linkedin && (
        <ExternalLink
          href={`https://linkedin.com/in/${linkedin}`}
          className="eyebrow mt-3 inline-flex items-center gap-1 text-cnd-red hover:text-cnd-coral"
        >
          LINKEDIN <span aria-hidden="true">→</span>
        </ExternalLink>
      )}
    </div>
  )
}

export default TeamMember
