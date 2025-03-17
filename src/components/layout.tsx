import React from "react";
import Header from "./header";
import { useStaticQuery, graphql } from "gatsby";
import Footer from "./footer";

interface LayoutProps {
  children: React.ReactNode;
  headerClassName?: string;
}

const Layout = ({ children, headerClassName }: LayoutProps) => {
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
      <Header
        className={headerClassName}
        menuLinks={data.site.siteMetadata.menuLinks}
      />
      <main className="relative isolate grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
