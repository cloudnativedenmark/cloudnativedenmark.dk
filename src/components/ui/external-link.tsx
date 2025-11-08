import React from "react"

interface ExternalLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: React.ReactNode
  variant?: "default" | "button" | "inline"
  openInNewTab?: boolean
}

const ExternalLink: React.FC<ExternalLinkProps> = ({
  href,
  children,
  variant = "default",
  openInNewTab = true,
  className = "",
  ...props
}) => {
  const variantClasses = {
    default: "text-blue-600 hover:text-blue-800 underline",
    button:
      "inline-flex items-center justify-center text-white font-semibold py-3 px-6 rounded-full text-base transition-colors duration-200 bg-background hover:bg-hover",
    inline: "font-semibold text-blue-600 hover:text-blue-800",
  }

  const combinedClasses = [variantClasses[variant], className]
    .filter(Boolean)
    .join(" ")

  const linkProps = openInNewTab
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {}

  return (
    <a href={href} className={combinedClasses} {...linkProps} {...props}>
      {children}
    </a>
  )
}

export default ExternalLink
