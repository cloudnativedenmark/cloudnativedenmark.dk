import React from "react"
import Section from "../ui/section"

interface ConferenceInfoProps {
  title: string
  description: string
  variant?: "default" | "dark"
}

const ConferenceInfo: React.FC<ConferenceInfoProps> = ({
  title,
  description,
  variant = "dark",
}) => {
  const isDark = variant === "dark"

  return (
    <Section
      className={`${
        isDark
          ? "bg-cnd-midnight text-white hex-bg"
          : "bg-cnd-bone text-cnd-midnight"
      } relative overflow-hidden`}
    >
      {/* Subtle red side rule echoing the hero */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute top-0 left-0 h-full w-[5px] ${
          isDark ? "bg-cnd-red" : "bg-cnd-coral"
        }`}
      />
      <div className="relative mx-auto max-w-4xl text-center">
        {title && (
          <div
            className="eyebrow mb-6"
            style={{
              color: isDark ? "var(--color-cnd-coral)" : "var(--color-cnd-red)",
            }}
          >
            {title}
          </div>
        )}
        <p
          className="display"
          style={{
            fontSize: "clamp(28px, 4vw, 48px)",
            lineHeight: 1.1,
            letterSpacing: "-0.025em",
            fontWeight: 600,
          }}
        >
          {description}
        </p>
      </div>
    </Section>
  )
}

export default ConferenceInfo
