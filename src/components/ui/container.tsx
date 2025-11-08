import React from "react"

export type ContainerSize = "small" | "medium" | "large" | "full"

interface ContainerProps {
  size?: ContainerSize
  centerContent?: boolean
  children: React.ReactNode
  className?: string
}

const Container: React.FC<ContainerProps> = ({
  size = "large",
  centerContent = false,
  children,
  className = "",
}) => {
  const sizeClasses = {
    small: "max-w-2xl",
    medium: "max-w-4xl",
    large: "max-w-6xl",
    full: "max-w-full",
  }

  const baseClasses = "mx-auto px-6"
  const centerClasses = centerContent ? "text-center" : ""

  const combinedClasses = [
    baseClasses,
    sizeClasses[size],
    centerClasses,
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return <div className={combinedClasses}>{children}</div>
}

export default Container
