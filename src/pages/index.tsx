import React from "react"
import { useLocation } from "react-router-dom"
import SEOHead from "../components/seo-head"
import { useModalManagement } from "../hooks/use-modal-management"
import { useSponsors } from "../hooks/use-sponsors"
import HeroSection from "../components/layout/hero-section"
import ConferenceInfo from "../components/content/conference-info"
import TicketRatesSection from "../components/content/ticket-rates-section"
import VenueSection from "../components/content/venue-section"
import LastYearEventSection from "../components/content/last-year-event-section"
import MissionSection from "../components/content/mission-section"
import SponsorsSection from "../components/content/sponsors-section"
import TalksCarouselSection from "../components/content/talks-carousel-section"
import SpeakerModal from "../components/speaker_modal"

const IndexPage: React.FC = () => {
  const location = useLocation()
  const { sponsors } = useSponsors()
  const { selectedSpeaker, handleCloseSpeakerModal } = useModalManagement()

  const scrollToTicketRates = () => {
    const element = document.getElementById("ticket-rates")
    if (element) {
      const headerOffset = 70
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - headerOffset
      window.scrollTo({ top: offsetPosition, behavior: "smooth" })
    }
  }

  return (
    <>
      <SEOHead title="Cloud Native Denmark 2026" pathname={location.pathname} />
      <HeroSection
        eyebrow="EDITION Nº 04 · NORDIC CLOUD NATIVE CONFERENCE"
        title={
          <>
            CLOUD
            <br />
            NATIVE
            <br />
            <span
              style={{
                WebkitTextStroke: "3px var(--color-cnd-midnight)",
                color: "transparent",
              }}
            >
              DENMARK.
            </span>
          </>
        }
        description="Two days in Copenhagen with the platform engineers, SREs, and architects shipping the Nordics' most demanding cloud native systems to production."
        actions={[
          {
            text: "Ticket rates →",
            onClick: scrollToTicketRates,
            variant: "primary",
          },
          {
            text: "Submit a talk",
            href: "http://cloudnativedenmark.dk/cfp",
            isExternal: true,
            variant: "midnight",
          },
          {
            text: "Merch →",
            href: "https://cloudnativedenmark.ticketbutler.io/en/e/cloud-native-denmark-26/?extras_flow=true",
            isExternal: true,
            variant: "secondary",
          },
        ]}
        dateStamp={{
          label: "COPENHAGEN · CND/2026",
          dates: "19–20 NOV 2026",
          venue: "Scandic Copenhagen",
        }}
      />

      <ConferenceInfo
        title="WHY YOU'RE COMING"
        description="Join us in Copenhagen as the Kubernetes and Cloud Native community comes together for a technical conference packed with inspiring talks, hands-on insights, and great opportunities to connect and grow."
        variant="dark"
      />

      <TicketRatesSection id="ticket-rates" />

      <VenueSection />

      <LastYearEventSection />

      <MissionSection
        description="Through our joint passion for Cloud Native Technologies, we help facilitate the vibrant community meetups and conferences around Denmark, that aim primarily at sharing knowledge and creating deep and diverse professional networks. We use generated profits to make generous donations to trusted charities."
        partnerDescription="Over the last three years, we have proudly made cumulative donations valued over 840,000 DKK to charity. Help us reach well beyond 1,000,000 DKK in 2026! ⭐ We welcome inquiries from good cause organizations - particularly those supporting technological education and enablement!"
      />

      {/*<SpeakersSection
        speakers={speakers}
        onSpeakerClick={handleSpeakerClick}
        initialSpeakersToShow={4}
      />*/}

      {/*<MerchandiseSection />*/}

      <SponsorsSection
        platinum={sponsors.platinum}
        gold={sponsors.gold}
        bronze={sponsors.bronze}
        community={sponsors.community}
        partners={sponsors.partners}
      />

      <TalksCarouselSection />

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
