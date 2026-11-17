import { type Session } from "../hooks/use-sessionize"
import { sessionFeedbackUrls } from "../config/session-feedback"
import ExternalLink from "./ui/external-link"

const SessionFeedbackLink = ({
  session,
  className = "",
}: {
  session: Session
  className?: string
}) => {
  const href = sessionFeedbackUrls[session.id]
  if (session.isServiceSession || !href) return null

  return (
    <ExternalLink
      href={href}
      className={`inline-flex min-h-11 items-center text-sm font-semibold text-primary underline underline-offset-4 hover:text-blue-800 ${className}`}
      aria-label={`Give feedback on ${session.title || session.name}`}
      rel="noopener noreferrer nofollow"
      onClick={(event) => event.stopPropagation()}
    >
      Give feedback
    </ExternalLink>
  )
}

export default SessionFeedbackLink
