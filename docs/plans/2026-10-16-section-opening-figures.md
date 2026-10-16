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

The Craft figure is independently releasable. The Demoscene placement remains
pending a verified capture; it must not publish an unresolved image URL.

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
- Installed FS-UAE 3.2.35 is the proposed independent check, configured as PAL
  A500, 68000, 1 MiB Chip RAM, no slow/fast RAM, Kickstart 1.3, host sound off,
  raw full-frame screenshots. The bounded launch was stopped. Desktop access
  reported a locked Mac; a verified capture still needs an unlocked session.

The Demoscene figure's exact script, final frame and output dimensions must be
recorded in its capture manifest when a suitable frame is obtained. No third-
party screenshot, inferred dancer frame, animation or audio has been substituted.

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
