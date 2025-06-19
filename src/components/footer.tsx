import React from "react";
import LinkedIn from "../images/linkedin-logo.inline.svg";
import Youtube from "../images/youtube.inline.svg";
import Flickr from "../images/flickr.inline.svg";
import { Link } from "gatsby";

const Footer = () => {
  return (
    <footer className="safe-paddings mt-auto bg-background-dark">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col md:flex-row gap-y-12 justify-between">
          <nav>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-4">
              <li>
                <a
                  className="text-white hover:text-gray-200 text-sm font-semibold"
                  target="_blank"
                  href="https://events.linuxfoundation.org/about/code-of-conduct/"
                >
                  Code of Conduct
                </a>
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
            <a
              className="text-sm font-semibold transition-colors duration-200 text-white hover:text-gray-200"
              href="mailto:contact@cloudnativedenmark.dk"
            >
              contact@cloudnativedenmark.dk
            </a>
            <ul className="flex mt-4 gap-x-2.5">
              <li className="h-9 w-9">
                <a
                  className="items-center h-full w-full"
                  href="https://www.linkedin.com/company/cloud-native-denmark"
                  target="_blank"
                >
                  <LinkedIn />
                </a>
              </li>
              <li className="h-9 w-9">
                <a
                  className="items-center h-full w-full"
                  href="https://www.youtube.com/@CloudNativeNordics/videos"
                  target="_blank"
                >
                  <Youtube />
                </a>
              </li>
              <li className="h-9 w-9 pt-1">
                <a
                  className="items-center h-full w-full"
                  href="https://www.flickr.com/photos/199545304@N04/"
                  target="_blank"
                >
                  <Flickr />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
