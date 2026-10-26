#!/usr/bin/env bash
# Fetch the shared 198x-ui components at a deliberate, reproducible pin.
# The kit stays out of version control; this same script runs locally and in CI.
set -euo pipefail

REPO="https://github.com/stevehill1981/198x-ui.git"
REF="${UI_REF:-7d7800b0e9d5b7ebdd03d4e0ce882a52985517de}"
DIR="_198x-ui"

if [ -d "$DIR/.git" ]; then
  current=$(git -C "$DIR" rev-parse HEAD)
  wanted=$(git -C "$DIR" rev-parse --verify "$REF^{commit}" 2>/dev/null || echo "")
  if [ "$current" != "$wanted" ]; then
    git -C "$DIR" fetch --quiet --depth 1 origin "$REF"
    git -C "$DIR" checkout --quiet --detach FETCH_HEAD
    echo "198x-ui: moved to $REF"
  else
    echo "198x-ui: already at $REF"
  fi
else
  rm -rf "$DIR"
  git init --quiet "$DIR"
  git -C "$DIR" remote add origin "$REPO"
  git -C "$DIR" fetch --quiet --depth 1 origin "$REF"
  git -C "$DIR" checkout --quiet --detach FETCH_HEAD
  echo "198x-ui: cloned at $REF"
fi

# The kit owns the font files. Its stylesheet serves them from /fonts/, so copy
# them into the Astro public root on every run, including a no-op pin check.
mkdir -p public
rm -rf public/fonts
cp -R "$DIR/fonts" public/fonts
echo "198x-ui: fonts copied to public/fonts"
