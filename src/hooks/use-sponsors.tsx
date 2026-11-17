import { useEffect, useState } from "react"
import { loadSponsors, SponsorData } from "../utils/data-loader"

export interface SponsorCategories {
  platinum: SponsorData[]
  gold: SponsorData[]
  bronze: SponsorData[]
  afterparty: SponsorData[]
  community: SponsorData[]
  partners: SponsorData[]
}

export const useSponsors = () => {
  const [sponsors, setSponsors] = useState<SponsorCategories>({
    platinum: [],
    gold: [],
    bronze: [],
    afterparty: [],
    community: [],
    partners: [],
  })

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const sponsorData = await loadSponsors()
        setSponsors({
          platinum: sponsorData.platinum || [],
          gold: sponsorData.gold || [],
          bronze: sponsorData.bronze || [],
          afterparty: sponsorData.afterparty || [],
          community: sponsorData.community || [],
          partners: sponsorData.partner || [],
        })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error loading sponsors:", error)
      }
    }

    fetchSponsors()
  }, [])

  return { sponsors }
}
