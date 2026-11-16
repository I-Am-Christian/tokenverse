#!/usr/bin/env sh
set -e
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
  echo 'Node.js 20+ is required. See https://nodejs.org/'
  exit 1
fi
echo 'Starting TOKENVERSE multiplayer at http://localhost:3000'
node server.js