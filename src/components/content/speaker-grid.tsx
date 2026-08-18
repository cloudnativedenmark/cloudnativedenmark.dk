import React from "react"
import { type Speaker } from "../../hooks/use-sessionize"
import SpeakerCard from "./speaker-card"

interface SpeakerGridProps {
  speakers: Speaker[]
}

const SpeakerGrid: React.FC<SpeakerGridProps> = ({ speakers }) => {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
      {speakers.map((speaker) => (
        <SpeakerCard key={speaker.id} speaker={speaker} />
      ))}
    </div>
  )
}

export default SpeakerGrid
