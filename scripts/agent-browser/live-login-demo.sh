#!/usr/bin/env bash

set -euo pipefail

BASE_URL="${1:-http://127.0.0.1:3000}"
SESSION="${AB_SESSION:-ikiform-live}"
EMAIL="${AB_EMAIL:-}"
PASSWORD="${AB_PASSWORD:-}"

if [[ -z "$EMAIL" || -z "$PASSWORD" ]]; then
  echo "Usage:"
  echo "  AB_EMAIL='you@example.com' AB_PASSWORD='secret' bash scripts/agent-browser/live-login-demo.sh [baseUrl]"
  exit 1
fi

extract_ref() {
  local snapshot="$1"
  local control="$2"
  local label="$3"
  echo "$snapshot" | sed -n "s/.*${control} \"${label}\" \\[ref=\\([^]]*\\)\\].*/@\\1/p" | head -n 1
}

echo "Opening login page in headed mode..."
agent-browser --session "$SESSION" --headed open "${BASE_URL}/login"

echo "Snapshot: login step"
login_snapshot="$(agent-browser --session "$SESSION" --headed snapshot -i)"
echo "$login_snapshot"

email_ref="$(extract_ref "$login_snapshot" "textbox" "Enter your email")"
continue_ref="$(extract_ref "$login_snapshot" "button" "Continue")"

if [[ -z "$email_ref" || -z "$continue_ref" ]]; then
  echo "Could not find login controls in snapshot."
  exit 1
fi

echo "Filling email (${email_ref}) and clicking continue (${continue_ref})..."
agent-browser --session "$SESSION" --headed fill "$email_ref" "$EMAIL"
agent-browser --session "$SESSION" --headed click "$continue_ref"
agent-browser --session "$SESSION" --headed wait 1200

echo "Snapshot: password step"
password_snapshot="$(agent-browser --session "$SESSION" --headed snapshot -i)"
echo "$password_snapshot"

password_ref="$(extract_ref "$password_snapshot" "textbox" "Enter your password")"
signin_ref="$(extract_ref "$password_snapshot" "button" "Sign in")"

if [[ -z "$password_ref" || -z "$signin_ref" ]]; then
  echo "Could not find password controls in snapshot."
  exit 1
fi

echo "Filling password (${password_ref}) and clicking sign in (${signin_ref})..."
agent-browser --session "$SESSION" --headed fill "$password_ref" "$PASSWORD"
agent-browser --session "$SESSION" --headed click "$signin_ref"
agent-browser --session "$SESSION" --headed wait 2500

echo "Final URL:"
agent-browser --session "$SESSION" --headed get url
echo "Live session '${SESSION}' remains open for inspection."
