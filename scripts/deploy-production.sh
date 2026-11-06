#!/usr/bin/env bash
# Deploy latest origin/production on this host and restart PM2.
# Used by GitHub Actions (.github/workflows/deploy-production.yml).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WEB="$ROOT/web"
PM2_APP="${PM2_APP:-Zubair-portfolio}"
BRANCH="${DEPLOY_BRANCH:-production}"
LOG="${ROOT}/scripts/last-deploy.log"
LOCK="${ROOT}/scripts/deploy.lock"

export PATH="/usr/local/bin:/usr/bin:/bin:${PATH:-}"

# Single-flight: ignore overlapping Action + watch triggers.
exec 9>"$LOCK"
if ! flock -n 9; then
  echo "$(date -Is) Deploy already running; skipping." | tee -a "$LOG"
  exit 0
fi

# Let the HTTP hook response finish before we stop the Next process that may have spawned us.
sleep 2

exec > >(tee -a "$LOG") 2>&1

bring_up() {
  echo "==> Ensuring PM2 app is up: $PM2_APP"
  if pm2 describe "$PM2_APP" >/dev/null 2>&1; then
    pm2 start "$PM2_APP" >/dev/null 2>&1 || true
    pm2 restart "$PM2_APP" --update-env || pm2 start "$WEB/ecosystem.config.cjs" || true
  else
    pm2 start "$WEB/ecosystem.config.cjs" || true
  fi
  pm2 save || true
}

# Always try to leave the site running if deploy fails mid-way.
trap 'echo "==> $(date -Is) Deploy aborted — attempting to bring site back up"; bring_up' ERR

echo "==> $(date -Is) Deploy root: $ROOT"
cd "$ROOT"

echo "==> Fetch + reset to origin/$BRANCH"
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git reset --hard "origin/$BRANCH"
git clean -fd --exclude=web/node_modules --exclude=web/.next --exclude=web/.env.local --exclude=web/public/assets --exclude=Assets

# Stop the live process before rewriting node_modules / .next.
# Safe now because this script is launched with setsid/nohup (independent of the Next process).
if pm2 describe "$PM2_APP" >/dev/null 2>&1; then
  echo "==> Stopping PM2 app during install/build: $PM2_APP"
  pm2 stop "$PM2_APP" || true
fi

echo "==> npm ci"
cd "$WEB"
npm ci

echo "==> prepare-assets + build"
npm run prepare-assets
npm run build

trap - ERR
bring_up

echo "==> Health check"
sleep 2
curl -fsS -o /dev/null -w "HTTP %{http_code}\n" "http://127.0.0.1:3001/"

echo "==> $(date -Is) Deploy complete"
pm2 list | grep -E "Zubair|name" || pm2 list
