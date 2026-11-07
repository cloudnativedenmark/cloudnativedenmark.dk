import React from "react"
import { Link, useLocation } from "react-router-dom"
import SEOHead from "../components/seo-head"
import PageHeader from "../components/layout/page-header"
import Section from "../components/ui/section"
import ExternalLink from "../components/ui/external-link"

const CONTACT_EMAIL = "contact@cloudnativedenmark.dk"

const linkClass =
  "text-cnd-red underline decoration-2 underline-offset-4 hover:text-cnd-coral"

const Heading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2
    className="display pt-6 text-cnd-midnight"
    style={{ fontSize: 26, letterSpacing: "-0.02em" }}
  >
    {children}
  </h2>
)

const ContactEmail = () => (
  <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
    {CONTACT_EMAIL}
  </a>
)

const CodeOfConductPage: React.FC = () => {
  const location = useLocation()

  return (
    <>
      <SEOHead
        title="Code of Conduct"
        description="The Code of Conduct for Cloud Native Denmark: what we expect from everyone taking part, and how to report a problem."
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
            Cloud Native Denmark is a community-driven conference, organized by
            volunteers from the Danish cloud native community. We are dedicated
            to making Cloud Native Denmark a welcoming, safe and harassment-free
            experience for everyone, regardless of age, body size, caste,
            disability, ethnicity, level of experience, family status, gender,
            gender identity and expression, marital status, nationality,
            personal appearance, race, religion, sexual orientation,
            socioeconomic status, or any other dimension of diversity.
          </p>
          <p>
            Everyone taking part is expected to follow this Code of Conduct. By
            registering for or attending Cloud Native Denmark, you agree to do
            so.
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
            <ul className="mt-3 ml-6 list-disc space-y-1">
              <li>
                <strong>Emergency:</strong> call <strong>112</strong> for
                police, fire or ambulance.
              </li>
              <li>
                <strong>At the conference:</strong> talk to any{" "}
                <Link to="/team" className={linkClass}>
                  organizer
                </Link>{" "}
                or to the venue reception, who can reach an organizer at any
                time.
              </li>
              <li>
                <strong>Email:</strong> <ContactEmail />
              </li>
            </ul>
          </section>

          <Heading>Scope</Heading>
          <p>
            This Code of Conduct applies to everyone taking part in Cloud Native
            Denmark: attendees, speakers, sponsors, exhibitors and booth staff,
            volunteers, venue staff and organizers. It covers:
          </p>
          <ul className="ml-6 list-disc space-y-1">
            <li>the conference venue, including talks, workshops and booths</li>
            <li>
              social events connected to the conference, such as the after-party
            </li>
            <li>
              online spaces we run or use, such as social media and chat
              channels
            </li>
            <li>
              any communication before, during or after the conference that is
              about the conference or the people taking part in it
            </li>
          </ul>

          <Heading>Expected behavior</Heading>
          <ul className="ml-6 list-disc space-y-1">
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
              Respect people's boundaries, including when they don't want to be
              photographed.
            </li>
            <li>
              Follow the venue's rules and the instructions of organizers and
              venue staff.
            </li>
            <li>
              Look out for each other. If someone seems to be in distress, check
              in with them or let an organizer know.
            </li>
          </ul>

          <Heading>Unacceptable behavior</Heading>
          <p>Unacceptable behavior includes, but is not limited to:</p>
          <ul className="ml-6 list-disc space-y-1">
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
            <li>photographing or recording someone who has asked you not to</li>
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
          </ul>
          <p>
            Talks, slides, demos, booths and marketing materials must not
            contain sexualized imagery or language. Booth staff must not present
            themselves as conference staff.
          </p>
          <p>The following is also prohibited:</p>
          <ul className="ml-6 list-disc space-y-1">
            <li>
              knowingly giving false or misleading information during a Code of
              Conduct investigation, or otherwise tampering with one
            </li>
            <li>
              retaliating against anyone for reporting an incident or acting as
              a witness
            </li>
          </ul>
          <p>
            Anyone asked to stop unacceptable behavior is expected to comply
            immediately.
          </p>

          <Heading>Reporting</Heading>
          <p>
            If you experience or witness unacceptable behavior, or have any
            other concern, please report it as soon as possible. You can:
          </p>
          <ul className="ml-6 list-disc space-y-1">
            <li>
              talk to any{" "}
              <Link to="/team" className={linkClass}>
                organizer
              </Link>{" "}
              during the conference
            </li>
            <li>ask the venue reception to get hold of an organizer for you</li>
            <li>
              email the organizers at <ContactEmail />
            </li>
          </ul>
          <p>
            In an emergency, call 112. For non-urgent matters, the Danish police
            can be reached on 114.
          </p>
          <p>If you can, include in your report:</p>
          <ul className="ml-6 list-disc space-y-1">
            <li>your contact details</li>
            <li>names or descriptions of the people involved</li>
            <li>when and where it happened</li>
            <li>what happened</li>
            <li>names of any witnesses</li>
          </ul>
          <p>
            Reports are handled with discretion and shared only with the
            organizers who need to know. An organizer who is involved in a
            report will not take part in handling it. During the conference we
            respond straight away; reports received outside the conference get a
            response within three business days.
          </p>

          <Heading>Pre-event concerns</Heading>
          <p>
            If you plan to attend and have concerns about another person who may
            be present, contact us at <ContactEmail /> before the conference. We
            will work with you on precautions, such as briefing organizers and
            venue staff, providing an escort, keeping the people involved apart
            at talks and social events, and making sure you can reach an
            organizer directly during the conference.
          </p>

          <Heading>Enforcement</Heading>
          <p>
            The organizers review every report and decide what action is
            appropriate. We will help anyone affected feel safe for the rest of
            the conference, for example by providing an escort, contacting venue
            security or the police, or briefing conference staff.
          </p>
          <p>Consequences may include, but are not limited to:</p>
          <ul className="ml-6 list-disc space-y-1">
            <li>a warning</li>
            <li>removal of offending talk, booth or marketing material</li>
            <li>ending a talk or activity early</li>
            <li>removal from the conference without a refund</li>
            <li>a ban from future Cloud Native Denmark events</li>
            <li>involving the police</li>
          </ul>
          <p>
            We decide based on the severity of the behavior, its impact on the
            people affected, and whether it is part of a pattern.
          </p>

          <Heading>Acknowledgements</Heading>
          <p>
            This Code of Conduct is adapted from the{" "}
            <ExternalLink
              href="https://github.com/cncf/foundation/blob/main/code-of-conduct.md"
              className={linkClass}
            >
              CNCF Community Code of Conduct
            </ExternalLink>{" "}
            and the{" "}
            <ExternalLink
              href="https://events.linuxfoundation.org/about/code-of-conduct/"
              className={linkClass}
            >
              Linux Foundation Events Code of Conduct
            </ExternalLink>
            , which build on the{" "}
            <ExternalLink
              href="https://www.contributor-covenant.org/version/2/0/code_of_conduct/"
              className={linkClass}
            >
              Contributor Covenant
            </ExternalLink>
            . Thanks to{" "}
            <ExternalLink
              href="https://2026.cloudnativedays.no/conduct"
              className={linkClass}
            >
              Cloud Native Days Norway
            </ExternalLink>{" "}
            for showing the way.
          </p>
        </article>
      </Section>
    </>
  )
}

export default CodeOfConductPage
