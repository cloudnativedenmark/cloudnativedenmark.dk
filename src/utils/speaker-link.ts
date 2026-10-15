interface SpeakerRef {
  id: string
  fullName: string
}

export const speakerKey = (id: string): string =>
  id
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 10)
    .toLowerCase()

export const linkSlug = (value: string): string =>
  value
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

export const speakerPath = (speaker: SpeakerRef): string =>
  `/speakers/${linkSlug(speaker.fullName) || "speaker"}-${speakerKey(speaker.id)}/`
