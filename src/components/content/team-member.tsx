import React from "react"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import ExternalLink from "../ui/external-link"

interface TeamMemberProps {
  name: string
  position: string
  image: {
    publicURL: string
    childImageSharp?: {
      gatsbyImageData: import("gatsby-plugin-image").IGatsbyImageData
    }
  }
  linkedin?: string
  variant?: "default" | "compact"
}

const TeamMember: React.FC<TeamMemberProps> = ({
  name,
  position,
  image,
  linkedin,
  variant = "default",
}) => {
  const imageData = getImage(image)

  const containerClasses =
    variant === "compact"
      ? "flex-col w-48 md:w-full"
      : "flex-col w-60 md:w-full"

  return (
    <div className={containerClasses}>
      {imageData && (
        <GatsbyImage
          className={variant === "compact" ? "w-48" : "w-60"}
          image={imageData}
          alt={name}
        />
      )}
      <div className="text-center mt-4">
        <h3 className="text-xl font-bold text-primary mb-2">{name}</h3>
        {position && <p className="text-base text-gray-600 mb-4">{position}</p>}
        {linkedin && (
          <ExternalLink
            href={`https://linkedin.com/in/${linkedin}`}
            variant="inline"
            className="text-blue-600 hover:text-blue-800"
          >
            LinkedIn
          </ExternalLink>
        )}
      </div>
    </div>
  )
}

export default TeamMember
