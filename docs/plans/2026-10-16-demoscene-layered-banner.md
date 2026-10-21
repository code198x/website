# Layered Demoscene opening

Steve approved the full-bleed Spectrum/C64/Amiga concept and asked for implementation.
This is a scoped exception to the paper-led, defined-container composition in
umbrella `decisions/family-visual-identity.md` §7: the Demoscene opening artwork
runs to the viewport edges, while reading content and navigation keep the shared
frame. The approved original artwork is an illustration, not machine evidence;
it is labelled accordingly and does not replace the verified production capture.
No looping motion or parallax; no dependency changes.

1. Produce distinct background, transparent chrome title and transparent dancer
   assets under `public/images/demoscene/`, based on the approved concept. Record
   generation prompts, origin, processing, hashes and dimensions alongside them.
   Use existing Sharp for delivery encoding only; image editing uses imagegen.
2. Add `src/components/DemosceneBanner.astro` and insert before the existing
   introduction in `src/pages/demoscene.astro`. The artwork has a text equivalent;
   images are decorative. Recompose the independent layers for narrow screens.
   Preserve the existing State of the Art feature and directory links.
3. Extend `tests/section-openings.spec.ts` to assert the banner spans the viewport,
   its three layers load, the title remains within bounds, no document overflow,
   a single accessible h1 survives image failure, and existing links still work.
4. Run checks/build and built-site browser checks at desktop, Pixel 7 and 320px.
   Capture complete opening and page context, check accessibility, run the design
   detector once, and obtain the required independent finish/documentation reviews.
5. Commit and push to PR #808, update its description/evidence, preserve unrelated
   files, and remove the task worktree and owned preview after remote retention.

## Verification and review

- Production build: 2,459 pages / 40 frame families, search indexing complete.
- Unit suite: 33 files, 239 passed / 9 skipped (248 total). Content, imagery,
  Vault links and prepared browser-tool checks pass.
- Twelve built-site browser checks pass, including banner geometry at
  320/390/768/1440/1920px, existing capture geometry, image-hidden heading/link
  access, Craft's legal choices and client navigation.
- Six desktop / Pixel 7 / 320px captures in light and dark settings: zero scoped
  axe violations and zero document overflow. Phone layers are recomposed rather
  than cropping the whole composition. The incumbent paper theme is unchanged.
- Detector: no findings. Prompt scan: six rasters, zero missing. WebP dimensions,
  alpha, bytes and hashes are in `public/images/demoscene/provenance.json`.
- Independent full visual finish review: `ship`, no material fixes, all twelve
  opening/context captures valid. It judged the supplied plan and approved comp
  for this narrow extension; no new-world build state/spec was created.
- Independent read-only documentation handoff: ordinary extension, no blocking
  gap and no shared design-file update required. Existing stale typography
  comments remain outside this task.

Initial environment failures were resolved before the final verification:
`ENOENT` for the prepared NES lesson `screen.asm` and sibling
`typein-198x-c64.bas` inputs required the existing prepared assets and sibling
source link in the isolated checkout. The first temporary HTTP server produced
`net::ERR_CONNECTION_RESET` for image/style requests during parallel checks;
the unchanged checks pass against normal Astro preview. The initial browser
failures demonstrate that missing layers and incorrect capture bounds fail the
checks. The final server and all task-owned build inputs are removed at cleanup.
