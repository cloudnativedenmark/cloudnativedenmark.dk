import React, { useState, useEffect } from "react";
import Logo from "../images/logo.svg";
import { Link } from "gatsby";
import { useLocation } from "@gatsbyjs/reach-router";
import HamburgerMenu from "../images/hamburger-menu.inline.svg";
import CloseMenu from "../images/close-menu.inline.svg";

interface HeaderProps {
  menuLinks: {
    name: string;
    link: string;
  }[];
}

const Header = ({ menuLinks }: HeaderProps) => {
  const [showLogo, setShowLogo] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      // Show logo when scrolled past hero section (roughly 600px)
      setShowLogo(window.scrollY > 600);
    };

    // Check if window is available (for SSR compatibility)
    if (typeof window !== "undefined" && isHomePage) {
      // Set initial state
      handleScroll();
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isHomePage]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={
        "bg-white safe-paddings transition-200 z-50 transition-colors sticky top-0" +
        (isMenuOpen ? " h-screen flex flex-col" : "")
      }
    >
      <div className="flex items-center justify-between p-4 w-full">
        <div
          className={`transition-opacity duration-300 ${
            isHomePage && !showLogo ? "opacity-0" : "opacity-100"
          }`}
        >
          <Link to="/">
            <img
              src={Logo}
              width={44}
              height="auto"
              loading="eager"
              alt="Cloud Native Denmark"
            />
          </Link>
        </div>
        <nav className="hidden md:flex mr-4">
          {menuLinks.map((link) => (
            <Link
              key={link.name}
              to={link.link}
              className="text-gray-800 hover:text-gray-600 text-base font-semibold pl-4"
            >
              {link.name}
            </Link>
          ))}
        </nav>
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {isMenuOpen ? <CloseMenu /> : <HamburgerMenu />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden flex-grow">
          <nav className="flex flex-col items-center justify-start h-full">
            {menuLinks.map((link) => (
              <Link
                key={link.name}
                to={link.link}
                className="text-gray-800 hover:text-gray-600 text-2xl font-semibold my-4"
                onClick={toggleMenu}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
