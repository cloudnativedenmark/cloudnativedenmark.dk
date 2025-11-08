import React from "react"
import { type Session, type Speaker } from "../hooks/use-sessionize"
import { formatDateTimeDetailed } from "../utils/time-formatting"

interface ArchiveSessionProps {
  session: Session & {
    event?: string
    year?: string
    location?: string
    room?: string
  }
  onSpeakerClick: (speaker: Speaker) => void
}

const ArchiveSession: React.FC<ArchiveSessionProps> = ({
  session,
  onSpeakerClick,
}) => {
  return (
    <div className="p-6 border border-gray-200 rounded-lg text-left bg-white hover:shadow-md transition-shadow duration-200">
      <h3 className="text-2xl font-bold">{session.title}</h3>

      {session.speakers && session.speakers.length > 0 && (
        <div className="flex flex-wrap items-center gap-4 mt-3">
          {session.speakers.map((speaker) => (
            <div
              key={speaker.id}
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onSpeakerClick(speaker)}
            >
              <img
                src={speaker.profilePicture || "/default-avatar.png"}
                alt={speaker.fullName}
                className="w-8 h-8 rounded-full object-cover"
              />
              <p className="text-md font-semibold">{speaker.fullName}</p>
            </div>
          ))}
        </div>
      )}

      <p className="mt-4 text-gray-700">{session.description}</p>

      <div className="mt-4 text-sm text-gray-600">
        <span>{formatDateTimeDetailed(session.startsAt)}</span>
        {session.event && <span> | {session.event}</span>}
        {session.room && <span> | {session.room}</span>}
      </div>

      <div className="mt-6 flex gap-4">
        {session.video ? (
          <a
            href={session.video}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center text-white font-semibold py-3 px-6 rounded-full text-md transition-colors duration-200 bg-background hover:bg-hover"
          >
            Video
          </a>
        ) : (
          <button
            disabled
            className="inline-flex items-center justify-center text-gray-500 font-semibold py-2 px-6 rounded-full text-md transition-colors duration-200 bg-gray-200 cursor-not-allowed"
          >
            Video
          </button>
        )}

        {session.slideDeck ? (
          <a
            href={`https://docs.google.com/gview?url=${session.slideDeck}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center text-white font-semibold py-2 px-6 rounded-full text-md transition-colors duration-200 bg-background hover:bg-hover"
          >
            Slides
          </a>
        ) : (
          <button
            disabled
            className="inline-flex items-center justify-center text-gray-500 font-semibold py-2 px-6 rounded-full text-md transition-colors duration-200 bg-gray-200 cursor-not-allowed"
          >
            Slides
          </button>
        )}
      </div>
    </div>
  )
}

export default ArchiveSession
