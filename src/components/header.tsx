import React, { useState, useEffect, useRef } from "react"
import Logo from "../images/logo.svg"
import { Link } from "react-router-dom"
import HamburgerMenu from "../images/hamburger-menu.inline.svg"
import CloseMenu from "../images/close-menu.inline.svg"

interface HeaderProps {
  menuLinks: {
    name: string
    link: string
  }[]
}

const ticketUrl =
  "https://cloudnativedenmark.ticketbutler.io/en/e/cloud-native-denmark-26/"

const Header = ({ menuLinks }: HeaderProps) => {
  const [isMenuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    const observer = new ResizeObserver(() => {
      document.documentElement.style.setProperty(
        "--site-header-height",
        `${header.getBoundingClientRect().height}px`
      )
    })
    observer.observe(header)

    return () => {
      observer.disconnect()
      document.documentElement.style.removeProperty("--site-header-height")
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMenuOpen])

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen)
  }

  return (
    <header
      ref={headerRef}
      className={
        "safe-paddings sticky top-0 z-50 bg-cnd-bone/85 backdrop-blur-md transition-colors border-b border-cnd-fog/40" +
        (isMenuOpen ? " h-screen flex flex-col bg-cnd-bone" : "")
      }
    >
      <div className="flex w-full items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={Logo}
              width={40}
              height="auto"
              loading="eager"
              alt="Cloud Native Denmark"
            />
            <span
              className="text-cnd-midnight"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: "0.02em",
                lineHeight: 1,
              }}
            >
              CLOUD NATIVE
              <br />
              DENMARK
            </span>
          </Link>
        </div>
        <nav className="mr-4 hidden md:flex items-center gap-6">
          {menuLinks.map((link) => (
            <Link
              key={link.name}
              to={link.link}
              className="text-sm font-semibold text-cnd-slate hover:text-cnd-red transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <a
            href={ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill bg-cnd-red text-white shadow-[0_4px_18px_rgba(224,19,42,0.25)] hover:bg-cnd-red/90"
          >
            Buy tickets →
          </a>
        </nav>
        <div className="md:hidden">
          <button onClick={toggleMenu} aria-label="Toggle navigation">
            {isMenuOpen ? <CloseMenu /> : <HamburgerMenu />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="flex-grow md:hidden">
          <nav className="flex h-full flex-col items-center justify-start gap-2 pt-4">
            {menuLinks.map((link) => (
              <Link
                key={link.name}
                to={link.link}
                className="my-3 text-2xl font-semibold text-cnd-midnight hover:text-cnd-red"
                onClick={toggleMenu}
              >
                {link.name}
              </Link>
            ))}
            <a
              href={ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="my-3 text-2xl font-semibold text-cnd-red hover:text-cnd-coral"
              onClick={toggleMenu}
            >
              Buy tickets →
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
