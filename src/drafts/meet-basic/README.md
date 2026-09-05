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
interface**. The saving explanation deliberately stops short of inventing a menu
operation: [Emu198x #1446](https://github.com/emu198x/emu198x/issues/1446) tracks the
missing desktop export of a recorded BASIC tape. The review wrapper makes this
blocker visible before a reader reaches the save section.

Before publication, verify the native keyboard/editor route and complete A2 with
actual destination-file, export, close/reopen and load instructions. Recheck that
an exported file survives closing, lists/runs in a new session and accepts an edit.
Add the necessary interface captures. Do not substitute snapshots silently.

Then resolve publishing identities and old URLs against the module's source mapping,
finish Story Builder with a setting, another event and readable presentation, and migrate the catalogues and affected links together.
These three drafts are not a replacement for all fifteen currently published units.
