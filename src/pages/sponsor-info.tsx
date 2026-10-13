import React from "react"
import { useLocation } from "react-router-dom"
import SEOHead from "../components/seo-head"
import PageHeader from "../components/layout/page-header"
import Section from "../components/ui/section"

const MailLink: React.FC<{ address: string }> = ({ address }) => (
  <a
    href={`mailto:${address}`}
    className="text-cnd-red underline decoration-2 underline-offset-4 hover:text-cnd-coral"
  >
    {address}
  </a>
)

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
            <p className="mt-2">Scandic Copenhagen provides each stand with:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>1 school table or café table with a tablecloth</li>
              <li>1 or 2 chairs (or high chairs)</li>
              <li>1 extension cable</li>
              <li>Wi-Fi</li>
              <li>Cleaning before the exhibition area opens each day</li>
            </ul>
            <p className="mt-2">
              All other equipment, displays, roll-ups, or additional booth
              materials are the sponsor's own responsibility. Extra equipment
              can be rented from the venue (see below).
            </p>
          </>
        ),
      },
      {
        question: "Can we ship materials to the venue before the event?",
        answer: (
          <>
            <p>
              Yes. Shipments may arrive at the earliest two days before the
              event, so no earlier than November 17, 2026. Label every package
              like this:
            </p>
            <address className="mt-2 not-italic rounded-lg bg-cnd-bone px-4 py-3 font-mono text-sm">
              Cloud Native Denmark 19.11-20.11.2026
              <br />
              C/O Scandic Copenhagen – Att: Camilla Olesen
              <br />
              Vester Søgade 6
              <br />
              DK-1601 Copenhagen V
              <br />
              Denmark
            </address>
            <p className="mt-2">
              If you are bringing larger items, contact the venue in advance to
              agree on which entrance to use.
            </p>
          </>
        ),
      },
      {
        question: "How do we get our materials back after the event?",
        answer: (
          <>
            <p>
              You are responsible for booking the pick-up with your carrier. The
              venue does not schedule pick-ups during the weekend, so plan for
              collection on Friday afternoon or the following week.
            </p>
            <p className="mt-2">
              Everything must be packed, wrapped, and labeled by you before you
              leave the venue.
            </p>
          </>
        ),
      },
      {
        question: "Can we rent a screen or other extra equipment?",
        answer: (
          <>
            <p>
              Yes, directly from Scandic Copenhagen. Email{" "}
              <MailLink address="meeting.copenhagen@scandichotels.com" /> at
              least 20 days before the event with what you need, and agree on
              payment terms at the same time. Indicative prices from the venue:
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>High café table: DKK 250 per piece per day</li>
              <li>High bar chair: DKK 250 per piece per day</li>
              <li>Extra tablecloth: DKK 25 per piece per day</li>
              <li>Extra power outlet or cable: DKK 15 per piece per day</li>
              <li>Screens, AV equipment, and flowers: ask for a quote</li>
            </ul>
          </>
        ),
      },
      {
        question: "Can we serve food or drinks from our booth?",
        answer: (
          <>
            Only if agreed with the hotel beforehand. Scandic offers a range of
            food and beverage options for stands. Email{" "}
            <MailLink address="meeting.copenhagen@scandichotels.com" /> at least
            two weeks before the event for an offer. Walking around between the
            stands with tastings is not allowed.
          </>
        ),
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
              <MailLink address="sponsor@cloudnativedenmark.dk" />.
            </p>
            <p className="mt-2">
              The booking code is valid for stays from November 18 to November
              20, 2026. If any of your team members wish to stay outside these
              dates, remove the code to book those additional nights separately,
              then email <MailLink address="copenhagen@scandichotels.com" /> to
              request staying in the same room.
            </p>
          </>
        ),
      },
      {
        question: "When can we set up, and when do we need to be packed down?",
        answer: (
          <>
            <p>The venue has confirmed the following windows:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>
                <strong>Setup</strong>: Wednesday, November 18, 2026 from 07:30
              </li>
              <li>
                <strong>Teardown</strong>: Friday, November 20, 2026 at 14:00
              </li>
            </ul>
            <p className="mt-2">
              The conference itself runs November 19–20, 2026 at Scandic
              Copenhagen.
            </p>
          </>
        ),
      },
    ],
  },
  {
    title: "Venue rules & practical details",
    entries: [
      {
        question: "What are the house rules for the stand?",
        answer: (
          <ul className="list-disc pl-5 space-y-1">
            <li>
              No nails, screws, or anything else that could damage the walls,
              floors, or interior.
            </li>
            <li>
              Roll-ups and other marketing material must stay inside your stand
              area. Respect the floor markings for the stand corners.
            </li>
            <li>
              Empty boxes and waste must be cleared from the area before the
              exhibition opens. Nothing may be stored visibly at the stand.
            </li>
            <li>
              Stand locations cannot be changed without written agreement from
              both Scandic Copenhagen and us. Never block emergency exits.
            </li>
            <li>
              Don't leave valuables at an unattended stand. The hotel is not
              liable for theft or damage to the stand or equipment.
            </li>
          </ul>
        ),
      },
      {
        question: "Is there Wi-Fi for the stand?",
        answer: (
          <>
            <p>
              Yes. Connect to the open network <strong>Scandic_easy</strong>,
              open a browser, and you're online. There is no password.
            </p>
            <p className="mt-2">
              If you need a dedicated network or a wired connection, contact the
              venue at{" "}
              <MailLink address="meeting.copenhagen@scandichotels.com" />.
            </p>
          </>
        ),
      },
      {
        question: "Where can we park?",
        answer:
          "There is public street parking along Vester Søgade (operated by EasyPark) and an underground car park run by Q-Park Vesterport at Nyropsgade 39-41.",
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
          "Yes. Every sponsorship that includes a presence at the conference gets access to the TicketButler lead scanner. This is a standard mobile application you install on your own devices, accompanied by an event code for badge scanning. We will share the setup details closer to the event.",
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
            Email <MailLink address="sponsor@cloudnativedenmark.dk" /> and we'll
            get back to you directly rather than leave you guessing.
          </>
        ),
      },
      {
        question: "Who do we contact at the venue?",
        answer: (
          <>
            For anything about the stand itself, such as shipping, extra
            equipment, catering, or network, email Scandic Copenhagen's meeting
            team at <MailLink address="meeting.copenhagen@scandichotels.com" />.
            Keep <MailLink address="sponsor@cloudnativedenmark.dk" /> in copy so
            we can help if anything gets stuck.
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
