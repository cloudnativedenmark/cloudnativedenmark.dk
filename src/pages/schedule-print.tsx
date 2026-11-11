import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"

export default function SchedulePrintPage() {
  const link = useRef<HTMLAnchorElement>(null)
  const started = useRef(false)

  useEffect(() => {
    if (!link.current || started.current) return

    started.current = true
    link.current.click()
  }, [])

  return (
    <main className="min-h-screen bg-cnd-bone px-6 py-12 text-cnd-ink">
      <title>Download schedule | Cloud Native Denmark</title>
      <meta name="robots" content="noindex, nofollow" />
      <div className="mx-auto max-w-3xl">
        <Link to="/schedule" className="underline">
          ← Schedule
        </Link>
        <h1 className="mt-8 text-4xl font-bold">Schedule PDF</h1>
        <p className="mt-4">
          If the download does not start, use the link below.
        </p>
        <a
          ref={link}
          href="/schedule.pdf"
          download="cloud-native-denmark-schedule.pdf"
          className="btn-pill mt-8 bg-cnd-midnight text-white"
        >
          Download schedule (PDF)
        </a>
      </div>
    </main>
  )
}
