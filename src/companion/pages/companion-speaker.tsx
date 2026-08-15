import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useOfflineSchedule } from "../data/use-offline-schedule"
import {
  flattenDaySessions,
  getAllSpeakersFromSchedule,
} from "../data/schedule-utils"
import { useAuth } from "../auth/auth-context"
import { formatDate, formatTimeDetailed } from "../../utils/time-formatting"

const SpeakerPicker: React.FC = () => {
  const { schedule } = useOfflineSchedule()
  const speakers = getAllSpeakersFromSchedule(schedule)
  const { setSpeakerId } = useAuth()
  const [query, setQuery] = useState("")

  const filtered = speakers.filter((s) =>
    s.fullName.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="px-4 py-4">
      <h1 className="mb-1 text-lg font-bold text-cnd-midnight">
        Which speaker are you?
      </h1>
      <p className="mb-4 text-sm text-cnd-ash">
        One-time — we'll remember this on this device.
      </p>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search your name"
        className="mb-4 w-full rounded-lg border border-cnd-fog/60 px-3 py-2.5 text-base outline-none focus:border-cnd-electric"
      />
      <div className="divide-y divide-cnd-fog/40 rounded-xl bg-white shadow-sm">
        {filtered.map((speaker) => (
          <button
            key={speaker.id}
            onClick={() => setSpeakerId(speaker.id)}
            className="block w-full px-4 py-3 text-left text-sm font-semibold text-cnd-midnight"
          >
            {speaker.fullName}
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="px-4 py-6 text-center text-sm text-cnd-ash">
            No match — try a different spelling.
          </p>
        )}
      </div>
    </div>
  )
}

const CompanionSpeaker: React.FC = () => {
  const { speakerId, setSpeakerId } = useAuth()
  const { schedule } = useOfflineSchedule()
  const navigate = useNavigate()

  if (!speakerId) {
    return <SpeakerPicker />
  }

  const mySessions = schedule.flatMap((day) =>
    flattenDaySessions(day).filter((s) =>
      s.speakers?.some((sp) => sp.id === speakerId)
    )
  )

  return (
    <div className="px-4 py-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-cnd-midnight">Your sessions</h1>
        <button
          onClick={() => setSpeakerId("")}
          className="text-xs font-semibold text-cnd-electric"
        >
          Not you?
        </button>
      </div>

      {mySessions.length === 0 && (
        <p className="py-12 text-center text-sm text-cnd-ash">
          No sessions found under that name yet — the schedule may still be
          updating.
        </p>
      )}

      <div className="divide-y divide-cnd-fog/40 rounded-xl bg-white shadow-sm">
        {mySessions.map((session) => (
          <button
            key={session.id}
            onClick={() => navigate(`/companion/session/${session.id}`)}
            className="block w-full px-4 py-3 text-left"
          >
            <div className="text-xs font-semibold text-cnd-electric">
              {formatDate(session.startsAt)} ·{" "}
              {formatTimeDetailed(session.startsAt)}
            </div>
            <div className="text-sm font-semibold text-cnd-midnight">
              {session.title || session.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default CompanionSpeaker
