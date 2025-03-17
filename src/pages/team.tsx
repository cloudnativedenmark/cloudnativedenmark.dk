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

/*

name: "Camilla Larsen",
position: "",
image: "organizer-cammilla-larsen.jpg",
linkedin: "camilla-larsen-tux",
*/

const TeamPage: React.FC<PageProps<DataProps>> = ({
  data: { site },
}: PageProps<DataProps>) => {
  return (
    <Layout>
      <section className="pt-24 pb-20">
        <h1 className="text-6xl font-bold text-primary">Team</h1>
      </section>
      <section className="pb-40">
        <ul className="flex grid grid-cols-4 gap-8">
          {site.siteMetadata.team.map((member, index) => {
            const image = getImage(member.image);
            return (
              <li className="flex-col" key={index}>
                {image && (
                  <GatsbyImage
                    className="w-60"
                    image={image}
                    alt={member.name}
                  />
                )}
                <p className="mt-2 text-2xl font-bold text-primary">
                  {member.name}
                </p>
                <p className="mt-2 text-primary">{member.position}</p>
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
  <SEO pathname={pathname} />
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
