#!/usr/bin/env bash
# Refuses to deploy unless release-<year> is absent (dispatch) or still at
# the commit being deployed. Runs again in the deploy job because
# "Re-run failed jobs" skips the prepare job.
set -euo pipefail

branch="$1"
err=$(mktemp)
if head=$(gh api "repos/$GITHUB_REPOSITORY/git/ref/heads/$branch" --jq .object.sha 2>"$err"); then
  :
elif grep -q "HTTP 404" "$err"; then
  head=""
else
  echo "::error::Could not look up $branch: $(cat "$err")"
  exit 1
fi

if [[ "$GITHUB_EVENT_NAME" == "workflow_dispatch" ]]; then
  if [[ -n "$head" && "$head" != "$GITHUB_SHA" ]]; then
    echo "::error::$branch already exists at $head. Push to it to redeploy."
    exit 1
  fi
elif [[ "$head" != "$GITHUB_SHA" ]]; then
  echo "::error::$branch has moved on to ${head:-nothing}; not redeploying $GITHUB_SHA."
  exit 1
fi
