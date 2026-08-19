import { useEffect, useState, useCallback } from "react"
import {
  type SessionType,
  type SessionCategoryGroup,
  deduceSessionType,
  isAdminOnlySession,
} from "../utils/session-type"

export const MainSessionizeId = "6dzu68z1"

export interface SpeakerSession {
  id: number
  name: string
  /** Deduced talk type (Keynote/Session/Workshop) — null when it can't be deduced. */
  type?: SessionType | null
}
export interface Speaker {
  id: string
  name: string
  firstName: string
  lastName: string
  fullName: string
  bio: string
  tagLine: string
  profilePicture: string | null
  isTopSpeaker: boolean
  sessions: SpeakerSession[]
}
export interface Session {
  id: string
  name: string
  title: string
  description: string
  startsAt: string
  endsAt: string
  isServiceSession: boolean
  isPlenumSession: boolean
  speakers: Speaker[]
  roomId: number
  room: string
  categories?: SessionCategoryGroup[]
  questionAnswers: QuestionAnswer[]
  recordingUrl: string

  slideDeck: string
  video: string
  rate: string
}
export interface QuestionAnswer {
  id: number
  answer: string
}
export interface GridEntry {
  date: string
  rooms: Room[]
  timeSlots: TimeSlot[]
}
export interface Room {
  id: number
  name: string
  sessions: Session[]
  session: Session
}
export interface TimeSlot {
  slotStart: string
  rooms: Room[]
}
export interface SessionList {
  sessions: Session[]
}
interface SessionInsights {
  sessionTypeById: Map<string, SessionType | null>
  adminOnlySessionIds: Set<string>
}

/**
 * Walks a grid once to build the shared lookups used to enrich raw
 * Speaker/Session data everywhere it's consumed: a deduced talk type per
 * session id, and the set of admin-only sessions (welcome, keynote
 * wrap-ups, closing remarks — hosted only by the administrative hosts in
 * config/admin-hosts) that should never be listed under a speaker's
 * bio, regardless of which hook fetched that speaker.
 */
const buildSessionInsights = (grid: GridEntry[]): SessionInsights => {
  const sessionTypeById = new Map<string, SessionType | null>()
  const adminOnlySessionIds = new Set<string>()
  grid.forEach((day) => {
    day.rooms.forEach((room) => {
      room.sessions.forEach((session) => {
        sessionTypeById.set(
          session.id,
          deduceSessionType({
            startsAt: session.startsAt,
            endsAt: session.endsAt,
            room: room.name,
            isServiceSession: session.isServiceSession,
            speakers: session.speakers,
          })
        )
        if (isAdminOnlySession(session.speakers)) {
          adminOnlySessionIds.add(session.id)
        }
      })
    })
  })
  return { sessionTypeById, adminOnlySessionIds }
}

/** Applies buildSessionInsights' lookups to a speaker list's sessions. */
const enrichSpeakerSessions = (
  speakers: Speaker[],
  { sessionTypeById, adminOnlySessionIds }: SessionInsights
): Speaker[] =>
  speakers.map((speaker) => ({
    ...speaker,
    sessions: speaker.sessions
      .filter((session) => !adminOnlySessionIds.has(String(session.id)))
      .map((session) => ({
        ...session,
        type: sessionTypeById.get(String(session.id)) ?? null,
      })),
  }))

