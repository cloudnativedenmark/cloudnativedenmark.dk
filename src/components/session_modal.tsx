import * as React from "react";
import { type Session, type Speaker } from "../hooks/use-sessionize";

const SessionModal: React.FC<{
  session: Session;
  onClose: () => void;
  onSpeakerClick: (speaker: Speaker) => void;
}> = ({
  session,
  onClose,
  onSpeakerClick,
}) => {
  const starts = new Date(session.startsAt);
  const ends = new Date(session.endsAt);
  const duration = (ends.getTime() - starts.getTime()) / (1000 * 60); // duration in minutes

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <>
      <div
        className="fixed inset-0 bg-white z-40" style={{opacity: 0.5}}
        onClick={onClose}
      ></div>
      <div
        className="fixed inset-0 z-50 flex justify-center items-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl leading-none"
          >
            &times;
          </button>

          <h2 className="text-3xl font-bold text-primary mb-4">
            {session.title || session.name}
          </h2>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-600 mb-6">
            <span>
              <strong>Time:</strong> {formatTime(session.startsAt)} -{" "}
              {formatTime(session.endsAt)} ({duration} min)
            </span>
            <span>
              <strong>Room:</strong> {session.room}
            </span>
          </div>

          {session.speakers && session.speakers.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Speakers</h3>
              <div className="flex flex-wrap gap-6">
                {session.speakers.map((speaker) => (
                  <div
                    key={speaker.id}
                    className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => onSpeakerClick(speaker)}
                  >
                    <img src={speaker.profilePicture} alt={speaker.fullName} className="w-16 h-16 rounded-full object-cover shadow-md" />
                    <span className="font-semibold text-gray-700">{speaker.fullName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {session.description && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Description</h3>
              <div className="text-gray-700 space-y-4" dangerouslySetInnerHTML={{ __html: session.description }} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SessionModal;