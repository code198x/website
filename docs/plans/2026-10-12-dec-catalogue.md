# DEC systems catalogue — issue #394

Add PDP-1, PDP-8 and PDP-10 as reference-only systems. Use the existing
catalogue and page templates; do not add lessons, emulator support or dependencies.

## Evidence and choices

- DEC's *DIGITAL Computing Timeline*, updated 2 February 1998, records the
  PDP-1 prototype demonstration in 1959 (first delivery in 1960), PDP-8
  introduction in 1965 and PDP-10 debut in September 1967:
  https://archive.computerhistory.org/resources/text/DEC/dec.digital_(DEC)_timeline_1957-1997.102630354/timelinetext.htm
- DEC's PDP-1 Handbook (F15D, October 1963), Small Computer Handbook (1970)
  and PDP-10 Reference Handbook (1969) establish the 18-, 12- and 36-bit
  architectures. Cite the public originals in the records.
- Use `dec-pdp-1`, `dec-pdp-8` and `dec-pdp-10` system identifiers, matching
  the family naming convention. CPU families are `pdp-1`, `pdp-8`, `pdp-10`.
- Add `minicomputer` for PDP-1/PDP-8. Use the existing broad `computer` type
  for PDP-10, the larger timesharing system. All three use `tier: beyond`.
- The PDP-10's sourced 1967 debut refines the original issue's 1966 date.

## Steps

1. Extend the CPU-family, system-type and both word-size enums in
   `src/content.config.ts`. Add `src/content/manufacturers/dec.yaml`, three
   `src/content/architectures/pdp-*.yaml` records and three
   `src/content/systems/dec-pdp-*.yaml` records. Verify schema loading and
   manufacturer/architecture references through the build.
2. Link existing Vault passages and platform metadata in
   `games/colossal-cave-adventure.mdx`, `games/zork.mdx`,
   `techniques/game-loop.mdx` and `technologies/vector-graphics.mdx` to the
   new system pages. Preserve existing prose and sources. Check links and
   related-reading output.
3. Run the existing unit/content checks and production build. Inspect built
   data for all three word sizes, false support flags and reference-only
   status. Inspect the era/maker/region/availability listings and system
   pages at desktop and mobile widths; check links, overflow and absence of
   a misleading player/toolchain link. Confirm older systems remain listed.
4. Review the diff and record results. Keep existing unrelated untracked
   review files untouched. Stop task-owned servers and remove temporary
   inspection scripts/screenshots before finishing.

## Verification results

- `npm run check`: 218 tests passed, 9 skipped; content, link, NES assembler
  and browser-player checks passed. The platform-balance report remains advisory.
- `npm run build`: passed, including static output, redirect processing,
  page-frame validation and Pagefind. Vite reported its large-chunk warning:
  “Some chunks are larger than 500 kB after minification.”
- Built-site Chromium checks: 14 page/viewport combinations (three system
  pages and four catalogue views at 1440px and 390px), plus links on four
  Vault articles. Every catalogue view retains all 159 system records.
- Inspected screenshots for all three system pages at both widths and the
  filtered era/maker listings. No horizontal overflow or misleading emulator
  player/instruction-reference link. Related reading is present for each PDP.
- Catalogue metadata check: system and architecture word sizes agree;
  all three records are `beyond` with emulator/development flags absent.
- The first Chromium launch failed under the macOS sandbox. The permitted
  retry exposed a case-sensitive test assertion against the uppercased
  status label; correcting that assertion allowed the check to pass.
- No dependency or template changes. Existing unrelated review files remain
  untouched. This records local implementation and verification, not deployment.
