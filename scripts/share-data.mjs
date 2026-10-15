import { createHash } from "node:crypto"
import { speakerKey, speakerPath } from "../src/utils/speaker-link.ts"
import { talkPath, talkType } from "../src/utils/talk-link.ts"

// Keep in sync with MainSessionizeId in src/hooks/use-sessionize.tsx.
const sessionizeId = "6dzu68z1"
const endpoints = ["Grid", "Sessions", "Speakers"]

export const fetchShareData = async () => {
  const entries = await Promise.all(
    endpoints.map(async (name) => {
      const response = await fetch(
        `https://sessionize.com/api/v2/${sessionizeId}/view/${name}`
      )
      if (!response.ok)
        throw new Error(`Sessionize ${name}: ${response.status}`)
      return [name, await response.json()]
    })
  )

  const data = Object.fromEntries(entries)
  pagesFor(data)
  return data
}

const text = (value) =>
  String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()

export const pagesFor = ({ Grid, Sessions, Speakers }) => {
  if (
    !Array.isArray(Grid) ||
    !Grid.length ||
    !Array.isArray(Sessions) ||
    !Sessions.length ||
    !Array.isArray(Speakers) ||
    !Speakers.length
  ) {
    throw new Error("Incomplete Sessionize share data")
  }

  const ids = new Set(
    Grid.flatMap(
      (day) =>
        day.timeSlots?.flatMap((slot) =>
          slot.rooms?.map((room) => room.session?.id)
        ) || []
    )
  )
  const talks = Sessions.flatMap((group) => group.sessions || [])
    .filter((session) => ids.has(session.id) && !session.isServiceSession)
    .map((session) => ({
      pathname: talkPath(session),
      title: `${talkType(session) || "Talk"}: ${text(session.title)} | Cloud Native Denmark`,
      description:
        text(session.description).slice(0, 300) ||
        "View this talk at Cloud Native Denmark.",
    }))

  if (!talks.length)
    throw new Error("No scheduled talks in Sessionize share data")

  const speakerKeys = Speakers.map((speaker) => speakerKey(speaker.id))
  if (new Set(speakerKeys).size !== speakerKeys.length) {
    throw new Error("Speaker short IDs are not unique")
  }

  const speakers = Speakers.map((speaker) => ({
    pathname: speakerPath(speaker),
    title: `${text(speaker.fullName)} | Cloud Native Denmark`,
    description:
      [text(speaker.tagLine), text(speaker.bio)]
        .filter(Boolean)
        .join(" — ")
        .slice(0, 300) || "Meet this speaker at Cloud Native Denmark.",
    image: /^https:\/\//.test(speaker.profilePicture || "")
      ? speaker.profilePicture
      : undefined,
  }))

  return [...talks, ...speakers].sort((a, b) =>
    a.pathname.localeCompare(b.pathname)
  )
}

export const digest = (data) =>
  createHash("sha256")
    .update(JSON.stringify(pagesFor(data)))
    .digest("hex")
