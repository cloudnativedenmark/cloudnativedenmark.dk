import React from "react"
import { type Speaker } from "../../hooks/use-sessionize"
import CNDPortrait from "../ui/cnd-portrait"

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

interface SpeakerCardProps {
  speaker: Speaker
  onClick?: (speaker: Speaker) => void
}

const SpeakerCard: React.FC<SpeakerCardProps> = ({ speaker, onClick }) => {
  const accent = accentFor(speaker.fullName)
  return (
    <div
      className={`flex w-full max-w-[280px] flex-col items-center text-center${
        onClick ? " cursor-pointer transition-opacity hover:opacity-80" : ""
      }`}
      onClick={onClick ? () => onClick(speaker) : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                onClick(speaker)
              }
            }
          : undefined
      }
    >
      <CNDPortrait
        src={speaker.profilePicture || "/default-avatar.jpg"}
        alt={speaker.fullName}
        size={240}
        fallbackFill={accent}
        ringColor={accent}
        ringOffset={6}
      />
      <h3
        className="display mt-6 text-cnd-midnight"
        style={{ fontSize: 20, letterSpacing: "-0.015em", lineHeight: 1.15 }}
      >
        {speaker.fullName}
      </h3>
      {speaker.tagLine && (
        <p
          className="mt-2 text-cnd-slate"
          style={{ fontSize: 14, lineHeight: 1.45 }}
        >
          {speaker.tagLine}
        </p>
      )}
    </div>
  )
}

export default SpeakerCard
