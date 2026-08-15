import { useEffect, useState } from "react"
import {
  useSessionizeSchedule,
  type GridEntry,
} from "../../hooks/use-sessionize"
import { getItem, setItem, StorageKeys } from "./storage"

// TEMPORARY: the 2026 Sessionize schedule isn't fully populated yet, so
// for now this points at last year's (real, complete) event instead of the
// live 2026 one — lets people actually try the companion app before the
// real schedule exists. Swap back to a no-arg call (defaults to
// MainSessionizeId) once 2026 has real session data.
const DEMO_SESSIONIZE_ID = "ri9gml9f" // CND 2025 Aarhus

// Cache-first: hydrates instantly from whatever was last successfully
// fetched (works offline / on a cold cache-only load), then swaps in fresh
// data in the background whenever the network fetch succeeds.
export function useOfflineSchedule() {
  const { schedule: liveSchedule } = useSessionizeSchedule(DEMO_SESSIONIZE_ID)
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
