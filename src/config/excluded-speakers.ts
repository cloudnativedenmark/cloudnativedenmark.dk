import { type Speaker } from "../hooks/use-sessionize"

/**
 * Speakers who appear in the Sessionize speaker list purely because they host
 * administrative segments (welcome, keynote wrap-ups, closing remarks, etc.)
 * rather than delivering an actual talk. They still show up normally in the
 * schedule for the sessions they host — this config only hides them from the
 * public-facing speaker listings (homepage "Featured Speakers" + /speakers).
 *
 * Match on full name (case-insensitive). Add/remove names here to change who
 * is left out — no other code changes needed.
 */
export const excludedSpeakerNames: string[] = [
  "Jinhong Brejnholt",
  "Allan Højgaard Jensen",
  "Kasper Borg Nissen",
]

const normalize = (name: string) => name.trim().toLowerCase()

export const isExcludedSpeaker = (fullName: string): boolean =>
  excludedSpeakerNames.some((name) => normalize(name) === normalize(fullName))

/** Filters a speaker list down to those eligible for public speaker listings. */
export const filterPublicSpeakers = (speakers: Speaker[]): Speaker[] =>
  speakers.filter((speaker) => !isExcludedSpeaker(speaker.fullName))
