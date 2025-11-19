import React from "react"
import { Link } from "react-router-dom"
import Section from "../ui/section"
import Button from "../ui/button"

const VenueSection: React.FC = () => {
  return (
    <Section className="bg-white">
      <div className="text-center">
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-12">
          Venue
        </h2>
        <div className="flex flex-col lg:flex-row items-center justify-evenly gap-12">
          <div className="flex flex-col items-center">
            <img
              src="/images/sav-vaerket-logo.png"
              alt="Savværket"
              className="w-32 h-32 mb-4"
              loading="lazy"
            />
            <p className="text-xl font-semibold text-gray-800 mb-2">
              Savværket
            </p>
            <p className="text-lg text-gray-600">Søren Nymarks Vej 8A</p>
            <p className="text-lg text-gray-600">8270 Højbjerg</p>
          </div>
          <div className="w-full lg:w-1/2 h-64 bg-gray-200 rounded-lg overflow-hidden">
            <iframe
              className="border-0"
              src="https://maps.google.com/maps?q=Savværket,Søren+Nymarks+Vej+8A,8270+Højbjerg,Denmark&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Savværket Location"
            />
          </div>
        </div>
        <div className="mt-12">
          <Link to="/venue-plan">
            <Button>See Venue Plan</Button>
          </Link>
        </div>
      </div>
    </Section>
  )
}

export default VenueSection
