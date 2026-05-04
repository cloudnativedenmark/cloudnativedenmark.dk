import React from "react"
import { Link } from "react-router-dom"
import Section from "../ui/section"
import SponsorGrid from "./sponsor-grid"
import Button from "../ui/button"
import CNDShape from "../ui/cnd-shape"

interface Sponsor {
  title: string
  url: string
  scale?: string
  logo: {
    publicURL: string
  }
}

interface SponsorsSectionProps {
  sectionNumber: number
  platinum: Sponsor[]
  gold: Sponsor[]
  bronze: Sponsor[]
  community: Sponsor[]
  partners: Sponsor[]
}

const SponsorsSection: React.FC<SponsorsSectionProps> = ({
  sectionNumber,
  platinum,
  gold,
  bronze,
  community,
  partners,
}) => {
  return (
    <Section className="relative overflow-hidden bg-cnd-bone text-cnd-midnight px-0! sm:px-6! lg:px-12!">
      {/* Decorative shapes — positioned within bounds so they're never clipped */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute hidden lg:block"
        style={{ top: 40, left: 40, opacity: 0.4 }}
      >
        <CNDShape size={120} fill="var(--color-cnd-amber)" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute hidden lg:block"
        style={{ bottom: 60, right: 40, opacity: 0.4 }}
      >
        <CNDShape size={140} fill="var(--color-cnd-sky)" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center" id="sponsors">
          <div
            className="eyebrow mb-4"
            style={{ color: "var(--color-cnd-red)" }}
          >
            {String(sectionNumber).padStart(2, "0")} · SPONSORS
          </div>
          <h2
            className="display"
            style={{
              fontSize: "clamp(32px, 5vw, 56px)",
              letterSpacing: "-0.035em",
            }}
          >
            Made possible by
            <br />
            our sponsors.
          </h2>
          <p
            className="mt-6 mx-auto max-w-2xl text-cnd-slate"
            style={{ fontSize: 18, lineHeight: 1.55 }}
          >
            Cloud Native Denmark is community-driven and powered by the
            companies who care about the Nordic cloud native scene.
          </p>
          <div className="mt-8">
            <Link to="/become-a-sponsor">
              <Button variant="primary">Become a sponsor →</Button>
            </Link>
          </div>
        </div>

        <SponsorGrid
          sponsors={platinum}
          title="Platinum"
          size="xl"
          tier="platinum"
        />
        <SponsorGrid sponsors={gold} title="Gold" size="l" tier="gold" />
        <SponsorGrid sponsors={bronze} title="Bronze" size="m" tier="bronze" />
        <SponsorGrid
          sponsors={community}
          title="Community"
          size="s"
          tier="community"
        />
        <SponsorGrid
          sponsors={partners}
          title="Partners & Media"
          size="s"
          tier="partners"
        />
      </div>
    </Section>
  )
}

export default SponsorsSection
