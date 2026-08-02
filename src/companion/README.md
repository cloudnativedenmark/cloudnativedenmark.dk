# Companion app (`/companion`)

A mobile-first, installable companion app for CND/2026 attendees, speakers,
and organizers — schedule browsing (works offline), a personal favorites
schedule, session ratings/feedback, and organizer broadcast messages with
push notifications. Lives inside the main site (same repo, same Vite
build, same visual identity) rather than as a separate native app — see
the PR description for why.

## How auth works

No accounts, no login form — three shared passphrases (one per role:
attendee / speaker / admin), matching how badges/tickets work at the
actual event. Unlocking with a passphrase persists the role in
`localStorage`, so it survives closing the browser/app — re-auth is only
needed after tapping **Log out**.

Passphrases are never stored in cleartext, and not even as a simple
reversible encryption — a static site can't hide a secret that the
browser itself has to check, so "encrypted" here means something specific:
`src/companion/auth/auth-config.enc.json` holds an AES-GCM–encrypted blob
of **salted SHA-256 hashes**, one per role. The decryption key comes from
`VITE_AUTH_CONFIG_KEY` at build time (falls back to a bundled demo key so
this works out of the box in previews). Even with that key, all an
attacker recovers is the hashes — not the passphrases themselves.

To change the passphrases before real conference use:

```bash
ROLE_PASSPHRASE_ATTENDEE=... \
ROLE_PASSPHRASE_SPEAKER=... \
ROLE_PASSPHRASE_ADMIN=... \
node scripts/generate-companion-auth-config.mjs
```

This prints a new key — set it as the `VITE_AUTH_CONFIG_KEY` GH Secret,
and commit the regenerated `auth-config.enc.json`.

**Demo passphrases** (bundled default, fine for previewing, rotate before
the real event): `harbor2026` (attendee), `keynote2026` (speaker),
`admin2026x7` (admin).

## How offline works

- **App shell**: a small hand-written service worker (`public/sw.js`,
  registered in `src/main.tsx`) caches-as-you-go — every same-origin GET
  that succeeds gets cached, and a failed fetch falls back to the cached
  copy (or the cached shell itself for unknown navigations). This was
  deliberately hand-rolled instead of using `vite-plugin-pwa`: this
  sandbox's network policy blocks Corepack from fetching the Yarn Berry
  version this repo's CI uses (`repo.yarnpkg.com` isn't reachable), so
  adding any new npm dependency here couldn't be done safely — attempting
  it rewrote `yarn.lock` in an incompatible format that would have broken
  `yarn install --immutable` for every PR, not just this one. A dependency
  free service worker sidesteps that entirely. Verified in this PR by
  disabling the network completely and doing a hard reload.
- **Schedule data**: cached to `localStorage` on every successful fetch,
  hydrated from that cache immediately on load so there's no flash of
  empty state — see `src/companion/data/use-offline-schedule.ts`.
- **Speaker picker**: derived from the cached schedule (sessions already
  carry speaker data) rather than a separate live-only API call, so it
  works offline too.
- **Favorites and "my feedback"**: pure `localStorage`, no network
  involved at all.

## The backend piece

Ratings-across-all-attendees, moderation, and shout/push all need a real
shared backend — a static site can't aggregate data across devices or
push to a browser that isn't open. That's `workers/companion-api/`, a
Cloudflare Worker + D1 database. **It's code-complete but not deployed**
— this automated run didn't hold Cloudflare provisioning credentials.
See `workers/companion-api/README.md` for the ~10 minute deploy.

Until it's deployed, the app still works — it just degrades to
local-only mode (your own ratings save locally but nobody else sees them;
shout messages you send are visible on your device only). Every place
this matters says so explicitly in the UI rather than silently failing.

## Known gaps / next steps

- Feedback/shout REST endpoints have no per-request rate limiting.
- Push delivery uses the `web-push` library but hasn't been live-tested
  end to end (impossible without deploying) — worth a manual check after
  first deploy.
- No real design pass on empty/error states beyond what's here — this is
  an MVP proposal, not final polish.
