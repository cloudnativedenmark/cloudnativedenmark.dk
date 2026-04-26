import React from "react"
import Section from "../ui/section"
import Button from "../ui/button"

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
    availableUntil: new Date("2026-09-18"),
    displayDate: "Through Sep 18",
  },
  {
    name: "Standard",
    price: 1999,
    availableUntil: new Date("2026-11-17"),
    displayDate: "Through Nov 17",
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

interface TicketRatesSectionProps {
  id?: string
}

const tierCardClasses = (status: TierStatus) => {
  switch (status) {
    case "active":
      return "bg-cnd-midnight text-white border-cnd-coral shadow-[0_18px_40px_rgba(11,30,63,0.18)] -translate-y-1"
    case "upcoming":
      return "bg-white text-cnd-midnight border-cnd-fog/60 hover:-translate-y-0.5"
    case "expired":
      return "bg-cnd-bone text-cnd-ash border-cnd-fog/40 opacity-60"
  }
}

const tierBadgeClasses = (status: TierStatus) => {
  switch (status) {
    case "active":
      return "bg-cnd-coral text-cnd-midnight"
    case "upcoming":
      return "bg-cnd-fog/40 text-cnd-slate"
    case "expired":
      return "bg-cnd-fog/30 text-cnd-ash"
  }
}

const TierCard: React.FC<{
  tier: TicketTier
  status: TierStatus
  index: number
}> = ({ tier, status, index }) => {
  const priceColor =
    status === "active"
      ? "text-white"
      : status === "expired"
        ? "text-cnd-ash"
        : "text-cnd-midnight"
  return (
    <div
      className={`relative flex flex-col rounded-2xl border-[1.5px] p-7 text-left transition-transform duration-200 ${tierCardClasses(
        status
      )}`}
    >
      <div className="mb-6 flex items-center justify-between">
        <span
          className={`eyebrow rounded-full px-3 py-1 ${tierBadgeClasses(status)}`}
          style={{ fontSize: 10 }}
        >
          {String(index + 1).padStart(2, "0")} · {status.toUpperCase()}
        </span>
        {status === "active" && (
          <span
            className="eyebrow text-cnd-coral"
            style={{ fontSize: 10, letterSpacing: "0.2em" }}
          >
            ON SALE
          </span>
        )}
      </div>
      <h3
        className="display"
        style={{
          fontSize: 22,
          letterSpacing: "-0.02em",
        }}
      >
        {tier.name}
      </h3>
      <p
        className={`mt-2 text-sm ${
          status === "active" ? "text-cnd-fog" : "text-cnd-ash"
        }`}
      >
        {tier.displayDate}
      </p>
      <div className="mt-8 flex items-baseline gap-2">
        <span
          className={`display ${priceColor}`}
          style={{ fontSize: 44, letterSpacing: "-0.03em" }}
        >
          {tier.price.toLocaleString("da-DK")}
        </span>
        <span
          className="eyebrow"
          style={{
            color:
              status === "active"
                ? "var(--color-cnd-fog)"
                : "var(--color-cnd-ash)",
          }}
        >
          DKK
        </span>
      </div>
    </div>
  )
}

const TicketRatesSection: React.FC<TicketRatesSectionProps> = ({ id }) => {
  const activeTierIndex = getActiveTierIndex(ticketTiers)

  return (
    <Section id={id} className="bg-cnd-bone text-cnd-midnight">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-baseline gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <div
              className="eyebrow mb-3"
              style={{ color: "var(--color-cnd-red)" }}
            >
              03 · TICKETS
            </div>
            <h2
              className="display"
              style={{
                fontSize: "clamp(32px, 5vw, 56px)",
                letterSpacing: "-0.035em",
              }}
            >
              Book early.
              <br />
              Pay less.
            </h2>
          </div>
          <p
            className="mt-4 max-w-md text-cnd-slate md:mt-0 md:text-right"
            style={{ fontSize: 16, lineHeight: 1.55 }}
          >
            Four tiers, sliding price, capped Blind Bird seats. The earlier you
            commit, the better the deal — and the schedule rewards you for it.
          </p>
        </div>

        <h3
          className="eyebrow mt-12 mb-6 text-cnd-ash"
          style={{ letterSpacing: "0.2em" }}
        >
          INDIVIDUAL TICKETS
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {ticketTiers.map((tier, index) => (
            <TierCard
              key={tier.name}
              tier={tier}
              index={index}
              status={getTierStatus(tier, index, activeTierIndex)}
            />
          ))}
        </div>

        <p className="mt-8 text-center text-sm italic text-cnd-ash">
          Visible prices include 25% VAT. Additional Ticketbutler service fees
          apply at checkout. Blind Bird availability is capped at 100 tickets,
          and may be limited given early release of the conference schedule.
        </p>

        <div className="mt-10 flex justify-center">
          <a
            href="https://cloudnativedenmark.ticketbutler.io/da/e/cloud-native-denmark-26/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button>Buy tickets →</Button>
          </a>
        </div>
      </div>
    </Section>
  )
}

export default TicketRatesSection
