import React from "react"
import Section from "../ui/section"
import ExternalLink from "../ui/external-link"
import SponsorGrid from "./sponsor-grid"
import Button from "../ui/button"

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
    <Section className="bg-white px-0 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <h2
          className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8"
          id="sponsors"
        >
          Sponsors
        </h2>
        <div className="mx-auto mb-12 max-w-[600px]">
          <p className="text-lg text-gray-700 leading-relaxed text-center mb-4">
            If you're interested in becoming a sponsor, please contact:
          </p>
          <p className="text-center mb-12">
            <ExternalLink
              href="mailto:sponsor@cloudnativedenmark.dk"
              openInNewTab={false}
              className="text-lg font-medium text-background hover:text-background/80 underline"
            >
              sponsor@cloudnativedenmark.dk
            </ExternalLink>
          </p>
          <div className="text-center">
            <ExternalLink href="https://www.canva.com/design/DAG18lTHcrM/RZGm8CHGviE7ZRUBsupWOA/edit">
              <Button variant="primary">Sponsor Prospectus</Button>
            </ExternalLink>
          </div>
        </div>
      </div>

      <SponsorGrid sponsors={platinum} title="Platinum Sponsors" />
      <SponsorGrid sponsors={gold} title="Gold Sponsors" />
      <SponsorGrid sponsors={bronze} title="Bronze Sponsors" />
      <SponsorGrid sponsors={community} title="Community Sponsors" />
      <SponsorGrid sponsors={partners} title="Partners & Media" />
    </Section>
  )
}

export default SponsorsSection
