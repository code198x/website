# Meet BASIC opening review

Three lesson drafts for the agreed opening arc:

1. **Make the Spectrum answer:** immediate instruction, numbered program, insertion,
   replacement, listing and editing.
2. **Remember a name; keep the program:** assignment, strings, output punctuation,
   changing a value, an intentional diagnostic, and saving/recovering work.
3. **Ask, then use the answer:** replace the fixed name with `INPUT`, combine three
   answers into a sentence, and investigate empty and long answers.

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

Previous/next links, the lesson list and links between draft lessons stay within
`review/`, including when the entry URL has no trailing slash. The overview button
returns to the review lesson list. The breadcrumb explicitly labels the exit to
the published BASIC track.

The route returns no paths for production builds. The drafts are outside the
curriculum content collections and catalogue. They neither replace existing unit
URLs nor appear in the public curriculum, sitemap or search index.

## Ready for review; not ready to publish

The target-side checks pass through Emu198x Spectrum MCP: seven checkpoints,
keyboard editing, an intentional variable error, real BASIC SAVE, TAP export,
fresh-process loading, listing, running and a further edit. The four A1/A2 captures were inspected against those checkpoints. A3 adds two
complete checkpoints and six input scenarios, with 20 named prompt/output checks
in `verification/input-results.json`; its story capture was visually inspected. Specific Foundations links
support instructions, order, variables and output without assuming attendance.

The desktop keyboard mapping was checked in source, **not exercised in the native
interface**. [Emu198x PR #1447](https://github.com/emu198x/emu198x/pull/1447)
implements Tape → Export Recording and has been built locally. A2 now describes
that export and the File → Open Tape Deck / LOAD / Play route. The obsolete
missing-command warning has been removed from the review wrapper.

The desktop export adapter passed a real-ROM SAVE and fresh-runtime reload test;
the rebuilt binary passed all 16 greeting keyboard/tape checks through MCP.
Native menu, file-picker, cancellation and message-dialog operation remain
unverified. Before publication, exercise the written route in that interface,
check the recovered listing/run/edit, and add the necessary interface captures.
[Emu198x #1446](https://github.com/emu198x/emu198x/issues/1446) remains open for
that acceptance check. Do not substitute a snapshot for a BASIC tape save.

Then resolve publishing identities and old URLs against the module's source mapping,
finish Story Builder with a setting, another event and readable presentation, and migrate the catalogues and affected links together.
These three drafts are not a replacement for all fifteen currently published units.
