import * as React from "react";
import { useStaticQuery, type HeadFC, type PageProps, graphql } from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";
import { GatsbyImage, getImage } from "gatsby-plugin-image";

interface TeamMember {
  name: string;
  position: string;
  image: any;
  linkedin: string;
}

type DataProps = {
  site: {
    siteMetadata: {
      team: TeamMember[];
    };
  };
};

const TeamPage: React.FC<PageProps<DataProps>> = ({
  data: { site },
}: PageProps<DataProps>) => {
  return (
    <Layout>
      <section className="pt-24 pb-20 bg-background-dark">
        <div className="mx-auto max-w-6xl text-white text-center px-6">
          <h1 className="text-6xl font-bold">Team</h1>
          <p className="text-2xl font-light mt-8 leading-normal">
            Cloud Native Denmark is organized by a dedicated committee who are
            passionate about bringing people together and fostering a sense of
            community. Our goal is to provide a platform for like-minded
            individuals from all levels and backgrounds that is dedicated to
            learning, growth, and diversity.
          </p>
        </div>
      </section>
      <section className="pb-40 max-w-6xl mx-auto">
        <ul className="text-primary grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20 justify-items-center">
          {site.siteMetadata.team.map((member, index) => {
            const image = getImage(member.image);
            return (
              <li className="flex-col w-60 md:w-full" key={index}>
                {image && (
                  <GatsbyImage
                    className="w-60"
                    image={image}
                    alt={member.name}
                  />
                )}
                <p className="mt-2 text-2xl font-bold">{member.name}</p>
                <p className="mt-2">{member.position}</p>
                <p className="mt-2 font-semibold">
                  <a
                    className="text-blue-500"
                    href={`https://linkedin.com/in/${member.linkedin}`}
                    target="_blank"
                  >
                    LinkedIn
                  </a>
                </p>
              </li>
            );
          })}
        </ul>
      </section>
    </Layout>
  );
};

export default TeamPage;

export const Head: HeadFC = ({ location: { pathname } }) => (
  <SEO title="Cloud Native Denmark - Team" pathname={pathname} />
);

export const query = graphql`
  query Team {
    site {
      siteMetadata {
        team {
          name
          position
          image {
            childImageSharp {
              gatsbyImageData
            }
          }
          linkedin
        }
      }
    }
  }
`;
