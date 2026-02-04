import React from "react"
import { useLocation } from "react-router-dom"
import SEOHead from "../components/seo-head"
import PageHeader from "../components/layout/page-header"
import Section from "../components/ui/section"
import Button from "../components/ui/button"

interface TicketTier {
  name: string
  price: number
  availableUntil: Date
  displayDate: string
}

const ticketTiers: TicketTier[] = [
  {
    name: "Early Blind Bird",
    price: 999,
    availableUntil: new Date("2026-01-01"),
    displayDate: "Through Jan 1",
  },
  {
    name: "Blind Bird",
    price: 1499,
    availableUntil: new Date("2026-03-31"),
    displayDate: "Through Mar 31",
  },
  {
    name: "Ordinary",
    price: 1999,
    availableUntil: new Date("2026-11-05"),
    displayDate: "Through Nov 5",
  },
  {
    name: "Late Bird",
    price: 4999,
    availableUntil: new Date("2026-11-20"),
    displayDate: "Through Event",
  },
]

type TierStatus = "expired" | "active" | "upcoming"

const getTierStatus = (
  tier: TicketTier,
  index: number,
  activeTierIndex: number
): TierStatus => {
  if (index < activeTierIndex) return "expired"
  if (index === activeTierIndex) return "active"
  return "upcoming"
}

const getActiveTierIndex = (tiers: TicketTier[]): number => {
  const now = new Date()
  for (let i = 0; i < tiers.length; i++) {
    if (now <= tiers[i].availableUntil) {
      return i
    }
  }
  return -1
}

const TicketRatesPage: React.FC = () => {
  const location = useLocation()
  const activeTierIndex = getActiveTierIndex(ticketTiers)

  return (
    <>
      <SEOHead title="Ticket Rates" pathname={location.pathname} />
      <PageHeader
        title="Ticket Rates"
        description="Cloud Native Denmark 2026 offers several ticket tiers. Book early to get the best price!"
        variant="dark"
        size="large"
      />
      <Section className="bg-white py-20 pb-40">
        <div className="max-w-5xl mx-auto">
          {/* Desktop table */}
          <div className="hidden md:grid md:grid-cols-4 gap-4">
            {ticketTiers.map((tier, index) => {
              const status = getTierStatus(tier, index, activeTierIndex)
              return (
                <div
                  key={tier.name}
                  className={`rounded-lg p-6 text-center border ${
                    status === "active"
                      ? "bg-blue-50 border-blue-300"
                      : status === "upcoming"
                        ? "bg-gray-50 border-gray-200"
                        : "bg-gray-100 border-gray-300 opacity-50"
                  }`}
                >
                  <h3
                    className={`text-lg font-bold ${
                      status === "expired" ? "text-gray-400" : "text-gray-900"
                    }`}
                  >
                    {tier.name}
                  </h3>
                  <p
                    className={`text-sm mt-1 ${
                      status === "expired" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {tier.displayDate}
                  </p>
                  <p
                    className={`text-2xl font-bold mt-4 ${
                      status === "active"
                        ? "text-blue-600"
                        : status === "upcoming"
                          ? "text-gray-700"
                          : "text-gray-400"
                    }`}
                  >
                    {tier.price.toLocaleString("da-DK")} DKK
                  </p>
                </div>
              )
            })}
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-4">
            {ticketTiers.map((tier, index) => {
              const status = getTierStatus(tier, index, activeTierIndex)
              return (
                <div
                  key={tier.name}
                  className={`rounded-lg p-6 text-center border ${
                    status === "active"
                      ? "bg-blue-50 border-blue-300"
                      : status === "upcoming"
                        ? "bg-gray-50 border-gray-200"
                        : "bg-gray-100 border-gray-300 opacity-50"
                  }`}
                >
                  <h3
                    className={`text-lg font-bold ${
                      status === "expired" ? "text-gray-400" : "text-gray-900"
                    }`}
                  >
                    {tier.name}
                  </h3>
                  <p
                    className={`text-sm mt-1 ${
                      status === "expired" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {tier.displayDate}
                  </p>
                  <p
                    className={`text-2xl font-bold mt-4 ${
                      status === "active"
                        ? "text-blue-600"
                        : status === "upcoming"
                          ? "text-gray-700"
                          : "text-gray-400"
                    }`}
                  >
                    {tier.price.toLocaleString("da-DK")} DKK
                  </p>
                </div>
              )
            })}
          </div>

          <p className="text-sm text-gray-500 text-center mt-8 italic">
            This page is a work in progress. Prices, dates, and other details
            are subject to change.
          </p>

          <div className="text-center mt-8">
            <a
              href="https://cloudnativedenmark.ticketbutler.io/da/e/cloud-native-denmark-26/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button>Buy Tickets</Button>
            </a>
          </div>
        </div>
      </Section>
    </>
  )
}

export default TicketRatesPage
