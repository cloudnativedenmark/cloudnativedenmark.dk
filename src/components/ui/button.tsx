import React from "react"

type ButtonVariant = "primary" | "secondary" | "ghost" | "light" | "midnight"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: ButtonVariant
}

const variantClasses: Record<ButtonVariant, string> = {
  // Danish red — primary CTA
  primary:
    "bg-cnd-red text-white hover:bg-cnd-red/90 shadow-[0_4px_18px_rgba(224,19,42,0.25)]",
  // Outline on midnight — secondary
  secondary:
    "bg-transparent text-cnd-midnight border-2 border-cnd-midnight hover:bg-cnd-midnight hover:text-white",
  // Ghost on dark backgrounds
  ghost:
    "bg-transparent text-white border-2 border-white/70 hover:bg-white hover:text-cnd-midnight",
  // Light on dark — bone pill
  light: "bg-cnd-bone text-cnd-midnight hover:bg-white",
  // Midnight pill — for use on light backgrounds when red would clash with logo
  midnight: "bg-cnd-midnight text-white hover:bg-cnd-harbor",
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "primary",
  disabled = false,
  ...props
}) => {
  const base = "btn-pill"
  const disabledClasses =
    "bg-cnd-fog text-cnd-ash cursor-not-allowed shadow-none hover:transform-none"
  const combined = disabled
    ? `${base} ${disabledClasses} ${className}`.trim()
    : `${base} ${variantClasses[variant]} ${className}`.trim()

  return (
    <button className={combined} disabled={disabled} {...props}>
      {children}
    </button>
  )
}

export default Button
