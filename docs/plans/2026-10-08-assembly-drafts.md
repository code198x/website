# Preserve assembly experiments in the browser

Approved as assessment F7 in the umbrella assessment-fixes plan before work.
The existing editor lost source and companion edits when a lesson reloaded
or a reader followed a link. Download buttons were also optional.

## Implemented

- `src/lib/assembly-draft.ts` stores source and companions together under a
  lesson/source key, with a separate SHA-256 starter revision. Recovery needs
  an explicit restore or discard; the complete draft can be downloaded first.
- `src/components/AssembleAndRun.astro` offers source/companion downloads on
  every editor, locks editing until recovery is ready, and removes navigation
  handlers when Astro swaps the page. Revert clears the draft only after all
  original files have been restored.
- Changed starters warn before restoring. Changed companion names and invalid
  records stay downloadable without silently applying or overwriting them.
- Failed storage warns and guards ordinary reload and Astro navigation through
  the browser's native beforeunload prompt. Astro cancellation falls back to
  full navigation; it does not itself cancel the link.
- A second tab's newer record is detected before writing. Local drafts are
  recovery, not a permanent backup; downloads remain the reader's durable copy.
- The first assembly lesson explains browser recovery. The release gate now
  includes `tests/assembly-draft.spec.ts` alongside the working learner journey.

## Verification

Seven browser scenarios run on desktop and mobile: pre-initialisation form
restoration; reload/export/restore/revert; navigation with companion edits;
changed starter; unreadable record; changed companion names; unavailable
storage with cancelled reload and cancelled client navigation.

The deterministic form-restoration regression failed before the correction:
a value restored into a textarea before scripts ran became the supposed
original. The fix compares against `defaultValue` and saves any existing
edit on initialisation. The retained red output proves this assertion fails
against the faulty code.

Final `npm run check:release`: **442 browser tests passed**, 2,448 built pages,
16,450 unique offline links, zero broken links. This includes the learner
journey, diagnostics, accessibility and existing player/editor checks. The
build used the matching F1 sample revision `48d4a629` and existing Play198x
WASM. No dependency or service was added.

Compressed full output and the failing regression are retained in
[`2026-10-08-assembly-drafts/`](2026-10-08-assembly-drafts/).
