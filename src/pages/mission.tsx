import React from "react";
import Layout from "../components/layout";
import { HeadFC, PageProps } from "gatsby";
import SEO from "../components/seo";

const PrivacyPage: React.FC<PageProps> = () => {
  return (
    <Layout>
      <div className="text-primary text-base font-sans mx-28 pb-12">
        <h1 className="text-4xl font-bold pt-24">Mission</h1>
        <p className="mt-16">
          Cloud Native Denmark shares knowledge about Cloud Native Techonologies
          and creates community networks in Denmark within this area. This may
          happen through events and profit from these will be donated to
          charity.
        </p>
      </div>
    </Layout>
  );
};

export default PrivacyPage;

export const Head: HeadFC = ({ location: { pathname } }) => (
  <SEO title="Cloud Native Denmark - Mission" pathname={pathname} />
);
