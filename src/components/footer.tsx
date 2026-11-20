import React from "react"
import { Link } from "react-router-dom"
import SocialLinks from "./content/social-links"

const Footer = () => {
  return (
    <footer className="safe-paddings relative mt-auto bg-cnd-ink text-white">
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-1.5 bg-cnd-red"
      />
      <div className="mx-auto flex max-w-[1280px] flex-col gap-4 px-6 pt-7 pb-6 md:flex-row md:items-center md:justify-between lg:px-12">
        <p className="text-sm text-cnd-fog">
          Help make CND/2027 happen as a sponsor, organizer or volunteer:{" "}
          <span className="font-semibold text-white select-all">
            contact@cloudnativedenmark.dk
          </span>
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <nav aria-label="Legal" className="flex gap-5">
            <Link
              to="/code-of-conduct"
              className="text-sm font-semibold text-white hover:text-cnd-coral"
            >
              Code of Conduct
            </Link>
            <Link
              to="/privacy"
              className="text-sm font-semibold text-white hover:text-cnd-coral"
            >
              Privacy Policy
            </Link>
          </nav>
          <SocialLinks
            links={[
              {
                type: "linkedin",
                url: "https://www.linkedin.com/company/cloud-native-denmark",
                label: "LinkedIn",
              },
              {
                type: "youtube",
                url: "https://www.youtube.com/@CloudNativeNordics/videos",
                label: "YouTube",
              },
              {
                type: "flickr",
                url: "https://www.flickr.com/photos/199545304@N04/",
                label: "Flickr",
              },
            ]}
            size="small"
            spacing="normal"
          />
        </div>
      </div>
    </footer>
  )
}

export default Footer
