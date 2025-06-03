import * as React from "react";
import { type HeadFC, type PageProps, graphql } from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";
import Logo from "../images/logo.svg";
import HeroImage from "../images/kcddenmark24.jpg";
import { StaticImage } from "gatsby-plugin-image";
import SavVaerketLogo from "../images/sav-vaerket-logo.png";
import CodingPiratesLogo from "../images/coding-pirates-logo.png";

interface Sponsor {
  title: string;
  url: string;
  scale: string;
  logo: {
    publicURL: string;
  };
}

type DataProps = {
  allCommunityYaml: {
    nodes: Sponsor[];
  };
  allGoldYaml: {
    nodes: Sponsor[];
  };
  allBronzeYaml: {
    nodes: Sponsor[];
  };
  allPlatinumYaml: {
    nodes: Sponsor[];
  };
  allPartnerYaml: {
    nodes: Sponsor[];
  };
};

const SponsorSection: React.FC<{ sponsors: Sponsor[]; title: string }> = ({
  sponsors,
  title,
}) => (
  <ul className="mt-16">
    <li>
      <p className="text-center text-2xl font-semibold uppercase leading-normal text-primary-1">
        {title}
      </p>
      <ul className="mt-10 mb-[70px] flex flex-wrap justify-center gap-x-8 xl:gap-y-6">
        {sponsors.map((sponsor, index) => (
          <li key={index} className="flex items-center justify-center min-w-[384px] min-h-[122px] sm:min-w-[320px] sm:min-h-[115px] xs:min-w-fit xs:max-w-full">
            <a href={sponsor.url} target="_blank" rel="noreferrer" className="flex h-full w-fit items-center justify-center">
              {sponsor.logo && <img className="h-auto max-h-[130px] xs:max-w-full max-w-[330px] sm:min-w-[70%] scale-[0.8]" src={sponsor.logo.publicURL} width={sponsor.scale} alt={sponsor.title} />}
            </a>
          </li>
        ))}
      </ul>
    </li>
  </ul>
);

