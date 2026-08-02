import webPush from "web-push"

export interface Env {
  DB: D1Database
  ADMIN_API_KEY?: string
  VAPID_PUBLIC_KEY?: string
  VAPID_PRIVATE_KEY?: string
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Admin-Key",
}

function json(data: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
      ...init.headers,
    },
  })
}

function isAdmin(request: Request, env: Env): boolean {
  if (!env.ADMIN_API_KEY) return false
  return request.headers.get("X-Admin-Key") === env.ADMIN_API_KEY
}

interface FeedbackRow {
  sessionId: string
  attendeeId: string
  rating: number
  comment: string
  hidden: number
  updatedAt: string
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders })
    }

    const { pathname } = new URL(request.url)

    try {
      if (pathname === "/feedback" && request.method === "GET") {
        const { results } = await env.DB.prepare(
          `SELECT session_id as sessionId, attendee_id as attendeeId, rating,
                  comment, hidden, updated_at as updatedAt FROM feedback`
        ).all<FeedbackRow>()
        return json(results.map((r) => ({ ...r, hidden: Boolean(r.hidden) })))
      }

      if (pathname === "/feedback" && request.method === "POST") {
        const body = await request.json<{
          sessionId?: string
          attendeeId?: string
          rating?: number
          comment?: string
        }>()
        if (!body.sessionId || !body.attendeeId || !body.rating) {
          return json(
            { error: "sessionId, attendeeId, rating required" },
            { status: 400 }
          )
        }
        await env.DB.prepare(
          `INSERT INTO feedback (session_id, attendee_id, rating, comment, hidden, updated_at)
           VALUES (?, ?, ?, ?, 0, ?)
           ON CONFLICT(session_id, attendee_id) DO UPDATE SET
             rating = excluded.rating,
             comment = excluded.comment,
             updated_at = excluded.updated_at`
        )
          .bind(
            body.sessionId,
            body.attendeeId,
            body.rating,
            body.comment ?? "",
            new Date().toISOString()
          )
          .run()
        return json({ ok: true })
      }

      const hideMatch = pathname.match(/^\/feedback\/([^/]+)\/([^/]+)$/)
      if (hideMatch && request.method === "PATCH") {
        if (!isAdmin(request, env)) {
          return json({ error: "unauthorized" }, { status: 401 })
        }
        const [, sessionId, attendeeId] = hideMatch
        const body = await request.json<{ hidden?: boolean }>()
        await env.DB.prepare(
          "UPDATE feedback SET hidden = ? WHERE session_id = ? AND attendee_id = ?"
        )
          .bind(
            body.hidden ? 1 : 0,
            decodeURIComponent(sessionId),
            decodeURIComponent(attendeeId)
          )
          .run()
        return json({ ok: true })
      }

      if (pathname === "/shout" && request.method === "GET") {
        const { results } = await env.DB.prepare(
          `SELECT id, title, body, created_at as createdAt FROM shout_messages
           ORDER BY created_at DESC LIMIT 100`
        ).all()
        return json(results)
      }

      if (pathname === "/shout" && request.method === "POST") {
        if (!isAdmin(request, env)) {
          return json({ error: "unauthorized" }, { status: 401 })
        }
        const message = await request.json<{
          id?: string
          title?: string
          body?: string
          createdAt?: string
        }>()
        if (!message.title || !message.body) {
          return json({ error: "title and body required" }, { status: 400 })
        }
        const id = message.id ?? crypto.randomUUID()
        const createdAt = message.createdAt ?? new Date().toISOString()
        await env.DB.prepare(
          "INSERT INTO shout_messages (id, title, body, created_at) VALUES (?, ?, ?, ?)"
        )
          .bind(id, message.title, message.body, createdAt)
          .run()

        // Best-effort — the message is already saved/visible in the feed
        // regardless of whether push delivery to any given device works.
        await sendPushToAllSubscribers(env, message.title, message.body)

        return json({ ok: true, id, createdAt })
      }

      if (pathname === "/push/subscribe" && request.method === "POST") {
        const subscription = await request.json<{ endpoint?: string }>()
        if (!subscription.endpoint) {
          return json({ error: "invalid subscription" }, { status: 400 })
        }
        await env.DB.prepare(
          `INSERT INTO push_subscriptions (endpoint, subscription_json, created_at)
           VALUES (?, ?, ?)
           ON CONFLICT(endpoint) DO UPDATE SET subscription_json = excluded.subscription_json`
        )
          .bind(
            subscription.endpoint,
            JSON.stringify(subscription),
            new Date().toISOString()
          )
          .run()
        return json({ ok: true })
      }

      return json({ error: "not found" }, { status: 404 })
    } catch (err) {
      console.error(err)
      return json({ error: "internal error" }, { status: 500 })
    }
  },
}

async function sendPushToAllSubscribers(
  env: Env,
  title: string,
  body: string
): Promise<void> {
  if (!env.VAPID_PUBLIC_KEY || !env.VAPID_PRIVATE_KEY) return

  webPush.setVapidDetails(
    "mailto:contact@cloudnativedenmark.dk",
    env.VAPID_PUBLIC_KEY,
    env.VAPID_PRIVATE_KEY
  )

  const { results } = await env.DB.prepare(
    "SELECT endpoint, subscription_json FROM push_subscriptions"
  ).all<{ endpoint: string; subscription_json: string }>()

  const payload = JSON.stringify({ title, body })

  await Promise.allSettled(
    results.map(async (row) => {
      try {
        const subscription = JSON.parse(row.subscription_json)
        await webPush.sendNotification(subscription, payload)
      } catch {
        // Expired/invalid subscriptions are expected over time — drop them
        // so future sends don't keep retrying a dead endpoint.
        await env.DB.prepare(
          "DELETE FROM push_subscriptions WHERE endpoint = ?"
        )
          .bind(row.endpoint)
          .run()
      }
    })
  )
}
