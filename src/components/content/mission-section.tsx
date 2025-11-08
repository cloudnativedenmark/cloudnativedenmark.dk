import React from "react"
import Section from "../ui/section"
import Container from "../ui/container"

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
    <Section variant="gray">
      <Container>
        <h2 className="text-4xl lg:text-5xl font-bold text-center text-gray-900 mb-12">
          {title}
        </h2>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <p className="text-lg lg:text-xl text-gray-800 leading-relaxed mb-6">
              {description}
            </p>
            {partnerDescription && (
              <p className="text-lg lg:text-xl text-gray-800 leading-relaxed">
                {partnerDescription}
              </p>
            )}
          </div>
          {children && <div className="flex-shrink-0">{children}</div>}
        </div>
      </Container>
    </Section>
  )
}

export default MissionSection
