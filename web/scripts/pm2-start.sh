#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
if [[ -f .env.local ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env.local
  set +a
fi

# Do NOT use Linux $HOSTNAME (often resolves to 127.0.1.1 and breaks localhost/tunnel).
PORT="${PORT:-3001}"
BIND_HOST="${BIND_HOST:-0.0.0.0}"

exec ./node_modules/next/dist/bin/next start -p "$PORT" -H "$BIND_HOST"
