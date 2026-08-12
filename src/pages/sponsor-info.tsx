import React from "react"
import { useLocation } from "react-router-dom"
import SEOHead from "../components/seo-head"
import PageHeader from "../components/layout/page-header"
import Section from "../components/ui/section"

interface FAQEntry {
  question: string
  answer: React.ReactNode
}

interface FAQGroup {
  title: string
  entries: FAQEntry[]
}

const faqGroups: FAQGroup[] = [
  {
    title: "Booth & on-site logistics",
    entries: [
      {
        question: "What's included with our booth?",
        answer: (
          <>
            <p>Booth area sizes depend on your sponsorship tier:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>
                <strong>Platinum</strong>: 5x3 meters
              </li>
              <li>
                <strong>Gold</strong>: 4x2 meters
              </li>
              <li>
                <strong>Bronze</strong>: 3x2 meters
              </li>
            </ul>
            <p className="mt-2">
              Each booth area is provided with a standing-height table and power
              outlets. All other equipment, displays, roll-ups, or additional
              booth materials are the sponsor's own responsibility.
            </p>
          </>
        ),
      },
      {
        question: "Can we rent a screen or get roll-ups printed on site?",
        answer:
          "We will share the delivery address for shipping goods to Scandic Copenhagen and rental options for extra equipment like TV screens or additional AV as soon as the venue finalizes them.",
      },
      {
        question: "Is there a hotel booking discount code?",
        answer: (
          <>
            <p>
              Yes. We have arranged a booking code for discounted rooms at
              Scandic Copenhagen. This code is sent by email to confirmed
              sponsors.
            </p>
            <p className="mt-2">
              If you did not receive your code or need it resent, please email{" "}
              <a
                href="mailto:sponsor@cloudnativedenmark.dk"
                className="text-cnd-red underline decoration-2 underline-offset-4 hover:text-cnd-coral"
              >
                sponsor@cloudnativedenmark.dk
              </a>
              .
            </p>
            <p className="mt-2">
              The booking code is valid for stays from November 18 to November
              20, 2026. If any of your team members wish to stay outside these
              dates, remove the code to book those additional nights separately,
              then email{" "}
              <a
                href="mailto:copenhagen@scandichotels.com"
                className="text-cnd-red underline decoration-2 underline-offset-4 hover:text-cnd-coral"
              >
                copenhagen@scandichotels.com
              </a>{" "}
              to request staying in the same room.
            </p>
          </>
        ),
      },
      {
        question: "When can we set up, and when do we need to be packed down?",
        answer:
          "We will send exact setup and teardown windows closer to the event. The conference runs November 19–20, 2026 at Scandic Copenhagen. If you have travel or shipping constraints that require an earlier answer, let us know and we will prioritize it.",
      },
    ],
  },
  {
    title: "Tickets & guests",
    entries: [
      {
        question: "How many tickets come with our tier?",
        answer: (
          <>
            <p>Ticket allocations and guest discounts by tier:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>
                <strong>Platinum</strong>: 6 complimentary tickets + 10 tickets
                at a 30% discount
              </li>
              <li>
                <strong>Gold</strong>: 4 complimentary tickets + 10 tickets at a
                30% discount
              </li>
              <li>
                <strong>Bronze</strong>: 2 complimentary tickets + 4 tickets at
                a 30% discount
              </li>
              <li>
                <strong>Community</strong>: 5 complimentary tickets
              </li>
            </ul>
            <p className="mt-2 text-sm italic">
              Important: Ticket registrations (including sponsor codes) are
              subject to general ticket availability. We recommend claiming and
              registering your tickets as soon as possible to secure your seats.
            </p>
          </>
        ),
      },
      {
        question: "Do we get access to attendee leads?",
        answer:
          "Yes. Platinum, Gold, and Bronze sponsors get access to the TicketButler lead scanner. This is a standard mobile application you install on your own devices, accompanied by an event code for badge scanning. We will share the setup details closer to the event.",
      },
    ],
  },
  {
    title: "Audience insights",
    entries: [
      {
        question: "What is the attendee profile and size?",
        answer:
          "Last year, 477 active attendees represented 180 unique companies, including major Danish and international corporate enterprises.",
      },
      {
        question: "What roles and job titles are represented?",
        answer: (
          <>
            <p>The audience consists of practitioners and leaders:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>
                <strong>Core Engineering (58%+)</strong>: Practitioners holding
                roles like Platform Engineer, Software Engineer, and DevOps
                Engineer. Perfect for showcasing infrastructure tools, developer
                platforms, or recruiting talent.
              </li>
              <li>
                <strong>Technical Leadership (13% approx.)</strong>:
                Decision-makers including CTOs, Directors, Team Leads, and
                Product Managers.
              </li>
            </ul>
          </>
        ),
      },
    ],
  },
  {
    title: "Branding & marketing",
    entries: [
      {
        question: "Where does our logo appear?",
        answer:
          "On the sponsors section of cloudnativedenmark.dk in tier order, as well as on marketing material and swag described in your package. Send us a high-resolution SVG (dark-on-light works best) and we will publish it live, usually within a day.",
      },
      {
        question: "Can we add a keynote mention or stage time?",
        answer: (
          <>
            <p>
              Stage presence and keynote presentation options depend on your
              tier:
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>
                <strong>Platinum</strong>: A 15-minute technical keynote
                presentation. This must be a strictly technical presentation,
                not a product pitch.
              </li>
              <li>
                <strong>Gold</strong>: A 2-minute stage key pitch to introduce
                your company or message to the full audience (you are free to
                present anything you'd like).
              </li>
              <li>
                <strong>Bronze &amp; Community</strong>: Keynote mention only
                (no active stage time).
              </li>
            </ul>
            <p className="mt-2">
              We coordinate these slots directly with your team before
              publishing the schedule.
            </p>
          </>
        ),
      },
    ],
  },
  {
    title: "Getting in touch",
    entries: [
      {
        question: "Who do we contact with questions that aren't covered here?",
        answer: (
          <>
            Email{" "}
            <a
              href="mailto:sponsor@cloudnativedenmark.dk"
              className="text-cnd-red underline decoration-2 underline-offset-4 hover:text-cnd-coral"
            >
              sponsor@cloudnativedenmark.dk
            </a>{" "}
            and we'll get back to you directly rather than leave you guessing.
          </>
        ),
      },
    ],
  },
]

const SponsorInfoPage: React.FC = () => {
  const location = useLocation()

  return (
    <>
      <SEOHead title="Sponsor Info & FAQ" pathname={location.pathname} />
      <PageHeader
        eyebrow="FOR SPONSORS"
        title="Sponsor info & FAQ."
        description="Answers to the questions sponsors ask us most. This page isn't in the site navigation — it's meant to be linked directly to confirmed and prospective sponsors."
        variant="dark"
        size="medium"
      />
      <Section className="bg-cnd-bone py-16">
        <div className="mx-auto max-w-3xl space-y-12">
          {faqGroups.map((group) => (
            <div key={group.title}>
              <h2
                className="display text-cnd-midnight"
                style={{ fontSize: 24, letterSpacing: "-0.02em" }}
              >
                {group.title}
              </h2>
              <div className="mt-4 space-y-3">
                {group.entries.map((entry) => (
                  <details
                    key={entry.question}
                    className="group rounded-xl border-2 border-cnd-fog/40 bg-white px-5 py-4 open:border-cnd-electric/70"
                  >
                    <summary className="cursor-pointer list-none font-semibold text-cnd-midnight marker:content-none">
                      <span className="flex items-center justify-between gap-4">
                        {entry.question}
                        <span
                          aria-hidden="true"
                          className="shrink-0 text-cnd-electric transition-transform group-open:rotate-45"
                          style={{ fontSize: 20, lineHeight: 1 }}
                        >
                          +
                        </span>
                      </span>
                    </summary>
                    <div
                      className="mt-3 text-cnd-slate"
                      style={{ fontSize: 15, lineHeight: 1.65 }}
                    >
                      {entry.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}

          <p className="text-center text-sm italic text-cnd-ash">
            This is a first pass covering the questions we've heard most often —
            if something's missing, tell us and we'll add it.
          </p>
        </div>
      </Section>
    </>
  )
}

export default SponsorInfoPage
