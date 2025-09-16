import React from "react";
import Header from "./header";
import { useStaticQuery, graphql } from "gatsby";
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
    <div className="flex min-h-screen flex-col">
      <Header menuLinks={data.site.siteMetadata.menuLinks} />
      <main className="relative isolate grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
