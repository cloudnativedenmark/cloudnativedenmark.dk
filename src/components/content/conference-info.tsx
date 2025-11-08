import React from "react"
import Section from "../ui/section"
import Container from "../ui/container"

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
  const textColorClass = variant === "dark" ? "text-white" : "text-gray-800"

  return (
    <Section variant={variant === "dark" ? "dark" : "default"}>
      <Container centerContent>
        <h2
          className={`text-4xl lg:text-5xl font-bold ${textColorClass} mb-12`}
        >
          {title}
        </h2>
        <p
          className={`text-2xl lg:text-3xl font-medium leading-relaxed ${textColorClass}`}
        >
          {description}
        </p>
      </Container>
    </Section>
  )
}

export default ConferenceInfo
