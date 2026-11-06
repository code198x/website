# Hardware model gallery

User-approved direction: renders by default, optional interactive 3D, a shared
gallery and placement on each modelled system page. Preserve the established
House typography, palette and controls.

The first five models are the Amiga 500 with UK keyboard, Commodore 64
breadbin, Spectrum 48K, NES-001 and original Game Boy. The Amiga uses the
accepted special-key-fit checkpoint, and the C64 uses port-surrounds.
The accepted native model sources are unchanged.

The implementation shares one image/viewer component between the gallery and
system pages. Separate optimised web meshes total approximately 9.3 MiB; no
mesh or Three.js viewer is requested on initial page load. The Amiga download
is approximately 3.9 MiB versus a 37.1 MiB source GLB. These are display meshes,
with the original authoring geometry preserved in the family library.

Visual review compared the Amiga and Spectrum source exports with the web
meshes under identical browser lighting. It exposed an OBJ colour-space
mismatch and depth interference on the Spectrum artwork; both were corrected
in the publication pipeline/viewer. Gallery layouts were inspected at desktop,
tablet and phone widths.

Validation: 220 unit tests, 14 focused desktop/mobile browser tests, content
checks and production build. Type checking accepts the existing 73-error
baseline with no added errors. The focused browser suite includes axe checks
with both renders and 3D visible. Impeccable detection returned no findings;
the taste source lint accepts existing House dividers and outlined controls
with documented incumbent-design exceptions.

The rendered taste audit also records explicit exceptions: source attribution
is meaningful credit rather than a decorative eyebrow; paper colour and
section/footer rules belong to the existing House design; the gallery uses
visitor-controlled 3D rather than unsolicited motion or video. Its final
desktop screens contain the inherited footer, which the empty-screen heuristic
counts as sparse ground. Screenshot review confirmed the actual model grid is
populated. Design/usability/content are coherent with the existing site; the
mobile opening has a longer introductory scroll than desktop, with direct
model jump links to shorten it.

### Screenshot critique

ROUND 1

Seen in one second: the Amiga above its keyboard, beside the gallery title.
Idea (one sentence): a catalogue of recognisable physical machines that can
be examined as images or turned by the visitor.
Live thing: optional model rotation, zoom and alternate render views.
Layout words by section: opening=split / collection=grid / context=prose.
Scores: design 7 · usability 8 · creativity 7 · content 9 → overall 7.5.
Caps applied: restrained motion; the user explicitly chose renders and
optional 3D, so no replacement photographs or autoplay footage were added.
Top three problems (most visible first), each with the screenshot and fix:

1. Spectrum artwork breaks up in the initial 3D screenshot. Fixed the printed
   material depth offset and compared source/web exports in the same viewer.
2. Spectrum caps are washed out in the initial 3D screenshot. Fixed the OBJ
   colour conversion and reduced the viewer lighting intensity.
3. The phone opening places navigation before the first model image. Kept
   direct jump links for this five-model catalogue; this is a known difference
   from the desktop split opening, not clipped or missing content.

Unrelated files present before this task (`.impeccable/critique/`,
`.impeccable/review/`, `tests/site-review-evidence.spec.ts`) are excluded.
Publication assets, preparation instructions and credits are documented in
`docs/hardware-models.md`. This local implementation does not itself publish
the site or send an announcement.
