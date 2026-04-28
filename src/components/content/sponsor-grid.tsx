import React from "react"
import ExternalLink from "../ui/external-link"

interface Sponsor {
  title: string
  url: string
  scale?: string
  logo: {
    publicURL: string
  }
}

type TierType = "platinum" | "gold" | "bronze" | "community" | "partners"

interface SponsorGridProps {
  sponsors: Sponsor[]
  title: string
  size?: "xl" | "l" | "m" | "s"
  tier?: TierType
}

const SponsorGrid: React.FC<SponsorGridProps> = ({
  sponsors,
  title,
  size = "m",
  tier = "community",
}) => {
  if (!sponsors || sponsors.length === 0) {
    return null
  }

  const sizeConfig = {
    xl: {
      container: "mt-16 mb-20",
      item: "flex items-center justify-center min-w-[380px] min-h-[130px] sm:min-w-[320px] sm:min-h-[110px] xs:min-w-fit xs:max-w-full",
      image: "h-auto max-h-[140px] xs:max-w-full max-w-[340px] sm:min-w-[70%]",
    },
    l: {
      container: "mt-14 mb-18",
      item: "flex items-center justify-center min-w-[320px] min-h-[120px] sm:min-w-[280px] sm:min-h-[100px] xs:min-w-fit xs:max-w-full",
      image: "h-auto max-h-[120px] xs:max-w-full max-w-[280px] sm:min-w-[70%]",
    },
    m: {
      container: "mt-12 mb-16",
      item: "flex items-center justify-center min-w-[240px] min-h-[100px] sm:min-w-[200px] sm:min-h-[85px] xs:min-w-fit xs:max-w-full",
      image: "h-auto max-h-[100px] xs:max-w-full max-w-[220px] sm:min-w-[70%]",
    },
    s: {
      container: "mt-12 mb-16",
      item: "flex items-center justify-center min-w-[200px] min-h-[90px] sm:min-w-[180px] sm:min-h-[75px] xs:min-w-fit xs:max-w-full",
      image: "h-auto max-h-[90px] xs:max-w-full max-w-[190px] sm:min-w-[70%]",
    },
  }

  const tierConfig: Record<
    TierType,
    { dot: string; text: string; line: string }
  > = {
    platinum: {
      dot: "bg-cnd-red",
      text: "text-cnd-midnight",
      line: "from-transparent via-cnd-red/60 to-transparent",
    },
    gold: {
      dot: "bg-cnd-amber",
      text: "text-cnd-midnight",
      line: "from-transparent via-cnd-amber to-transparent",
    },
    bronze: {
      dot: "bg-cnd-coral",
      text: "text-cnd-midnight",
      line: "from-transparent via-cnd-coral to-transparent",
    },
    community: {
      dot: "bg-cnd-electric",
      text: "text-cnd-midnight",
      line: "from-transparent via-cnd-electric/70 to-transparent",
    },
    partners: {
      dot: "bg-cnd-sky",
      text: "text-cnd-slate",
      line: "from-transparent via-cnd-fog to-transparent",
    },
  }

  const {
    container: containerClasses,
    item: itemClasses,
    image: imageClasses,
  } = sizeConfig[size]
  const {
    dot: dotColor,
    line: lineGradient,
    text: textColor,
  } = tierConfig[tier]

  return (
    <div className={containerClasses}>
      <div className="flex items-center justify-center gap-4 mb-10">
        <div
          className={`h-px bg-gradient-to-r ${lineGradient} flex-1 max-w-24`}
        ></div>
        <span
          className={`inline-block h-2 w-2 rounded-sm ${dotColor}`}
          aria-hidden="true"
        />
        <p
          className={`eyebrow text-center ${textColor}`}
          style={{ fontSize: 13, letterSpacing: "0.22em" }}
        >
          {title}
        </p>
        <div
          className={`h-px bg-gradient-to-l ${lineGradient} flex-1 max-w-24`}
        ></div>
      </div>
      <div className="flex flex-wrap justify-center gap-x-8 xl:gap-y-6">
        {sponsors.map((sponsor, index) => (
          <div key={`${sponsor.title}-${index}`} className={itemClasses}>
            <ExternalLink
              href={sponsor.url}
              className="flex h-full w-fit items-center justify-center hover:opacity-80 transition-opacity"
            >
              {sponsor.logo && (
                <img
                  className={imageClasses}
                  src={sponsor.logo.publicURL}
                  width={sponsor.scale}
                  alt={sponsor.title}
                />
              )}
            </ExternalLink>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SponsorGrid
