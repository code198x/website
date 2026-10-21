# Craft and Demoscene opening figures

Approved scope: #805, with the Craft portion shared with #806. Preserve the
existing page frame, typography, section links and planned/published distinctions.

1. Add `src/components/CounterChoices.astro`: derive seven counters and the two
   legal next states (six and five) from the same values, with a complete text
   equivalent. Place it beside `src/pages/craft.astro`'s introduction, stacking
   below on phones. Link the figure to the existing paper activity.
2. Capture one frame of the published *State of the Art* ourselves. Record dump
   hash, emulator revision/configuration, exact script, image dimensions, credit
   and the criticism/review basis in `capture/vault/demos-state-of-the-art.json`.
   Publish only the PNG under `public/images/vault/demos/state-of-the-art/`.
   Do not treat a third-party screenshot's licence as permission for the demo.
3. Add a captioned feature below the introduction in `src/pages/demoscene.astro`,
   linking to the existing reviewed Vault article and explaining the visible
   shapes/background. No animation, audio, media download or global heading change.
4. Update #806 to mark its Craft figure delivered by this work, retaining its
   byte-order and bitmask work. Record evidence in #805/PR.

Verify the generated counter counts and legal transitions, accessible names,
figure links, capture provenance and successful image loads. Inspect both routes
at desktop and phone widths in both themes. Run imagery/link checks, existing
relevant browser tests and the production build. Commit and push the scoped work
and create a PR. Preserve unrelated files in the primary checkout. Remove the
task worktree and build cache after its commits are verified on the remote.

## Delivery and capture checks

Both approved openings are implemented. The Demoscene feature uses one verified
own capture, with the exact disk identity and manual capture method recorded in
`capture/vault/demos-state-of-the-art.json`.

Reuse review, 16 October 2026:

- The Commons record for `File:State_of_the_Art_-_Spaceballs_2.png` labels its
  screenshot CC BY-SA 4.0, credits Spaceballs, and records an upload by Aeroid.
  It does not show a separate rights-holder permission record. This file was
  not downloaded or used. The family's `capturing-published-software.md` and
  `publishing-third-party-imagery.md` require our own frames rather than online
  screenshots; credit alone is not permission.
- The published production is *State of the Art*, Spaceballs, 29 December 1992,
  Commodore Amiga. The existing reviewed Vault article and
  https://demozoo.org/productions/2/ identify it. No open licence or specific
  permission for the underlying demo was established. A proposed frame relies
  on the existing criticism/review policy, with named acknowledgement and a
  caption explaining the shapes it shows, not on a claim of public domain.
- The original release disk used for the attempted capture is
  `State of the Art (1992-12-29)(Spaceballs)[TP2#1].adf`, 901120 bytes,
  SHA-256 `470e74457065b38db660c1f6286e5600c6433b42f63f99f832f7d9a07c6a8a64`.
  The disk and firmware are not part of this repository or publication.
- Emu198x revision `6cc5d5f9e7fe6507a079f237bc44da0dc95fe25c` was built with
  `cargo build -p emu198x-amiga --no-default-features --release`. Both A500+
  (ECS, 1 MiB Chip RAM) and A2000 (OCS, 1 MiB Chip RAM) profiles used PAL and
  Kickstart 1.3. The former produced identical opening-hand frames at 1800,
  2400, 3000 and 3600 frames. The latter remained on that opening at 3600.
  These runs do not verify the requested dancer/background frame. No emulator
  changes or state patches were made to manufacture it.
- The original disk also stopped during its introduction in FS-UAE 3.2.35.
  The held memory-compatible release ran through the dancers successfully using
  PAL A500, 68000, 1 MiB Chip RAM, no slow/fast RAM, Kickstart 1.3 and muted host
  volume. A replay was paused on a raised-arm dancer pose and saved through
  FS-UAE's raw full-frame screenshot command. The 752×572 PNG contains no window
  chrome, pause icon or notification. It is copied unchanged into the site.
- The final disk is `State of the Art (1992-12-29)(Spaceballs)[f mem SR][TP2#1].adf`,
  SHA-256 `6eb968f6b97f22ed49322d99f7b142242fea458f82fcb91eff40ba52e6b4d703`.
  This is identified as a compatible release, not claimed to be the original
  disk. The displayed artwork is credited to TMB Designs.

The configuration template, manual action sequence, raw capture filename,
firmware hash, image hash and dimensions are recorded with the manifest. The
selection is manual, not a deterministic frame-number replay. The public image
hash matches the raw emulator PNG. No third-party screenshot, inferred dancer
frame, animation, audio, disk or firmware is substituted or published.

## Craft verification

- 33 Vitest files / 248 tests pass; content, imagery, Vault links and prepared
  browser assembler/player checks pass.
- Production build passes: 2,459 public pages, 39 shared-frame rendering families,
  search index complete.
- Eight built-preview browser checks pass across desktop and Pixel 7 profiles,
  including both theme requests and existing menu navigation. The kit currently
  deliberately uses paper for dark requests; no new dark theme is introduced.
- The count/transition/activity regression fails on unchanged production with
  `expect(locator).toBeVisible() failed` / `element(s) not found`, then passes on
  the new build.
- Scoped axe analysis reports zero violations. The detector's
  `border-accent-on-rounded` warning confuses the circular counter CSS with the
  containing figure: its computed border radius is `0px`.
- The preview reported Astro 7.4.0 available; the project remains on its existing
  7.2.9 installation. Dependency changes are outside this task and need approval.
- Independent Impeccable finish review: `ship` for the Craft opening, with no
  material fixes. The review covered all four complete opening captures and
  their full-page context. Demoscene is explicitly outside that disposition.
- Documentation handoff confirmed an ordinary extension using existing text,
  surface, spacing and accent tokens. No design documents or token sidecars
  changed. It recorded pre-existing pink Craft accents beside rust project
  furniture and incumbent eyebrows; neither is repaired in this scope.

## Demoscene verification

- Clean-checkout checks pass: 33 Vitest files / 248 tests, all imagery (16 images
  across 10 manifests), Vault links and prepared browser tools. The final build
  verifies 2,459 public pages across 39 rendering families and completes search.
- Ten built-site browser checks pass across desktop and Pixel 7 profiles. The
  capture's source dimensions, proportions and actual feature/column bounds are
  checked at 320, 390, 900 and 1440px; both theme requests and existing navigation
  are also covered.
- An additional range check found 16px overflow at 320px before correction:
  shared Figure selector specificity overrode the local constraint, and `1fr`
  retained a 320px intrinsic minimum inside a 288px slot. The scoped selector and
  `minmax(0, 1fr)` correction now produce zero overflow at 320, 390, 850, 900 and
  1440px. Rendered image widths are 288, 358, 376, 376 and 376px respectively.
- Final screenshots and scoped axe checks cover desktop, Pixel 7 and 320px in
  both theme settings: no violations, full image and caption visible, proportions
  intact. The default 376×286 display grid is detected from the raw 752×572 PNG.
- Independent full finish review: `ship` for the Demoscene feature. A subsequent
  verdict pass scored the narrow sizing correction resolved and returned `ship`
  at that scope. The ordinary-extension documentation handoff preserves existing
  design files and records no new visual system or dependency.
