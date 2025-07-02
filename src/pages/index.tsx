import * as React from "react";
import { type HeadFC, type PageProps, graphql } from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";
import { useSessionizeSpeakers } from "../hooks/use-sessionize";
import Logo from "../images/logo.svg";
import { StaticImage } from "gatsby-plugin-image";

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
          <li
            key={index}
            className="flex items-center justify-center min-w-[384px] min-h-[122px] sm:min-w-[320px] sm:min-h-[115px] xs:min-w-fit xs:max-w-full"
          >
            <a
              href={sponsor.url}
              target="_blank"
              rel="noreferrer"
              className="flex h-full w-fit items-center justify-center"
            >
              {sponsor.logo && (
                <img
                  className="h-auto max-h-[130px] xs:max-w-full max-w-[330px] sm:min-w-[70%] scale-[0.8]"
                  src={sponsor.logo.publicURL}
                  width={sponsor.scale}
                  alt={sponsor.title}
                />
              )}
            </a>
          </li>
        ))}
      </ul>
    </li>
  </ul>
);

const IndexPage: React.FC<PageProps<DataProps>> = ({
  data: {
    allCommunityYaml,
    allGoldYaml,
    allBronzeYaml,
    allPlatinumYaml,
    allPartnerYaml,
  },
}) => {
  const { speakers } = useSessionizeSpeakers();
  const [isExpanded, setIsExpanded] = React.useState(false);

  const sortedSpeakers = React.useMemo(() => {
    return [...speakers].sort((a, b) => {
      if (a.isTopSpeaker && !b.isTopSpeaker) return -1;
      if (!a.isTopSpeaker && b.isTopSpeaker) return 1;
      return a.fullName.localeCompare(b.fullName);
    });
  }, [speakers]);

  const initialSpeakersToShow = 4;
  const speakersToShow = isExpanded
    ? sortedSpeakers
    : sortedSpeakers.slice(0, initialSpeakersToShow);

  return (
    <Layout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-white">
        <div className="relative z-10 mx-auto max-w-6xl px-6 pt-16 pb-16">
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
                <span className="font-medium tracking-wider">CLOUD NATIVE</span>
                <br />
                <span className="font-extrabold">DENMARK</span>
              </h1>
              <p className="text-xl lg:text-2xl font-medium text-gray-800 mb-8">
                October 7-8, 2025 • Aarhus
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  className="inline-flex items-center justify-center text-white font-semibold py-3 px-8 rounded-full text-lg transition-colors duration-200 bg-background hover:bg-hover"
                  href="https://cloudnativedenmark.ticketbutler.io/en/e/cloud-native-denmark/"
                  target="_blank"
                >
                  Get your tickets
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="opacity-100 min-w-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            viewBox="-80.724 316.355 927.667 175.986"
            preserveAspectRatio="xMidYMid slice"
            width="927.667px"
            height="175.986px"
          >
            <defs></defs>
            <g clipPath="url(#wave1)">
              <path
                fill="#d7dff4"
                d="M 348.113 567.704 L -1048.965 568.625 L -1048.965 464.805 C -583.18 717.992 -117.672 142.594 348.113 395.777 L 348.113 567.704 Z"
              />
            </g>
            <g clipPath="url(#wave2)">
              <path
                fill="#0026ce"
                d="M 548.566 568.003 L -637.617 568.186 L -637.617 477.156 C -242.145 692.121 153.094 203.582 548.566 418.551 L 548.566 568.003 Z"
              />
            </g>
            <g clipPath="url(#wave3)">
              <path
                fill="#11347e"
                d="M 1019.449219 568.15625 L -151.777344 568.15625 L -151.777344 430.761719 C 238.710938 642.867188 628.964844 160.832031 1019.449219 372.9375 Z"
              />
            </g>
          </svg>
        </div>
      </section>

      <section className="relative bg-background-dark">
        <div className="relative z-10 mx-auto max-w-4xl px-6 py-20">
          <p className="text-white text-2xl lg:text-3xl text-center font-medium leading-relaxed">
            Join us in Aarhus on October 7–8, as the Kubernetes and Cloud Native
            community comes together for a two-day technical conference packed
            with inspiring talks, hands-on insights, and great opportunities to
            connect and grow.
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
              <StaticImage
                src="../images/sav-vaerket-logo.png"
                alt="Savværket"
                className="w-32 h-32 mb-4"
              />
              <p className="text-xl font-semibold text-gray-800 mb-2">
                Savværket
              </p>
              <p className="text-lg text-gray-600">Søren Nymarks Vej 8A</p>
              <p className="text-lg text-gray-600">8270 Højbjerg</p>
            </div>
            <div className="w-full lg:w-1/2 h-64 bg-gray-200 rounded-lg overflow-hidden">
              <iframe
                className="border-0"
                src="https://maps.google.com/maps?q=Savværket,Søren+Nymarks+Vej+8A,8270+Højbjerg,Denmark&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Savværket Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* SPEAKERS */}
      {speakers.length > 0 && (
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-12">
              Speakers
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12 justify-items-center">
              {speakersToShow.map((speaker) => (
                <li
                  key={speaker.id}
                  className="flex flex-col items-center w-60"
                >
                  <img
                    className="w-48 h-48 rounded-full object-cover mx-auto shadow-lg"
                    src={speaker.profilePicture}
                    alt={speaker.fullName}
                  />
                  <p className="mt-4 text-xl font-bold text-gray-900">
                    {speaker.fullName}
                  </p>
                  <p className="mt-1 text-base text-gray-600 h-12">
                    {speaker.tagLine}
                  </p>
                </li>
              ))}
            </ul>
            {sortedSpeakers.length > initialSpeakersToShow && (
              <div className="mt-12">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="inline-flex items-center justify-center text-white font-semibold py-3 px-8 rounded-full text-lg transition-colors duration-200 bg-background hover:bg-hover"
                >
                  {isExpanded ? "Show Less" : "Show More Speakers"}
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* LAST YEAR'S EVENT */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-4xl lg:text-5xl font-bold text-center text-white mb-8">
            Recap last years event
          </h2>
          <div className="mx-auto max-w-4xl text-center mb-12">
            <p className="text-lg lg:text-xl text-white leading-relaxed">
              In 2024, we hosted&nbsp;
              <a
                href="https://2024.kcddenmark.dk/"
                target="_blank"
                style={{ textDecoration: "underline dotted" }}
              >Kubernetes Community Days Denmark</a>&nbsp;
              at the Bella Center in Copenhagen, bringing together over 500
              attendees for two packed days of technical talks, community
              connection, and cloud native inspiration.
            </p>
            <p className="text-lg lg:text-xl text-white leading-relaxed mt-6">
              While we're not running under the official KCD banner this year
              due to a few logistical reasons, it's still the same event,
              organized by the same passionate community — just with a new name
              and a new city. This October in Aarhus, we're aiming even higher.
              Join us as we take things to the next level.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              <div
                className="relative w-full"
                style={{ paddingBottom: "56.25%" }}
              >
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg border-0"
                  src="https://www.youtube.com/embed/eqqHVjg7FaU"
                  title="KCD Denmark 2024 Highlights"
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
      <section className="py-16 bg-background-light">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-4xl lg:text-5xl font-bold text-center text-gray-900 mb-12">
            Mission
          </h2>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <p className="text-lg lg:text-xl text-gray-800 leading-relaxed mb-6">
                Cloud Native Denmark shares knowledge about Cloud Native
                Technologies and creates community networks in Denmark within
                this area. This may happen through events and profit from these
                will be donated to charity.
              </p>
              <p className="text-lg lg:text-xl text-gray-800 leading-relaxed">
                This year we are collaborating with Coding Pirates and all
                profits go to them.
              </p>
            </div>
            <div className="flex-shrink-0">
              <StaticImage
                src="../images/coding-pirates-logo.png"
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
          <h2
            className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8"
            id="sponsors"
          >
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

        <SponsorSection
          sponsors={allPlatinumYaml.nodes}
          title="Platinum Sponsors"
        />
        <SponsorSection sponsors={allGoldYaml.nodes} title="Gold Sponsors" />
        <SponsorSection
          sponsors={allBronzeYaml.nodes}
          title="Bronze Sponsors"
        />
        <SponsorSection
          sponsors={allCommunityYaml.nodes}
          title="Community Sponsors"
        />
        <SponsorSection
          sponsors={allPartnerYaml.nodes}
          title="Partners & Media"
        />
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
