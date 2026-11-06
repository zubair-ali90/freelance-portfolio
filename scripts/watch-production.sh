#!/usr/bin/env bash
# Health watchdog only. Full deploys are triggered by GitHub Actions → /api/admin/deploy.
# If the site stays down, restart PM2 (do not run npm ci here — that raced with Actions).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PM2_APP="${PM2_APP:-Zubair-portfolio}"
INTERVAL_SEC="${DEPLOY_POLL_SECONDS:-60}"
URL="${HEALTH_URL:-http://127.0.0.1:3001/}"

export PATH="/usr/local/bin:/usr/bin:/bin:${PATH:-}"

echo "Watching $PM2_APP health every ${INTERVAL_SEC}s ($URL)"

fail_streak=0
while true; do
  if curl -fsS -o /dev/null --connect-timeout 5 --max-time 10 "$URL"; then
    fail_streak=0
  else
    fail_streak=$((fail_streak + 1))
    echo "$(date -Is) Health check failed ($fail_streak)"
    # Wait through a normal deploy window (~2 fails @ 60s) before healing.
    if [[ "$fail_streak" -ge 3 ]]; then
      # Skip heal while a deploy lock is held.
      if ! flock -n "$ROOT/scripts/deploy.lock" true 2>/dev/null; then
        echo "$(date -Is) Deploy in progress — not restarting"
      else
        echo "$(date -Is) Bringing $PM2_APP back up"
        pm2 describe "$PM2_APP" >/dev/null 2>&1 && pm2 start "$PM2_APP" || true
        pm2 restart "$PM2_APP" --update-env >/dev/null 2>&1 || true
        fail_streak=0
      fi
    fi
  fi
  sleep "$INTERVAL_SEC"
done
