---
name: cnd-website-change
description: Drives the full change workflow for the cloudnativedenmark/cloudnativedenmark.dk repo -- commit a change, open a PR against it, label the PR "preview-enabled" to trigger the Cloudflare Pages preview deploy, then wait for and surface the preview URL. Use this whenever the user asks to make a change to the CND website and see it deployed, wants a preview link for a PR, or asks to "ship"/"push"/"preview" a change to cloudnativedenmark.dk. Also use when asked to add the preview-enabled label to an existing PR in this repo. Also covers the daily automated run that triages @Alek Slack mentions, opens PRs for in-scope website requests, replies with the preview link, and sends Alek a digest of unmerged PRs and out-of-scope items -- use this section when running as that scheduled, unattended session.
---

# CND website change workflow

This repo has a per-PR preview environment: any PR labeled `preview-enabled`
gets built and deployed to Cloudflare Pages by
`.github/workflows/preview.yaml`, which then posts a sticky bot comment
containing the live URL. Use this skill to drive a change through that loop
end-to-end so the user gets a clickable preview link, not just a merged diff.

## Steps

1. **Make the change and open the PR.**
   - Branch from the latest `main`, commit the change with a clear message.
   - Push the branch and open a PR against `cloudnativedenmark/cloudnativedenmark.dk`
     with `mcp__github__create_pull_request` (base: `main`). Check for a PR
     template first (`.github/pull_request_template.md` etc.) and follow the
     usual repo conventions from CLAUDE.md (yarn, TypeScript, etc.) — this
     skill only covers what happens *after* the diff is ready.
   - If the change is unrelated to something else already in flight, keep the
     PR scoped to just this change — don't bundle unrelated work (see the
     preview-environment/schedule-feature split in PR #106/#107 for why:
     mixing concerns forced an after-the-fact extraction).

2. **Label the PR `preview-enabled`.**
   - PRs are issues under the hood on GitHub's API, so labels are set via
     `mcp__github__issue_write` (method `update`, `issue_number` = PR number,
     `labels: ["preview-enabled"]`) rather than a pull-request-specific tool.
   - Note from the README: only users/tokens with write or triage access can
     apply labels. If the label call fails with a permissions error, say so
     rather than retrying blindly.
   - This label is also what the workflow's `teardown` job watches for removal
     on, and what the workflow reacts to on every subsequent push — so leave
     it on while iterating on the PR.

