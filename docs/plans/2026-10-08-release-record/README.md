# Release evidence after the assessment fixes

The full local release command passed at website revision
`5f58ed008819341ed2cd354b1e38c0733fb3e50f` on 8 October 2026. This includes
the editor-focus correction discovered by the first run. The earlier failure
is retained under `../2026-10-08-editor-enhancement-focus/` and is not a pass.

## Inputs

`inputs.json.gz` records the inputs before the run. A second capture after the
command exited zero was byte-identical, including all asset hashes.

| Input | Revision or version |
|---|---|
| Website | `5f58ed008819341ed2cd354b1e38c0733fb3e50f` |
| Code samples | `be65631db11bac9127e85a76f448bef3806819a8` |
| 198x-ui | `7eda45e1c2f8b8f919359c971b2e210822e431f2` |
| Node / npm | 24.21.0 / 11.19.0 |
| Python | 3.14.3 |
| Pagefind / lychee | 1.5.2 / 0.24.2 |

All three source checkouts were clean. The record also contains their Git
trees, the package-lock hash, installed package versions, hashes of 1,460
prepared public files (players, assemblers, downloads, fonts and other assets)
and all seven files in the prepared Play198x Node decoder. Those hashes identify
the actual prepared assets used, independently of their sibling checkout state.

## Completed checks

The unchanged `npm run check:release` command exited zero. `release.log.gz`
retains its complete output:

- 227 unit tests in 31 files and seven announcement regression tests.
- Content checks, NES browser-assembler byte comparison and malformed-source
  rejection, and prepared browser-player checks.
- 2,448 public pages built and checked for shared page frames.
- 30 system player stages, browser modules and lesson media checked in the build.
- 444 desktop/mobile browser checks, including the full learner journey,
  accessibility, draft recovery, image decoding and player integration.
- 16,460 unique offline links, with zero errors; configured exclusions remain
  exclusions, not successful external-link checks.

`built-files.json.gz` records SHA-256 hashes for every file in the tested local
`dist/`. This binds the observations to that build. It does not claim that the
separate Pages deployment emitted byte-identical files or that automated
accessibility checks are a certification.
