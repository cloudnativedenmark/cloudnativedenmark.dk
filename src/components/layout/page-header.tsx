import React from "react"
import Section from "../ui/section"
import Container from "../ui/container"

interface PageHeaderProps {
  title: string
  description?: string
  variant?: "default" | "dark"
  size?: "medium" | "large"
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  variant = "dark",
  size = "large",
}) => {
  const titleSizeClasses = {
    medium: "text-4xl lg:text-5xl",
    large: "text-6xl",
  }

  const descriptionSizeClasses = {
    medium: "text-lg lg:text-xl",
    large: "text-2xl",
  }

  const textColorClasses = variant === "dark" ? "text-white" : "text-gray-900"

  return (
    <Section variant={variant} paddingY="large" className="pt-24 pb-12">
      <Container centerContent>
        <h1
          className={`${titleSizeClasses[size]} font-bold ${textColorClasses} mb-4`}
        >
          {title}
        </h1>
        {description && (
          <p
            className={`${descriptionSizeClasses[size]} font-light ${textColorClasses} leading-normal`}
          >
            {description}
          </p>
        )}
      </Container>
    </Section>
  )
}

export default PageHeader
