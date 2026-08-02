import React, { useState } from "react"
import { useAuth } from "../auth/auth-context"
import CNDShape from "../../components/ui/cnd-shape"

const PassphraseGate: React.FC = () => {
  const { unlock, status, error } = useAuth()
  const [passphrase, setPassphrase] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await unlock(passphrase)
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-cnd-midnight px-6 text-white hex-bg">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 -right-10 opacity-20"
      >
        <CNDShape size={180} fill="var(--color-cnd-coral)" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -left-16 opacity-15"
      >
        <CNDShape size={220} fill="var(--color-cnd-electric)" />
      </div>

      <div className="relative w-full max-w-sm">
        <div
          className="eyebrow mb-2 text-center"
          style={{ color: "var(--color-cnd-coral)", letterSpacing: "0.22em" }}
        >
          CND/2026 COMPANION
        </div>
        <h1
          className="display mb-8 text-center text-white"
          style={{ fontSize: 32, letterSpacing: "-0.025em" }}
        >
          Enter your
          <br />
          passphrase.
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            inputMode="text"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            placeholder="Passphrase"
            aria-label="Passphrase"
            className="w-full rounded-xl border-2 border-white/20 bg-white/5 px-4 py-3.5 text-center text-lg text-white placeholder-white/40 outline-none focus:border-cnd-electric"
          />

          {error && (
            <p className="text-center text-sm text-cnd-coral" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "checking" || !passphrase}
            className="w-full rounded-xl bg-cnd-red py-3.5 text-center font-semibold text-white transition-opacity disabled:opacity-40"
          >
            {status === "checking" ? "Checking…" : "Unlock"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-cnd-fog">
          Attendee passphrase was on your badge/ticket email. Speakers and
          organizers — check your own instructions.
        </p>
      </div>
    </div>
  )
}

export default PassphraseGate
