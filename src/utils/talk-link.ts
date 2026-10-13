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

export const talkPath = (talk: TalkRef): string => {
  const type =
    talk.type ||
    (talk.startsAt && talk.endsAt
      ? deduceSessionType(talk as SessionTiming)
      : null)
  const typeSlug = linkSlug(type || "Talk")
  const title = linkSlug(talk.title || talk.name || "talk") || "talk"

  return `/schedule/talk/${typeSlug}-${title}-${encodeURIComponent(talk.id)}/`
}
