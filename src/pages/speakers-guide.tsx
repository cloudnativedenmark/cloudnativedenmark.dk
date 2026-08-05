import React from "react"
import { useLocation } from "react-router-dom"
import SEOHead from "../components/seo-head"
import PageHeader from "../components/layout/page-header"
import Section from "../components/ui/section"

const Todo: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mt-3 rounded-lg border-2 border-dashed border-cnd-amber/60 bg-cnd-amber/10 px-4 py-2 text-sm font-semibold text-cnd-slate">
    TODO — {children}
  </div>
)

interface GuideSection {
  title: string
  content: React.ReactNode
}

const sections: GuideSection[] = [
  {
    title: "Contact us",
    content: (
      <p>
        You can always reach the organizer team at{" "}
        <a
          href="mailto:contact@cloudnativedenmark.dk"
          className="text-cnd-red underline decoration-2 underline-offset-4 hover:text-cnd-coral"
        >
          contact@cloudnativedenmark.dk
        </a>{" "}
        or on Slack.
      </p>
    ),
  },
  {
    title: "Date",
    content: <p>The event will take place November 19–20.</p>,
  },
  {
    title: "Registration",
    content: (
      <p>
        As a speaker you should receive an email with a registration code for
        signing up shortly after having your talk accepted. If you have not
        received that email before end of August, please reach out to us.
      </p>
    ),
  },
  {
    title: "Venue",
    content: (
      <p>
        The venue is{" "}
        <a
          href="https://www.scandichotels.com/en/hotels/scandic-copenhagen"
          className="text-cnd-red underline decoration-2 underline-offset-4 hover:text-cnd-coral"
        >
          Scandic Copenhagen
        </a>
        , Vester Søgade 6, 1601 København (
        <a
          href="https://maps.app.goo.gl/U8Enw9TJMDB7JHjaA"
          className="text-cnd-red underline decoration-2 underline-offset-4 hover:text-cnd-coral"
        >
          Google Maps
        </a>
        ). Latest details on the venue can always be found on{" "}
        <a
          href="/venue"
          className="text-cnd-red underline decoration-2 underline-offset-4 hover:text-cnd-coral"
        >
          cloudnativedenmark.dk/venue
        </a>
        .
      </p>
    ),
  },
  {
    title: "Social media",
    content: (
      <p>
        We've prepared a social media badge on Sessionize. Find it under
        "Banner" on your speaker profile page in Sessionize.
      </p>
    ),
  },
  {
    title: "How to reach the speaker community",
    content: (
      <>
        <p>
          As a speaker, we encourage you to join our Slack community. You can
          connect with fellow attendees, organizers, and other speakers by
          heading to the <strong>#cloudnativedenmark2026-speakers</strong>{" "}
          channel under Cloud Native Nordics on Slack. Use the invitation link
          on{" "}
          <a
            href="https://cloudnativenordics.com/"
            className="text-cnd-red underline decoration-2 underline-offset-4 hover:text-cnd-coral"
          >
            cloudnativenordics.com
          </a>{" "}
          to join, then send us a mail with your username/email and we'll add
          you.
        </p>
        <Todo>which account do we use, Cloud Native Denmark or Nordics?</Todo>
      </>
    ),
  },
  {
    title: "Speakers dinner",
    content: (
      <p>
        We will send out an invite to a speakers dinner when we get closer to
        the event. We aim for about 19:00 on the 18th of November — the day
        before the conference.
      </p>
    ),
  },
  {
    title: "Accommodation",
    content: (
      <>
        <p>
          We've landed a deal with a local hotel — several organizers will be
          staying at Scandic Copenhagen, and we'll factor travel distance from
          the hotel into picking the speakers dinner venue.
        </p>
        <Todo>hotel discount code — do we already have it?</Todo>
      </>
    ),
  },
  {
    title: "Travel",
    content: (
      <>
        <p>
          When planning your trip to the event, we recommend that you come early
          and announce your arrival in the speakers Slack channel.
        </p>
        <Todo>
          update travel details — remember to arrive in time for the speakers
          dinner.
        </Todo>
      </>
    ),
  },
  {
    title: "Important dates and deadlines",
    content: (
      <>
        <Todo>agree on these — the two dates below don't line up yet.</Todo>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            Presentation slides submission deadline is September 22nd, 12:00.
            Send your presentation to contact@cloudnativedenmark.dk.
          </li>
          <li>Speakers dinner — more info will be added closer to the date.</li>
        </ul>
      </>
    ),
  },
  {
    title: "Schedule",
    content: (
      <>
        <p>
          When announced, you can access the conference schedule on{" "}
          <a
            href="/schedule"
            className="text-cnd-red underline decoration-2 underline-offset-4 hover:text-cnd-coral"
          >
            cloudnativedenmark.dk/schedule
          </a>
          . Your session details — title, description, and profile picture — are
          pulled live from Sessionize. Feel free to make minor edits and they'll
          be reflected automatically; get in touch with us if you want to make
          bigger changes.
        </p>
        <Todo>agree on the above.</Todo>
      </>
    ),
  },
  {
    title: "Audio / visual requirements",
    content: (
      <>
        <Todo>
          additional AV requirements for keynotes — or should we just agree
          directly with the speaker?
        </Todo>
        <h3 className="mt-6 text-base font-bold text-cnd-midnight">
          Standard talk
        </h3>
        <ul className="mt-2 list-disc space-y-2 pl-5">
          <li>
            All speakers must bring their own computers and HDMI adapters for
            use during the talk.
          </li>
          <li>Presentation slides should be formatted in 16:9.</li>
          <li>
            Conference wifi will be available. If you're planning a demo, we
            strongly recommend pre-recording it and having that ready for use.
          </li>
          <li>
            The room will include a screen, projector, and one microphone per
            speaker or panelist.
          </li>
          <li>
            If you require any additional AV, please email us as soon as
            possible.
          </li>
        </ul>
        <h3 className="mt-6 text-base font-bold text-cnd-midnight">
          Lightning talk
        </h3>
        <ul className="mt-2 list-disc space-y-2 pl-5">
          <li>Presentation slides should be formatted in 16:9.</li>
          <li>The talk is 10 minutes.</li>
          <li>
            Slides will be presented from a shared computer — please email us as
            soon as possible if this isn't possible for you.
          </li>
          <li>
            There is no opportunity for requesting additional AV for lightning
            talks.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Talk preparation",
    content: (
      <ul className="list-disc space-y-2 pl-5">
        <li>
          Please check your computer and HDMI connection before the session —
          check colors, contrast, and format.
        </li>
        <li>
          Please ensure your computer is connected to wifi or another working
          internet connection before starting the session.
        </li>
        <li>
          Check in with the room host during the break before your session.
        </li>
        <li>
          Please be present and visible at the stage at least 5 minutes before
          you go on, with your checked computer ready.
        </li>
        <li>
          Please have a timer to keep track of time — the room host will signal
          as you get near the end of the talk.
        </li>
      </ul>
    ),
  },
  {
    title: "Talk presentation template and notes",
    content: (
      <ul className="list-disc space-y-2 pl-5">
        <li>
          There are no requirements for the presentation template, but it needs
          to be in accordance with the Code of Conduct.
        </li>
        <li>
          When adding logos to your slides, be aware of resolution — a lot of
          the logos you need are on the CNCF landscape, sourced from the CNCF
          artwork repo or the community repo.
        </li>
        <li>
          When referring to projects and companies, use proper capitalization
          like "gRPC" and "containerd" — the CNCF landscape is a good source for
          up-to-date logos and capitalization.
        </li>
        <li>
          See the CNCF style guide, which covers things like abbreviating
          Kubernetes as "K8s," not "K8" or "K8S."
        </li>
      </ul>
    ),
  },
  {
    title: "Talk recording",
    content: (
      <p>
        All talks at Cloud Native Denmark will be recorded, so your insights can
        reach a wider audience even after the event. Please let us know before
        November 9th if you do not want the recording of your presentation made
        public.
      </p>
    ),
  },
  {
    title: "Promote your talk",
    content: (
      <p>
        We appreciate you spreading the word — link to your session once the
        schedule is published on cloudnativedenmark.dk/schedule. Feel free to
        share it however suits you, tagging #CloudNativeDenmark.
      </p>
    ),
  },
  {
    title: "Dress code",
    content: (
      <p>
        There is no dress code, and we encourage you to be comfortable. That
        said, the Code of Conduct applies to this space, both in how you appear
        and what you say — please be tasteful and considerate in choosing your
        clothing, and avoid wearing shirts with global brand logos that aren't
        your own while on stage.
      </p>
    ),
  },
  {
    title: "Code of conduct",
    content: (
      <p>
        Please read and abide by our Code of Conduct, which is strictly
        enforced. We ask that speakers especially review it and are careful to
        be inclusive in the words and images used during their presentation.
      </p>
    ),
  },
]

const SpeakersGuidePage: React.FC = () => {
  const location = useLocation()

  return (
    <>
      <SEOHead title="Speakers Guide" pathname={location.pathname} />
      <PageHeader
        eyebrow="FOR SPEAKERS"
        title="Speakers guide."
        description="Everything you need to know as a Cloud Native Denmark 2026 speaker. This page isn't in the site navigation — it's meant to be linked directly to confirmed speakers."
        variant="dark"
        size="medium"
      />
      <Section className="bg-cnd-bone py-16">
        <div className="mx-auto max-w-3xl space-y-10">
          <p className="rounded-xl border-2 border-cnd-fog/40 bg-white px-5 py-4 text-sm italic text-cnd-ash">
            This is a work-in-progress draft mirroring the team's speakers guide
            doc — some details (marked TODO below) are still being finalized.
            Not final until those are resolved.
          </p>
          {sections.map((section) => (
            <div key={section.title}>
              <h2
                className="display text-cnd-midnight"
                style={{ fontSize: 24, letterSpacing: "-0.02em" }}
              >
                {section.title}
              </h2>
              <div
                className="mt-3 space-y-3 text-cnd-slate"
                style={{ fontSize: 15, lineHeight: 1.65 }}
              >
                {section.content}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}

export default SpeakersGuidePage
