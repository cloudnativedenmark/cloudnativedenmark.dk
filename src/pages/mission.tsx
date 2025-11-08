import React from "react"
import Layout from "../components/layout"
import { HeadFC, PageProps } from "gatsby"
import SEO from "../components/seo"
import PageHeader from "../components/layout/page-header"
import Section from "../components/ui/section"
import Container from "../components/ui/container"

const MissionPage: React.FC<PageProps> = () => {
  return (
    <Layout>
      <PageHeader title="Mission" variant="default" size="medium" />
      <Section variant="default" paddingY="xlarge">
        <Container centerContent>
          <p className="text-2xl text-primary leading-relaxed max-w-4xl">
            Cloud Native Denmark shares knowledge about Cloud Native
            Technologies and creates community networks in Denmark within this
            area. This may happen through events and profit from these will be
            donated to charity.
          </p>
        </Container>
      </Section>
    </Layout>
  )
}

export default MissionPage

export const Head: HeadFC = ({ location: { pathname } }) => (
  <SEO title="Cloud Native Denmark - Mission" pathname={pathname} />
)
