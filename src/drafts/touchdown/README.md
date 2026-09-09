# Touchdown lesson review

The overview and eleven lessons implement the agreed brief. Sixteen game checkpoints and one input diagnostic live in the samples repository under `sinclair-zx-spectrum/basic/touchdown/teaching/`. Keep this directory's roster identical to that source roster.

Run the website with the teaching samples checkout:

```sh
CODE_SAMPLES_PATH=/path/to/code-samples npm run dev -- --port 4371
```

Open `http://localhost:4371/systems/sinclair-zx-spectrum/basic/touchdown/review/overview/`. The review route exists only in development; production builds emit no review pages. Published Touchdown content and catalogue entries remain as they were.

Verification:

```sh
CODE_SAMPLES_PATH=/path/to/code-samples TOUCHDOWN_REVIEW_URL=http://localhost:4371/systems/sinclair-zx-spectrum/basic/touchdown/review/ node scripts/check-touchdown-review.mjs
CODE_SAMPLES_PATH=/path/to/code-samples npm run build
```

All 48 page/width/theme combinations passed source and inline-code equality, navigation, questions, image loading, overflow and serious/critical accessibility checks. The production build passed 69 tests with nine existing skips. `browser-results.json` retains the browser summary. Source execution and hashes are retained alongside the teaching checkpoints. The overview flight image comes from the verified prototype, whose final source and stored program are identical to the final teaching checkpoint.

Review the teaching pace, especially the program reorganisation in lesson 4 and the keyboard-port explanation in lesson 7. Successful scripted landings demonstrate possibility, not beginner ease.

After lesson approval, publish the reviewed MDX, reconcile the eleven-unit catalogue and game number, preserve or redirect every existing Touchdown lesson URL, update the BASIC landing page and Volley's onward link, then build and deploy together. No publication is included in this draft handoff.
