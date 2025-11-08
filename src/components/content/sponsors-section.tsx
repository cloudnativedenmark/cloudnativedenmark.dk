import React from "react"
import Section from "../ui/section"
import Container from "../ui/container"
import ExternalLink from "../ui/external-link"
import SponsorGrid from "./sponsor-grid"

interface Sponsor {
  title: string
  url: string
  scale?: string
  logo: {
    publicURL: string
  }
}

interface SponsorsSectionProps {
  platinum: Sponsor[]
  gold: Sponsor[]
  bronze: Sponsor[]
  community: Sponsor[]
  partners: Sponsor[]
}

const SponsorsSection: React.FC<SponsorsSectionProps> = ({
  platinum,
  gold,
  bronze,
  community,
  partners,
}) => {
  return (
    <Section variant="default">
      <Container centerContent>
        <h2
          className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8"
          id="sponsors"
        >
          Sponsors
        </h2>
        <p className="text-lg text-gray-700 mx-auto mb-12 max-w-[600px] leading-relaxed">
          If you're interested in becoming a sponsor, please contact{" "}
          <ExternalLink
            href="mailto:sponsor@cloudnativedenmark.dk"
            variant="inline"
            openInNewTab={false}
          >
            sponsor@cloudnativedenmark.dk
          </ExternalLink>{" "}
          or view our{" "}
          <ExternalLink
            href="https://cloudnativedenmark2025.my.canva.site/"
            variant="inline"
          >
            prospectus
          </ExternalLink>
        </p>
      </Container>

      <SponsorGrid sponsors={platinum} title="Platinum Sponsors" />
      <SponsorGrid sponsors={gold} title="Gold Sponsors" />
      <SponsorGrid sponsors={bronze} title="Bronze Sponsors" />
      <SponsorGrid sponsors={community} title="Community Sponsors" />
      <SponsorGrid sponsors={partners} title="Partners & Media" />
    </Section>
  )
}

export default SponsorsSection
