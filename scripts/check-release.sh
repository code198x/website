#!/usr/bin/env bash
# Local release checks. Deployment only builds and publishes.
set -euo pipefail
cd "$(dirname "$0")/.."

export CODE_SAMPLES_PATH="${CODE_SAMPLES_PATH:-$PWD/../code-samples}"
export PLAY198X_WASM_PATH="${PLAY198X_WASM_PATH:-$PWD/../../Play198x/play198x/crates/play198x-web/pkg-node}"
if ! command -v lychee >/dev/null; then
  echo 'Local link checks need the lychee executable on PATH.' >&2
  exit 1
fi
if [ ! -d "$CODE_SAMPLES_PATH" ] || [ ! -f "$PLAY198X_WASM_PATH/play198x_web.js" ]; then
  echo 'Prepare code-samples and the Play198x decoder first; see README.md.' >&2
  exit 1
fi

npm run check
python3 -m unittest discover -s scripts -p 'test_discord_*.py'
npm run build
node scripts/check-browser-player.mjs --built
A11Y_SWEEP=1 npx playwright test tests/native-image.spec.ts tests/player-integration.spec.ts tests/a11y.spec.ts tests/page-frame.spec.ts tests/spectrum-learner-journey.spec.ts
lychee --root-dir "$PWD/dist" --no-progress \
  --exclude-path "$PWD/dist/assets" --exclude 'mailto:.*' \
  --exclude 'localhost' --exclude '/images/' --offline "$PWD/dist/**/*.html"