3. **Wait for the preview deploy and surface the URL.**
   - Subscribe to the PR with `mcp__github__subscribe_pr_activity` so the
     workflow's completion and comment arrive as webhook events — don't poll
     with sleeps.
   - The workflow runs a `deploy` job (build + `wrangler pages deploy`) and
     then posts/updates a **sticky** comment (header `preview`) from
     `github-actions[bot]` titled "🚀 Preview environment ready", containing a
     `Preview URL` row like:
     `https://pr-<number>.cloudnative-denmark-preview.pages.dev`
   - If subscribing isn't available or you need to check retroactively, read
     comments with `mcp__github__pull_request_read` (method `get_comments`)
     and look for that bot comment instead.
   - Once it arrives, **show the Preview URL to the user directly** — that's
     the deliverable of this flow, not just "the workflow succeeded."
   - If this run was driven by the Slack-monitoring automation (a request
     that came in via Slack rather than direct chat), reply with the preview
     link in the Slack thread where the request originated, addressed to
     whoever actually asked for the change — not just Alek, and not
     generically "the channel." If Alek relayed or forwarded someone else's
     ask, trace it back to that original message and reply to that person.
     Write the message in Alek's own voice: don't credit, name-check, or
     otherwise disclose Claude/AI authorship in the Slack message (no "Made
     by Claude," no AI signature). This applies to Slack only — PR
     descriptions and commits still carry the standard Claude Code
     attribution footer, which stays as-is.
   - If the `deploy` check run fails instead, fetch its logs
     (`mcp__github__get_job_logs` / the check run's `html_url`) and diagnose
     before reporting back — common causes are a failed `yarn build` or a
     missing/expired `CLOUDFLARE_API_TOKEN`/`CLOUDFLARE_ACCOUNT_ID` secret
     (see `.github/CLOUDFLARE_SETUP.md`).

4. **Teardown is automatic, not something to do manually.**
   - Removing the `preview-enabled` label or closing/merging the PR triggers
     the `teardown` job, which deletes the Cloudflare deployment and replaces
     the sticky comment with a "torn down" message. You don't need to do
     anything extra when the PR is done — just don't remove the label
     prematurely while the user still wants the preview live.

## Notes

- Preview project name is fixed: `cloudnative-denmark-preview` (distinct from
  the per-release subdomain projects documented in
  `.github/CLOUDFLARE_SETUP.md`, which is a separate, unrelated deployment
  path — don't conflate the two).
- Every push to the PR while labeled redeploys and updates the same sticky
  comment (same URL pattern), so re-fetching after a subsequent push is
  enough to get the latest link — no new comment to hunt for.

## Automated daily Slack monitoring

A Routine fires into a fresh session every morning (08:00 CEST /
06:00 UTC — see the DST caveat below) to triage `@Alek` mentions in the CND
Slack and drive qualifying requests through this skill autonomously. Follow
this section end-to-end whenever you're running as that fresh, unattended
session — there's no human watching this particular run, so be conservative
about what counts as "safe to act on" and lean on the digest for anything
uncertain.

### 1. Find what's new

- Resolve Alek's Slack user ID once (`mcp__Slack__slack_search_users`) if not
  already known from context.
- Search for messages mentioning him since the last run
  (`mcp__Slack__slack_search_public_and_private`, roughly a 24h window —
  widen it if the previous run's digest suggests a gap, e.g. after downtime).
- Skip anything that is clearly not a request (reactions, FYIs, threads
  where Alek is only tagged for visibility, not being asked to do
  something).

### 2. Triage each mention

For each message that reads as an actual ask:

- **In scope for autonomous action**: a concrete, boundable change to the
  cloudnativedenmark.dk site — copy edits, adding/updating a
  sponsor/speaker/hotel entry, fixing a broken link, small UI tweaks, etc.
  Pull extra context from Gmail or Google Drive only if the Slack message
  itself references a specific email or doc (a sponsor logo attachment, a
  bio doc, etc.) — don't go on open-ended fishing expeditions through
  someone's inbox or Drive on the strength of a vague ask.
- **Out of scope for autonomous action** — do not attempt, do not reply as
  Alek, just log it for the digest instead:
  - Anything ambiguous enough that two reasonable people could disagree on
    what was asked.
  - Anything architecturally significant, or larger than a single scoped PR.
  - Anything that isn't actually a website change (scheduling, payments,
    vendor questions, anything needing a judgment call that's Alek's to
    make).
  - Anything where the needed context isn't already reachable via Slack the
    thread, a directly-referenced email/doc, or the repo itself.

When in doubt, treat it as out of scope. A missed request costs a day's
delay and shows up in the digest; a wrong autonomous change ships under
Alek's name without him having seen it.

### 3. Do the work and reply

- For in-scope requests, run this skill's normal flow (steps 1–3 above):
  branch, commit, open the PR, label `preview-enabled`, wait for the preview
  URL. **Do not merge** — merging stays a human decision, always.
- Reply in the Slack thread where the request originated, addressed to
  whoever actually asked (trace through Alek if he relayed someone else's
  ask — see the existing note above on this). Write it in Alek's own voice,
  with the PR + preview link, and no AI/Claude disclosure — consistent with
  how this skill already handles Slack replies for interactively-triggered
  changes.
- This impersonation-style reply is scoped strictly to confirming a website
  change with a preview link. Never use the Alek identity to answer
  questions, make commitments, or discuss anything outside "here's the
  preview of the change you asked for."

### 4. Daily digest

Before ending the run, DM Alek on Slack (not a channel) with a short digest:

- Any PR opened today (this run or still open from before) that isn't
  merged yet, with its status (preview ready / preview failed / awaiting
  review).
- Anything from step 2 that was judged out of scope, with a one-line reason
  and a link to the Slack thread, so Alek can pick it up himself.
- Any `deploy` check-run failure this run hit and couldn't resolve.

Keep it scannable — a short bulleted list, not prose.

### Guardrails

- Connector access for this routine is fixed to Slack, GitHub, Gmail
  (read), and Google Drive (read). If a request seems to need something
  else, that's an out-of-scope case for the digest, not a reason to reach
  for a broader grant.
- Never merge PRs, never remove the `preview-enabled` label, and never
  reply as Alek outside the narrow "your change is ready, here's the
  preview" confirmation described above.
- The 06:00 UTC schedule is fixed to one offset and does not shift with
  Denmark's clocks — it lands at 08:00 during CEST (summer) and 07:00 once
  the clocks fall back to CET. Adjust the trigger's cron if you want it
  pinned to local wall-clock time year-round.
