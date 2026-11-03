#!/usr/bin/env bash
# Local release checks. Deployment only builds and publishes.
set -euo pipefail
cd "$(dirname "$0")/.."

export CODE_SAMPLES_PATH="${CODE_SAMPLES_PATH:-$PWD/../code-samples}"
if ! command -v lychee >/dev/null; then
  echo 'Local link checks need the lychee executable on PATH.' >&2
  exit 1
fi
if [ ! -d "$CODE_SAMPLES_PATH" ]; then
  echo 'Prepare code-samples first; see README.md.' >&2
  exit 1
fi

npm run check
python3 -m unittest discover -s scripts -p 'test_discord_*.py'
npm run build
node scripts/check-browser-player.mjs --built
node --test scripts/release-host.test.mjs
# Workers follow the host's spare capacity (PLAYWRIGHT_WORKERS overrides it).
# Failures keep their trace and report the host's load and memory (#901).
workers="$(node scripts/release-host.mjs)"
A11Y_SWEEP=1 npx playwright test tests/native-image.spec.ts tests/player-integration.spec.ts tests/a11y.spec.ts tests/page-frame.spec.ts tests/spectrum-learner-journey.spec.ts tests/assembly-draft.spec.ts \
  --workers="$workers" --trace=retain-on-failure --reporter=list,./scripts/release-host-reporter.mjs
lychee --root-dir "$PWD/dist" --no-progress \
  --exclude-path "$PWD/dist/assets" --exclude 'mailto:.*' \
  --exclude 'localhost' --exclude '/images/' --offline "$PWD/dist/**/*.html"
