import { useEffect, useState } from "react"
import {
  useSessionizeSchedule,
  type GridEntry,
} from "../../hooks/use-sessionize"
import { getItem, setItem, StorageKeys } from "./storage"

// Cache-first: hydrates instantly from whatever was last successfully
// fetched (works offline / on a cold cache-only load), then swaps in fresh
// data in the background whenever the network fetch succeeds.
export function useOfflineSchedule() {
  const { schedule: liveSchedule } = useSessionizeSchedule()
  const [schedule, setSchedule] = useState<GridEntry[]>(() =>
    getItem<GridEntry[]>(StorageKeys.scheduleCache, [])
  )
  const [isOffline, setIsOffline] = useState(
    typeof navigator !== "undefined" ? !navigator.onLine : false
  )

  useEffect(() => {
    if (liveSchedule.length > 0) {
      setSchedule(liveSchedule)
      setItem(StorageKeys.scheduleCache, liveSchedule)
    }
  }, [liveSchedule])

  useEffect(() => {
    const onOnline = () => setIsOffline(false)
    const onOffline = () => setIsOffline(true)
    window.addEventListener("online", onOnline)
    window.addEventListener("offline", onOffline)
    return () => {
      window.removeEventListener("online", onOnline)
      window.removeEventListener("offline", onOffline)
    }
  }, [])

  return {
    schedule,
    isOffline,
    isFromCache: liveSchedule.length === 0 && schedule.length > 0,
  }
}
