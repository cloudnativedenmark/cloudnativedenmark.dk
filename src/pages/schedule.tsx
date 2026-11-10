import React, { useEffect, useRef } from "react"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import SEOHead from "../components/seo-head"
import { useSessionizeSchedule } from "../hooks/use-sessionize"
import { useModalManagement } from "../hooks/use-modal-management"
import {
  formatDate,
  formatTime,
  formatEventTime,
} from "../utils/time-formatting"
import SessionCard from "../components/session-card"
import ScheduleHeader from "../components/schedule-header"
import SessionModal from "../components/session_modal"
import SpeakerModal from "../components/speaker_modal"
import { speakerPath } from "../utils/speaker-link"
import { talkPath, talkType } from "../utils/talk-link"
import { daySessions, timetableRows } from "../utils/schedule-layout"

const SchedulePage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { talkId } = useParams()
  const previousTalkId = useRef(talkId)
  const { schedule, isLoading } = useSessionizeSchedule()
  const {
    selectedSession,
    selectedSpeaker,
    handleSessionClick,
    handleSpeakerClick,
    handleCloseSessionModal,
    handleCloseSpeakerModal,
  } = useModalManagement({ schedule, urlMode: "path" })
  const dayHash = location.hash.slice(1)
  const linkedDay = schedule.find((day, index) => {
    if (!dayHash) return false
    if (dayHash === `day${index + 1}` || dayHash === day.date.slice(0, 10)) {
      return true
    }

    const weekday = new Date(day.date.slice(0, 10)).toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        timeZone: "UTC",
      }
    )
    return dayHash === weekday.toLowerCase()
  })

  const findSessionById = (id: number | string) => {
    for (const day of schedule) {
      for (const timeSlot of day.timeSlots) {
        for (const room of timeSlot.rooms) {
          if (
            room.session &&
            (room.session.id === String(id) ||
              String(id).endsWith(`-${room.session.id}`))
          ) {
            return room.session
          }
        }
      }
    }
    return undefined
  }

  useEffect(() => {
    if (!talkId) {
      if (!location.hash || linkedDay) {
        handleCloseSessionModal()
      }
      return
    }

    const session = findSessionById(talkId)
    if (session) handleSessionClick(session)
    // Only sync when the route or data changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [talkId, schedule, location.hash, linkedDay])

  useEffect(() => {
    const closedTalk = previousTalkId.current && !talkId
    previousTalkId.current = talkId
    if (!linkedDay || closedTalk) return

    const frame = window.requestAnimationFrame(() => {
      document.getElementById(linkedDay.date.slice(0, 10))?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [linkedDay, location.key, talkId])

  const openSession = (session: NonNullable<typeof selectedSession>) => {
    handleSessionClick(session)
    navigate(talkPath(session))
  }

  const closeSession = () => {
    handleCloseSessionModal()
    navigate("/schedule")
  }

  return (
    <>
      <SEOHead
        title={
          selectedSession
            ? `${talkType(selectedSession) || "Talk"}: ${selectedSession.title || selectedSession.name}`
            : "Schedule"
        }
        description={selectedSession?.description || undefined}
        pathname={location.pathname}
      />
      <section className="pt-24 pb-12 bg-background-dark">
        <div className="mx-auto max-w-6xl text-white text-center px-6">
          <h1 className="text-6xl font-bold">Schedule</h1>
          <p className="text-2xl font-light mt-8 leading-normal">
            Plan your conference experience. Here’s the full schedule of talks
            and events.
          </p>
          <a
            href="/schedule.pdf"
            download="cloud-native-denmark-schedule.pdf"
            className="btn-pill mt-8 bg-cnd-bone text-cnd-midnight hover:bg-white"
          >
            Download schedule (PDF)
          </a>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {schedule.length === 0 && isLoading && (
            <div className="text-center">
              <p className="text-xl text-gray-600">Loading schedule...</p>
            </div>
          )}

          {schedule.length === 0 && !isLoading && (
            <div className="text-center">
              <p className="text-xl text-gray-600">
                The schedule is being finalized — check back soon.
              </p>
            </div>
          )}

          {schedule.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-4">
              {schedule.map((day, index) => (
                <Link
                  key={day.date}
                  to={{
                    pathname: "/schedule",
                    search: location.search,
                    hash: `#day${index + 1}`,
                  }}
                  className="bg-background hover:bg-hover text-white text-l font-semibold py-3 px-6 rounded-full transition-colors duration-200"
                >
                  {formatDate(day.date)}
                </Link>
              ))}
            </div>
          )}

          {schedule.map((day) => {
            const rows = timetableRows(
              day,
              day.rooms.map((room) => room.id)
            )
            const serviceSessions = daySessions(day).filter(
              (session) => session.isServiceSession
            )
            const weekday = new Date(day.date.slice(0, 10)).toLocaleDateString(
              "en-US",
              { weekday: "long", timeZone: "UTC" }
            )

            return (
              <div
                key={day.date}
                id={day.date.slice(0, 10)}
                className="mb-16 scroll-mt-[var(--site-header-height)]"
              >
                <div
                  className="hidden md:grid isolate gap-px bg-gray-200 border border-gray-300 rounded-lg overflow-clip mt-8"
                  style={{
                    gridTemplateColumns: `minmax(80px, 0.5fr) repeat(${day.rooms.length}, 1fr)`,
                  }}
                >
                  <ScheduleHeader date={day.date} rooms={day.rooms} />

                  {/* Time Slots */}
                  {rows.map((row, rowIndex) => {
                    const plenumCell = row.cells.find(
                      (cell) => cell.session?.isPlenumSession
                    )
                    const plenum = plenumCell?.session
                    const isOverlay =
                      plenum?.isServiceSession &&
                      row.cells.some(
                        (cell) => cell.continued && cell !== plenumCell
                      )
                    return (
                      <React.Fragment key={row.startsAt}>
                        <div
                          className="bg-white p-4 text-center font-semibold flex items-center justify-center"
                          style={{ gridColumn: 1, gridRow: rowIndex + 2 }}
                        >
                          {formatEventTime(row.startsAt)}
                        </div>
                        {plenum && plenumCell ? (
                          <>
                            {isOverlay &&
                              row.cells.map((cell, index) =>
                                cell.continued && cell !== plenumCell ? null : (
                                  <div
                                    key={cell.roomId}
                                    className="bg-white"
                                    style={{
                                      gridColumn: index + 2,
                                      gridRow: rowIndex + 2,
                                    }}
                                  />
                                )
                              )}
                            {!plenumCell.continued && (
                              <div
                                className={
                                  isOverlay
                                    ? "relative z-10 p-1 pointer-events-none"
                                    : "bg-white p-1 flex flex-col"
                                }
                                style={{
                                  gridColumn: "2 / -1",
                                  gridRow:
                                    plenumCell.rowSpan === 1
                                      ? rowIndex + 2
                                      : `${rowIndex + 2} / span ${plenumCell.rowSpan}`,
                                }}
                              >
                                {!plenum.isServiceSession && (
                                  <p className="p-3 font-bold text-gray-600">
                                    {plenum.room}
                                  </p>
                                )}
                                <SessionCard
                                  session={plenum}
                                  onClick={() => openSession(plenum)}
                                  variant={isOverlay ? "overlay" : "schedule"}
                                />
                              </div>
                            )}
                          </>
                        ) : (
                          row.cells.map((cell, index) => {
                            if (cell.continued) return null
                            const { session } = cell

                            return (
                              <div
                                key={cell.roomId}
                                className="bg-white p-1"
                                style={{
                                  gridColumn: index + 2,
                                  gridRow: `${rowIndex + 2} / span ${cell.rowSpan}`,
                                }}
                              >
                                {session && (
                                  <SessionCard
                                    session={session}
                                    onClick={() => openSession(session)}
                                    variant="schedule"
                                  />
                                )}
                              </div>
                            )
                          })
                        )}
                      </React.Fragment>
                    )
                  })}
                </div>
                <div className="md:hidden">
                  <h2 className="text-3xl font-bold text-gray-900 my-8 text-center">
                    {formatDate(day.date)}
                  </h2>
                  {day.timeSlots.map((timeSlot) => (
                    <div key={timeSlot.slotStart} className="mb-8">
                      <h3 className="sticky top-[var(--site-header-height)] z-20 flex items-baseline gap-3 text-xl font-semibold text-gray-800 mb-4 bg-gray-100 p-3 rounded-t-lg border-b border-gray-200">
                        <span>{formatTime(timeSlot.slotStart)}</span>{" "}
                        <span className="text-sm font-normal text-gray-500">
                          {weekday}
                        </span>
                      </h3>
                      <div className="space-y-4">
                        {timeSlot.rooms.map((room) => (
                          <div
                            key={room.id}
                            className="bg-white p-1 rounded-lg shadow-sm border border-gray-300"
                          >
                            {!(
                              room.session.isPlenumSession &&
                              room.session.isServiceSession
                            ) && (
                              <div className="p-3">
                                <p className="font-bold text-gray-600">
                                  {room.name}
                                </p>
                              </div>
                            )}
                            <SessionCard
                              session={room.session}
                              onClick={() => openSession(room.session)}
                              variant="mobile"
                              serviceSessions={serviceSessions}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>
      {selectedSession && (
        <SessionModal
          session={selectedSession}
          onClose={closeSession}
          onSpeakerClick={(speaker) => {
            handleSpeakerClick(speaker)
            navigate(speakerPath(speaker))
          }}
        />
      )}
      {selectedSpeaker && (
        <SpeakerModal
          speaker={selectedSpeaker}
          onClose={handleCloseSpeakerModal}
          onSessionClick={(sessionId) => {
            const session = findSessionById(sessionId)
            if (session) {
              openSession(session)
            }
          }}
        />
      )}
    </>
  )
}

export default SchedulePage
