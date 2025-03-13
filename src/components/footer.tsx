import React from "react";
import Logo from "../images/logo.svg";
import { Link } from "gatsby";

const Footer = () => {
  return (
    <footer className="safe-paddings border-t border-t-gray-10 bg-white">
      <div className="flex items-center justify-between pt-5 pb-2 mx-auto max-w-2xl">
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
        <div>
          <a
            className="ml-2 font-semibold transition-colors duration-200"
            href="mailto:contact@cloudnativedenmark.dk"
          >
            contact@cloudnativedenmark.dk
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
