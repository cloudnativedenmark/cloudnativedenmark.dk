import * as React from "react";
import { type HeadFC, type PageProps } from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";
import SavvaerketMap from "../images/savvaerket.svg";
import KlingenMap from "../images/klingen.svg";

const VenuePage: React.FC<PageProps> = () => {
  return (
    <Layout>
      <section className="pt-24 pb-12 bg-background-dark">
        <div className="mx-auto max-w-6xl text-white text-center px-6">
          <h1 className="text-6xl font-bold">Venue Plan</h1>
          <p className="text-2xl font-light mt-8 leading-normal">
            Find your way around the conference.
          </p>
        </div>
      </section>

      <section className="pt-8 bg-white">
        <div className="mx-auto max-w-6xl text-center">
          <div className="w-full">
            <img
              src={SavvaerketMap}
              alt="Savvaerket Map"
              className="w-full h-auto"
            />
          </div>
        </div>
        <div className="mx-auto max-w-6xl text-center">
          <div className="w-full">
            <img src={KlingenMap} alt="Klingen Map" className="w-full h-auto" />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default VenuePage;

export const Head: HeadFC = ({ location: { pathname } }) => (
  <SEO pathname={pathname} title="Venue Plan" />
);
