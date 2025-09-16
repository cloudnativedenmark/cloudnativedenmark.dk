import React from "react";
import Layout from "../components/layout";
import { HeadFC, PageProps } from "gatsby";
import SEO from "../components/seo";

const PrivacyPage: React.FC<PageProps> = () => {
  return (
    <Layout>
      <div className="text-primary text-base text-center font-sans pb-20 mx-auto max-w-6xl">
        <h1 className="mx-2 md:mx-32 text-4xl font-bold pt-24">Mission</h1>
        <p className="mx-2 md:mx-32 mt-16 text-2xl">
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
