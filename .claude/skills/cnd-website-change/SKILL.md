---
name: cnd-website-change
description: Drives the full change workflow for the cloudnativedenmark/cloudnativedenmark.dk repo -- commit a change, open a PR against it, label the PR "preview-enabled" to trigger the Cloudflare Pages preview deploy, then wait for and surface the preview URL. Use this whenever the user asks to make a change to the CND website and see it deployed, wants a preview link for a PR, or asks to "ship"/"push"/"preview" a change to cloudnativedenmark.dk. Also use when asked to add the preview-enabled label to an existing PR in this repo.
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
