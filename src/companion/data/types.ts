export interface FeedbackEntry {
  sessionId: string
  attendeeId: string
  rating: number // 1-5
  comment: string
  hidden: boolean
  updatedAt: string // ISO timestamp
}

export interface ShoutMessage {
  id: string
  title: string
  body: string
  createdAt: string // ISO timestamp
}
