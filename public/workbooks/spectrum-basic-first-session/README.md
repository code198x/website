# Spectrum BASIC first-session workbook

Version 0.1, 17 October 2026. A classroom pilot adapted from the maintained first-session activity: predict the result, change a greeting, compare the output and keep a recoverable readable source copy. The optional line-order experiment uses the complete text editor, not direct Spectrum line entry. This edition makes no claim of classroom trials, age suitability, fixed completion time or syllabus alignment.

## Editions and editable sources

- `learner.pdf`: four A4 pages, including response space and an optional extension.
- `teacher.pdf`: three A4 pages with preparation, hints, expected results and reuse notes. Keep this separate when distributing the learner edition.
- `src/pages/try/workbook/learner.astro` and `src/pages/try/workbook/teacher.astro`: semantic HTML editions and printable sources, served at `/try/workbook/learner/` and `/try/workbook/teacher/`.
- `workbook.css`: shared screen and print styles. The printable edition uses black text on white paper, Nebula Sans for reading and JetBrains Mono for listings. HTML editions remain available for on-screen reading and enlarged text.
- `sources.json`: source URLs, source revisions, exact starting listing and SHA-256. `pdf-manifest.json` records the generated PDF hashes, byte counts and authored page counts.

The starting listing comes from [the code-samples repository](https://github.com/code198x/code-samples/blob/51297ac3196a990286b0d21a4dedd4653c0168f0/sinclair-zx-spectrum/basic/meet-basic/opening/unit-01/steps/step-04.bas). The maintained [BASIC activity](https://code198x.com/try/spectrum-basic/), [lesson](https://code198x.com/systems/sinclair-zx-spectrum/basic/meet-basic/unit-01-make-the-spectrum-answer/) and [first-session companion](https://code198x.com/try/parents-and-teachers/) supply the teaching and tool workflows. Check those sources before updating a command, control name or expected result.

## Rebuild

Use the website’s existing supported Node/npm environment, dependencies and Playwright Chromium installation. No separate PDF dependency is required. Run commands from the website repository root.

First build the HTML sources:

```sh
npm run build
```

In a second terminal, serve that build:

```sh
npm run preview -- --host 127.0.0.1 --port 4466
```

With the preview running, generate both editions:

```sh
node scripts/build-first-workbook.mjs --base-url http://127.0.0.1:4466
```

The script loads the HTML editions, waits for workbook fonts, checks each authored sheet for overflow, rewrites internal PDF links to the public site and requests tagged PDFs with outlines. It writes both PDFs and the manifest in this folder. Tags alone do not establish accessible reading order.

Rebuild the website again so `dist` contains the newly generated files:

```sh
npm run build
```

Stop the task-owned preview when finished. Review the generated PDF changes alongside their HTML/CSS sources before committing.

## Check an updated edition

Inspect all seven rendered pages, not only the HTML or a successful generation message. Confirm A4 page size, four learner pages and three teacher pages, readable type, complete code, usable writing space, clear footer separation, black-and-white output and no clipped or split content. Check PDF text extraction, embedded fonts, reading order and working public links. Compare the manifest hashes with the actual files.

Check the initial listing against `sources.json` and its pinned sample; verify the teacher’s predicted output and renumbering explanation against the runnable lesson. Test edited output, tape download and reopening the learner’s own saved text after reloading the lesson. The current editable browser panel has no tape file picker; tape images can be loaded by an emulator with tape-loading controls. Update the version/date and source record when content changes. Retain HTML alternatives and separate teacher answers. After publication, download the served PDFs and compare their hashes with the reviewed files.

## Reuse

Original and adapted prose: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Credit Code Like It's 198x, link the source and licence, and indicate changes. Code samples: MIT; retain `CODE-LICENSE.txt`. These grants do not cover third-party assets or project marks. The pilot does not bundle third-party imagery.
