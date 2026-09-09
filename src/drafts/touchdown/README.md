# Touchdown publication evidence

The overview and eleven lessons were approved and moved to `src/content/curriculum/sinclair-zx-spectrum/basic/touchdown/`. This directory retains the teaching roster and browser evidence. The sixteen checkpoints and input diagnostic live under `sinclair-zx-spectrum/basic/touchdown/teaching/` in code-samples.

Run `scripts/check-touchdown-review.mjs` with `CODE_SAMPLES_PATH` set to that checkout and `TOUCHDOWN_REVIEW_URL` set to the served public Touchdown base URL. It checks all twelve pages at two widths in both themes. `npm run build` runs the production checks. The old review URLs and numbered lesson URLs redirect to the published course.

The reviewed final game is unchanged. Emulator results and source hashes remain with the samples. Scripted safe approaches establish that the controls allow success, not beginner ease.
