# Volley lesson review

Eight lesson drafts and a module overview, based on the verified 48K BASIC checkpoints. These files live outside the curriculum collections; the review route returns no production paths.

Run the development server with `CODE_SAMPLES_PATH` pointing to the compatible code-samples checkout. Open `/systems/sinclair-zx-spectrum/basic/volley/review/overview/`. The page links all eight lessons and the existing unit layout supplies step navigation.

`roster.json` records each lesson’s add/replace/delete set. In code-samples, `sinclair-zx-spectrum/basic/volley/prototype/verification/lessons.py --roster /path/to/website/src/drafts/volley/roster.json` validates those edits and the maintained snippets. Runnable sources retain the agreed keyword-spacing convention.

Run `node scripts/check-volley-review.mjs` against the default local server, or set `VOLLEY_REVIEW_URL` to the review URL including its final slash. It checks the overview and lessons at two widths in both themes, code availability, links, keyboard questions, overflow, images and serious/critical Axe findings. Captures and results go to a temporary directory, overridable with `VOLLEY_REVIEW_OUTPUT`.

Before publication, promote the MDX to the curriculum collection, adjust the overview’s relative links, add the unit catalogue, place Volley after Bright Spark and reconcile existing numbers and route copy. Convert review bookmarks to redirects. The current public catalogue has not been changed by these drafts.
