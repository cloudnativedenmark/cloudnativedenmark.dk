# Cloudflare Pages Setup for Release Deployments

This document explains the Cloudflare configuration required for automated deployments to release-based subdomains (e.g., `2025.cloudnativedenmark.dk`, `feat-testing.cloudnativedenmark.dk`).

## Overview

Each release gets deployed to its own subdomain using Cloudflare Pages. This setup enables multiple concurrent versions of the site while maintaining a clean URL structure.

## Prerequisites

Before setting up deployments, ensure you have:

- A Cloudflare account with the `cloudnativedenmark.dk` domain
- GitHub repository access with Actions enabled

## Configuration Steps

### 1. GitHub Actions Configuration

GitHub repository secrets must be configured first to enable automated deployments.

#### Required Secrets

Set up the following repository secrets in your GitHub repository (Settings → Secrets and variables → Actions -> Repository secrets):

#### CLOUDFLARE_API_TOKEN

1. Navigate to Cloudflare Dashboard → Go to... → Account API tokens
2. Click "Create Token"
3. Select "Custom token"
4. Configure permissions:
   - `Cloudflare Pages:Edit`
5. Set Account Resources to "Include - All accounts"
6. Click "Continue to summary" and create the token
7. Add token as `CLOUDFLARE_API_TOKEN` GitHub repository secrets

#### CLOUDFLARE_ACCOUNT_ID

1. Navigate to Cloudflare Dashboard -> Go to... → Compute (Workers)
2. Find Account Details and copy Account ID (format: `1234567890abcdef1234567890abcdef`)
3. Add the ID as `CLOUDFLARE_ACCOUNT_ID` GitHub repository secrets

### 2. Pages Project Creation

Pages projects are automatically created by Wrangler during the first deployment. The naming convention is `cloudnative-denmark-<release-name>` (e.g., `cloudnative-denmark-2025`, `cloudnative-denmark-feat-testing`).

### 3. Custom Domain Setup

After the initial deployment to a new release project:

1. Navigate to Cloudflare Dashboard → Workers & Pages → Pages
2. Select your project (e.g., `cloudnative-denmark-2025`)
3. Go to the Custom domains tab
4. Click "Set up a custom domain"
5. Enter the release-based subdomain: `2025.cloudnativedenmark.dk`
6. Complete Cloudflare's domain verification process. This will create the DNS CNAME record like below:

```

Name: 2025
Type: CNAME
Content: cloudnative-denmark-2025.pages.dev
Proxy status: Proxied (orange cloud enabled)
TTL: Auto
```
