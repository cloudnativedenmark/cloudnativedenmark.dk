import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"
import { Link, useSearchParams } from "react-router-dom"
import Button from "../components/ui/button"
import CopyLinkButton from "../components/copy-link-button"
import {
  useSessionizeSchedule,
  type GridEntry,
  type Room,
  type Session,
  type Speaker,
} from "../hooks/use-sessionize"
import {
  trackTalks,
  trackTimeline,
  trackSections,
  paginateTrackCards,
} from "../utils/track-overview"
import { formatPlainTextToHtml } from "../utils/text-formatting"
import PrintSheet from "../components/print/print-sheet"
import { formatEventDate, formatEventTime } from "../utils/time-formatting"
import { preparePrint } from "../utils/print"
import "../styles/track-overview.css"

const formats = {
  spacious: {
    name: "One per page",
    description: "Large portraits, 12 pt text, and space for notes.",
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
      <div className="track-overview-photo track-overview-photo-missing">
        Photo unavailable
      </div>
    )
  }

  return (
    <img
      className="track-overview-photo"
      src={speaker.profilePicture}
      alt={speaker.fullName || speaker.name}
      onError={() => setFailed(true)}
    />
  )
}

function TalkCard({ session }: { session: Session }) {
  return (
    <article className="track-overview-card">
      <div className="track-overview-card-heading">
        <p className="track-overview-time">
          {formatEventTime(session.startsAt)}–{formatEventTime(session.endsAt)}
        </p>
        <h2>{session.title || session.name}</h2>
      </div>
      <div className="track-overview-speakers">
        {session.speakers.map((speaker) => (
          <div className="track-overview-speaker" key={speaker.id}>
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
        className="track-overview-abstract"
        dangerouslySetInnerHTML={{
          __html:
            formatPlainTextToHtml(session.description) ||
            "<p>Abstract unavailable.</p>",
        }}
      />
    </article>
  )
}

function DayOverview({
  day,
  rooms,
  fetchedAt,
}: {
  day: GridEntry
  rooms: Room[]
  fetchedAt: Date | null
}) {
  const roomIds = rooms.map((room) => room.id)
  const timeline = trackTimeline(day, roomIds)
  const stageIds = day.rooms.map((room) => room.id).sort((a, b) => a - b)

  return (
    <div className="track-overview-sheets track-overview-overview">
      <PrintSheet
        context="Track overview"
        title={rooms.map((room) => room.name).join(" · ")}
        date={day.date.slice(0, 10)}
        fetchedAt={fetchedAt}
        label="Day overview"
      >
        <table className="track-overview-timeline">
          <thead>
            <tr>
              <th>Time</th>
              <th>Session / speakers</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {timeline.map((session) => {
              const sharedService =
                session.isPlenumSession && session.isServiceSession

              return (
                <tr
                  className={
                    sharedService
                      ? "track-overview-shared-service"
                      : `track-overview-stage-${stageIds.indexOf(session.roomId)}`
                  }
                  key={session.id}
                >
                  <td>
                    {formatEventTime(session.startsAt)}–
                    {formatEventTime(session.endsAt)}
                  </td>
                  <td>
                    <strong>{session.title || session.name}</strong>
                    <span>
                      {session.speakers.length > 0 && " · "}
                      {session.speakers
                        .map((speaker) => speaker.fullName || speaker.name)
                        .join(" · ")}
                    </span>
                    {sharedService && session.description && (
                      <span className="track-overview-service-directions">
                        {" · "}
                        {session.description}
                      </span>
                    )}
                  </td>
                  <td>{!sharedService && session.room}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </PrintSheet>
    </div>
  )
}

function TrackSection({
  day,
  room,
  format,
  fetchedAt,
}: {
  day: GridEntry
  room: Room
  format: Format
  fetchedAt: Date | null
}) {
  const [groups, setGroups] = useState<number[][]>([])
  const [hasLongSessions, setHasLongSessions] = useState(false)
  const measureRef = useRef<HTMLDivElement>(null)
  const date = day.date.slice(0, 10)
  const roomId = room.id
  const sessions = trackTalks(day, roomId)
  const pageCount = groups.length

  useLayoutEffect(() => {
    const root = measureRef.current
    if (!root) return
    let active = true

    const measure = () => {
      if (!active) return
      const cards = Array.from(
        root.querySelectorAll<HTMLElement>(".track-overview-card")
      )
      const body = root.querySelector<HTMLElement>(
        ".track-overview-measure-budget"
      )!
      const available = body.getBoundingClientRect().height
      if (!available) return
      const heights = cards.map((card) => card.getBoundingClientRect().height)
      setHasLongSessions(heights.some((height) => height > available))
      const next = paginateTrackCards(
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
      .querySelectorAll(".track-overview-card")
      .forEach((card) => observer.observe(card))
    void document.fonts.ready.then(measure)
    measure()

    return () => {
      active = false
      observer.disconnect()
    }
  }, [day, roomId, format])
  return (
    <section
      className="track-overview-track-section"
      data-date={date}
      data-room={roomId}
    >
      <div className="track-overview-section-heading">
        <h2>
          {formatEventDate(date)} · {room.name}
        </h2>
        <p>
          {sessions.length} sessions · {hasLongSessions ? "at least " : ""}
          {pageCount} {pageCount === 1 ? "sheet" : "sheets"}
        </p>
      </div>
      <div
        className="track-overview-measure"
        ref={measureRef}
        aria-hidden="true"
      >
        <div className="track-overview-measure-budget" />
        {sessions.map((session) => (
          <TalkCard session={session} key={session.id} />
        ))}
      </div>
      <div className="track-overview-sheets">
        <div className="track-overview-talk-sheets">
          {groups.map((group, index) => (
            <PrintSheet
              context="Track overview"
              key={group.join("-")}
              title={room.name}
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
            </PrintSheet>
          ))}
          {!sessions.length && (
            <p className="track-overview-empty">
              No talks are scheduled for this track on this date.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

export default function TrackOverview() {
  const { schedule, isLoading } = useSessionizeSchedule()
  const [params, setParams] = useSearchParams()
  const [fetchedAt, setFetchedAt] = useState<Date | null>(null)
  const [printing, setPrinting] = useState(false)
  const [overviewOnly, setOverviewOnly] = useState(false)
  const printRef = useRef<HTMLElement>(null)
  const requestedFormat = params.get("format")
  const format: Format =
    requestedFormat && Object.hasOwn(formats, requestedFormat)
      ? (requestedFormat as Format)
      : "paired"
  const dates = params.has("date")
    ? params.getAll("date").filter(Boolean)
    : schedule.slice(0, 1).map((day) => day.date.slice(0, 10))
  const rooms = [
    ...new Map(
      schedule.flatMap((day) =>
        day.rooms.map((room) => [room.id, room] as const)
      )
    ).values(),
  ]
  const roomIds = params.has("room")
    ? params.getAll("room").filter(Boolean).map(Number)
    : rooms.slice(0, 1).map((room) => room.id)
  const sections = trackSections(schedule, dates, roomIds)
  const selectedDays = [
    ...new Map(sections.map(({ day }) => [day.date, day])).values(),
  ]
  const includeOverview = params.get("overview") !== "0"
  const linkParams = new URLSearchParams({
    format,
    overview: includeOverview ? "1" : "0",
  })
  if (!dates.length) linkParams.set("date", "")
  dates.forEach((date) => linkParams.append("date", date))
  if (!roomIds.length) linkParams.set("room", "")
  roomIds.forEach((roomId) => linkParams.append("room", String(roomId)))

  useEffect(() => {
    if (!isLoading && schedule.length) setFetchedAt(new Date())
  }, [isLoading, schedule])

  const update = (values: Record<string, string | string[]>) => {
    const next = new URLSearchParams(linkParams)
    Object.entries(values).forEach(([key, value]) => {
      next.delete(key)
      const entries = Array.isArray(value) ? value : [value]
      if (!entries.length) next.set(key, "")
      entries.forEach((entry) => next.append(key, entry))
    })
    setParams(next)
  }

  const print = async (onlyOverview: boolean) => {
    setPrinting(true)
    try {
      await preparePrint(printRef.current!)
      flushSync(() => setOverviewOnly(onlyOverview))
      window.print()
    } finally {
      setPrinting(false)
      setOverviewOnly(false)
    }
  }

  return (
    <main
      ref={printRef}
      className={`print-document track-overview track-overview-format-${format}${overviewOnly ? " track-overview-overview-only" : ""}${!includeOverview ? " track-overview-no-overview" : ""}`}
    >
      <title>Track overview | Cloud Native Denmark</title>
      <meta name="robots" content="noindex, nofollow" />
      <div className="track-overview-controls">
        <Link to="/" className="track-overview-back">
          ← Cloud Native Denmark
        </Link>
        <h1 className="display">Track overview</h1>
        {schedule.length > 0 && (
          <>
            <div className="track-overview-selectors">
              <fieldset>
                <legend>Days</legend>
                {schedule.map((day) => {
                  const date = day.date.slice(0, 10)
                  return (
                    <label key={date}>
                      <input
                        type="checkbox"
                        name="date"
                        value={date}
                        checked={dates.includes(date)}
                        onChange={(event) =>
                          update({
                            date: event.target.checked
                              ? [...dates, date]
                              : dates.filter((value) => value !== date),
                          })
                        }
                      />
                      {formatEventDate(date)}
                    </label>
                  )
                })}
              </fieldset>
              <fieldset>
                <legend>Tracks</legend>
                {rooms.map((room) => (
                  <label key={room.id}>
                    <input
                      type="checkbox"
                      name="room"
                      value={room.id}
                      checked={roomIds.includes(room.id)}
                      onChange={(event) =>
                        update({
                          room: event.target.checked
                            ? [...roomIds, room.id].map(String)
                            : roomIds
                                .filter((value) => value !== room.id)
                                .map(String),
                        })
                      }
                    />
                    {room.name}
                  </label>
                ))}
              </fieldset>
            </div>
            <fieldset className="track-overview-formats">
              <legend>Print format</legend>
              {(
                Object.entries(formats) as [Format, (typeof formats)[Format]][]
              ).map(([key, entry]) => (
                <label
                  className={
                    key === format
                      ? "track-overview-format-option track-overview-selected"
                      : "track-overview-format-option"
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
            <label className="track-overview-overview-toggle">
              <input
                type="checkbox"
                checked={includeOverview}
                onChange={(event) =>
                  update({ overview: event.target.checked ? "1" : "0" })
                }
              />
              Include day overview
            </label>
            <div className="track-overview-actions">
              <Button
                disabled={!sections.length || printing}
                onClick={() => void print(false)}
              >
                {printing ? "Preparing print…" : "Print / save PDF"}
              </Button>
              <Button
                variant="secondary"
                disabled={!sections.length || printing}
                onClick={() => void print(true)}
              >
                Print overview only
              </Button>
              <CopyLinkButton
                key={linkParams.toString()}
                path={`/schedule/track-overview?${linkParams}`}
                label="Copy link"
              />
            </div>
            {!sections.length && (
              <p role="status">Select at least one listed day and track.</p>
            )}
          </>
        )}
        {isLoading && <p role="status">Loading schedule and speakers…</p>}
        {!isLoading && !schedule.length && (
          <p role="alert">
            Schedule unavailable. Reload this page to try again.
          </p>
        )}
      </div>
      {selectedDays.map((day) => {
        const selectedRooms = day.rooms.filter((room) =>
          roomIds.includes(room.id)
        )
        return (
          <section
            className="track-overview-day-section"
            data-date={day.date.slice(0, 10)}
            key={day.date}
          >
            <DayOverview
              day={day}
              rooms={selectedRooms}
              fetchedAt={fetchedAt}
            />
            {selectedRooms.map((room) => (
              <TrackSection
                key={room.id}
                day={day}
                room={room}
                format={format}
                fetchedAt={fetchedAt}
              />
            ))}
          </section>
        )
      })}
    </main>
  )
}
