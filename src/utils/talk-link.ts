import {
  deduceSessionType,
  type SessionTiming,
  type SessionType,
} from "./session-type.ts"
import { linkSlug } from "./speaker-link.ts"

interface TalkRef extends Partial<SessionTiming> {
  id: string | number
  title?: string
  name?: string
  type?: SessionType | null
}

export const talkType = (talk: TalkRef): SessionType | null => {
  if (talk.type) return talk.type
  if (!talk.startsAt || !talk.endsAt) return null

  return deduceSessionType(talk as SessionTiming)
}

export const talkPath = (talk: TalkRef): string => {
  const typeSlug = linkSlug(talkType(talk) || "Talk")
  const title = linkSlug(talk.title || talk.name || "talk") || "talk"

  return `/schedule/talk/${typeSlug}-${title}-${encodeURIComponent(talk.id)}/`
}
