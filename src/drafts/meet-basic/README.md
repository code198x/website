# Meet BASIC opening review

Four lesson drafts for the agreed opening arc:

1. **Make the Spectrum answer:** immediate instruction, numbered program, insertion,
   replacement, listing and editing.
2. **Remember a name; keep the program:** assignment, strings, output punctuation,
   changing a value, an intentional diagnostic, and saving/recovering work.
3. **Ask, then use the answer:** replace the fixed name with `INPUT`, combine three
   answers into a sentence, and investigate empty and long answers.
4. **A story worth sharing:** add a place and another event, clear the display,
   arrange the story and save a named copy.

They use complete sources from [sample PR #6](https://github.com/code198x/code-samples/pull/6) in the sibling code-samples repo at
`sinclair-zx-spectrum/basic/meet-basic/opening/`, with a keyword-entry verification
driver and recorded results. The source README owns execution details and limits.

## Review locally

Check out the corresponding `curriculum/meet-basic-opening` branch in code-samples
beside this website, or set `CODE_SAMPLES_PATH` to that checkout. Start `npm run dev`.
The review routes are:

- `/systems/sinclair-zx-spectrum/basic/meet-basic/review/unit-01/`
- `/systems/sinclair-zx-spectrum/basic/meet-basic/review/unit-02/`
- `/systems/sinclair-zx-spectrum/basic/meet-basic/review/unit-03/`
- `/systems/sinclair-zx-spectrum/basic/meet-basic/review/unit-04/`

Previous/next links, the lesson list and links between draft lessons stay within
`review/`, including when the entry URL has no trailing slash. The overview button
returns to the review lesson list. The breadcrumb explicitly labels the exit to
the published BASIC track.

The route returns no paths for production builds. The drafts are outside the
curriculum content collections and catalogue. They neither replace existing unit
URLs nor appear in the public curriculum, sitemap or search index.

## Approved opening lessons; publication pending

Steve reports testing and approving revised units 1–3, and explicitly confirms the
host-keyboard fix works well in native use. This is user-reported acceptance,
separate from the automated evidence below.

The target-side checks pass through Emu198x Spectrum MCP: seven checkpoints,
keyboard editing, an intentional variable error, real BASIC SAVE, TAP export,
fresh-process loading, listing, running and a further edit. The four A1/A2 captures were inspected against those checkpoints. A3 adds two
complete checkpoints and six input scenarios, with 20 named prompt/output checks
in `verification/input-results.json`; its story capture was visually inspected. Specific Foundations links
support instructions, order, variables and output without assuming attendance.

The drafts use Host Keyboard mode from
[Emu198x PR #1448](https://github.com/emu198x/emu198x/pull/1448), built locally.
Characters use the host layout; the ROM still interprets keyword keys. Home is
EDIT, with Original Keyboard mode available for target shift combinations.
Automated checks cover the host-character adapter through the 48K ROM and shared
held-key/release behaviour. Native host-keyboard use is confirmed by Steve; other host layouts are not
covered by that report.

[Emu198x PR #1447](https://github.com/emu198x/emu198x/pull/1447)
implements Tape → Export Recording and has been built locally. A2 now describes
that export and the File → Open Tape Deck / LOAD / Play route. The obsolete
missing-command warning has been removed from the review wrapper.

The desktop export adapter passed a real-ROM SAVE and fresh-runtime reload test;
the rebuilt binary passed all 16 greeting keyboard/tape checks through MCP.
Acceptance of the revised units does not establish separate coverage of every
file-picker cancellation or error-dialog case.
[Emu198x #1446](https://github.com/emu198x/emu198x/issues/1446) tracks the export fix. Do not substitute a snapshot for a BASIC tape save.

A4 is ready for reader review; its two complete checkpoints finish Story Builder.
Its ROM verification driver checks the edits from A3, output layout, changed,
empty and long answers, and a fresh-process tape reload. See the sample evidence
for the tested binary and limits. A4 has not yet received native reader acceptance.

Resolve publishing identities and old URLs against the module's source mapping,
then migrate the catalogues and affected links together. These four drafts are
not a replacement for all fifteen currently published units.
