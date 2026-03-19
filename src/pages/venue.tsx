import React from "react"
import { useLocation } from "react-router-dom"
import SEOHead from "../components/seo-head"
import PageHeader from "../components/layout/page-header"
import Section from "../components/ui/section"

const VenuePage: React.FC = () => {
  const location = useLocation()

  return (
    <>
      <SEOHead
        title="Venue"
        description="Cloud Native Denmark 2025 takes place at Scandic Copenhagen - a modern venue in the heart of Copenhagen with capacity for 500 attendees."
        pathname={location.pathname}
      />
      <PageHeader
        title="Venue"
        description="In the heart of Copenhagen"
        variant="dark"
        size="large"
      />

      {/* Venue Overview */}
      <Section className="bg-white py-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero layout with vertical image */}
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-12">
            <div className="relative rounded-2xl overflow-hidden w-full md:w-2/5 flex-shrink-0">
              <img
                src="/images/scandic-copenhagen/hotel-outside-2.jpg"
                alt="Scandic Copenhagen exterior"
                className="w-full h-80 md:h-[28rem] object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <img
                src="/images/scandic-logo.png"
                alt="Scandic"
                className="h-12 md:h-16 mb-4 object-contain mx-auto md:mx-0"
                loading="lazy"
              />
              <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
                Scandic Copenhagen
              </h3>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                The event will take place in the large auditoriums of Scandic
                Copenhagen, which has room for all 500 attendees. The venue
                hosts all attendees and sponsors, and features separate
                auditoriums for break-out sessions.
              </p>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">500</div>
              <div className="text-gray-700 font-medium">Attendees</div>
              <p className="text-sm text-gray-500 mt-2">
                Room for the entire community
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">2</div>
              <div className="text-gray-700 font-medium">Conference Tracks</div>
              <p className="text-sm text-gray-500 mt-2">
                Parallel sessions to choose from
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">1</div>
              <div className="text-gray-700 font-medium">Exhibition Area</div>
              <p className="text-sm text-gray-500 mt-2">
                Meet sponsors outside the auditoriums
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Photo Gallery */}
      <Section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-10">
            The Spaces
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <img
                src="/images/scandic-copenhagen/auditorium.webp"
                alt="Main auditorium"
                className="w-full h-64 md:h-72 object-cover rounded-xl"
                loading="lazy"
              />
              <p className="text-gray-600 font-medium">Main Auditorium</p>
              <p className="text-sm text-gray-500">
                The primary stage for keynotes and main track sessions
              </p>
            </div>
            <div className="space-y-2">
              <img
                src="/images/scandic-copenhagen/hall-1.webp"
                alt="Conference hall"
                className="w-full h-64 md:h-72 object-cover rounded-xl"
                loading="lazy"
              />
              <p className="text-gray-600 font-medium">Conference Hall</p>
              <p className="text-sm text-gray-500">
                Second track sessions and workshops
              </p>
            </div>
            <div className="space-y-2">
              <img
                src="/images/scandic-copenhagen/hall-2.webp"
                alt="Break-out session room"
                className="w-full h-64 md:h-72 object-cover rounded-xl"
                loading="lazy"
              />
              <p className="text-gray-600 font-medium">Exhibition Area</p>
              <p className="text-sm text-gray-500">
                Meet our sponsors and network with fellow attendees
              </p>
            </div>
            <div className="space-y-2">
              <img
                src="/images/scandic-copenhagen/restaurant.jpg"
                alt="Restaurant area"
                className="w-full h-64 md:h-72 object-cover rounded-xl"
                loading="lazy"
              />
              <p className="text-gray-600 font-medium">Restaurant & Lounge</p>
              <p className="text-sm text-gray-500">
                Lunch, refreshments, and networking breaks
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Getting There */}
      <Section className="bg-white py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-10">
            Getting There
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Directions */}
            <div className="space-y-8">
              <div className="bg-blue-50 border-l-4 border-blue-600 rounded-r-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Address
                </h3>
                <p className="text-lg font-medium text-gray-800">
                  Scandic Copenhagen
                </p>
                <p className="text-gray-700">Vester Sogade 6</p>
                <p className="text-gray-700">1601 Copenhagen V</p>
                <p className="text-gray-700">Denmark</p>
                <a
                  href="https://maps.google.com/?q=Scandic+Copenhagen,Vester+Søgade+6,1601+København,Denmark"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-blue-600 font-medium hover:underline"
                >
                  Open in Google Maps →
                </a>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  By Public Transport
                </h3>
                <ul className="text-gray-600 space-y-2">
                  <li>
                    <strong>Train:</strong> Copenhagen Central Station
                    (Kobenhavn H) is a 5-minute walk
                  </li>
                  <li>
                    <strong>Metro:</strong> Vesterport Station is nearby
                  </li>
                  <li>
                    <strong>Bus:</strong> Multiple bus lines stop at Vesterport
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  From Copenhagen Airport
                </h3>
                <ul className="text-gray-600 space-y-2">
                  <li>Take the Metro or train to Copenhagen Central Station</li>
                  <li>Journey time: approximately 15-20 minutes</li>
                  <li>
                    From the station, walk 5 minutes to Scandic Copenhagen
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  By Car
                </h3>
                <p className="text-gray-600">
                  Limited parking available at the hotel. We recommend public
                  transport or nearby parking facilities.
                </p>
              </div>
            </div>

            {/* Map */}
            <div className="h-80 lg:h-full min-h-80 bg-gray-200 rounded-xl overflow-hidden">
              <iframe
                className="border-0"
                src="https://maps.google.com/maps?q=Scandic+Copenhagen,Vester+Søgade+6,1601+København,Denmark&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Scandic Copenhagen Location"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Accommodation */}
      <Section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Accommodation
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Scandic Copenhagen offers comfortable rooms if you prefer to stay at
            the venue. Being centrally located, there are also many other hotels
            within walking distance.
          </p>
          <a
            href="https://www.scandichotels.com/hotels/denmark/copenhagen/scandic-copenhagen"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border-2 border-blue-600 text-blue-600 px-8 py-3 text-lg rounded-full font-medium hover:bg-blue-600 hover:text-white transition-colors"
          >
            Book at Scandic Copenhagen
          </a>
        </div>
      </Section>
    </>
  )
}

export default VenuePage
