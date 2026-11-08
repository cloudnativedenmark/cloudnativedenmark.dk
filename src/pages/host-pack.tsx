import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { flushSync } from "react-dom"
import { Link, useSearchParams } from "react-router-dom"
import Button from "../components/ui/button"
import CopyLinkButton from "../components/copy-link-button"
import {
  useSessionizeSchedule,
  type Session,
  type Speaker,
} from "../hooks/use-sessionize"
import {
  hostDate,
  hostTime,
  hostTalks,
  hostTimeline,
  paginateHostCards,
} from "../utils/host-pack"
import { formatPlainTextToHtml } from "../utils/text-formatting"
import "../styles/host-pack.css"

const formats = {
  spacious: {
    name: "One per page",
    description:
      "Large portraits and 12 pt text. One session starts on each sheet.",
    limit: 1,
  },
  paired: {
    name: "Two per page",
    description: "Up to two sessions per sheet, with 11 pt text.",
    limit: 2,
  },
  compact: {
    name: "Compact",
    description: "Fit as many sessions as possible, with 10 pt text.",
    limit: Infinity,
  },
}

type Format = keyof typeof formats

function Portrait({ speaker }: { speaker: Speaker }) {
  const [failed, setFailed] = useState(false)

  if (!speaker.profilePicture || failed) {
    return (
      <div className="host-photo host-photo-missing">Photo unavailable</div>
    )
  }

  return (
    <img
      className="host-photo"
      src={speaker.profilePicture}
      alt={speaker.fullName || speaker.name}
      onError={() => setFailed(true)}
    />
  )
}

function TalkCard({ session }: { session: Session }) {
  return (
    <article className="host-card">
      <div className="host-card-heading">
        <p className="host-time">
          {hostTime(session.startsAt)}–{hostTime(session.endsAt)}
        </p>
        <h2>{session.title || session.name}</h2>
      </div>
      <div className="host-speakers">
        {session.speakers.map((speaker) => (
          <div className="host-speaker" key={speaker.id}>
            <Portrait key={speaker.profilePicture} speaker={speaker} />
            <div>
              <h3>{speaker.fullName || speaker.name}</h3>
              <p>{speaker.tagLine}</p>
            </div>
          </div>
        ))}
        {!session.speakers.length && <p>Speaker information unavailable.</p>}
      </div>
      <div
        className="host-abstract"
        dangerouslySetInnerHTML={{
          __html:
            formatPlainTextToHtml(session.description) ||
            "<p>Abstract unavailable.</p>",
        }}
      />
    </article>
  )
}

