import React from "react"
import { useLocation } from "react-router-dom"
import SEOHead from "../components/seo-head"
import PageHeader from "../components/layout/page-header"
import Section from "../components/ui/section"

const MissionPage: React.FC = () => {
  const location = useLocation()

  return (
    <>
      <SEOHead title="Mission" pathname={location.pathname} />
      <PageHeader
        eyebrow="MISSION"
        title="Why we do this."
        variant="dark"
        size="medium"
      />
      <Section className="bg-cnd-bone py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p
            className="display"
            style={{
              fontSize: "clamp(22px, 2.4vw, 30px)",
              lineHeight: 1.35,
              letterSpacing: "-0.02em",
              color: "var(--color-cnd-midnight)",
              fontWeight: 600,
            }}
          >
            Cloud Native Denmark shares knowledge about cloud native
            technologies and creates community networks in Denmark within this
            area. This happens through events, and profits from these are
            donated to charity.
          </p>
        </div>
      </Section>
    </>
  )
}

export default MissionPage
