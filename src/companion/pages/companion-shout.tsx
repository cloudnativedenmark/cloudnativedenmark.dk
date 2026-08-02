import React, { useState } from "react"
import { useAuth } from "../auth/auth-context"
import { useShout } from "../data/use-shout"
import { usePushSubscription } from "../data/use-push"
import { formatDateTimeDetailed } from "../../utils/time-formatting"

const CompanionShout: React.FC = () => {
  const { role } = useAuth()
  const { messages, send, connected } = useShout()
  const { supported, permission, subscribed, subscribe } = usePushSubscription()
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [sending, setSending] = useState(false)

  const sorted = [...messages].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) return
    setSending(true)
    await send(title.trim(), body.trim())
    setTitle("")
    setBody("")
    setSending(false)
  }

  return (
    <div className="px-4 py-4">
      <h1 className="mb-1 text-lg font-bold text-cnd-midnight">
        Organizer shout
      </h1>
      <p className="mb-4 text-sm text-cnd-ash">
        Announcements from the organizing team during the conference.
      </p>

      {supported && !subscribed && permission !== "denied" && (
        <button
          onClick={subscribe}
          className="mb-4 w-full rounded-xl border-2 border-dashed border-cnd-electric px-4 py-3 text-center text-sm font-semibold text-cnd-electric"
        >
          Enable push notifications for shouts
        </button>
      )}
      {permission === "denied" && (
        <p className="mb-4 text-xs text-cnd-ash">
          Notifications are blocked for this site in your browser settings —
          you'll still see shouts here in the app.
        </p>
      )}

      {role === "admin" && (
        <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
          <h2 className="mb-2 text-sm font-bold text-cnd-midnight">
            Send a shout
          </h2>
          {!connected && (
            <p className="mb-2 text-xs text-cnd-ash">
              Backend not connected in this preview — sends will be visible on
              this device only until companion-api is deployed.
            </p>
          )}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="mb-2 w-full rounded-lg border border-cnd-fog/60 px-3 py-2 text-sm outline-none focus:border-cnd-electric"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Message"
            rows={3}
            className="w-full rounded-lg border border-cnd-fog/60 p-3 text-sm outline-none focus:border-cnd-electric"
          />
          <button
            onClick={handleSend}
            disabled={sending || !title.trim() || !body.trim()}
            className="mt-2 rounded-lg bg-cnd-red px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
          >
            {sending ? "Sending…" : "Send to all attendees"}
          </button>
        </div>
      )}

      {sorted.length === 0 && (
        <p className="py-12 text-center text-sm text-cnd-ash">
          No announcements yet.
        </p>
      )}

      <div className="space-y-3">
        {sorted.map((message) => (
          <div key={message.id} className="rounded-xl bg-white p-4 shadow-sm">
            <div className="text-xs font-semibold text-cnd-ash">
              {formatDateTimeDetailed(message.createdAt)}
            </div>
            <div className="mt-1 text-sm font-bold text-cnd-midnight">
              {message.title}
            </div>
            <p className="mt-1 text-sm text-cnd-slate">{message.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CompanionShout
