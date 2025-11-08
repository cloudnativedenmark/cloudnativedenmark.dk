import React from "react"

export type ButtonVariant = "primary" | "secondary" | "ghost" | "disabled"
export type ButtonSize = "small" | "medium" | "large"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  fullWidth = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-semibold rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"

  const variantClasses = {
    primary: disabled
      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
      : "bg-background hover:bg-hover text-white focus:ring-background",
    secondary: disabled
      ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
      : "bg-white text-background border-2 border-background hover:bg-background hover:text-white focus:ring-background",
    ghost: disabled
      ? "text-gray-400 cursor-not-allowed"
      : "text-background hover:bg-background hover:text-white focus:ring-background",
    disabled: "bg-gray-200 text-gray-500 cursor-not-allowed",
  }

  const sizeClasses = {
    small: "py-2 px-4 text-sm",
    medium: "py-3 px-6 text-base",
    large: "py-3 px-8 text-lg",
  }

  const widthClasses = fullWidth ? "w-full" : ""

  const combinedClasses = [
    baseClasses,
    variantClasses[disabled ? "disabled" : variant],
    sizeClasses[size],
    widthClasses,
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <button className={combinedClasses} disabled={disabled} {...props}>
      {children}
    </button>
  )
}

export default Button
