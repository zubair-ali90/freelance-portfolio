#!/usr/bin/env bash
# Deploy latest origin/production on this host and restart PM2.
# Used by GitHub Actions (.github/workflows/deploy-production.yml).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WEB="$ROOT/web"
PM2_APP="${PM2_APP:-Zubair-portfolio}"
BRANCH="${DEPLOY_BRANCH:-production}"

export PATH="/usr/local/bin:/usr/bin:/bin:${PATH:-}"

echo "==> Deploy root: $ROOT"
cd "$ROOT"

echo "==> Fetch + reset to origin/$BRANCH"
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git reset --hard "origin/$BRANCH"
git clean -fd --exclude=web/node_modules --exclude=web/.next --exclude=web/.env.local --exclude=web/public/assets --exclude=Assets

echo "==> npm ci"
cd "$WEB"
npm ci

echo "==> prepare-assets + build"
npm run prepare-assets
npm run build

echo "==> Restart PM2: $PM2_APP"
if pm2 describe "$PM2_APP" >/dev/null 2>&1; then
  pm2 restart "$PM2_APP" --update-env
else
  pm2 start "$WEB/ecosystem.config.cjs"
fi
pm2 save

echo "==> Health check"
sleep 2
curl -fsS -o /dev/null -w "HTTP %{http_code}\n" "http://127.0.0.1:3001/"

echo "==> Deploy complete"
pm2 list | grep -E "Zubair|name" || pm2 list
