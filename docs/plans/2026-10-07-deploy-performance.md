# Cache the missing Rust builds and measure

Status: approved scope, 7 October 2026. Extend the existing Rust cache approach;
completed-bundle caching and pipeline restructuring are outside this change.

## Baseline

Two successful website deploys spent most build time compiling browser players:

| Run | Player build | NES assembler | Decoder | Site build |
| --- | ---: | ---: | ---: | ---: |
| 37629284216 | 223s | 18s | 5s | 34s |
| 37631782518 | 373s | 28s | 8s | 60s |

The workflows cache Play198x's standalone web crate, but not Emu198x's workspace
or Asm198x's standalone web crate. Every step runs sequentially. These two runs
show a bottleneck, not a stable performance range or a promised saving.

## Change and verification

1. Add independent `Swatinem/rust-cache@v2` entries in
   `.github/workflows/deploy.yml` for `asm198x-source/crates/asm198x-web` and
   `emu198x-source`, after their toolchains are available. Keep existing build
   commands and validation in place. Retain the existing Play198x cache.
2. Validate YAML and workflow expressions with available local tooling. Inspect
   target paths, cache keys and toolchain fingerprinting against the action's
   implementation. No added dependency or change to deployed runtime behaviour.
3. Merge after CI passes. Inspect the first deployment's cache-save logs.
4. Run the same website revision again; confirm actual restored caches, source
   revisions and successful output. Compare build, restore/save and whole-job
   times. Record results without attributing runner variation to the cache.

Cache misses must retain the complete build path. Cache hits must still run the
build scripts, including player validation. Do not cache a raw firmware file.

Implementation: separate cache keys for the standalone Asm198x web crate and
Emu198x workspace, placed after the corresponding toolchain setup. Both leave
`cache-bin` off to avoid restoring over installed tools. The existing action
fingerprints installed Rust toolchains, manifests and lockfiles. Its default
policy caches dependencies; workspace source still compiles. No final bundle is
reused and no build step is conditional on a cache hit.

Local verification: YAML parses; keys are distinct; workspace manifests exist;
cache placement follows toolchain installation and precedes each unconditional
build. `git diff --check` passed. Actionlint is not installed; hosted workflow
validation and actual restore/save/build logs provide the remaining evidence.

Sources: the action's [inputs](https://github.com/Swatinem/rust-cache/blob/v2/action.yml)
and [key construction](https://github.com/Swatinem/rust-cache/blob/v2/src/config.ts).
