import * as React from "react";
import { type HeadFC, type PageProps, graphql } from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";
import Logo from "../images/logo.svg";
import { GatsbyImage, getImage } from "gatsby-plugin-image";

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
};

const IndexPage: React.FC<PageProps<DataProps>> = ({
  data: { allCommunityYaml },
}) => {
  return (
    <Layout>
      {/* HERO */}
      <section className="bg-background">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-row px-6 pt-14 py-24">
            <div className="hidden sm:block basis-sm p-5">
              <img
                src={Logo}
                width={400}
                height="auto"
                loading="eager"
                alt="Cloud Native Denmark"
              />
            </div>
            div className="basis-xl pl-4 pt-20">
              <h1 className="text-5xl font-semibold tracking-tight text-balance text-primary sm:text-7xl">
                Cloud Native Denmark 2025
              </h1>
              <p className="mt-8 text-lg font-medium text-pretty text-primary sm:text-xl/8">
                KCD Denmark will return as <b>Cloud Native Denmark</b> in 2025.
              </p>
              <p className="mt-10 flex flex-wrap gap-x-5 gap-y-8">
                <div>
                  <a
                    className="bg-blue-900 text-white h-14 rounded-3xl px-10 py-2 text-xl font-bold leading-none shadow-[0_15px_40px_#999999] hover:bg-blue-700 hover:shadow-[0px_15px_30px_#adadad]"
                    href="https://cloudnativedenmark.ticketbutler.io/en/e/cloud-native-denmark/"
                    target="_blank"
                  >
                    Get your ticket
                  </a>
                </div>
                <div>
                  <a
                    className="bg-blue-900 text-white h-14 rounded-3xl px-10 py-2 text-xl font-bold leading-none shadow-[0_15px_40px_#999999] hover:bg-blue-700 hover:shadow-[0px_15px_30px_#adadad]"
                    href="https://sessionize.com/cloud-native-denmark-2025/"
                    target="_blank"
                  >
                    Submit a talk
                  </a>
                </div>
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-4xl text-primary text-4xl text-center font-semibold py-10">
        <p>
          On 7th and 8th of October, the Kubernetes and Cloud Native Community
          will gather in Aarhus for a two-day technical conference loaded with
          exciting talks and plenty of opportunities for growing and networking.
        </p>
      </section>
      {/* HERO */}

      {/* SPONSORS */}
      <section className="safe-paddings relative bg-white sm:pb-16">
        <div className="mx-auto max-w-6xl text-center text-primary">
          <h2 className="text-6xl font-bold leading-denser" id="sponsors">
            Sponsors
          </h2>
          <p className="text-lg font-medium text-pretty text-primary sm:text-xl/8 mx-auto mt-5 max-w-[800px] leading-normal">
            If you’re interested in becoming a sponsor, please contact&nbsp;
            <a
              className="font-semibold text-blue-900"
              href="mailto:contact@cloudnativedenmark.dk"
            >
              sponsor@cloudnativedenmark.dk
            </a>
            &nbsp;or view our&nbsp;
            <a
              className="font-semibold text-blue-900"
              href="https://cloudnativedenmark2025.my.canva.site/"
              target="_blank"
            >
              prospectus
            </a>
          </p>
        </div>
        <ul className="mt-16">
          <li>
            <p className="text-center text-2xl font-semibold uppercase leading-normal text-primary-1">
              Community Sponsors
            </p>
            <ul className="mt-10 mb-[70px] flex flex-wrap justify-center gap-x-8 xl:gap-y-6">
              {allCommunityYaml.nodes.map((sponsor, index) => {
                return (
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
                          className="h-auto max-h-[130px] xs:max-w-full max-w-[330px] sm:min-w-[70%] scale-[0.7]"
                          src={sponsor.logo.publicURL}
                          width={sponsor.scale}
                          alt={sponsor.title}
                        />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
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
  }
`;
