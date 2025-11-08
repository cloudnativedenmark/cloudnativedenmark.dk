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