export const useSessionizeSpeakers = (sessionId: string = MainSessionizeId) => {
  const [speakers, setSpeakers] = useState<Speaker[]>([])

  const fetchSpeakers = useCallback(async () => {
    if (!sessionId) return

    const response = await fetch(
      `https://sessionize.com/api/v2/${sessionId}/view/Speakers`
    )
    if (!response.ok) {
      return
    }
    const data: Speaker[] = await response.json()

    // Cross-reference the grid so each speaker's sessions can carry a
    // deduced talk type and have admin-only sessions dropped, as everywhere
    // else. Best-effort: if this fails, sessions just have no type and
    // nothing is dropped.
    let insights: SessionInsights = {
      sessionTypeById: new Map(),
      adminOnlySessionIds: new Set(),
    }
    try {
      const gridResponse = await fetch(
        `https://sessionize.com/api/v2/${sessionId}/view/Grid`
      )
      if (gridResponse.ok) {
        const grid: GridEntry[] = await gridResponse.json()
        insights = buildSessionInsights(grid)
      }
    } catch {
      // Ignore — talk type is a nice-to-have, not required for the speaker list.
    }

    setSpeakers(enrichSpeakerSessions(data, insights))
  }, [sessionId])

  useEffect(() => {
    fetchSpeakers()
  }, [fetchSpeakers])

  return { speakers }
}
export const useSessionizeSchedule = (sessionId: string = MainSessionizeId) => {
  const [grid, setGrid] = useState<GridEntry[]>([])
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [schedule, setSchedule] = useState<GridEntry[]>([])
  const [sessions, setSessions] = useState<SessionList[]>([])
  const [loaded, setLoaded] = useState({
    grid: false,
    speakers: false,
    sessions: false,
  })

  const fetchGrid = useCallback(async () => {
    try {
      const response = await fetch(
        `https://sessionize.com/api/v2/${sessionId}/view/Grid`
      )
      if (!response.ok) {
        return
      }
      const data = await response.json()
      setGrid(data)
    } finally {
      setLoaded((s) => ({ ...s, grid: true }))
    }
  }, [sessionId])

  const fetchSpeakers = useCallback(async () => {
    try {
      const response = await fetch(
        `https://sessionize.com/api/v2/${sessionId}/view/Speakers`
      )
      if (!response.ok) {
        return
      }
      const data = await response.json()
      setSpeakers(data)
    } finally {
      setLoaded((s) => ({ ...s, speakers: true }))
    }
  }, [sessionId])

  const fetchSessions = useCallback(async () => {
    try {
      const response = await fetch(
        `https://sessionize.com/api/v2/${sessionId}/view/Sessions`
      )
      if (!response.ok) {
        return
      }
      const data = await response.json()
      setSessions(data)
    } finally {
      setLoaded((s) => ({ ...s, sessions: true }))
    }
  }, [sessionId])

  useEffect(() => {
    if (sessionId) {
      fetchGrid()
    }
  }, [sessionId, fetchGrid])
  useEffect(() => {
    if (sessionId) {
      fetchSpeakers()
    }
  }, [sessionId, fetchSpeakers])
  useEffect(() => {
    if (sessionId) {
      fetchSessions()
    }
  }, [sessionId, fetchSessions])
  useEffect(() => {
    if (grid.length === 0 || speakers.length === 0 || sessions.length === 0) {
      setSchedule([])
      return
    }
    // Same enrichment as useSessionizeSpeakers (deduced talk type,
    // admin-only sessions dropped) so a speaker's bio modal looks identical
    // whether it was opened from the schedule or from /speakers.
    const enrichedSpeakers = enrichSpeakerSessions(
      speakers,
      buildSessionInsights(grid)
    )
    const schedule = grid.map((entry) => {
      const timeSlots = entry.timeSlots.map((timeSlot) => {
        const rooms = timeSlot.rooms.map((room) => {
          const sessionSpeakers = room.session.speakers.map((speaker) => {
            return enrichedSpeakers.find((s) => s.id === speaker.id)
          })
          room.session.speakers = sessionSpeakers.filter(
            (s): s is Speaker => s !== undefined
          )

          const session = sessions[0].sessions.find(
            (s) => room.session.id === s.id
          )
          if (session !== undefined) {
            const slides = session.questionAnswers.find((q) => q.id === 99194)
            if (slides !== undefined) {
              room.session.slideDeck = slides.answer
            }
            const rate = session.questionAnswers.find((q) => q.id === 112538)
            if (rate !== undefined) {
              room.session.rate = rate.answer
            }
            room.session.title = session.title
            room.session.description = session.description
            room.session.video = session.recordingUrl
          }

          return room
        })
        return {
          ...timeSlot,
          rooms,
        }
      })
      return {
        ...entry,
        timeSlots,
      }
    })
    setSchedule(schedule)
  }, [grid, speakers, sessions])

  const isLoading = !(loaded.grid && loaded.speakers && loaded.sessions)

  return { schedule, isLoading }
}
