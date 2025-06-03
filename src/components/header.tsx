import React, { useState, useEffect } from "react";
import Logo from "../images/logo.svg";
import { Link } from "gatsby";

interface HeaderProps {
  menuLinks: any;
  className?: string;
}

const defaultClass = "";

const Header = ({ menuLinks, className }: HeaderProps) => {
  const headerClass = className || defaultClass;
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show logo when scrolled past hero section (roughly 600px)
      setShowLogo(window.scrollY > 600);
    };

    // Check if window is available (for SSR compatibility)
    if (typeof window !== 'undefined') {
      // Set initial state
      handleScroll();
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);
  return (
    <header
      className={
        "safe-paddings transition-200 z-50 transition-colors sticky top-0 " +
        headerClass
      }
      style={{ backgroundColor: 'white' }}
    >
      <div className="flex items-center justify-between pt-5 pb-2 w-full px-4">
        <div className={`transition-opacity duration-300 ${showLogo ? 'opacity-100' : 'opacity-0'}`}>
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
          <Link to="/team" className="text-gray-800 hover:text-gray-600 text-sm font-semibold">
            Team
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
