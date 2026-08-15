import { useCallback, useEffect, useMemo, useState } from "react"
import type { FeedbackEntry } from "./types"
import { getItem, setItem, StorageKeys } from "./storage"
import { apiRequest, isApiConfigured, adminHeaders } from "./api-client"
import { useAuth } from "../auth/auth-context"

// This device's own feedback (works with or without a backend — the
// backend, when configured, is best-effort sync so an admin/speaker on a
// *different* device can see it too).
export function useMyFeedback() {
  const { deviceId } = useAuth()
  const [entries, setEntries] = useState<Record<string, FeedbackEntry>>(() =>
    getItem<Record<string, FeedbackEntry>>(StorageKeys.feedback, {})
  )

  const myFeedbackFor = useCallback(
    (sessionId: string): FeedbackEntry | undefined => entries[sessionId],
    [entries]
  )

  const submitFeedback = useCallback(
    async (sessionId: string, rating: number, comment: string) => {
      const entry: FeedbackEntry = {
        sessionId,
        attendeeId: deviceId,
        rating,
        comment,
        hidden: false,
        updatedAt: new Date().toISOString(),
      }
      setEntries((prev) => {
        const next = { ...prev, [sessionId]: entry }
        setItem(StorageKeys.feedback, next)
        return next
      })
      // Best-effort — local copy above is the source of truth for "my
      // feedback" regardless of whether this succeeds.
      await apiRequest("/feedback", {
        method: "POST",
        body: JSON.stringify(entry),
      })
    },
    [deviceId]
  )

  const allEntries = useMemo(
    () =>
      Object.values(entries).sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ),
    [entries]
  )

  return { myFeedbackFor, submitFeedback, allEntries }
}

// All feedback across all attendees — only possible via the backend, since
// a static site has no shared store across devices. Used by admin/speaker
// views only.
export function useAllFeedback() {
  const [entries, setEntries] = useState<FeedbackEntry[] | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const data = await apiRequest<FeedbackEntry[]>("/feedback")
    setEntries(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const setHidden = useCallback(
    async (sessionId: string, attendeeId: string, hidden: boolean) => {
      await apiRequest(
        `/feedback/${encodeURIComponent(sessionId)}/${encodeURIComponent(attendeeId)}`,
        {
          method: "PATCH",
          headers: adminHeaders(),
          body: JSON.stringify({ hidden }),
        }
      )
      await refresh()
    },
    [refresh]
  )

  return {
    entries,
    loading,
    connected: isApiConfigured(),
    setHidden,
    refresh,
  }
}
