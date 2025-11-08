import React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: "primary" | "secondary"
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "primary",
  ...props
}) => {
  const defaultClasses = {
    primary:
      "bg-background text-white px-8 py-3 text-lg rounded-full font-medium hover:bg-background/90 transition-colors cursor-pointer",
    secondary:
      "border-2 border-background text-background px-8 py-3 text-lg rounded-full font-medium hover:bg-background hover:text-white transition-colors cursor-pointer",
  }

  const baseClasses = defaultClasses[variant]
  const combinedClasses = className
    ? `${baseClasses} ${className}`
    : baseClasses

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  )
}

export default Button
