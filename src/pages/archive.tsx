import React, { useState, useMemo } from "react";
import { type HeadFC, type PageProps } from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";
import { useSessionizeSchedule, type Speaker } from "../hooks/use-sessionize";
import Fuse from "fuse.js";
import SpeakerModal from "../components/speaker_modal";

import Dropdown from "../components/dropdown";

const sessionizeEvents = {
  "2025": { id: "ri9gml9f", name: "CND 2025 Aarhus", location: "Aarhus" },
};

const ArchivePage: React.FC<PageProps> = () => {
  const [selectedYear, setSelectedYear] = useState("2025");
  const { schedule } = useSessionizeSchedule(sessionizeEvents[selectedYear].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);

  const sessions = useMemo(() => {
    if (!schedule.length) return [];

    return schedule
      .flatMap((day) => day.timeSlots)
      .flatMap((slot) => slot.rooms)
      .map((room) => ({
        ...room.session,
        room: room.name,
      }))
      .filter(
        (session) =>
          !session.isServiceSession &&
          session.speakers &&
          session.speakers.length > 0
      );
  }, [schedule]);

  const archivedSessions = useMemo(() => {
    if (!sessions.length) return [];
    const eventInfo = sessionizeEvents[selectedYear];
    return sessions.map((session) => {
      return {
        ...session,
        event: eventInfo.name,
        year: selectedYear,
        location: eventInfo.location,
      };
    });
  }, [sessions, selectedYear]);

  const fuse = useMemo(
    () =>
      new Fuse(archivedSessions, {
        keys: ["title", "description", "speakers.fullName"],
        threshold: 0.3,
        ignoreLocation: true,
      }),
    [archivedSessions]
  );

  const filteredSessions = useMemo(() => {
    if (!searchQuery) {
      return archivedSessions;
    }
    return fuse.search(searchQuery).map((result) => result.item);
  }, [searchQuery, archivedSessions, fuse]);

  const yearOptions = Object.keys(sessionizeEvents)
    .sort((a, b) => parseInt(b) - parseInt(a))
    .map((year) => ({
      value: year,
      label: year,
    }));

  return (
    <Layout>
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-12 text-center">
            Archive
          </h2>
          <div className="mb-8 max-w-lg mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search talks by title, speaker, description..."
              className="w-full p-4 border border-gray-300 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Dropdown
              options={yearOptions}
              selectedValue={selectedYear}
              onSelect={setSelectedYear}
            />
          </div>
          <div className="space-y-8">
            {!archivedSessions.length ? (
              <p className="text-center">Loading talks...</p>
            ) : (
              filteredSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-6 border border-gray-200 rounded-lg text-left"
                >
                  <h3 className="text-2xl font-bold">{session.title}</h3>
                  {session.speakers && session.speakers.length > 0 && (
                    <div className="flex flex-wrap items-center gap-4 mt-3">
                      {session.speakers.map((speaker) => (
                        <div
                          key={speaker.id}
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() => setSelectedSpeaker(speaker)}
                        >
                          <img
                            src={speaker.profilePicture}
                            alt={speaker.fullName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <p className="text-md font-semibold">
                            {speaker.fullName}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="mt-4 text-gray-700">{session.description}</p>
                  <div className="mt-4 text-sm text-gray-600">
                    <span>
                      {new Date(session.startsAt).toLocaleString([], {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>{" "}
                    | <span>{session.event}</span> | <span>{session.room}</span>
                  </div>
                  <div className="mt-6 flex gap-4">
                    {session.video ? (
                      <a
                        href={session.video}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center text-white font-semibold py-3 px-6 rounded-full text-md transition-colors duration-200 bg-background hover:bg-hover"
                      >
                        Video
                      </a>
                    ) : (
                      <button
                        disabled
                        className="inline-flex items-center justify-center text-gray-500 font-semibold py-2 px-6 rounded-full text-md transition-colors duration-200 bg-gray-200 cursor-not-allowed"
                      >
                        Video
                      </button>
                    )}
                    {session.slideDeck ? (
                      <a
                        href={`https://docs.google.com/gview?url=${session.slideDeck}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center text-white font-semibold py-2 px-6 rounded-full text-md transition-colors duration-200 bg-background hover:bg-hover"
                      >
                        Slides
                      </a>
                    ) : (
                      <button
                        disabled
                        className="inline-flex items-center justify-center text-gray-500 font-semibold py-2 px-6 rounded-full text-md transition-colors duration-200 bg-gray-200 cursor-not-allowed"
                      >
                        Slides
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      {selectedSpeaker && (
        <SpeakerModal
          speaker={selectedSpeaker}
          onClose={() => setSelectedSpeaker(null)}
        />
      )}
    </Layout>
  );
};

export default ArchivePage;

export const Head: HeadFC = ({ location: { pathname } }) => (
  <SEO pathname={pathname} />
);
