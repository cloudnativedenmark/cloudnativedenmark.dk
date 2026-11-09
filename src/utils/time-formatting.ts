export const formatTime = (timeString: string) => {
  return timeString.substring(0, timeString.lastIndexOf(":"))
}

export const formatTimeDetailed = (timeString: string) => {
  return new Date(timeString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
}

export const formatDateTimeDetailed = (dateString: string) => {
  return new Date(dateString).toLocaleString([], {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const calculateSessionDuration = (startsAt: string, endsAt: string) => {
  const starts = new Date(startsAt)
  const ends = new Date(endsAt)
  return (ends.getTime() - starts.getTime()) / (1000 * 60) // duration in minutes
}

const eventTimeFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Copenhagen",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
})

const eventDateFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Copenhagen",
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
})

export const formatEventTime = (value: string): string => {
  // Sessionize's offset-free timestamps are event-local, not device-local.
  if (!/(Z|[+-]\d{2}:\d{2})$/i.test(value)) return value.slice(11, 16)
  return eventTimeFormat.format(new Date(value))
}

export const formatEventDate = (value: string): string =>
  eventDateFormat.format(new Date(`${value.slice(0, 10)}T12:00:00Z`))
