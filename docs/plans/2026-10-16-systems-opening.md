# Systems: a wider machine landscape

Steve approved the layered photographic Systems composition, explicitly asked
for systems beyond current curriculum coverage, and approved verified public-domain
or openly licensed hardware photographs with recorded credits. Update the umbrella
imagery policy narrowly to reflect this source exception; no scanned publication
artwork or unverified online images become decorative assets by analogy.

1. Verify source file identities, authors, public-domain/open licence evidence and
   intended processing for three additional machines. Retain source records and
   hashes; use existing approved Spectrum/C64/Amiga/NES photographs alongside them.
   Review TOSEC-PIX as reference material, without bulk copying or republishing scans.
2. Add `src/components/SystemsOpening.astro` and a source/credit record under
   `src/data/` and `public/images/systems-opening/`. Use real photographs and live
   Fira Sans Condensed title text. Compose independent layers at the page edges;
   recompose for phones. Artwork goes full bleed on `/systems/` only, with the
   directory, navigation and lesson/planned distinctions unchanged.
3. Integrate with `src/pages/systems.astro` and `src/components/FleetBoard.astro`
   without duplicating the h1 or changing other catalogue views. Keep the existing
   introduction and direct catalogue jump. Make every machine identifiable and its
   source credit reachable. No new dependency, motion or invented hardware image.
4. Verify built page on desktop, Pixel 7 and 320px; image loads, heading hierarchy,
   keyboard links, reading order, no overflow, catalogue search/arrangements and
   existing route availability. Run content checks/build and relevant browser tests.
   Inspect one batched capture round, correct together, confirm once; independent
   finish and documentation handoffs required by the Impeccable skill.
5. Commit/push website work and create a PR, with the policy update retained in the
   umbrella repository separately. Preserve unrelated work; verify remote retention,
   stop the task preview and remove the task worktree and disposable build inputs.

## Approved scope and source record

This is an approved `/systems/`-only exception to the paper/defined-container
composition of umbrella `decisions/family-visual-identity.md` §7. The art reaches
viewport edges; the reading content, directory and navigation keep the shared
frame. It does not change the other three catalogue arrangements or establish a
new family-wide visual world. Existing design documents and sidecars stay intact.

Steve explicitly approved verified public-domain/openly licensed hardware
photographs in this chat. The narrow rule amendment is retained in umbrella
PR https://github.com/stevehill1981/198x/pull/175 , commit
`24e2d7da2b6a9a4ef41555fb0d0234a54512cbb8`. It does not widen rules for portraits,
software captures, scanned publication art or software shown on screens.

The selected set is Spectrum, C64, Amiga 500 Plus, NES, Atari 400, Acorn Electron
and Sony HB-10P MSX. The Atari 400 is identified as itself and links to the Atari
8-bit family route. The wider three do not gain lesson availability through their
presence in the artwork. TOSEC-PIX was checked as reference material; no scanned
publication pages were extracted for this composition.

The manifest records all file pages, authors, exact licences, delivery/source
hashes, dimensions and processing. New photos' exact SHA-1 values match Commons
imageinfo. The existing website copies contain extra metadata, so their file
hashes differ from the held originals; decoded RGB pixels were verified identical.
The held C64/NES/Amiga originals match current Commons SHA-1 records and their
file-level public-domain declarations were rechecked. No AI-edited hardware is used.

## Verification and independent handoffs

- Unit suite: 33 files, 239 passed / 9 skipped (248 total). Content, imagery,
  Vault links and prepared browser-tool checks pass.
- Production build: 2,459 public pages / 41 frame families, search complete.
- Eight browser checks pass across desktop and Pixel 7: one heading, seven loaded
  photos, viewport-width art, bounded headline/reading frame at
  320/390/768/1440/1920px, source/credit/licence links, image-hidden text, direct
  catalogue access, search/empty/reset, lesson/planned distinctions and maker view.
- The new opening check failed on unchanged production with
  `Error: element(s) not found` for `.systems-opening`, then passed on the build.
- Six light/dark desktop/Pixel 7/320px inspections: zero scoped axe violations
  and zero document overflow. Existing paper-only dark requests remain unchanged.
- One batched correction removed photo blend-through, clarified the Electron's
  placement and preserved whitespace in the accessible heading. Confirmation
  captures and unchanged behavioural checks pass.
- Detector: no findings. Fourteen delivery rasters have source-origin sidecars;
  provenance scan reports zero missing.
- Independent full visual finish review: `ship`, no material fixes. All twelve
  opening/page-context captures valid; seven-machine breadth and phone composition
  are accepted adaptations of the approved four-machine initial concept.
- Read-only documentation handoff confirmed an ordinary extension. Its requested
  scope/policy link, exact new-source SHA-1 evidence and verification record are
  now included here and in the manifest; no shared design files were changed.

Final combined regression: eighteen built-site browser checks pass across Systems,
Craft, Demoscene and navigation. The finished build's provenance JSON matches the
source record, and all fourteen published WebP hashes match their manifest entries.
The documentation reviewer rechecked the scope/policy/SHA-1 additions and confirmed
all documentation gaps resolved.
