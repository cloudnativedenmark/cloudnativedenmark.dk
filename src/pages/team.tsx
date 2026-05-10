import React from "react"
import { useLocation } from "react-router-dom"
import SEOHead from "../components/seo-head"
import PageHeader from "../components/layout/page-header"
import Section from "../components/ui/section"
import TeamGrid from "../components/content/team-grid"
import { getTeamMembers } from "../utils/data-loader"

const TeamPage: React.FC = () => {
  const location = useLocation()
  const teamMembers = getTeamMembers()

  return (
    <>
      <SEOHead title="Team" pathname={location.pathname} />
      <PageHeader
        eyebrow="ORGANIZERS"
        title="The crew."
        description="Cloud Native Denmark is organized by a dedicated committee passionate about bringing people together and fostering a sense of community. Our goal is a platform for like-minded individuals from all levels and backgrounds, dedicated to learning, growth, and diversity."
        variant="dark"
        size="large"
      />
      <Section className="bg-cnd-bone pb-32 pt-16 lg:pt-20 lg:pb-40">
        <div className="mx-auto max-w-7xl">
          <TeamGrid members={teamMembers} />
        </div>
      </Section>
    </>
  )
}

export default TeamPage