function Sheet({
  room,
  date,
  fetchedAt,
  label,
  children,
}: {
  room: string
  date: string
  fetchedAt: Date | null
  label: string
  children: ReactNode
}) {
  return (
    <section className="host-sheet" aria-label={label}>
      <header className="host-sheet-header">
        <div>
          <p>Cloud Native Denmark · Track host pack</p>
          <h2>{room}</h2>
        </div>
        <p>
          {hostDate(date)}
          <br />
          <strong>{label}</strong>
        </p>
      </header>
      <div className="host-sheet-body">{children}</div>
      <footer className="host-sheet-footer">
        <span>All times: Copenhagen · {date}</span>
        <span>
          Data fetched:{" "}
          {fetchedAt
            ? fetchedAt.toLocaleString("en-GB", {
                timeZone: "Europe/Copenhagen",
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
            : "Loading"}
        </span>
      </footer>
    </section>
  )
}

export default function HostPack() {
  const { schedule, isLoading } = useSessionizeSchedule()
  const [params, setParams] = useSearchParams()
  const [fetchedAt, setFetchedAt] = useState<Date | null>(null)
  const [groups, setGroups] = useState<number[][]>([])
  const [hasLongSessions, setHasLongSessions] = useState(false)
  const [printing, setPrinting] = useState(false)
  const [overviewOnly, setOverviewOnly] = useState(false)
  const measureRef = useRef<HTMLDivElement>(null)
  const requestedFormat = params.get("format")
  const format: Format =
    requestedFormat && Object.hasOwn(formats, requestedFormat)
      ? (requestedFormat as Format)
      : "paired"
  const date = params.get("date") || schedule[0]?.date.slice(0, 10) || ""
  const day = schedule.find((entry) => entry.date.slice(0, 10) === date)
  const roomId = Number(params.get("room") || day?.rooms[0]?.id)
  const room = day?.rooms.find((entry) => entry.id === roomId)
  const sessions = day && room ? hostTalks(day, roomId) : []
  const timeline = day && room ? hostTimeline(day, roomId) : []
  const includeOverview = params.get("overview") !== "0"
  const pageCount = groups.length + (includeOverview ? 1 : 0)

  useEffect(() => {
    if (!isLoading && schedule.length) setFetchedAt(new Date())
  }, [isLoading, schedule])

  useLayoutEffect(() => {
    const root = measureRef.current
    if (!root) return
    let active = true

    const measure = () => {
      if (!active) return
      const cards = Array.from(root.querySelectorAll<HTMLElement>(".host-card"))
      const body = root.querySelector<HTMLElement>(".host-measure-budget")!
      const available = body.getBoundingClientRect().height
      if (!available) return
      const heights = cards.map((card) => card.getBoundingClientRect().height)
      setHasLongSessions(heights.some((height) => height > available))
      const next = paginateHostCards(
        heights,
        available,
        parseFloat(getComputedStyle(root).rowGap),
        formats[format].limit
      )
      setGroups((previous) =>
        JSON.stringify(previous) === JSON.stringify(next) ? previous : next
      )
    }

    const observer = new ResizeObserver(measure)
    observer.observe(root)
    root
      .querySelectorAll(".host-card")
      .forEach((card) => observer.observe(card))
    void document.fonts.ready.then(measure)
    measure()

    return () => {
      active = false
      observer.disconnect()
    }
  }, [day, roomId, format])

  const update = (values: Record<string, string>) => {
    const next = new URLSearchParams(params)
    next.set("date", date)
    next.set("room", String(roomId))
    next.set("format", format)
    Object.entries(values).forEach(([key, value]) => next.set(key, value))
    setParams(next)
  }

  const print = async (onlyOverview: boolean) => {
    setPrinting(true)
    try {
      await document.fonts.ready
      await Promise.all(
        Array.from(
          document.querySelectorAll<HTMLImageElement>(".host-talk-sheets img")
        ).map((image) => {
          if (image.complete) return
          const { promise, resolve } = Promise.withResolvers<void>()
          const done = () => resolve()
          image.addEventListener("load", done, { once: true })
          image.addEventListener("error", done, { once: true })
          return promise
        })
      )
      flushSync(() => setOverviewOnly(onlyOverview))
      window.print()
    } finally {
      setPrinting(false)
      setOverviewOnly(false)
    }
  }

  const linkParams = new URLSearchParams({
    date,
    room: String(roomId),
    format,
    overview: includeOverview ? "1" : "0",
  })

  return (
    <main
      className={`host-pack host-format-${format}${overviewOnly ? " host-overview-only" : ""}${!includeOverview ? " host-no-overview" : ""}`}
    >
      <title>{`${room ? `${room.name} · ${date} · Host pack` : "Track host pack"} | Cloud Native Denmark`}</title>
      <meta name="robots" content="noindex, nofollow" />
      <div className="host-controls">
        <Link to="/" className="host-back">
          ← Cloud Native Denmark
        </Link>
        <p className="eyebrow">For organisers and track hosts</p>
        <h1 className="display">Track host pack</h1>
        <p className="host-intro">
          Read up. Meet your speakers. Keep the day on track.
        </p>
        <p className="host-public">
          Unlisted, not private. This page uses public speaker information only.
        </p>
        {schedule.length > 0 && (
          <>
            <div className="host-selectors">
              <label>
                Date
                <select
                  value={date}
                  onChange={(event) => {
                    const nextDay = schedule.find((entry) =>
                      entry.date.startsWith(event.target.value)
                    )!
                    update({
                      date: event.target.value,
                      room: String(
                        nextDay.rooms.some((entry) => entry.id === roomId)
                          ? roomId
                          : nextDay.rooms[0]?.id
                      ),
                    })
                  }}
                >
                  {!day && <option value={date}>Unknown date: {date}</option>}
                  {schedule.map((entry) => (
                    <option key={entry.date} value={entry.date.slice(0, 10)}>
                      {hostDate(entry.date)}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Track
                <select
                  value={roomId}
                  onChange={(event) => update({ room: event.target.value })}
                >
                  {!room && <option value={roomId}>Select a track</option>}
                  {day?.rooms.map((entry) => (
                    <option key={entry.id} value={entry.id}>
                      {entry.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <fieldset className="host-formats">
              <legend>Compare print formats</legend>
              {(
                Object.entries(formats) as [Format, (typeof formats)[Format]][]
              ).map(([key, entry]) => (
                <label
                  className={
                    key === format
                      ? "host-format-option host-selected"
                      : "host-format-option"
                  }
                  key={key}
                >
                  <input
                    type="radio"
                    name="format"
                    value={key}
                    checked={format === key}
                    onChange={() => update({ format: key })}
                  />
                  <span>
                    <strong>{entry.name}</strong>
                    <span>{entry.description}</span>
                  </span>
                </label>
              ))}
            </fieldset>
            <label className="host-overview-toggle">
              <input
                type="checkbox"
                checked={includeOverview}
                onChange={(event) =>
                  update({ overview: event.target.checked ? "1" : "0" })
                }
              />{" "}
              Include day overview
            </label>
            <div className="host-actions">
              <Button
                disabled={!room || !groups.length || printing}
                onClick={() => void print(false)}
              >
                {printing ? "Preparing print…" : "Print / save PDF"}
              </Button>
              <Button
                variant="secondary"
                disabled={!room || printing}
                onClick={() => void print(true)}
              >
                Print overview only
              </Button>
              <CopyLinkButton
                key={linkParams.toString()}
                path={`/host-pack?${linkParams}`}
                label="Copy pack link"
              />
            </div>
            <p className="host-print-help">
              A4 portrait · 100% scale · Turn off browser headers and footers.
              Full abstracts in every format. Long sessions get their own sheet
              and continue onto another sheet if needed.
            </p>
            {room && (
              <p className="host-count" aria-live="polite">
                {sessions.length} sessions ·{" "}
                {hasLongSessions ? "at least " : ""}
                {pageCount} {pageCount === 1 ? "sheet" : "sheets"} including{" "}
                {includeOverview ? "the overview" : "no overview"}.
                {hasLongSessions
                  ? " Long abstracts continue when printed."
                  : " Compare the previews below."}
              </p>
            )}
          </>
        )}
        {isLoading && <p role="status">Loading schedule and speakers…</p>}
        {!isLoading && !schedule.length && (
          <p role="alert">
            Schedule unavailable. Reload this page to try again.
          </p>
        )}
        {schedule.length > 0 && (!day || !room) && (
          <p role="alert">
            This date or track is not in the schedule. Select a listed date and
            track.
          </p>
        )}
      </div>
      {day && room && (
        <>
          <div className="host-measure" ref={measureRef} aria-hidden="true">
            <div className="host-measure-budget" />
            {sessions.map((session) => (
              <TalkCard session={session} key={session.id} />
            ))}
          </div>
          <div className="host-sheets">
            <div className="host-overview">
              <Sheet
                room={room.name}
                date={date}
                fetchedAt={fetchedAt}
                label="Day overview"
              >
                <h1 className="host-overview-title">Your day at a glance</h1>
                <p className="host-overview-intro">
                  Shaded rows take place elsewhere while this track is idle.
                  Locations are shown below.
                </p>
                <table className="host-timeline">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Session / speakers</th>
                      <th>Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeline.map((session) => (
                      <tr
                        className={
                          session.roomId !== roomId ? "host-elsewhere" : ""
                        }
                        key={session.id}
                      >
                        <td>
                          {hostTime(session.startsAt)}–
                          {hostTime(session.endsAt)}
                        </td>
                        <td>
                          <strong>{session.title || session.name}</strong>
                          <span>
                            {session.speakers
                              .map(
                                (speaker) => speaker.fullName || speaker.name
                              )
                              .join(" · ")}
                          </span>
                        </td>
                        <td>{session.room}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Sheet>
            </div>
            <div className="host-talk-sheets">
              {groups.map((group, index) => (
                <Sheet
                  key={group.join("-")}
                  room={room.name}
                  date={date}
                  fetchedAt={fetchedAt}
                  label={`Sessions · ${index + 1} / ${groups.length}`}
                >
                  {group.map(
                    (sessionIndex) =>
                      sessions[sessionIndex] && (
                        <TalkCard
                          session={sessions[sessionIndex]}
                          key={sessions[sessionIndex].id}
                        />
                      )
                  )}
                </Sheet>
              ))}
              {!sessions.length && (
                <p className="host-empty">
                  No talks are scheduled for this track on this date.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  )
}
