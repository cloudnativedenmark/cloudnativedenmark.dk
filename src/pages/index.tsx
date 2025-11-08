import * as React from "react"
import { type HeadFC, type PageProps, graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { useSessionizeSpeakers } from "../hooks/use-sessionize"
import { useModalManagement } from "../hooks/use-modal-management"
import HeroSection from "../components/layout/hero-section"
import ConferenceInfo from "../components/content/conference-info"
import VenueSection from "../components/content/venue-section"
import SpeakersSection from "../components/content/speakers-section"
import LastYearEventSection from "../components/content/last-year-event-section"
import MerchandiseSection from "../components/content/merchandise-section"
import MissionSection from "../components/content/mission-section"
import SponsorsSection from "../components/content/sponsors-section"
import SpeakerModal from "../components/speaker_modal"
import Logo from "../images/logo.svg"

interface Sponsor {
  title: string
  url: string
  scale: string
  logo: {
    publicURL: string
  }
}

interface Hotel {
  title: string
  url: string
  description: string
  logo: {
    publicURL: string
  }
}

type DataProps = {
  allCommunityYaml: {
    nodes: Sponsor[]
  }
  allGoldYaml: {
    nodes: Sponsor[]
  }
  allBronzeYaml: {
    nodes: Sponsor[]
  }
  allPlatinumYaml: {
    nodes: Sponsor[]
  }
  allPartnerYaml: {
    nodes: Sponsor[]
  }
  allHotelsYaml: {
    nodes: Hotel[]
  }
}

const IndexPage: React.FC<PageProps<DataProps>> = ({
  data: {
    allCommunityYaml,
    allGoldYaml,
    allBronzeYaml,
    allPlatinumYaml,
    allPartnerYaml,
  },
}) => {
  const { speakers } = useSessionizeSpeakers()
  const { selectedSpeaker, handleSpeakerClick, handleCloseSpeakerModal } =
    useModalManagement()

  // Hero background SVG element
  const heroBackgroundSvg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      viewBox="-80.724 316.355 927.667 175.986"
      preserveAspectRatio="xMidYMid slice"
      width="927.667px"
      height="175.986px"
    >
      <defs></defs>
      <g clipPath="url(#wave1)">
        <path
          fill="#d7dff4"
          d="M 348.113 567.704 L -1048.965 568.625 L -1048.965 464.805 C -583.18 717.992 -117.672 142.594 348.113 395.777 L 348.113 567.704 Z"
        />
      </g>
      <g clipPath="url(#wave2)">
        <path
          fill="#0026ce"
          d="M 548.566 568.003 L -637.617 568.186 L -637.617 477.156 C -242.145 692.121 153.094 203.582 548.566 418.551 L 548.566 568.003 Z"
        />
      </g>
      <g clipPath="url(#wave3)">
        <path
          fill="#11347e"
          d="M 1019.449219 568.15625 L -151.777344 568.15625 L -151.777344 430.761719 C 238.710938 642.867188 628.964844 160.832031 1019.449219 372.9375 Z"
        />
      </g>
    </svg>
  )

  return (
    <Layout>
      <HeroSection
        logo={{
          src: Logo,
          alt: "Cloud Native Denmark",
          width: 300,
        }}
        title={
          <>
            <span className="font-medium tracking-wider">CLOUD NATIVE</span>
            <br />
            <span className="font-extrabold">DENMARK</span>
          </>
        }
        subtitle="October 7-8, 2025 • Aarhus"
        primaryAction={{
          text: "Videos & Slides",
          href: "/talk-archive",
        }}
        secondaryAction={{
          text: "Photos",
          href: "https://www.picdrop.com/kim-yennguyen/Rpea9zFuqv",
          isExternal: true,
        }}
        backgroundElement={heroBackgroundSvg}
      />

      <ConferenceInfo
        title=""
        description="Join us in Aarhus on October 7–8, as the Kubernetes and Cloud Native community comes together for a two-day technical conference packed with inspiring talks, hands-on insights, and great opportunities to connect and grow."
        variant="dark"
      />

      <VenueSection />

      <SpeakersSection
        speakers={speakers}
        onSpeakerClick={handleSpeakerClick}
        initialSpeakersToShow={4}
      />

      <LastYearEventSection />

      <MerchandiseSection />

      <MissionSection
        description="Cloud Native Denmark shares knowledge about Cloud Native Technologies and creates community networks in Denmark within this area. This may happen through events and profit from these will be donated to charity."
        partnerDescription="This year we are collaborating with Coding Pirates and all profits go to them."
      >
        <StaticImage
          src="../images/coding-pirates-logo.png"
          alt="Coding Pirates"
          className="w-48 h-auto"
        />
      </MissionSection>

      <SponsorsSection
        platinum={allPlatinumYaml.nodes}
        gold={allGoldYaml.nodes}
        bronze={allBronzeYaml.nodes}
        community={allCommunityYaml.nodes}
        partners={allPartnerYaml.nodes}
      />

      {selectedSpeaker && (
        <SpeakerModal
          speaker={selectedSpeaker}
          onClose={handleCloseSpeakerModal}
        />
      )}
    </Layout>
  )
}

export default IndexPage

export const Head: HeadFC = ({ location: { pathname } }) => (
  <SEO pathname={pathname} />
)

export const query = graphql`
  query IndexPageQuery {
    allCommunityYaml {
      nodes {
        id
        title
        url
        logo {
          publicURL
        }
        scale
      }
    }

    allGoldYaml {
      nodes {
        id
        title
        url
        logo {
          publicURL
        }
        scale
      }
    }

    allBronzeYaml {
      nodes {
        id
        title
        url
        logo {
          publicURL
        }
        scale
      }
    }

    allPlatinumYaml {
      nodes {
        id
        title
        url
        logo {
          publicURL
        }
        scale
      }
    }

    allPartnerYaml {
      nodes {
        id
        title
        url
        logo {
          publicURL
        }
        scale
      }
    }

    allHotelsYaml {
      nodes {
        id
        title
        url
        description
        logo {
          publicURL
        }
      }
    }
  }
`
