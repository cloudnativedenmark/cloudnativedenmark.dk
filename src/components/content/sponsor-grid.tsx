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

interface SponsorGridProps {
  sponsors: Sponsor[]
  title: string
  variant?: "default" | "compact"
}

const SponsorGrid: React.FC<SponsorGridProps> = ({
  sponsors,
  title,
  variant = "default",
}) => {
  if (!sponsors || sponsors.length === 0) {
    return null
  }

  const containerClasses = variant === "compact" ? "mt-12 mb-16" : "mt-16 mb-20"

  const itemClasses =
    variant === "compact"
      ? "flex items-center justify-center min-w-[280px] min-h-[100px] xs:min-w-fit xs:max-w-full"
      : "flex items-center justify-center min-w-[384px] min-h-[122px] sm:min-w-[320px] sm:min-h-[115px] xs:min-w-fit xs:max-w-full"

  const imageClasses =
    variant === "compact"
      ? "h-auto max-h-[100px] xs:max-w-full max-w-[280px] sm:min-w-[70%] scale-[0.7]"
      : "h-auto max-h-[130px] xs:max-w-full max-w-[330px] sm:min-w-[70%] scale-[0.8]"

  return (
    <div className={containerClasses}>
      <p className="text-center text-2xl font-semibold uppercase leading-normal text-primary-1 mb-8">
        {title}
      </p>
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
