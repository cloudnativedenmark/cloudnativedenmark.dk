import * as React from "react"
import { type HeadFC, type PageProps, graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import PageHeader from "../components/layout/page-header"
import Section from "../components/ui/section"
import Container from "../components/ui/container"
import TeamGrid from "../components/content/team-grid"

interface TeamMember {
  name: string
  position: string
  image: {
    publicURL: string
    childImageSharp?: {
      gatsbyImageData: import("gatsby-plugin-image").IGatsbyImageData
    }
  }
  linkedin: string
}

type DataProps = {
  site: {
    siteMetadata: {
      team: TeamMember[]
    }
  }
}

const TeamPage: React.FC<PageProps<DataProps>> = ({
  data: { site },
}: PageProps<DataProps>) => {
  return (
    <Layout>
      <PageHeader
        title="Team"
        description="Cloud Native Denmark is organized by a dedicated committee who are passionate about bringing people together and fostering a sense of community. Our goal is to provide a platform for like-minded individuals from all levels and backgrounds that is dedicated to learning, growth, and diversity."
        variant="dark"
        size="large"
      />
      <Section variant="default" paddingY="xlarge" className="pb-40">
        <Container size="large">
          <TeamGrid members={site.siteMetadata.team} />
        </Container>
      </Section>
    </Layout>
  )
}

export default TeamPage

export const Head: HeadFC = ({ location: { pathname } }) => (
  <SEO title="Cloud Native Denmark - Team" pathname={pathname} />
)

export const query = graphql`
  query Team {
    site {
      siteMetadata {
        team {
          name
          position
          image {
            childImageSharp {
              gatsbyImageData
            }
          }
          linkedin
        }
      }
    }
  }
`
