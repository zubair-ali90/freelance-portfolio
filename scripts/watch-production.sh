#!/usr/bin/env bash
# Poll origin/production and deploy when a new commit appears.
# Fallback when GitHub Actions cannot reach this host over SSH.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BRANCH="${DEPLOY_BRANCH:-production}"
INTERVAL_SEC="${DEPLOY_POLL_SECONDS:-60}"
REPO_API="${REPO_API:-https://api.github.com/repos/zubair-ali90/freelance-portfolio/commits/${BRANCH}}"

export PATH="/usr/local/bin:/usr/bin:/bin:${PATH:-}"

echo "Watching $BRANCH every ${INTERVAL_SEC}s in $ROOT"

while true; do
  cd "$ROOT"
  remote="$(curl -fsSL "$REPO_API" | python3 -c 'import sys,json; print(json.load(sys.stdin)["sha"])' 2>/dev/null || true)"
  local_sha="$(git rev-parse HEAD 2>/dev/null || true)"

  if [[ -n "$remote" && -n "$local_sha" && "$remote" != "$local_sha" ]]; then
    echo "$(date -Is) New commit on $BRANCH: $local_sha -> $remote"
    if "$ROOT/scripts/deploy-production.sh"; then
      echo "$(date -Is) Deploy OK"
    else
      echo "$(date -Is) Deploy FAILED" >&2
    fi
  fi
  sleep "$INTERVAL_SEC"
done
