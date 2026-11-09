import { type ReactNode } from "react"
import Logo from "../../images/logo.svg"
import { formatEventDate } from "../../utils/time-formatting"
import "../../styles/print-sheet.css"

const fetchedAtFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Copenhagen",
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
})

export default function PrintSheet({
  title,
  context,
  date,
  fetchedAt,
  label,
  children,
}: {
  title: string
  context: string
  date: string
  fetchedAt: Date | null
  label: string
  children: ReactNode
}) {
  return (
    <section className="print-sheet" aria-label={label}>
      <header className="print-sheet-header">
        <div className="print-brand">
          <img
            className="print-logo"
            src={Logo}
            width={44}
            height={44}
            alt="Cloud Native Denmark"
          />
          <div>
            <p>Cloud Native Denmark · {context}</p>
            <h2>{title}</h2>
          </div>
        </div>
        <p>
          {formatEventDate(date)}
          <br />
          <strong>{label}</strong>
        </p>
      </header>
      <div className="print-sheet-body">{children}</div>
      <footer className="print-sheet-footer">
        <span>All times: Copenhagen · {date}</span>
        <span>
          Data fetched:{" "}
          {fetchedAt ? fetchedAtFormat.format(fetchedAt) : "Loading"}
        </span>
      </footer>
    </section>
  )
}
