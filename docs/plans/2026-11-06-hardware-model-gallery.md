# Hardware illustrations on Code198x

Use model renders as editorial images throughout relevant pages. Interactive
3D is deferred. Each of the five system pages and matching Vault system
articles uses its render in the opening. The shared `/systems/models/` image
index remains a secondary place to find alternate views.

The images show the Amiga 500 UK keyboard (special-key-fit), C64 breadbin
(port-surrounds), shallow-base Spectrum, NES-001 and original Game Boy. The
C64 front render is cropped closer without clipping its case. The Spectrum
receipt matches the current native document; the old tapered export is excluded.

A static `ModelIllustration` component supplies responsive images, captions,
credits and full-size links. The image index adds alternate-view links. These
work without JavaScript. No Three.js dependency, viewer controls, GLB downloads
or model-viewing sections remain. Original native models are untouched.

Validation covers system and Vault placement, image loading, absence of 3D
requests, alternate image links, no-JavaScript access and accessibility at
desktop and mobile sizes, alongside the normal type/content/build checks.

The production build, content checks and six desktop/mobile browser tests pass.
Type checking adds no errors to the existing 73-error baseline. Screenshot
review confirms the closer C64 framing and the system/Vault placements without
overflow. Source design detection reports no findings. The rendered audit keeps
the existing House palette, dividers, route cards, mobile introduction heading
and restrained image count; this task changes illustration placement rather
than the curriculum-page design.

Unrelated pre-existing `.impeccable/critique/`, `.impeccable/review/` and
`tests/site-review-evidence.spec.ts` remain excluded. Preparation and provenance
are documented in `docs/hardware-models.md`. This work does not publish the site
or send an announcement.
