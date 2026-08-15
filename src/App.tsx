import React from "react"
import { Routes, Route } from "react-router-dom"
import Layout from "./components/layout"
import Home from "./pages/index"
import ConvinceYourBoss from "./pages/convince-your-boss"
import Mission from "./pages/mission"
import Privacy from "./pages/privacy"
import Schedule from "./pages/schedule"
import TalkArchive from "./pages/talk-archive"
import Team from "./pages/team"
import Venue from "./pages/venue"
import VenuePlan from "./pages/venue-plan"
import BecomeASponsor from "./pages/become-a-sponsor"
import SponsorInfo from "./pages/sponsor-info"
import NotFound from "./pages/404"
import CompanionApp from "./companion/companion-app"

function App() {
  return (
    <Routes>
      {/* No marketing header/footer — the companion app is its own
          full-screen shell with its own nav. */}
      <Route path="/companion/*" element={<CompanionApp />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="convince-your-boss" element={<ConvinceYourBoss />} />
        <Route path="mission" element={<Mission />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="talk-archive" element={<TalkArchive />} />
        <Route path="team" element={<Team />} />
        <Route path="venue" element={<Venue />} />
        <Route path="venue-plan" element={<VenuePlan />} />
        <Route path="become-a-sponsor" element={<BecomeASponsor />} />
        {/* Not in nav — link directly to confirmed/prospective sponsors */}
        <Route path="sponsor-info" element={<SponsorInfo />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
