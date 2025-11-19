import React from "react"
import { useLocation } from "react-router-dom"
import SEOHead from "../components/seo-head"
import { useSessionizeSpeakers } from "../hooks/use-sessionize"
import { useModalManagement } from "../hooks/use-modal-management"
import { useSponsors } from "../hooks/use-sponsors"
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

const IndexPage: React.FC = () => {
  const location = useLocation()
  const { speakers } = useSessionizeSpeakers()
  const { sponsors } = useSponsors()
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
    <>
      <SEOHead title="Cloud Native Denmark 2025" pathname={location.pathname} />
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
        subtitle="Fall, 2026 • Copenhagen"
        primaryAction={{
          text: "Early Bird Tickets",
          href: "https://cloudnativedenmark.ticketbutler.io/da/e/cloud-native-denmark-26/",
          isExternal: true,
        }}
        secondaryAction={{
          text: "Merch",
          href: "https://cloudnativedenmark.ticketbutler.io/en/e/cloud-native-denmark-26/?extras_flow=true",
          isExternal: true,
        }}
        backgroundElement={heroBackgroundSvg}
      />

      <ConferenceInfo
        title=""
        description="Join us in Copenhagen as the Kubernetes and Cloud Native community comes together for a technical conference packed with inspiring talks, hands-on insights, and great opportunities to connect and grow."
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
        <img
          src="/images/coding-pirates-logo.png"
          alt="Coding Pirates"
          className="w-48 h-auto"
          loading="lazy"
        />
      </MissionSection>

      <SponsorsSection
        platinum={sponsors.platinum}
        gold={sponsors.gold}
        bronze={sponsors.bronze}
        community={sponsors.community}
        partners={sponsors.partners}
      />

      {selectedSpeaker && (
        <SpeakerModal
          speaker={selectedSpeaker}
          onClose={handleCloseSpeakerModal}
        />
      )}
    </>
  )
}

export default IndexPage
