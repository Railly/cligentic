#!/bin/bash
# Vercel deploys only site/, but the registry source lives at the repo root.
# This script copies the source into site/ AND runs `shadcn build` to emit
# the per-block JSONs into site/public/r/, which is what gets served in prod.
#
# Locally: re-runs every time so edits to registry.json or registry/ are picked
# up.
# On Vercel: the source files should already be present from the local upload
# (vercel deploys site/ as the root); we only need to run shadcn build.
set -e

SITE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
REPO_ROOT="$(cd "$SITE_DIR/.." 2>/dev/null && pwd)" || REPO_ROOT=""

# Step 1: ensure site/registry.json and site/registry-source/ are present.
if [ -f "$SITE_DIR/registry.json" ] && [ -d "$SITE_DIR/registry-source" ]; then
  echo "[prebuild] Registry source already present (likely Vercel build)."
elif [ -n "$REPO_ROOT" ] && [ -f "$REPO_ROOT/registry.json" ]; then
  echo "[prebuild] Copying registry.json from repo root to site/"
  cp "$REPO_ROOT/registry.json" "$SITE_DIR/registry.json"

  echo "[prebuild] Copying registry source files to site/registry-source/"
  rm -rf "$SITE_DIR/registry-source"
  mkdir -p "$SITE_DIR/registry-source"
  cp -r "$REPO_ROOT/registry/"* "$SITE_DIR/registry-source/"
else
  echo "[prebuild] Error: Cannot find registry.json in site/ or parent."
  exit 1
fi

# Step 2: build per-block JSONs into site/public/r/ via shadcn CLI.
# The registry.json sources files from `registry/...` paths; shadcn build
# resolves them relative to the registry.json's location, so we run it from
# the directory that contains registry-source/ (which mirrors the layout
# expected by registry.json).
#
# In local/dev, REPO_ROOT/registry/ exists so we run from REPO_ROOT.
# On Vercel, site/registry-source/ is the mirror but registry.json paths
# start with `registry/`, so we symlink registry-source -> registry inside
# site/ for the duration of the build.
echo "[prebuild] Building per-block JSONs into site/public/r/"
if [ -n "$REPO_ROOT" ] && [ -d "$REPO_ROOT/registry" ]; then
  cd "$REPO_ROOT"
  bunx --bun shadcn@latest build registry.json -o "$SITE_DIR/public/r"
else
  cd "$SITE_DIR"
  ln -sfn registry-source registry
  bunx --bun shadcn@latest build registry.json -o public/r
  rm -f registry
fi

echo "[prebuild] Done"
