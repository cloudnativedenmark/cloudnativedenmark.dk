import React from "react"
import { Routes, Route } from "react-router-dom"
import { AuthProvider, useAuth } from "./auth/auth-context"
import PassphraseGate from "./components/passphrase-gate"
import CompanionShell from "./components/companion-shell"
import CompanionSchedule from "./pages/companion-schedule"
import CompanionSessionDetail from "./pages/companion-session"
import CompanionShout from "./pages/companion-shout"
import CompanionSpeaker from "./pages/companion-speaker"
import CompanionAdmin from "./pages/companion-admin"
import RoleGuard from "./components/role-guard"

const CompanionRoutes: React.FC = () => {
  const { role } = useAuth()

  if (!role) {
    return <PassphraseGate />
  }

  return (
    <Routes>
      <Route element={<CompanionShell />}>
        <Route index element={<CompanionSchedule />} />
        <Route path="session/:sessionId" element={<CompanionSessionDetail />} />
        <Route path="shout" element={<CompanionShout />} />
        <Route
          path="speaker"
          element={
            <RoleGuard allow={["speaker", "admin"]}>
              <CompanionSpeaker />
            </RoleGuard>
          }
        />
        <Route
          path="admin"
          element={
            <RoleGuard allow={["admin"]}>
              <CompanionAdmin />
            </RoleGuard>
          }
        />
      </Route>
    </Routes>
  )
}

const CompanionApp: React.FC = () => {
  return (
    <AuthProvider>
      <CompanionRoutes />
    </AuthProvider>
  )
}

export default CompanionApp
