import * as React from "react"
import { createPortal } from "react-dom"
import { Link } from "react-router-dom"
import { type Speaker } from "../hooks/use-sessionize"
import { type SessionType } from "../utils/session-type"
import Button from "./ui/button"

const sessionTypeBadgeClasses: Record<SessionType, string> = {
  Keynote: "bg-cnd-red/10 text-cnd-red",
  Session: "bg-cnd-electric/10 text-cnd-electric",
  Workshop: "bg-cnd-amber/10 text-cnd-amber",
  "Lightning Talk": "bg-cnd-sky/10 text-cnd-harbor",
}

const SpeakerModal: React.FC<{ speaker: Speaker; onClose: () => void }> = ({
  speaker,
  onClose,
}) => {
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
        className="fixed inset-0 z-50 flex justify-center items-center overflow-y-auto p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-lg border border-gray-200 shadow-2xl max-w-2xl w-full max-h-[85vh] my-auto flex flex-col relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="overflow-y-auto p-8 flex-grow">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
              <img
                src={speaker.profilePicture || "/default-avatar.jpg"}
                alt={speaker.fullName}
                className="w-32 h-32 rounded-full object-cover shadow-md flex-shrink-0"
              />
              <div className="text-center sm:text-left">
                <h2 className="text-3xl font-bold text-primary mb-2">
                  {speaker.fullName}
                </h2>
                <p className="text-lg text-gray-600">{speaker.tagLine}</p>
              </div>
            </div>

            {speaker.bio && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">About</h3>
                <div
                  className="text-gray-700 space-y-4"
                  dangerouslySetInnerHTML={{ __html: speaker.bio }}
                />
              </div>
            )}

            {speaker.sessions && speaker.sessions.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  Sessions
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  Tap a talk to view it in the schedule.
                </p>
                <div className="space-y-2">
                  {speaker.sessions.map((session) => (
                    <Link
                      key={session.id}
                      to={`/schedule#${session.id}`}
                      className="group flex items-center justify-between gap-3 rounded-lg border border-gray-200 px-4 py-3 transition-colors hover:border-primary hover:bg-primary/5"
                    >
                      <span className="flex flex-wrap items-center gap-2">
                        {session.type && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${sessionTypeBadgeClasses[session.type]}`}
                          >
                            {session.type}
                          </span>
                        )}
                        <span className="font-medium text-gray-800 group-hover:text-primary">
                          {session.name}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className="shrink-0 text-primary transition-transform group-hover:translate-x-0.5"
                      >
                        →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="p-4 pb-8 text-center bg-white flex-shrink-0 relative">
            <div className="absolute bottom-full left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
            <Button onClick={onClose} variant="primary">
              Back
            </Button>
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}

export default SpeakerModal
