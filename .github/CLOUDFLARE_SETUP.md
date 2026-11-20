# Cloudflare Pages Setup for Release Deployments

Each conference edition is archived on its own subdomain (e.g. `2026.cloudnativedenmark.dk`) by `.github/workflows/release.yml`.

## Releasing an edition

1. Go to Actions → **Deploy Release to CloudFlare** → **Run workflow**.
2. Keep **main** selected and enter the release name, e.g. `2027`. Use lowercase letters, digits and hyphens.
3. The workflow:
   - creates the `release-2027` branch from `main` (it fails if the branch already exists),
   - builds and deploys it to the `cloudnative-denmark-2027` Pages project (created if needed),
   - attaches `2027.cloudnativedenmark.dk` to that project,
   - creates or updates the proxied `CNAME 2027 → cloudnative-denmark-2027.pages.dev` record,
   - waits until the domain is active and the site answers.

Each deploy is recorded in a GitHub environment named after the branch (`release-2027`), so the repository's Environments page shows every edition's latest deploy status and URL.

## Hotfixes

Push to `release-<name>`. The same workflow redeploys it into the same environment and re-checks the domain and DNS record. Branches created before this workflow existed (`release-2025`, `release-2026`) need it merged in first, or their pushes run the old workflow.

## Repository secrets

Set these under Settings → Secrets and variables → Actions → Repository secrets.

### CLOUDFLARE_API_TOKEN

1. Cloudflare Dashboard → My Profile → API Tokens → **Create Token** → **Custom token**.
2. Permissions:
   - Account → **Cloudflare Pages** → Edit
   - Zone → **DNS** → Edit
   - Zone → **Zone** → Read (not needed if `CLOUDFLARE_ZONE_ID` is set)
3. Account Resources: include the account that owns `cloudnativedenmark.dk`.
4. Zone Resources: include the specific zone `cloudnativedenmark.dk`.
5. Save the token as `CLOUDFLARE_API_TOKEN`.

### CLOUDFLARE_ACCOUNT_ID

Cloudflare Dashboard → Workers & Pages → Account details → copy the Account ID (format: `1234567890abcdef1234567890abcdef`).

### CLOUDFLARE_ZONE_ID (optional)

Cloudflare Dashboard → `cloudnativedenmark.dk` → Overview → API → Zone ID. Without it, the workflow looks the zone up by name, which needs the Zone → Read permission above.

## Troubleshooting

- **HTTP 522 on `<name>.cloudnativedenmark.dk`**: the DNS record exists, but the domain isn't attached to the Pages project. Push to the release branch to rerun the attach step, or check Workers & Pages → `cloudnative-denmark-<name>` → Custom domains.
- **"already has A records"**: remove the conflicting record for that name in Cloudflare DNS and rerun.
