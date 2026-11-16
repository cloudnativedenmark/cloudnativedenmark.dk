import React from "react"
import SEOHead from "../components/seo-head"
import CNDShape from "../components/ui/cnd-shape"
import Button from "../components/ui/button"

const contact = "contact@cloudnativedenmark.dk"

// The guide lists the track hosts' phone numbers, so it goes to speakers by
// email instead of living on a public page.
const SpeakersGuidePage: React.FC = () => {
  return (
    <>
      <SEOHead title="Speakers guide" pathname="/speakers-guide" />
      <section
        aria-labelledby="speakers-guide-title"
        className="relative isolate flex min-h-[78vh] flex-col items-center justify-center overflow-hidden bg-cnd-bone px-6 py-16 text-center"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute hidden md:block"
          style={{ top: 40, right: 60, opacity: 0.5 }}
        >
          <CNDShape size={140} fill="var(--color-cnd-coral)" />
        </div>
        <div className="relative">
          <div
            className="eyebrow mb-3"
            style={{ color: "var(--color-cnd-red)", letterSpacing: "0.22em" }}
          >
            SPEAKERS · GUIDE
          </div>
          <h1
            id="speakers-guide-title"
            className="display text-cnd-midnight"
            style={{
              fontSize: "clamp(56px, 9vw, 120px)",
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
            }}
          >
            Check your inbox.
          </h1>
          <p
            className="mx-auto mt-6 max-w-md text-cnd-slate"
            style={{ fontSize: 18, lineHeight: 1.5 }}
          >
            The speakers guide now comes by email, with your track host's
            contact details. Use the latest version we sent you. Can't find it?
            Email us at <a href={`mailto:${contact}`}>{contact}</a>.
          </p>
          <div className="mt-8 flex justify-center">
            <a href={`mailto:${contact}`}>
              <Button>Email us →</Button>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

export default SpeakersGuidePage
