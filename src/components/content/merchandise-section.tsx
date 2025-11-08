import React from "react"
import Section from "../ui/section"
import Container from "../ui/container"
import ExternalLink from "../ui/external-link"

const MerchandiseSection: React.FC = () => {
  return (
    <Section variant="default">
      <Container centerContent>
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-12">
          Official Merchandise
        </h2>
        <div className="max-w-4xl mx-auto mb-12">
          <p className="text-lg lg:text-xl text-gray-800 leading-relaxed mb-6">
            Unable to attend? You can still get your hands on our exclusive
            conference merchandise! Order now and have a colleague pick it up
            for you at the event.
          </p>
          <p className="text-lg lg:text-xl text-gray-700 leading-relaxed">
            For large orders, shipping is possible. Please contact us at{" "}
            <ExternalLink
              href="mailto:contact@cloudnativedenmark.dk"
              variant="inline"
              openInNewTab={false}
            >
              contact@cloudnativedenmark.dk
            </ExternalLink>{" "}
            for more information.
          </p>
        </div>
        <ExternalLink
          href="https://cloudnativedenmark.ticketbutler.io/en/e/cloud-native-denmark/?extras_flow=true"
          variant="button"
        >
          Order Merch
        </ExternalLink>
      </Container>
    </Section>
  )
}

export default MerchandiseSection
