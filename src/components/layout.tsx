import React from "react"
import { Outlet } from "react-router-dom"
import Header from "./header"
import Footer from "./footer"

const menuLinks = [
  // {
  //   name: "Talk Archive",
  //   link: "/talk-archive",
  // },
  // {
  //   name: "Venue Plan",
  //   link: "/venue-plan",
  // },
  // {
  //   name: "Convince Your Boss",
  //   link: "/convince-your-boss",
  // },
  {
    name: "Team",
    link: "/team",
  },
]

const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header menuLinks={menuLinks} />
      <main className="relative isolate grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