const IndexPage: React.FC<PageProps<DataProps>> = ({
  data: { allCommunityYaml, allGoldYaml, allBronzeYaml, allPlatinumYaml, allPartnerYaml },
}) => {
  return (
    <Layout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-white">
        {/* SVG Wave Background */}
        <div className="absolute bottom-20 left-0 w-full h-96 opacity-100">
          <svg className="w-full h-full" viewBox="0 0 810 568" preserveAspectRatio="xMidYMid slice">
            <defs>
              <clipPath id="wave1"><path d="M 0 329.789062 L 349 329.789062 L 349 629 L 0 629 Z M 0 329.789062" /></clipPath>
              <clipPath id="wave2"><path d="M 0 362.523438 L 549 362.523438 L 549 616.773438 L 0 616.773438 Z M 0 362.523438" /></clipPath>
              <clipPath id="wave3"><path d="M 0 317.65625 L 810 317.65625 L 810 568.15625 L 0 568.15625 Z M 0 317.65625" /></clipPath>
            </defs>
            <g clipPath="url(#wave1)">
              <path fill="#d7dff4" d="M 348.113281 628.808594 L -1048.964844 628.808594 L -1048.964844 464.804688 C -583.179688 717.992188 -117.671875 142.59375 348.113281 395.777344 Z" />
            </g>
            <g clipPath="url(#wave2)">
              <path fill="#0026ce" d="M 548.566406 616.402344 L -637.617188 616.402344 L -637.617188 477.15625 C -242.144531 692.121094 153.09375 203.582031 548.566406 418.550781 Z" />
            </g>
            <g clipPath="url(#wave3)">
              <path fill="#11347e" d="M 1019.449219 568.15625 L -151.777344 568.15625 L -151.777344 430.761719 C 238.710938 642.867188 628.964844 160.832031 1019.449219 372.9375 Z" />
            </g>
          </svg>
        </div>
        
        <div className="relative z-10 mx-auto max-w-6xl px-6 pt-16 pb-72">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 lg:order-1">
              <img
                src={Logo}
                width={300}
                height="auto"
                loading="eager"
                alt="Cloud Native Denmark"
                className="mx-auto lg:mx-0"
              />
            </div>
            <div className="flex-1 lg:order-2 text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl tracking-tight text-gray-900 mb-4">
                <span className="font-medium tracking-wider">CLOUD NATIVE</span><br />
                <span className="font-extrabold">DENMARK</span>
              </h1>
              <p className="text-xl lg:text-2xl font-medium text-gray-800 mb-8">
                October 7-8, 2025 • Aarhus
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  className="inline-flex items-center justify-center text-white font-semibold py-3 px-8 rounded-full text-lg transition-colors duration-200"
                  style={{ backgroundColor: '#0026ce' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#001ba0'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0026ce'}
                  href="https://cloudnativedenmark.ticketbutler.io/en/e/cloud-native-denmark/"
                  target="_blank"
                >
                  Get your tickets
                </a>
                <a
                  className="inline-flex items-center justify-center text-white font-semibold py-3 px-8 rounded-full text-lg transition-colors duration-200"
                  style={{ backgroundColor: '#0026ce' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#001ba0'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0026ce'}
                  href="https://sessionize.com/cloud-native-denmark-2025/"
                  target="_blank"
                >
                  Submit a talk
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="relative" style={{ backgroundColor: '#11347e', marginTop: '-80px' }}>
        <div className="relative z-10 mx-auto max-w-4xl px-6 py-20">
          <p className="text-white text-2xl lg:text-3xl text-center font-medium leading-relaxed">
            Join us in Aarhus on October 7–8, as the Kubernetes and Cloud Native community comes together for a two-day technical conference packed with inspiring talks, hands-on insights, and great opportunities to connect and grow.
          </p>
        </div>
      </section>

      {/* VENUE */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-12">
            Venue
          </h2>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
            <div className="flex flex-col items-center">
              <img
                src={SavVaerketLogo}
                alt="SAV VÆRKET"
                className="w-32 h-32 mb-4"
              />
              <p className="text-xl font-semibold text-gray-800 mb-2">Savværket</p>
              <p className="text-lg text-gray-600">Søren Nymarks Vej 8A</p>
              <p className="text-lg text-gray-600">8270 Højbjerg</p>
            </div>
            <div className="w-full lg:w-1/2 h-64 bg-gray-200 rounded-lg overflow-hidden">
              <iframe
                src="https://maps.google.com/maps?q=Savværket,Søren+Nymarks+Vej+8A,8270+Højbjerg,Denmark&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Savværket Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* LAST YEAR'S EVENT */}
      <section className="py-16" style={{ backgroundColor: '#0026ce' }}>
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-4xl lg:text-5xl font-bold text-center text-white mb-8">
            Recap last years event
          </h2>
          <div className="mx-auto max-w-4xl text-center mb-12">
            <p className="text-lg lg:text-xl text-white leading-relaxed">
              In 2024, we hosted Kubernetes Community Days Denmark at the Bella Center in Copenhagen, bringing together over 500 attendees for two packed days of technical talks, community connection, and cloud native inspiration.
            </p>
            <p className="text-lg lg:text-xl text-white leading-relaxed mt-6">
              While we're not running under the official KCD banner this year due to a few logistical reasons, it's still the same event, organized by the same passionate community — just with a new name and a new city. This October in Aarhus, we're aiming even higher. Join us as we take things to the next level.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                  src="https://www.youtube.com/embed/eqqHVjg7FaU"
                  title="KCD Denmark 2024 Highlights"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* LAST YEAR'S EVENT */}

      {/* MISSION */}
      <section className="py-16" style={{ backgroundColor: '#d7dff4' }}>
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-4xl lg:text-5xl font-bold text-center text-gray-900 mb-12">
            Mission
          </h2>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <p className="text-lg lg:text-xl text-gray-800 leading-relaxed mb-6">
                Cloud Native Denmark shares knowledge about Cloud Native Technologies and creates community networks in Denmark within this area. This may happen through events and profit from these will be donated to charity.
              </p>
              <p className="text-lg lg:text-xl text-gray-800 leading-relaxed">
                This year we are collaborating with Coding Pirates and all profits go to them.
              </p>
            </div>
            <div className="flex-shrink-0">
              <img
                src={CodingPiratesLogo}
                alt="Coding Pirates"
                className="w-48 h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SPONSORS */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-6xl text-center px-6">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8" id="sponsors">
            Sponsors
          </h2>
          <p className="text-lg text-gray-700 mx-auto mb-12 max-w-[600px] leading-relaxed">
            If you’re interested in becoming a sponsor, please contact&nbsp;
            <a
              className="font-semibold text-blue-600 hover:text-blue-800"
              href="mailto:contact@cloudnativedenmark.dk"
            >
              sponsor@cloudnativedenmark.dk
            </a>
            &nbsp;or view our&nbsp;
            <a
              className="font-semibold text-blue-600 hover:text-blue-800"
              href="https://cloudnativedenmark2025.my.canva.site/"
              target="_blank"
            >
              prospectus
            </a>
          </p>
        </div>

        <SponsorSection sponsors={allPlatinumYaml.nodes} title="Platinum Sponsors" />
        <SponsorSection sponsors={allGoldYaml.nodes} title="Gold Sponsors" />
        <SponsorSection sponsors={allBronzeYaml.nodes} title="Bronze Sponsors" />
        <SponsorSection sponsors={allCommunityYaml.nodes} title="Community Sponsors" />
        <SponsorSection sponsors={allPartnerYaml.nodes} title="Partners & Media" />
      </section>
      {/* SPONSORS */}
    </Layout>
  );
};

export default IndexPage;

export const Head: HeadFC = ({ location: { pathname } }) => (
  <SEO pathname={pathname} />
);

export const query = graphql`
  query Sponsors {
    allCommunityYaml {
      nodes {
        id
        title
        url
        logo {
          publicURL
        }
        scale
      }
    }

    allGoldYaml {
      nodes {
        id
        title
        url
        logo {
          publicURL
        }
        scale
      }
    }

    allBronzeYaml {
      nodes {
        id
        title
        url
        logo {
          publicURL
        }
        scale
      }
    }

    allPlatinumYaml {
      nodes {
        id
        title
        url
        logo {
          publicURL
        }
        scale
      }
    }
      
    allPartnerYaml {
      nodes {
        id
        title
        url
        logo {
          publicURL
        }
        scale
      }
    }


}
`;
