import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import Logo from "../images/logo.svg";
import Layout from "../components/layout";
import Hero from "../components/hero";

const IndexPage: React.FC<PageProps> = () => {
  return (
    <Layout>
      <Hero />
    </Layout>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Cloud Native Denmark</title>;
