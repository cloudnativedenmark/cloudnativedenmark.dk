import React from "react"

export type SectionVariant = "default" | "dark" | "light" | "gray"
export type SectionSpacing = "none" | "small" | "medium" | "large" | "xlarge"

interface SectionProps {
  variant?: SectionVariant
  paddingY?: SectionSpacing
  paddingX?: SectionSpacing
  children: React.ReactNode
  className?: string
  id?: string
}

const Section: React.FC<SectionProps> = ({
  variant = "default",
  paddingY = "large",
  paddingX = "medium",
  children,
  className = "",
  id,
}) => {
  const variantClasses = {
    default: "bg-white",
    dark: "bg-background-dark",
    light: "bg-gray-50",
    gray: "bg-gray-100",
  }

  const spacingClasses = {
    none: "0",
    small: "8",
    medium: "12",
    large: "16",
    xlarge: "20",
  }

  const paddingYClass = `py-${spacingClasses[paddingY]}`
  const paddingXClass = `px-${spacingClasses[paddingX]}`

  const combinedClasses = [
    variantClasses[variant],
    paddingYClass,
    paddingXClass,
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <section className={combinedClasses} id={id}>
      {children}
    </section>
  )
}

export default Section
