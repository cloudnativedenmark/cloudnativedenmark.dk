import { type Session } from "../hooks/use-sessionize"
import { sessionFeedbackUrls } from "../config/session-feedback"
import ExternalLink from "./ui/external-link"
import { buttonVariants } from "./ui/button"

const SessionFeedbackLink = ({
  session,
  className = "",
  variant = "link",
}: {
  session: Session
  className?: string
  variant?: "link" | "button"
}) => {
  const href = sessionFeedbackUrls[session.id]
  if (session.isServiceSession || !href) return null

  return (
    <ExternalLink
      href={href}
      className={`${
        variant === "button"
          ? `btn-pill btn-compact ${buttonVariants.muted}`
          : "inline-flex min-h-11 items-center text-sm font-semibold text-primary underline underline-offset-4 hover:text-blue-800"
      } ${className}`}
      aria-label={`Give feedback on ${session.title || session.name}`}
      rel="noopener noreferrer nofollow"
      onClick={(event) => event.stopPropagation()}
    >
      {variant === "button" ? "Give Feedback" : "Give feedback"}
    </ExternalLink>
  )
}

export default SessionFeedbackLink
