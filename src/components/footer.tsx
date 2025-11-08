import React from "react"
import { Link } from "gatsby"
import SocialLinks from "./content/social-links"
import ExternalLink from "./ui/external-link"

const Footer = () => {
  return (
    <footer className="safe-paddings mt-auto bg-background-dark">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col md:flex-row gap-y-12 justify-between">
          <nav>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-4">
              <li>
                <ExternalLink
                  href="https://events.linuxfoundation.org/about/code-of-conduct/"
                  variant="inline"
                  className="text-white hover:text-gray-200 text-sm font-semibold"
                >
                  Code of Conduct
                </ExternalLink>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-white hover:text-gray-200 text-sm font-semibold"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </nav>
          <div>
            <ExternalLink
              href="mailto:contact@cloudnativedenmark.dk"
              variant="inline"
              openInNewTab={false}
              className="text-sm font-semibold transition-colors duration-200 text-white hover:text-gray-200"
            >
              contact@cloudnativedenmark.dk
            </ExternalLink>
            <div className="mt-4">
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
                size="medium"
                spacing="normal"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
