import React from "react"
import { Link, useLocation } from "react-router-dom"
import SEOHead from "../components/seo-head"
import PageHeader from "../components/layout/page-header"
import Section from "../components/ui/section"
import ExternalLink from "../components/ui/external-link"

const CONTACT_EMAIL = "contact@cloudnativedenmark.dk"
const PRIVACY_EMAIL = "privacy@cloudnativedenmark.dk"

// Red text and coral hover fall below WCAG AA on bone; keep red as the underline accent only.
const linkClass =
  "font-semibold text-cnd-midnight underline decoration-cnd-red decoration-2 underline-offset-4 hover:text-cnd-electric"

const Heading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2
    className="display pt-6 text-cnd-midnight"
    style={{ fontSize: 26, letterSpacing: "-0.02em" }}
  >
    {children}
  </h2>
)

const List: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ul className="ml-6 list-disc space-y-1">{children}</ul>
)

const Email: React.FC<{ address?: string }> = ({ address = CONTACT_EMAIL }) => (
  <a href={`mailto:${address}`} className={linkClass}>
    {address}
  </a>
)

const Phone: React.FC<{ number: string }> = ({ number }) => (
  <a href={`tel:${number}`} className={linkClass}>
    {number}
  </a>
)

const TeamLink = () => (
  <Link to="/team" className={linkClass}>
    team page
  </Link>
)

