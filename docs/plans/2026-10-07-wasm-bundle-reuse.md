# Reuse completed WASM bundles

Status: complete and deployed on 7 October. The owner approved reuse and the
official GitHub cache action under the dependency rule.

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

- 227 unit tests pass, including 40 bundle identity/integrity checks.
- `npm run check` and the production build pass with the real decoder supplied.
- Built-site verification finds all 30 system stages and checks 90 lesson pages.
- Copies of the real decoder (7 files) and assembler (4 files) seal and verify;
  deliberately corrupted WASM copies fail. The older local player distribution
  is correctly refused because its build metadata records modified source.
- Workflow parsing confirms exact restore/save keys, unconditional verification,
  and cache saves only after a successful site build.

## Hosted verification

Merged in [PR 650](https://github.com/code198x/website/pull/650) and
[PR 651](https://github.com/code198x/website/pull/651). PR 651 contains the full
verification record, source revisions and cache evidence.

| Deployment run | Runner image | Build job | Result |
| --- | --- | --- | --- |
| [37644644584](https://github.com/code198x/website/actions/runs/37644644584) | 20261004.327.1 | 6m23s | Built, validated and saved all three bundles. |
| [37645746608](https://github.com/code198x/website/actions/runs/37645746608) | 20260927.320.1 | 7m31s | Different runner image required different bundles. |
| [37647457724](https://github.com/code198x/website/actions/runs/37647457724) | 20261004.327.1 | 1m53s | Three exact cache hits; compilation and native package setup skipped. |

The same-image comparison saved 4m30s (70%) in the build job. Website and tool
source revisions were identical across these runs. This is one measured pair;
runner-image, source or build-input changes deliberately cause cache misses.
The earlier cancelled run is excluded. GitHub's publication delay is also
excluded from build-job timings.

The warm run checked all 116 cached files: 8 decoder, 6 assembler and 102 player
files. The assembler executed against the lesson cartridge, and player firmware
and save-container checks passed. The original build checked native/WASM parity
for 68 variants; 23 require additional local firmware.

After warm deployment, all 108 published assembler/player files matched the
original Pages artifact byte for byte, and every WASM module validated. Hidden
cache receipts are excluded from the Pages artifact, so the publication check
compared served payloads directly with the archive. Bundled Spectrum 48K firmware
remained enabled. All three deployment runs completed successfully.
