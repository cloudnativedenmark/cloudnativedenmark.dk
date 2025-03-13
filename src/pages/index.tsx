import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import Logo from "../images/logo.svg";
import Layout from "../components/layout";

const IndexPage: React.FC<PageProps> = () => {
  return (
    <Layout>
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 flex flex-row">
          <div className="basis-sm p-5">
            <img
              src={Logo}
              width={400}
              height="auto"
              loading="eager"
              alt="Cloud Native Denmark"
            />
          </div>
          <div className="basis-xl pt-5">
            <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
              Cloud Native Denmark 2025
            </h1>
            <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
              Stay tuned KCD Denmark will return as Cloud Native Denmark in
              2025.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Cloud Native Denmark</title>;
