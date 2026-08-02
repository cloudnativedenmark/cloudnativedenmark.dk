import React from "react"
import { NavLink, Outlet } from "react-router-dom"
import { useAuth } from "../auth/auth-context"

interface Tab {
  label: string
  to: string
  end?: boolean
}

const roleLabels: Record<string, string> = {
  attendee: "Attendee",
  speaker: "Speaker",
  admin: "Admin",
}

const CompanionShell: React.FC = () => {
  const { role, logout } = useAuth()

  const tabs: Tab[] = [
    { label: "Schedule", to: "/companion", end: true },
    ...(role === "speaker"
      ? [{ label: "My Sessions", to: "/companion/speaker" }]
      : []),
    ...(role === "admin"
      ? [{ label: "Moderate", to: "/companion/admin" }]
      : []),
    { label: "Shout", to: "/companion/shout" },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-cnd-bone text-cnd-midnight">
      <header
        className="flex items-center justify-between border-b border-cnd-fog/40 bg-cnd-midnight px-4 py-3 text-white"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 12px)" }}
      >
        <div>
          <div
            className="eyebrow"
            style={{ color: "var(--color-cnd-coral)", letterSpacing: "0.18em" }}
          >
            CND/2026
          </div>
          <div className="text-sm font-semibold">
            {role ? roleLabels[role] : ""} companion
          </div>
        </div>
        <button
          onClick={logout}
          className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/80 hover:text-white"
        >
          Log out
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      <nav
        className="fixed bottom-0 left-0 right-0 flex border-t border-cnd-fog/50 bg-white"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-semibold ${
                isActive ? "text-cnd-red" : "text-cnd-ash"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isActive ? "bg-cnd-red" : "bg-transparent"
                  }`}
                  aria-hidden="true"
                />
                {tab.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default CompanionShell
