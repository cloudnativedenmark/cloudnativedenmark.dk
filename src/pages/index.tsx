import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";
import Logo from "../images/logo.svg";

const IndexPage: React.FC<PageProps> = () => {
  return (
    <Layout>
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
            <div className="basis-xl pl-4 pt-20">
              <h1 className="text-5xl font-semibold tracking-tight text-balance text-primary sm:text-7xl">
                Cloud Native Denmark 2025
              </h1>
              <p className="mt-8 text-lg font-medium text-pretty text-primary sm:text-xl/8">
                KCD Denmark will return as <b>Cloud Native Denmark</b> in 2025.
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
    </Layout>
  );
};

export default IndexPage;

export const Head: HeadFC = ({ location: { pathname } }) => (
  <SEO pathname={pathname} />
);
