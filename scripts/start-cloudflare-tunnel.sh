#!/usr/bin/env bash
set -euo pipefail

TOKEN_FILE="${CLOUDFLARE_TUNNEL_TOKEN_FILE:-$HOME/.cloudflared/zubair-portfolio_token}"

if [[ ! -f "$TOKEN_FILE" ]]; then
  echo "Missing tunnel token file: $TOKEN_FILE" >&2
  exit 1
fi

TOKEN="$(tr -d '\n\r' < "$TOKEN_FILE")"
if [[ -z "$TOKEN" ]]; then
  echo "Tunnel token file is empty: $TOKEN_FILE" >&2
  exit 1
fi

# Prefer system package binary when available
if [[ -x /usr/bin/cloudflared ]]; then
  CLOUDFLARED=/usr/bin/cloudflared
elif command -v cloudflared >/dev/null 2>&1; then
  CLOUDFLARED="$(command -v cloudflared)"
else
  echo "cloudflared is not installed" >&2
  exit 1
fi

exec "$CLOUDFLARED" tunnel run --token "$TOKEN"
