import React, { useState, useEffect } from "react";
import Logo from "../images/logo.svg";
import { Link } from "gatsby";
import { useLocation } from "@gatsbyjs/reach-router";

interface HeaderProps {
  menuLinks: {
    name: string;
    link: string;
  }[];
  className?: string;
}

const defaultClass = "";

const Header = ({ menuLinks, className }: HeaderProps) => {
  const headerClass = className || defaultClass;
  const [showLogo, setShowLogo] = useState(false);
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

  return (
    <header
      className={
        "safe-paddings transition-200 z-50 transition-colors sticky top-0 " +
        headerClass
      }
      style={{ backgroundColor: "white" }}
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
        <nav className="mr-4">
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
      </div>
    </header>
  );
};

export default Header;
