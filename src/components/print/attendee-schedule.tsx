import { type GridEntry, type Session } from "../../hooks/use-sessionize"
import { daySessions, timetableRows } from "../../utils/schedule-layout"
import { formatEventTime } from "../../utils/time-formatting"
import PrintSheet from "./print-sheet"
import "../../styles/attendee-schedule.css"

function SessionText({
  session,
  showRoom = false,
}: {
  session: Session
  showRoom?: boolean
}) {
  return (
    <>
      <strong className="attendee-title">
        {session.title || session.name}
      </strong>
      {session.speakers.length > 0 && (
        <span className="attendee-speakers">
          {session.speakers
            .map((speaker) => speaker.fullName || speaker.name)
            .join(" · ")}
        </span>
      )}
      {showRoom && <span className="attendee-location">{session.room}</span>}
    </>
  )
}

export default function AttendeeScheduleDocument({
  days,
  fetchedAt,
}: {
  days: GridEntry[]
  fetchedAt: Date | null
}) {
  return (
    <div className="print-document attendee-schedule">
      {[...days]
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((day, dayIndex) => {
          const rooms = day.rooms.filter(
            (room) => room.name.trim().toLowerCase() !== "workshop"
          )
          const workshopRooms = day.rooms.filter(
            (room) => room.name.trim().toLowerCase() === "workshop"
          )
          const workshopIds = workshopRooms.map((room) => room.id)
          const workshops = daySessions(day).filter(
            (session) =>
              workshopIds.includes(session.roomId) && !session.isServiceSession
          )
          const rows = timetableRows(
            day,
            rooms.map((room) => room.id)
          )

          return (
            <PrintSheet
              key={day.date}
              title="Schedule"
              context={day.date.slice(0, 4)}
              date={day.date.slice(0, 10)}
              fetchedAt={fetchedAt}
              label={`Day ${dayIndex + 1} / ${days.length}`}
            >
              {rooms.length > 0 && (
                <table className="attendee-timetable">
                  <colgroup>
                    <col className="attendee-time-column" />
                    {rooms.map((room) => (
                      <col key={room.id} />
                    ))}
                  </colgroup>
                  <thead>
                    <tr>
                      <th scope="col">Time</th>
                      {rooms.map((room) => (
                        <th scope="col" key={room.id}>
                          {room.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => {
                      const active = row.cells.filter((cell) => cell.session)
                      const single =
                        active.length === 1 &&
                        !active[0].continued &&
                        active[0].rowSpan === 1
                          ? active[0].session
                          : null
                      return (
                        <tr
                          key={row.startsAt}
                          className={
                            single?.isServiceSession ? "attendee-service" : ""
                          }
                        >
                          <th scope="row" className="attendee-time">
                            {formatEventTime(row.startsAt)}–
                            {formatEventTime(row.endsAt)}
                          </th>
                          {single ? (
                            <td
                              colSpan={rooms.length}
                              className="attendee-shared"
                            >
                              <SessionText session={single} showRoom />
                            </td>
                          ) : (
                            row.cells.map(
                              (cell, index) =>
                                !cell.continued && (
                                  <td
                                    key={cell.roomId}
                                    rowSpan={cell.rowSpan}
                                    className={`attendee-stage-${index}`}
                                  >
                                    {cell.session && (
                                      <SessionText session={cell.session} />
                                    )}
                                  </td>
                                )
                            )
                          )}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
              {workshops.length > 0 && (
                <section className="attendee-workshops" aria-label="Workshops">
                  <h2>
                    {workshopRooms.length === 1
                      ? workshopRooms[0].name
                      : "Workshops"}
                  </h2>
                  <div className="attendee-workshop-grid">
                    {workshops.map((session) => (
                      <article key={session.id} className="attendee-workshop">
                        <p className="attendee-workshop-time">
                          {formatEventTime(session.startsAt)}–
                          {formatEventTime(session.endsAt)}
                        </p>
                        <SessionText
                          session={session}
                          showRoom={workshopRooms.length > 1}
                        />
                      </article>
                    ))}
                  </div>
                </section>
              )}
            </PrintSheet>
          )
        })}
    </div>
  )
}
