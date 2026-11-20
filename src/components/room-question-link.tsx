import { type Session } from "../hooks/use-sessionize"
import { trackQuestionUrls } from "../config/track-questions"
import ExternalLink from "./ui/external-link"
import { buttonVariants } from "./ui/button"

const RoomQuestionLink = ({
  session,
  variant = "link",
}: {
  session: Session
  variant?: "link" | "button"
}) => {
  const href = trackQuestionUrls[session.room]
  if (session.isServiceSession || !href) return null

  return (
    <ExternalLink
      href={href}
      className={
        variant === "button"
          ? `btn-pill btn-compact ${buttonVariants.muted}`
          : "inline-flex min-h-11 items-center text-sm font-semibold text-primary underline underline-offset-4 hover:text-blue-800"
      }
      aria-label={`Show track Q&A for ${session.room}`}
      onClick={(event) => event.stopPropagation()}
    >
      {variant === "button" && <span aria-hidden="true">💬 </span>}
      Show track Q&amp;A
    </ExternalLink>
  )
}

export default RoomQuestionLink
