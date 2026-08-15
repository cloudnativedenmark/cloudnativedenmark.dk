# companion-api

Backend for the CND companion app (`/companion` on the main site). A static
site can't aggregate feedback across attendees' devices or fan out push
notifications on its own — this Worker is the minimal piece that does.

This was written by an automated session that doesn't hold Cloudflare
account credentials, so it's code-complete but **not deployed**. The
companion app frontend works fine without it (ratings save locally per
device, shout messages are local-only) — deploying this just makes those
features actually sync across attendees. Do this whenever you're ready,
it's a ~10 minute one-time setup.

## Deploy steps

```bash
cd workers/companion-api
npm install

# 1. Create the D1 database
wrangler d1 create cnd-companion
# → copy the returned database_id into wrangler.toml's [[d1_databases]] block

# 2. Apply the schema
wrangler d1 execute cnd-companion --file=schema.sql --remote

# 3. Generate a VAPID keypair for push notifications
npx web-push generate-vapid-keys
# → prints a public and private key

# 4. Set secrets
wrangler secret put VAPID_PUBLIC_KEY    # paste the public key
wrangler secret put VAPID_PRIVATE_KEY   # paste the private key
wrangler secret put ADMIN_API_KEY       # any random string — this gates
                                         # shout-send and hide/unhide

# 5. Deploy
wrangler deploy
# → prints the Worker URL, e.g. https://cnd-companion-api.<subdomain>.workers.dev
```

## Wire the frontend to it

Add these to the main site's Cloudflare Pages build environment (or the
`preview.yaml` workflow's `env:` for the "Build website" step, as GH
Secrets):

| Env var | Value |
|---|---|
| `VITE_API_BASE_URL` | the Worker URL from step 5 above |
| `VITE_VAPID_PUBLIC_KEY` | the same public key from step 3 |
| `VITE_ADMIN_API_KEY` | the same value set in step 4 |

Once those are set and the site rebuilds, the companion app automatically
starts using the backend — no frontend code changes needed, it already
checks for `VITE_API_BASE_URL` and degrades gracefully when it's absent.

## API

All responses are JSON. Admin-only writes require an `X-Admin-Key` header
matching the `ADMIN_API_KEY` secret.

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/feedback` | — | all feedback, every session |
| POST | `/feedback` | — | upsert one attendee's rating/comment for a session |
| PATCH | `/feedback/:sessionId/:attendeeId` | admin | `{ hidden: boolean }` |
| GET | `/shout` | — | all shout messages, newest first |
| POST | `/shout` | admin | `{ title, body }` — also fans out push |
| POST | `/push/subscribe` | — | stores a browser PushSubscription |

## Notes on the security model

This intentionally mirrors the "simple is better" spirit of the frontend:
no per-attendee auth, no rate limiting, a single shared admin key rather
than per-admin credentials. That's a reasonable MVP tradeoff for a 2-day
internal conference tool, not something to reuse for anything higher-
stakes without hardening first (rotate `ADMIN_API_KEY` after the
conference, since anyone who had it during the event could still use it
afterward).

The `web-push` package handles VAPID signing and payload encryption — it's
a well-established library, but push delivery specifically hasn't been
live-tested end-to-end by this automated run (no way to receive a real
push without deploying). Worth a manual smoke test after the first deploy:
subscribe from a real device, send a test shout, confirm the notification
arrives.
