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
        answer:
          "Booth space includes standard furniture (table, chairs, power). Booth size scales with your tier — Extra Large for Platinum, Large for Gold, Regular for Bronze. If you need anything beyond standard furniture (screens, extra power, custom builds), let us know and we'll confirm what Scandic can provide.",
      },
      {
        question: "Can we rent a screen or get roll-ups printed on site?",
        answer:
          "We're still confirming exact options and pricing with the venue for screen rental and on-site printing. If you need either, email us and we'll get you a straight answer as soon as we have one — don't wait until the week of the event.",
      },
      {
        question: "When can we set up, and when do we need to be packed down?",
        answer:
          "Exact setup/teardown windows will be sent to confirmed sponsors closer to the event (November 19–20, 2026, Scandic Copenhagen). If you have travel or shipping constraints that need an earlier answer, reach out and we'll prioritize it.",
      },
    ],
  },
  {
    title: "Tickets & guests",
    entries: [
      {
        question: "How many tickets come with our tier?",
        answer:
          "Platinum: 6 tickets. Gold: 4 tickets. Bronze: 2 tickets. Community: 5 tickets. All paid tiers also come with a discount code for additional guest tickets, subject to general ticket availability.",
      },
      {
        question: "Do we get access to attendee leads?",
        answer:
          "Platinum, Gold, and Bronze sponsors get access to the lead scanner app for badge scanning at your booth.",
      },
    ],
  },
  {
    title: "Branding & marketing",
    entries: [
      {
        question: "Where does our logo appear?",
        answer:
          "On the sponsors section of cloudnativedenmark.dk, in tier order, plus marketing material and swag as described in your tier. Send us a high-resolution SVG (dark-on-light works best against our site background) and we'll get it live — usually within a day.",
      },
      {
        question: "Can we add a keynote mention or stage time?",
        answer:
          "Platinum sponsors get a 15-minute keynote presentation slot; Gold gets 2 minutes of keynote presence; Bronze and Community get a keynote mention. These are coordinated directly with the organizing team ahead of the schedule going out.",
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