const CodeOfConductPage: React.FC = () => {
  const location = useLocation()

  return (
    <>
      <SEOHead
        title="Code of Conduct"
        description="How we expect everyone at Cloud Native Denmark to behave, and how to get help or report a problem."
        pathname={location.pathname}
      />
      <PageHeader
        eyebrow="LEGAL"
        title="Code of conduct."
        variant="dark"
        size="medium"
      />
      <Section className="bg-cnd-bone py-16">
        <article
          className="mx-auto max-w-3xl space-y-5 text-cnd-slate"
          style={{ fontSize: 16, lineHeight: 1.7 }}
        >
          <p>
            Cloud Native Denmark is a community conference, organized by
            volunteers. We want it to be a welcoming, safe and harassment-free
            experience for everyone, regardless of age, body size, caste,
            disability, ethnicity, level of experience, family status, gender,
            gender identity and expression, marital status, nationality,
            personal appearance, race, religion, sexual orientation,
            socioeconomic status, or any other dimension of diversity.
          </p>
          <p>
            Everyone taking part must follow this Code of Conduct. By
            registering for or attending Cloud Native Denmark, you agree to do
            so.
          </p>
          <p>
            <strong>In short:</strong> treat everyone with respect. Harassment
            of any kind is not tolerated. If something happens, tell us.
          </p>

          <section
            aria-labelledby="need-help"
            className="rounded-lg border-l-4 border-cnd-red bg-white p-6"
          >
            <h2
              id="need-help"
              className="display text-cnd-midnight"
              style={{ fontSize: 22, letterSpacing: "-0.02em" }}
            >
              Need help?
            </h2>
            <ul className="mt-3 ml-6 list-disc space-y-2">
              <li>
                <strong>Emergency:</strong> call <Phone number="112" /> for
                police, fire or ambulance. The venue is Scandic Copenhagen,
                Vester Søgade 6. Then tell an organizer.
              </li>
              <li>
                <strong>At the conference:</strong> find any organizer (see
                the <TeamLink />
                ), or find us in the info-desk where you checked in.
              </li>
              <li>
                <strong>By email:</strong> <Email />. The organizing team reads
                this inbox. It is not watched around the clock, and we reply
                within three business days.
              </li>
            </ul>
          </section>

          <Heading>Scope</Heading>
          <p>
            This Code of Conduct applies to everyone taking part in Cloud Native
            Denmark: attendees, speakers, sponsors, exhibitors, volunteers and
            organizers. It covers:
          </p>
          <List>
            <li>
              the conference venue, including talks, workshops and the
              exhibition area
            </li>
            <li>
              social events connected to the conference, such as the after-party
            </li>
            <li>our website and social media accounts</li>
            <li>
              other communication, online or offline, that is about the
              conference or is aimed at someone because they take part in it
            </li>
          </List>
          <p>
            If someone this Code does not cover, such as venue staff, behaves
            badly toward you, tell us and we will raise it with the venue.
          </p>

          <Heading>Expected behavior</Heading>
          <List>
            <li>Show empathy and kindness toward other people.</li>
            <li>
              Respect differing opinions, viewpoints and levels of experience.
            </li>
            <li>Give constructive feedback, and accept it gracefully.</li>
            <li>
              Take responsibility for your mistakes, apologize to those
              affected, and learn from them.
            </li>
            <li>Use welcoming and inclusive language.</li>
            <li>
              Ask before taking close-up photos or videos of people, and respect
              their answer.
            </li>
            <li>
              Follow the venue's rules and the instructions of organizers and
              venue staff.
            </li>
            <li>
              Look out for each other. If someone seems to be in distress, check
              in with them or tell an organizer.
            </li>
          </List>

          <Heading>Unacceptable behavior</Heading>
          <p>Unacceptable behavior includes, but is not limited to:</p>
          <List>
            <li>harassment of any kind, in public or in private</li>
            <li>
              offensive or derogatory comments about any of the characteristics
              listed above
            </li>
            <li>sexualized language or imagery</li>
            <li>unwelcome physical contact</li>
            <li>unwelcome sexual or romantic attention or advances</li>
            <li>
              violence, threats of violence, or encouraging others to be violent
            </li>
            <li>stalking, following or intimidating someone</li>
            <li>photographing or recording people who have said no</li>
            <li>sustained disruption of talks or other activities</li>
            <li>trolling, insults, and personal or political attacks</li>
            <li>
              publishing someone's private information, such as a physical or
              email address, without their explicit permission
            </li>
            <li>
              using the conference for political campaigning or promotion of
              political causes unrelated to cloud native technology. This does
              not restrict personal attire, including attire that expresses
              personal beliefs or aspects of identity.
            </li>
            <li>
              other conduct that could reasonably be considered inappropriate in
              a professional setting
            </li>
          </List>
          <p>
            Talks, slides, demos, booths and marketing materials must not
            contain sexualized imagery or language. Sponsors and exhibitors are
            responsible for their staff, booth activities, attire and giveaways.
            Booth staff must not present themselves as conference staff.
          </p>
          <p>The following is also prohibited:</p>
          <List>
            <li>
              knowingly giving false or misleading information during a Code of
              Conduct investigation, or otherwise interfering with one
            </li>
            <li>
              retaliating against anyone for reporting an incident or acting as
              a witness
            </li>
          </List>
          <p>
            Anyone asked to stop unacceptable behavior must stop immediately.
          </p>
          <p>
            Alcohol may be served at social events. Being drunk is never an
            excuse for breaking this Code. Respect people who choose not to
            drink.
          </p>

          <Heading>Photos and recordings</Heading>
          <p>
            Photos are taken and talks are recorded during the conference. We
            publish photos on Flickr and social media, and talk recordings on
            YouTube. If you prefer not to be photographed, tell the photographer
            or an organizer. If you want a published photo of you removed, email{" "}
            <Email /> and we will take it down.
          </p>

          <Heading>Reporting</Heading>
          <p>
            If you experience or witness unacceptable behavior, or have any
            other concern, please report it as soon as possible. Use any of the
            options under <em>Need help?</em> at the top of this page.
          </p>
          <p>
            If your report involves an organizer, talk to another organizer in
            person or contact one directly (see the <TeamLink />) instead of
            emailing the shared inbox.
          </p>
          <p>
            You can report anonymously or ask someone to report for you. We will
            act where we can, but we may not be able to follow up with you.
          </p>
          <p>If you can, include in your report:</p>
          <List>
            <li>your contact details</li>
            <li>names or descriptions of the people involved</li>
            <li>when and where it happened</li>
            <li>what happened</li>
            <li>names of any witnesses</li>
          </List>
          <p>
            If you report in person during the conference, we act immediately.
            We reply to emailed reports within three business days.
          </p>
          <p>
            To report a crime to the police when no one is in danger, call{" "}
            <Phone number="114" />.
          </p>

          <Heading>How we handle reports</Heading>
          <p>
            Apart from whoever receives your report, only the organizers
            handling it see the details. Anyone involved in a report, or close
            to the people involved, does not take part in handling it.
          </p>
          <p>
            We share details with others, such as venue staff or the police,
            only when needed to keep people safe. Unless someone is in immediate
            danger, we ask for your consent first.
          </p>
          <p>
            We keep notes about a report only as long as we need them to handle
            it and enforce any decision, and then delete them. For questions
            about your data, email <Email address={PRIVACY_EMAIL} />.
          </p>

          <Heading>Pre-event concerns</Heading>
          <p>
            If you plan to attend and have concerns about another person who may
            be present, email <Email /> as early as possible before the
            conference. We will work with you on precautions where we can, such
            as briefing organizers and venue staff, having an organizer
            accompany you, and making sure you can reach us during the
            conference.
          </p>

          <Heading>Enforcement</Heading>
          <p>
            The organizers review every report and decide what action to take.
            Before deciding, we usually talk to the person reported, unless that
            would put someone at risk. We consider how serious the behavior is,
            its impact on the people affected, and whether it is part of a
            pattern.
          </p>
          <p>
            We offer support to anyone affected, for example by having an
            organizer stay with them, contacting venue staff or the police, or
            briefing other organizers.
          </p>
          <p>Consequences may include, but are not limited to:</p>
          <List>
            <li>a warning</li>
            <li>removal of offending talk, booth or marketing material</li>
            <li>ending a talk or activity early</li>
            <li>removal from a speaker, volunteer or organizer role</li>
            <li>ending a sponsorship or exhibition</li>
            <li>removal from the conference without a refund</li>
            <li>a ban from future Cloud Native Denmark events</li>
            <li>involving the police</li>
          </List>
          <p>
            If you disagree with a decision, email <Email />. An organizer who
            was not part of the decision will review it.
          </p>

          <Heading>Changes</Heading>
          <p>
            We may update this Code of Conduct. The version on this page
            applies. Last updated: November 2026.
          </p>

          <Heading>Acknowledgements</Heading>
          <p>
            Adapted, with changes, from the{" "}
            <ExternalLink
              href="https://github.com/cncf/foundation/blob/main/code-of-conduct.md"
              className={linkClass}
            >
              CNCF Community Code of Conduct
            </ExternalLink>{" "}
            v1.3 (
            <ExternalLink
              href="https://creativecommons.org/licenses/by/4.0/"
              className={linkClass}
            >
              CC BY 4.0
            </ExternalLink>
            ) and the{" "}
            <ExternalLink
              href="https://events.linuxfoundation.org/about/code-of-conduct/"
              className={linkClass}
            >
              Linux Foundation Events Code of Conduct
            </ExternalLink>
            .
          </p>
        </article>
      </Section>
    </>
  )
}

export default CodeOfConductPage
