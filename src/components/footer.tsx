import React from "react";
import Logo from "../images/logo.svg";
import LinkedIn from "../images/linkedin-logo.inline.svg";
import Youtube from "../images/youtube.inline.svg";
import { Link } from "gatsby";

const Footer = () => {
  return (
    <footer className="safe-paddings border-t border-gray-200 bg-white">
      <div className="flex items-center justify-between pt-5 pb-2 mx-auto max-w-6xl">
        <div>
          <img
            className="ml-2"
            src={Logo}
            width={44}
            height="auto"
            loading="eager"
            alt="Cloud Native Denmark"
          />
        </div>
        <nav className="flex">
          <ul className="grid grid-cols-2 gap-y-4">
            <li>
              <a
                className="text-primary text-sm font-semibold"
                target="_blank"
                href="https://events.linuxfoundation.org/about/code-of-conduct/"
              >
                Code of Conduct
              </a>
            </li>
            <li>
              <Link
                to="/mission"
                className="text-primary text-sm font-semibold"
              >
                Mission Statement
              </Link>
            </li>
            <li>
              <Link to="/team" className="text-primary text-sm font-semibold">
                Team
              </Link>
            </li>
            <li>
              <Link
                to="/privacy"
                className="text-primary text-sm font-semibold"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </nav>
        <div>
          <a
            className="font-semibold transition-colors duration-200 text-primary"
            href="mailto:contact@cloudnativedenmark.dk"
          >
            contact@cloudnativedenmark.dk
          </a>
          <ul className="flex mt-4 gap-x-2.5">
            <li className="h-9 w-9">
              <a
                className="items-center h-full w-full"
                href="https://www.linkedin.com/company/kubernetes-community-days-denmark"
              >
                <LinkedIn />
              </a>
            </li>
            <li className="h-9 w-9">
              <a
                className="items-center h-full w-full"
                href="https://www.youtube.com/@CloudNativeNordics"
              >
                <Youtube />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
