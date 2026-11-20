import * as React from "react"
import { createPortal } from "react-dom"
import { type Session, type Speaker } from "../hooks/use-sessionize"
import {
  formatTimeDetailed,
  calculateSessionDuration,
} from "../utils/time-formatting"
import { formatPlainTextToHtml } from "../utils/text-formatting"
import { deduceSessionType, getSessionTags } from "../utils/session-type"
import SpeakerList from "./speaker-list"
import SessionTypeBadge from "./session-type-badge"
import Button, { buttonVariants } from "./ui/button"
import CopyLinkButton from "./copy-link-button"
import { talkPath } from "../utils/talk-link"
import SessionFeedbackLink from "./session-feedback-link"
import RoomQuestionLink from "./room-question-link"
import ExternalLink from "./ui/external-link"

const SessionModal: React.FC<{
  session: Session
  onClose: () => void
  onSpeakerClick: (speaker: Speaker) => void
}> = ({ session, onClose, onSpeakerClick }) => {
  const duration = calculateSessionDuration(session.startsAt, session.endsAt)
  const sessionType = deduceSessionType({
    startsAt: session.startsAt,
    endsAt: session.endsAt,
    room: session.room,
    isServiceSession: session.isServiceSession,
    speakers: session.speakers,
    categories: session.categories,
  })
  const tags = getSessionTags(session.categories)
  const formattedDescription = formatPlainTextToHtml(session.description)
  const slideUrl = session.slideDeck?.trim()

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = "hidden"
    document.body.style.paddingRight = `${scrollbarWidth}px`
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = "unset"
      document.body.style.paddingRight = "0px"
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose])

  return createPortal(
    <>
      <div
        className="fixed inset-0 bg-white z-40"
        style={{ opacity: 0.5 }}
        onClick={onClose}
      ></div>
      <div
        className="fixed inset-x-0 top-0 z-50 flex h-svh justify-center items-center overflow-hidden p-4"
        onClick={onClose}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="session-modal-title"
          className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-full sm:max-h-[85svh] min-h-0 overflow-hidden flex flex-col relative border border-gray-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex shrink-0 justify-end px-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close session details"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-cnd-red/10 text-cnd-red hover:bg-cnd-red/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cnd-red"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M6 6l12 12M6 18L18 6" />
              </svg>
            </button>
          </div>
          <div className="min-h-0 overflow-y-auto overscroll-contain p-6 pt-2 sm:px-8 flex-1">
            <SessionTypeBadge type={sessionType} className="mb-3" />
            <h2
              id="session-modal-title"
              className="text-3xl font-bold text-primary mb-4"
            >
              {session.title || session.name}
            </h2>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-600 mb-6">
              <span>
                <strong>Time:</strong> {formatTimeDetailed(session.startsAt)} -{" "}
                {formatTimeDetailed(session.endsAt)} ({duration} min)
              </span>
              <span>
                <strong>Room:</strong> {session.room}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <SessionFeedbackLink session={session} variant="button" />
              <RoomQuestionLink session={session} variant="button" />
              <CopyLinkButton
                path={talkPath(session)}
                label="🔗 Copy talk link"
                variant="muted"
                className="btn-compact"
              />
              {slideUrl && (
                <ExternalLink
                  href={slideUrl}
                  className={`btn-pill btn-compact ${buttonVariants.muted}`}
                  onClick={(event) => event.stopPropagation()}
                >
                  <span aria-hidden="true">📑 </span>Show slides
                </ExternalLink>
              )}
            </div>

            {tags.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {session.speakers && session.speakers.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Speakers
                </h3>
                <SpeakerList
                  speakers={session.speakers}
                  onSpeakerClick={onSpeakerClick}
                  variant="inline"
                  size="medium"
                />
              </div>
            )}

            {formattedDescription && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Description
                </h3>
                <div
                  className="text-gray-700 space-y-4 leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_li+li]:mt-1"
                  dangerouslySetInnerHTML={{ __html: formattedDescription }}
                />
              </div>
            )}
          </div>
          <div className="hidden shrink-0 px-4 pb-6 pt-4 text-center md:block">
            <Button onClick={onClose} variant="primary" className="btn-compact">
              <span aria-hidden="true">⬅️ </span>Back to Schedule
            </Button>
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}

export default SessionModal
