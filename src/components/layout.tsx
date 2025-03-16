import React from "react";
import Header from "./header";
import { useStaticQuery, StaticQuery, graphql } from "gatsby";
import Footer from "./footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
          menuLinks {
            name
            link
          }
        }
      }
    }
  `);

  return (
    <React.Fragment>
      <div className="flex min-h-screen flex-col">
        <Header menuLinks={data.site.siteMetadata.menuLinks} />
        <main>{children}</main>
        <Footer />
      </div>
    </React.Fragment>
  );
};

export default Layout;
