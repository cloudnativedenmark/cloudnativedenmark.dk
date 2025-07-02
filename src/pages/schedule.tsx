import * as React from "react";
import { type HeadFC, type PageProps } from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";
import { useSessionizeSchedule, type Session } from "../hooks/use-sessionize";

const SessionCard: React.FC<{ session: Session }> = ({ session }) => {
  if (!session || !session.id) {
    return null;
  }

  if (session.isServiceSession) {
    return (
      <div className="bg-gray-100 p-4 h-full flex items-center justify-center text-center rounded-lg border border-gray-200">
        <h3 className="font-bold text-lg text-gray-700">{session.name}</h3>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 hover:bg-blue-100 p-3 h-full flex flex-col justify-between rounded-lg shadow-sm border border-blue-200 transition-colors duration-200">
      <div>
        <h3 className="font-bold text-md text-primary">{session.name}</h3>
        {session.speakers && session.speakers.length > 0 && (
          <p className="text-sm text-gray-600 mt-2">
            <em>{session.speakers.map((s) => s.fullName).join(", ")}</em>
          </p>
        )}
      </div>
    </div>
  );
};

const SchedulePage: React.FC<PageProps> = () => {
  const { schedule } = useSessionizeSchedule();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <Layout>
      <section className="pt-24 pb-12 bg-background-dark">
        <div className="mx-auto max-w-6xl text-white text-center px-6">
          <h1 className="text-6xl font-bold">Schedule</h1>
          <p className="text-2xl font-light mt-8 leading-normal">
            Plan your conference experience. Here’s the full schedule of talks
            and events.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {schedule.length === 0 && (
            <div className="text-center">
              <p className="text-xl text-gray-600">Loading schedule...</p>
            </div>
          )}

          {schedule.map((day) => (
            <div key={day.date} className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                {formatDate(day.date)}
              </h2>
              <div
                className="grid gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden"
                style={{
                  gridTemplateColumns: `minmax(80px, 0.5fr) repeat(${day.rooms.length}, 1fr)`,
                }}
              >
                {/* Header Row */}
                <div className="bg-gray-100 p-4 font-bold text-center">Time</div>
                {day.rooms.map((room) => (
                  <div
                    key={room.id}
                    className="bg-gray-100 p-4 font-bold text-center"
                  >
                    {room.name}
                  </div>
                ))}

                {/* Time Slots */}
                {day.timeSlots.flatMap((timeSlot) => {
                  const serviceSession =
                    timeSlot.rooms.length === 1 &&
                    timeSlot.rooms[0].session.isServiceSession
                      ? timeSlot.rooms[0].session
                      : null;

                  const timeCell = (
                    <div
                      key={`${timeSlot.slotStart}-time`}
                      className="bg-white p-4 text-center font-semibold flex items-center justify-center"
                    >
                      {formatTime(timeSlot.slotStart)}
                    </div>
                  );

                  if (serviceSession) {
                    return [
                      timeCell,
                      <div key={`${timeSlot.slotStart}-session`} className="bg-white p-1" style={{ gridColumn: `span ${day.rooms.length}` }}>
                        <SessionCard session={serviceSession} />
                      </div>,
                    ];
                  }

                  const sessionCells = day.rooms.map((room) => {
                    const sessionForRoom = timeSlot.rooms.find((r) => r.id === room.id)?.session;
                    return (
                      <div key={`${timeSlot.slotStart}-${room.id}`} className="bg-white p-1">
                        {sessionForRoom && <SessionCard session={sessionForRoom} />}
                      </div>
                    );
                  });

                  return [timeCell, ...sessionCells];
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default SchedulePage;

export const Head: HeadFC = ({ location: { pathname } }) => (
  <SEO title="Cloud Native Denmark - Schedule" pathname={pathname} />
);