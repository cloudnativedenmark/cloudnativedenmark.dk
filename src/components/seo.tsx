import React from "react";
import { useStaticQuery, graphql } from "gatsby";

interface SEOProps {
  title?: string;
  description?: string;
  pathname?: string;
}

const defaultTitle = "Cloud Native Denmark";
const defaultDescription =
  "Experience the power of community at the Cloud Native Denmark!";

const SEO = ({ title, description, pathname }: SEOProps) => {
  const {
    site: {
      siteMetadata: { siteTitle, siteDescription, siteUrl },
    },
  } = useStaticQuery(graphql`
    query SEO {
      site {
        siteMetadata {
          title
          description
          siteUrl
        }
      }
    }
  `);

  const currentTitle = title || defaultTitle || siteTitle;
  const currentDescription =
    description || defaultDescription || siteDescription;
  const currentUrl = pathname !== "/" ? `${siteUrl}${pathname}` : siteUrl;

  return (
    <>
      <title key={currentTitle}>{currentTitle}</title>
      {/* General */}
      <meta name="description" content={currentDescription} />
      {/* Open Graph */}
      <meta property="og:title" content={currentTitle} />
      <meta property="og:description" content={currentDescription} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content="website" />
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
    </>
  );
};

export default SEO;
