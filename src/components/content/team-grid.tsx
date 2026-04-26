import React from "react"
import TeamMember from "./team-member"

interface TeamMemberData {
  name: string
  position: string
  image: string
  linkedin?: string
}

interface TeamGridProps {
  members: TeamMemberData[]
  variant?: "default" | "compact"
  columns?: {
    mobile?: number
    tablet?: number
    desktop?: number
  }
}

const TeamGrid: React.FC<TeamGridProps> = ({
  members,
  variant = "default",
}) => {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
      {members.map((member, index) => (
        <TeamMember
          key={`${member.name}-${index}`}
          name={member.name}
          position={member.position}
          image={member.image}
          linkedin={member.linkedin}
          variant={variant}
        />
      ))}
    </div>
  )
}

export default TeamGrid
