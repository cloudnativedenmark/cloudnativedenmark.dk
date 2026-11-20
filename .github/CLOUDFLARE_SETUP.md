# Cloudflare Pages Setup for Release Deployments

`main` is always the current site. When a conference ends, `.github/workflows/release.yml` freezes `main` as that year's archive on its own subdomain, e.g. `2026.cloudnativedenmark.dk`.

## Archiving an edition

1. Go to Actions → **Deploy Release to CloudFlare** → **Run workflow**.
2. Keep **main** selected and enter the four-digit year, e.g. `2026`.
3. The workflow:
   - stops before building if `release-2026` already exists at another commit,
   - tests and builds `main`,
   - deploys the build to the `cloudnative-denmark-2026` Pages project (created if needed; an existing project must serve production from `release-2026`),
   - creates or updates the proxied `CNAME 2026 → <project>.pages.dev` record, refusing to change records that point anywhere other than Pages,
   - attaches `2026.cloudnativedenmark.dk` to the project and waits until it's active and the site answers,
   - creates the `release-2026` branch at the deployed commit, only after everything above succeeded.

If the run fails:

- **Tests or build:** fix `main` and run the workflow again.
- **Deploy, DNS or domain:** fix the cause (token, DNS record), then use **Re-run failed jobs** on the same run. It reuses that run's build (kept for 7 days). A new dispatch would archive whatever `main` is by then.

Each deploy is recorded in a GitHub environment named after the branch (`release-2026`). The repository's Environments page shows every edition's latest deploy status and URL.

Archive the edition before `main` moves on to the next one.

## Hotfixes

Push to `release-<year>` (admins and maintainers only, see the ruleset below). The same workflow redeploys it into the same environment and re-checks the DNS record and domain. Re-running an older run after a newer push fails instead of rolling the site back.

Pushes run the workflow file on that branch. To bring an older branch onto this workflow, copy just these files from `main`. Don't merge `main` into it, because that would replace the archived site.

```bash
git switch release-2025
git checkout origin/main -- .github/workflows/release.yml scripts/release-domain.mjs
git commit -m "ci: Use the release workflow from main"
git push
```

## Branch ruleset

The `release` ruleset protects `refs/heads/release-*`: no deletion, no force pushes, linear history, and only admins and maintainers can push updates. Branch creation is deliberately not restricted, because the workflow creates the branch with `GITHUB_TOKEN` and GitHub Actions can't be added to a ruleset's bypass list.

## Repository secrets

Set these under Settings → Secrets and variables → Actions → Repository secrets **before** the first run.

### CLOUDFLARE_API_TOKEN

1. Cloudflare Dashboard → My Profile → API Tokens → **Create Token** → **Custom token**.
2. Permissions:
   - Account → **Cloudflare Pages** → Edit
   - Zone → **DNS** → Edit
   - Zone → **Zone** → Read (not needed if `CLOUDFLARE_ZONE_ID` is set)
3. Account Resources: include the account that owns `cloudnativedenmark.dk`.
4. Zone Resources: include the specific zone `cloudnativedenmark.dk`.
5. Save the token as `CLOUDFLARE_API_TOKEN`.

The PR preview workflow uses the same token and only needs the Pages permission.

### CLOUDFLARE_ACCOUNT_ID

Cloudflare Dashboard → Workers & Pages → Account details → copy the Account ID (format: `1234567890abcdef1234567890abcdef`).

### CLOUDFLARE_ZONE_ID (optional)

Cloudflare Dashboard → `cloudnativedenmark.dk` → Overview → API → Zone ID. Without it, the workflow looks the zone up by name, which needs the Zone → Read permission above.

## Troubleshooting

- **HTTP 522 on `<year>.cloudnativedenmark.dk`**: the DNS record exists but the domain isn't attached to the Pages project. Push to the release branch to rerun the attach step.
- **"already has A records" or "not a Pages project"**: another record owns that name. Remove or rename it in Cloudflare DNS, then re-run failed jobs.
- **"serves production from …"**: the Pages project's production branch isn't `release-<year>`. Change it under Workers & Pages → the project → Settings → Builds, then re-run failed jobs.
- **"Could not create release-<year>"**: the branch already exists at another commit. Push to it to redeploy instead.
