import React from "react"
import { useLocation } from "react-router-dom"
import SEOHead from "../components/seo-head"
import PageHeader from "../components/layout/page-header"
import Section from "../components/ui/section"

const PrivacyPage: React.FC = () => {
  const location = useLocation()

  return (
    <>
      <SEOHead title="Privacy Policy" pathname={location.pathname} />
      <PageHeader
        eyebrow="LEGAL"
        title="Privacy policy."
        variant="dark"
        size="medium"
      />
      <Section className="bg-cnd-bone py-16">
        <article
          className="mx-auto max-w-3xl space-y-5 text-cnd-slate"
          style={{ fontSize: 16, lineHeight: 1.7 }}
        >
          <p>
            This Privacy Policy applies only to our online activities and is
            valid for visitors to our website with regards to the information
            that they shared and/or collected in cloudnativedenmark.dk. This
            policy is not applicable to any information collected offline or
            via channels other than this website.
          </p>

          <h2 className="display pt-6 text-cnd-midnight" style={{ fontSize: 26, letterSpacing: "-0.02em" }}>
            Consent
          </h2>
          <p>
            By using our website, you hereby consent to our Privacy Policy and
            agree to its terms.
          </p>

          <h2 className="display pt-6 text-cnd-midnight" style={{ fontSize: 26, letterSpacing: "-0.02em" }}>
            Information we collect
          </h2>
          <p>
            The personal information that you are asked to provide, and the
            reasons why you are asked to provide it, will be made clear to you
            at the point we ask you to provide your personal information.
          </p>
          <p>
            If you contact us directly, we may receive additional information
            about you such as your name, email address, phone number, the
            contents of the message and/or attachments you may send us, and any
            other information you may choose to provide.
          </p>
          <p>
            When you register for an Account, we may ask for your contact
            information, including items such as name, company name, address,
            email address, and telephone number.
          </p>

          <h2 className="display pt-6 text-cnd-midnight" style={{ fontSize: 26, letterSpacing: "-0.02em" }}>
            How we use your information
          </h2>
          <p>We use the information we collect in various ways, including to:</p>
          <ul className="ml-6 list-disc space-y-1">
            <li>Provide, operate, and maintain our website</li>
            <li>Improve, personalize, and expand our website</li>
            <li>Understand and analyze how you use our website</li>
            <li>Develop new products, services, features, and functionality</li>
            <li>
              Communicate with you, either directly or through one of our
              partners, including for customer service, to provide you with
              updates and other information relating to the website, and for
              marketing and promotional purposes
            </li>
            <li>Send you emails</li>
            <li>Find and prevent fraud</li>
          </ul>

          <h2 className="display pt-6 text-cnd-midnight" style={{ fontSize: 26, letterSpacing: "-0.02em" }}>
            Log Files
          </h2>
          <p>
            <code className="rounded bg-cnd-fog/30 px-2 py-0.5 font-mono text-sm">
              cloudnativedenmark.dk
            </code>{" "}
            follows a standard procedure of using log files. These files log
            visitors when they visit websites. All hosting companies do this and
            a part of hosting services' analytics. The information collected by
            log files include internet protocol (IP) addresses, browser type,
            Internet Service Provider (ISP), date and time stamp, referring/exit
            pages, and possibly the number of clicks. These are not linked to
            any information that is personally identifiable. The purpose of the
            information is for analyzing trends, administering the site,
            tracking users' movement on the website, and gathering demographic
            information.
          </p>

          <h2 className="display pt-6 text-cnd-midnight" style={{ fontSize: 26, letterSpacing: "-0.02em" }}>
            GDPR Data Protection Rights
          </h2>
          <p>
            We would like to make sure you are fully aware of all of your data
            protection rights. Every user is entitled to the following:
          </p>
          <ul className="ml-6 list-disc space-y-1">
            <li>The right to access — request copies of your personal data.</li>
            <li>
              The right to rectification — request that we correct any
              information you believe is inaccurate or incomplete.
            </li>
            <li>
              The right to erasure — request that we erase your personal data,
              under certain conditions.
            </li>
            <li>
              The right to restrict processing — request that we restrict
              processing of your personal data, under certain conditions.
            </li>
            <li>
              The right to object to processing — object to our processing of
              your personal data, under certain conditions.
            </li>
            <li>
              The right to data portability — request that we transfer the data
              we have collected to another organization, or directly to you,
              under certain conditions.
            </li>
          </ul>

          <h2 className="display pt-6 text-cnd-midnight" style={{ fontSize: 26, letterSpacing: "-0.02em" }}>
            Ticket purchase
          </h2>
          <p>
            We use Ticketbutler for ticket sales. Read their policy at{" "}
            <a
              href="https://ticketbutler.io/privacy-policy/"
              className="text-cnd-red underline decoration-2 underline-offset-4 hover:text-cnd-coral"
            >
              ticketbutler.io/privacy-policy
            </a>
            .
          </p>

          <h2 className="display pt-6 text-cnd-midnight" style={{ fontSize: 26, letterSpacing: "-0.02em" }}>
            Contact
          </h2>
          <p>
            For any inquiries about Cloud Native Denmark's processing of your
            personal data, contact{" "}
            <a
              href="mailto:privacy@cloudnativedenmark.dk"
              className="text-cnd-red underline decoration-2 underline-offset-4 hover:text-cnd-coral"
            >
              privacy@cloudnativedenmark.dk
            </a>
            .
          </p>
          <p>
            You can also file a complaint with Datatilsynet, the Danish
            supervisory authority, at{" "}
            <a
              href="http://www.datatilsynet.dk"
              className="text-cnd-red underline decoration-2 underline-offset-4 hover:text-cnd-coral"
            >
              datatilsynet.dk
            </a>
            .
          </p>
        </article>
      </Section>
    </>
  )
}

export default PrivacyPage
