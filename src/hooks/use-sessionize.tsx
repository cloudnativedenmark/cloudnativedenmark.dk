import { useEffect, useState, useCallback } from "react"

export const MainSessionizeId = "ri9gml9f" // 'ri9gml9f'; // TEST ID: jl4ktls0

export interface SpeakerSession {
  id: number
  name: string
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
    setSpeakers(data.filter((speaker) => speaker.profilePicture !== null))
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

  const fetchGrid = useCallback(async () => {
    const response = await fetch(
      `https://sessionize.com/api/v2/${sessionId}/view/Grid`
    )
    if (!response.ok) {
      return
    }
    const data = await response.json()
    setGrid(data)
  }, [sessionId])

  const fetchSpeakers = useCallback(async () => {
    const response = await fetch(
      `https://sessionize.com/api/v2/${sessionId}/view/Speakers`
    )
    if (!response.ok) {
      return
    }
    const data = await response.json()
    setSpeakers(data)
  }, [sessionId])

  const fetchSessions = useCallback(async () => {
    const response = await fetch(
      `https://sessionize.com/api/v2/${sessionId}/view/Sessions`
    )
    if (!response.ok) {
      return
    }
    const data = await response.json()
    setSessions(data)
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
    const schedule = grid.map((entry) => {
      const timeSlots = entry.timeSlots.map((timeSlot) => {
        const rooms = timeSlot.rooms.map((room) => {
          const sessionSpeakers = room.session.speakers.map((speaker) => {
            return speakers.find((s) => s.id === speaker.id)
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

  return { schedule }
}
