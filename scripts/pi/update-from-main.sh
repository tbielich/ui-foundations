#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="/home/nerdyboy/pi-dashboard"
DEFAULT_BRANCH="main"

cd "$REPO_DIR"

branch="$(git branch --show-current 2>/dev/null || true)"
if [ -z "$branch" ]; then
  branch="$DEFAULT_BRANCH"
fi

echo "Updating pi-dashboard from origin/$branch"
git fetch origin "$branch"

local_rev="$(git rev-parse HEAD)"
remote_rev="$(git rev-parse "origin/$branch")"

if [ "$local_rev" != "$remote_rev" ]; then
  git reset --hard "origin/$branch"
else
  echo "Already up to date"
fi

if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

if node -e "const p=require('./package.json'); process.exit(p.scripts && p.scripts.build ? 0 : 1)"; then
  npm run build
elif node -e "const p=require('./package.json'); process.exit(p.scripts && p.scripts['build:all'] ? 0 : 1)"; then
  npm run build:all
else
  echo "No build script found; skipping build step"
fi

if systemctl list-unit-files --no-legend 2>/dev/null | awk '{print $1}' | grep -qx 'pi-dashboard.service'; then
  sudo systemctl restart pi-dashboard.service
else
  echo "pi-dashboard.service not present; skipping app restart"
fi
