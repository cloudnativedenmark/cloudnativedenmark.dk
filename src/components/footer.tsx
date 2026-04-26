import React from "react"
import { Link } from "react-router-dom"
import SocialLinks from "./content/social-links"
import ExternalLink from "./ui/external-link"
import CNDShape from "./ui/cnd-shape"

const Footer = () => {
  return (
    <footer className="safe-paddings relative mt-auto overflow-hidden bg-cnd-ink text-white hex-bg">
      {/* Top red rule echoing the hero */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-1.5 bg-cnd-red"
      />

      {/* Decorative shape */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute hidden md:block"
        style={{ bottom: 30, right: 40, opacity: 0.14 }}
      >
        <CNDShape size={140} fill="var(--color-cnd-electric)" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <div
              className="eyebrow mb-3"
              style={{ color: "var(--color-cnd-coral)" }}
            >
              CND/2026 · COPENHAGEN
            </div>
            <div
              className="display text-white"
              style={{
                fontSize: 32,
                letterSpacing: "-0.025em",
                lineHeight: 0.95,
              }}
            >
              CLOUD NATIVE
              <br />
              DENMARK.
            </div>
            <p className="mt-4 max-w-sm text-sm text-cnd-fog">
              A community-driven cloud native conference, organized by
              practitioners for practitioners.
            </p>
          </div>

          <nav>
            <div
              className="eyebrow mb-4 text-cnd-sky"
              style={{ letterSpacing: "0.2em" }}
            >
              LEGAL
            </div>
            <ul className="grid grid-cols-1 gap-3">
              <li>
                <ExternalLink
                  href="https://events.linuxfoundation.org/about/code-of-conduct/"
                  className="text-sm font-semibold text-white hover:text-cnd-coral"
                >
                  Code of Conduct
                </ExternalLink>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-sm font-semibold text-white hover:text-cnd-coral"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <div
              className="eyebrow mb-4 text-cnd-sky"
              style={{ letterSpacing: "0.2em" }}
            >
              CONTACT
            </div>
            <ExternalLink
              href="mailto:contact@cloudnativedenmark.dk"
              openInNewTab={false}
              className="text-sm font-semibold text-white underline decoration-cnd-coral decoration-2 underline-offset-4 hover:text-cnd-coral"
            >
              contact@cloudnativedenmark.dk
            </ExternalLink>
            <div className="mt-6">
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

        <div
          className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span
            className="eyebrow text-cnd-fog"
            style={{ letterSpacing: "0.2em" }}
          >
            EDITION Nº 04 · NOVEMBER 19–20 · SCANDIC COPENHAGEN
          </span>
          <span
            className="eyebrow text-cnd-fog"
            style={{ letterSpacing: "0.2em" }}
          >
            cloudnativedenmark.dk
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
