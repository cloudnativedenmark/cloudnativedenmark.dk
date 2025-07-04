import * as React from "react";
import { type Speaker } from "../hooks/use-sessionize";

const SpeakerModal: React.FC<{ speaker: Speaker; onClose: () => void }> = ({
  speaker,
  onClose,
}) => {
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

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
            <img
              src={speaker.profilePicture}
              alt={speaker.fullName}
              className="w-32 h-32 rounded-full object-cover shadow-md flex-shrink-0"
            />
            <div className="text-center sm:text-left">
              <h2 className="text-3xl font-bold text-primary mb-2">
                {speaker.fullName}
              </h2>
              <p className="text-lg text-gray-600">{speaker.tagLine}</p>
            </div>
          </div>

          {speaker.bio && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">About</h3>
              <div
                className="text-gray-700 space-y-4"
                dangerouslySetInnerHTML={{ __html: speaker.bio }}
              />
            </div>
          )}

          {speaker.sessions && speaker.sessions.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Sessions
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {speaker.sessions.map((session) => (
                  <li key={session.id}>{session.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SpeakerModal;