// Build-only entry point for scripts/generate-schedule-pdf.mjs.
import { useEffect, useRef, useState } from "react"
import { createRoot } from "react-dom/client"
import { useSessionizeSchedule } from "../../hooks/use-sessionize"
import { preparePrint } from "../../utils/print"
import AttendeeScheduleDocument from "./attendee-schedule"
import "../../styles/global.css"

function SchedulePdf() {
  const { schedule, isLoading } = useSessionizeSchedule()
  const root = useRef<HTMLDivElement>(null)
  const [fetchedAt] = useState(() => new Date())
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!isLoading && schedule.length && root.current) {
      void preparePrint(root.current).then(() => setReady(true))
    }
  }, [isLoading, schedule])

  return (
    <div ref={root} data-pdf-ready={ready}>
      <title>Schedule | Cloud Native Denmark</title>
      <AttendeeScheduleDocument days={schedule} fetchedAt={fetchedAt} />
    </div>
  )
}

createRoot(document.getElementById("root")!).render(<SchedulePdf />)
