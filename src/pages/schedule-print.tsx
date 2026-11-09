import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import Button from "../components/ui/button"
import AttendeeScheduleDocument from "../components/print/attendee-schedule"
import { useSessionizeSchedule } from "../hooks/use-sessionize"
import { preparePrint } from "../utils/print"

export default function SchedulePrintPage() {
  const { schedule, isLoading } = useSessionizeSchedule()
  const [fetchedAt, setFetchedAt] = useState<Date | null>(null)
  const [printing, setPrinting] = useState(false)
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!isLoading && schedule.length) setFetchedAt(new Date())
  }, [isLoading, schedule])

  const print = async () => {
    setPrinting(true)
    try {
      await preparePrint(rootRef.current!)
      window.print()
    } finally {
      setPrinting(false)
    }
  }

  return (
    <main className="schedule-print" ref={rootRef}>
      <title>Print schedule | Cloud Native Denmark</title>
      <meta name="robots" content="noindex, nofollow" />
      <div className="schedule-print-controls">
        <Link to="/schedule">← Schedule</Link>
        <h1>Print schedule</h1>
        <Button
          onClick={() => void print()}
          disabled={isLoading || !schedule.length || printing}
        >
          {printing ? "Preparing print…" : "Print / save PDF"}
        </Button>
        {isLoading && <p role="status">Loading schedule…</p>}
        {!isLoading && !schedule.length && (
          <p role="alert">
            Schedule unavailable. Reload this page to try again.
          </p>
        )}
      </div>
      <AttendeeScheduleDocument days={schedule} fetchedAt={fetchedAt} />
    </main>
  )
}
