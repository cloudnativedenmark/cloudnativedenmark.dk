import * as React from "react"
import { type HeadFC, type PageProps } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import PageHeader from "../components/layout/page-header"
import VenueMap from "../components/content/venue-map"
import SavvaerketMap from "../images/savvaerket.svg"
import KlingenMap from "../images/klingen.svg"

const VenuePage: React.FC<PageProps> = () => {
  const maps = [
    {
      src: SavvaerketMap,
      alt: "Savvaerket Map",
      title: "Savværket Floor Plan",
    },
    {
      src: KlingenMap,
      alt: "Klingen Map",
      title: "Klingen Floor Plan",
    },
  ]

  return (
    <Layout>
      <PageHeader
        title="Venue Plan"
        description="Find your way around the conference."
        variant="dark"
        size="large"
      />
      <VenueMap maps={maps} />
    </Layout>
  )
}

export default VenuePage

export const Head: HeadFC = ({ location: { pathname } }) => (
  <SEO pathname={pathname} title="Venue Plan" />
)
