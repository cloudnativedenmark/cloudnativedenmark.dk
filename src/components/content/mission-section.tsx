import React from "react"
import Section from "../ui/section"

interface MissionSectionProps {
  title?: string
  description: string
  partnerDescription?: string
  children?: React.ReactNode
}

const MissionSection: React.FC<MissionSectionProps> = ({
  title = "Mission",
  description,
  partnerDescription,
  children,
}) => {
  return (
    <Section className="bg-cnd-bone text-cnd-midnight">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <div
            className="eyebrow mb-4"
            style={{ color: "var(--color-cnd-red)" }}
          >
            07 · MISSION
          </div>
          <h2
            className="display text-cnd-midnight"
            style={{
              fontSize: "clamp(32px, 5vw, 52px)",
              letterSpacing: "-0.03em",
            }}
          >
            {title}.
          </h2>
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-12 lg:flex-row lg:items-start">
          {children && <div className="flex-shrink-0">{children}</div>}
          <div className="flex-1 text-center lg:text-left">
            <p
              className="text-cnd-slate"
              style={{
                fontSize: "clamp(18px, 1.5vw, 22px)",
                lineHeight: 1.55,
                fontWeight: 500,
              }}
            >
              {description}
            </p>
            {partnerDescription && (
              <p
                className="mt-6 text-cnd-slate"
                style={{
                  fontSize: "clamp(18px, 1.5vw, 22px)",
                  lineHeight: 1.55,
                  fontWeight: 500,
                }}
              >
                {partnerDescription}
              </p>
            )}
          </div>
        </div>
      </div>
    </Section>
  )
}

export default MissionSection
