import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import Layout from "./components/layout"
import Home from "./pages/index"
import CodeOfConduct from "./pages/code-of-conduct"
import ConvinceYourBoss from "./pages/convince-your-boss"
import Mission from "./pages/mission"
import Privacy from "./pages/privacy"
import Schedule from "./pages/schedule"
import Speakers from "./pages/speakers"
import TalkArchive from "./pages/talk-archive"
import Team from "./pages/team"
import Venue from "./pages/venue"
import VenueMap from "./pages/venue-map"
import BecomeASponsor from "./pages/become-a-sponsor"
import SponsorInfo from "./pages/sponsor-info"
import NotFound from "./pages/404"
import { features } from "./config/features"

const HostPack = React.lazy(() => import("./pages/host-pack"))
const SchedulePrint = React.lazy(() => import("./pages/schedule-print"))

function App() {
  return (
    <Routes>
      <Route
        path="/schedule/track-overview"
        element={
          <React.Suspense
            fallback={<p role="status">Loading track overview…</p>}
          >
            <HostPack />
          </React.Suspense>
        }
      />
      {features.scheduleAndSpeakers && (
        <Route
          path="/schedule/print"
          element={
            <React.Suspense
              fallback={<p role="status">Loading schedule download…</p>}
            >
              <SchedulePrint />
            </React.Suspense>
          }
        />
      )}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="code-of-conduct" element={<CodeOfConduct />} />
        <Route path="convince-your-boss" element={<ConvinceYourBoss />} />
        <Route path="mission" element={<Mission />} />
        <Route path="privacy" element={<Privacy />} />
        {features.scheduleAndSpeakers && (
          <>
            <Route path="schedule" element={<Schedule />} />
            <Route path="schedule/talk/:talkId" element={<Schedule />} />
            <Route path="speakers" element={<Speakers />} />
            <Route path="speakers/:speakerId" element={<Speakers />} />
          </>
        )}
        <Route path="talk-archive" element={<TalkArchive />} />
        <Route path="team" element={<Team />} />
        <Route path="venue" element={<Venue />} />
        <Route path="conference-map" element={<VenueMap />} />
        {["venue-plan", "venue-map"].map((path) => (
          <Route
            key={path}
            path={path}
            element={<Navigate to="/conference-map" replace />}
          />
        ))}
        <Route path="become-a-sponsor" element={<BecomeASponsor />} />
        {/* Not in nav — link directly to confirmed/prospective sponsors */}
        <Route path="sponsor-info" element={<SponsorInfo />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
