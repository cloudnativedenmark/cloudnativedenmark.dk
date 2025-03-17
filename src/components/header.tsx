import React from "react";
import Logo from "../images/logo.svg";
import { Link } from "gatsby";

interface HeaderProps {
  menuLinks: any;
  className?: string;
}

const defaultClass = "bg-background";

const Header = ({ menuLinks, className }: HeaderProps) => {
  const headerClass = className || defaultClass;
  return (
    <header
      className={
        "safe-paddings transition-200 z-10 transition-colors bg-background " +
        headerClass
      }
    >
      <div className="flex items-center justify-between pt-5 pb-2 mx-auto max-w-6xl">
        <div>
          <Link to="/">
            <img
              className="ml-2"
              src={Logo}
              width={44}
              height="auto"
              loading="eager"
              alt="Cloud Native Denmark"
            />
          </Link>
        </div>
        <nav>
          <ul className="flex">
            {menuLinks.map((link: any) => (
              <li key={link.name} className="p-1 list-none">
                <Link to={link.link} className="text-primary-1">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
