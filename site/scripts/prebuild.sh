#!/bin/bash
# Copies registry data into site/ so Vercel builds work (Vercel only uploads
# the root directory, so parent-relative paths don't resolve).
set -e

SITE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
REPO_ROOT="$(cd "$SITE_DIR/.." && pwd)"

echo "[prebuild] Copying registry.json to site/"
cp "$REPO_ROOT/registry.json" "$SITE_DIR/registry.json"

echo "[prebuild] Copying registry source files to site/registry-source/"
rm -rf "$SITE_DIR/registry-source"
mkdir -p "$SITE_DIR/registry-source"
cp -r "$REPO_ROOT/registry/"* "$SITE_DIR/registry-source/"

echo "[prebuild] Building registry JSON files"
cd "$REPO_ROOT" && bun scripts/build-registry.ts

echo "[prebuild] Done"
