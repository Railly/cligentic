#!/bin/bash
# Copies registry data into site/ so builds work when the parent directory
# isn't available (Vercel deploys only the root directory).
#
# On Vercel: the files should already be present from the local deploy
# (vercel deploy uploads them). Skip if they exist.
set -e

SITE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
REPO_ROOT="$(cd "$SITE_DIR/.." 2>/dev/null && pwd)" || REPO_ROOT=""

# If registry.json already exists locally (from a previous prebuild or
# because we're on Vercel where it was uploaded), skip copying.
if [ -f "$SITE_DIR/registry.json" ] && [ -d "$SITE_DIR/registry-source" ]; then
  echo "[prebuild] Registry data already present. Skipping copy."
  exit 0
fi

if [ -z "$REPO_ROOT" ] || [ ! -f "$REPO_ROOT/registry.json" ]; then
  echo "[prebuild] Error: Cannot find registry.json in parent directory."
  echo "[prebuild] Run prebuild locally before deploying."
  exit 1
fi

echo "[prebuild] Copying registry.json to site/"
cp "$REPO_ROOT/registry.json" "$SITE_DIR/registry.json"

echo "[prebuild] Copying registry source files to site/registry-source/"
rm -rf "$SITE_DIR/registry-source"
mkdir -p "$SITE_DIR/registry-source"
cp -r "$REPO_ROOT/registry/"* "$SITE_DIR/registry-source/"

echo "[prebuild] Done"
