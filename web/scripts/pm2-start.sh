#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
if [[ -f .env.local ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env.local
  set +a
fi
exec ./node_modules/next/dist/bin/next start -p "${PORT:-3001}" -H "${HOSTNAME:-0.0.0.0}"
