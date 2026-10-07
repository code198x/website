# Reuse completed WASM bundles

Status: reuse approved by the owner on 7 October. The owner also approved the official
GitHub cache action under the dependency rule.

The dependency-cache trial still spent 5m42s building players on its warm run.
Most of the cost remains when only website content or CSS changes.

## Design

Keep the current build pipeline and independently cache its three outputs:
Play198x's Node decoder, Asm198x's NES browser assembler and Emu198x's complete
browser-player distribution. Use exact matches only. A miss follows the existing
build and validation path. A hit verifies the restored files before use.

A bundle identity covers the checked-out source commit, actual Rust compiler and
wasm-pack versions, runner platform, website build scripts and workflow, relevant
build environment, and the validated Spectrum firmware digest for players.
Website page/content changes do not invalidate tool bundles. Source checkouts
must be clean. Raw firmware stays outside cached directories.

Seal successful build outputs with a manifest of their file hashes and identity.
Require a non-empty, complete distribution, valid WASM headers and matching source
metadata. Reject missing, changed or mismatched restored files before publishing;
never substitute a near-match bundle. Store only successfully validated builds.
Keep inexpensive distribution and assembler execution checks on hits as well as
misses. The full source builder's parity checks run when producing a new bundle.

## Work

1. `scripts/wasm-bundle.mjs`: fingerprint, seal and verify helpers/CLI. Add focused
   unit tests in `src/lib/wasm-bundle.test.ts` for changed input identity, corrupt
   or incomplete output, empty manifests, unexpected files and source mismatch.
2. `.github/workflows/deploy.yml`: independent restore/build/verify/save flows.
   Keep Rust dependency caches on misses and skip player native-package setup
   on a verified bundle hit. Preserve daily builds and feed/deploy ordering.
3. `README.md`: document cache scope, invalidation and recovery.
4. Run unit/content checks and a production build. Exercise a restored copy of
   real local outputs and a deliberately corrupted copy. Inspect hosted CI and
   cache population, then a repeat deployment: prove exact bundle hits, skipped
   compilation, retained validation and current published artefacts. Record
   source revisions and timings, including any concurrent upstream changes.

No new bundle registry or cross-repository publishing workflow. No new npm
package. The workflow action is the only proposed new dependency.

## Local verification

- 224 unit tests pass, including 37 bundle identity/integrity checks.
- `npm run check` and the production build pass with the real decoder supplied.
- Built-site verification finds all 30 system stages and checks 90 lesson pages.
- Copies of the real decoder (7 files) and assembler (4 files) seal and verify;
  deliberately corrupted WASM copies fail. The older local player distribution
  is correctly refused because its build metadata records modified source.
- Workflow parsing confirms exact restore/save keys, unconditional verification,
  and cache saves only after a successful site build. Hosted population and
  repeat-run timing remain to be checked after merge.
