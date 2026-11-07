# Hardware illustrations

The model renders are editorial images, embedded directly in the twenty-five system
page openings and their matching Vault system articles. The shared image index
at `/systems/models/` provides alternate keyboard, rear and top views. There is
no interactive 3D viewer or mesh download.

`src/data/hardware-models.ts` owns names, variants, views, alt text and credits.
`ModelIllustration.astro` renders a responsive image with a short caption and
an enlargement link. Its optional `view` prop selects a detail image for an
article; `showViews` adds alternate-image links in the shared index. Every
image and link works without JavaScript.

## Publication assets

`public/images/models/` contains WebP images at 640, 1280 and 1920 pixels,
with dimensions and SHA-256 hashes in `provenance.json`. These are checked-in
publication media; normal website builds need neither Blender nor the family
asset library. Original CAD, Blender documents and reference photographs remain
unchanged in the asset library.

Regenerate with ImageMagick installed:

```sh
python3 scripts/models/prepare-images.py /path/to/198x
```

`scripts/models/sources.json` identifies each retained render. A source can
supply an explicit pixel crop; the C64 front view uses this to bring the machine
closer while keeping the complete case visible. Otherwise alpha borders are
trimmed with breathing room, and opaque studio framing is retained.

The Spectrum comes from `solidcraft-issue3b-case/portraits/`: the shallow front
base with returned faceplate. Preparation checks the render receipt against
the current native model and the source image hash, rejecting stale exports.

## Credits and scope

The C64 keycap typeface is Levente Szabadkai's
[CC0 keyboard font](https://github.com/szabadkai/c64-keyboard-font).
Game Boy shell references include
[Wesk's Unlicense scans](https://bitbuilt.net/forums/threads/dmg-gameboy-scan.4479/).
Credits appear beside the relevant images. Existing source provenance and
rights remain authoritative; publication assigns no new blanket licence.
User-supplied eBay photographs are comparison references and are not published.
The illustrations contain estimated details and are not manufacturing drawings.

Run the normal type, content and build checks, plus
`playwright test tests/hardware-models.spec.ts --workers=1`. Inspect the system
and Vault openings at desktop and phone sizes when changing image framing.


The approved second and third groups add BBC Micro Model B, UK-keyboard ZX81,
overseas Master System I, brown-key VIC-20, Acorn Electron and Atari 800XL.
Each supplies a front, detail and top view. The Atari 8-bit Vault article uses
an explicit `vaultSystem` association; its caption identifies the illustrated
800XL rather than implying that it depicts the original Atari 800.

Sources with a `receipt` bind the selected image to its qualified native model,
review and renderer inputs. Preparation rejects changed native files, images or
source inputs. The BBC/ZX81/Master System inputs use the approved case-profile
checkpoints; VIC/Electron/800XL use the fitted lettering/material checkpoints.
The VIC-20 uses the same credited CC0 keycap typeface as the C64. No reference
photographs or local library paths are added to the public image provenance.

The CPC 464 and original short-case Atari 520ST use their approved photo-guided
profile renders. Each adds front, keyboard, top and low-angle views. Their
case radii and key profiles remain illustration estimates. The public images
contain reconstructed artwork; comparison photographs are not distributed.


The console group adds the Japanese HAA-2500 Mega Drive Model 1, PAL SNES and
six-switch light-sixer Atari VCS. Each supplies front, top, controls and rear
views; the SNES also has a low-angle view of its inset base. The SNES uses the
accepted shallow rear-fin checkpoint, with a continuous raised deck. Their
captions identify these variants rather than implying every regional version
looks the same. The console artwork is reconstructed; reference photographs
are not distributed.


The next nine first-pass illustrations add Game Gear, Neo Geo AES, Vectrex,
Commodore 128, Oric Atmos, Toshiba HX-10, Thomson MO5, Mühlhausen KC85/3 and
Sharp X68000 CZ-600C. All have system openings and gallery entries; five also
have existing Vault system articles. The MSX caption identifies the HX-10 as
one implementation of the standard. The KC85 directory alias covers a broader
family; the illustration specifically depicts the Mühlhausen KC85/3. The AES,
Vectrex, KC85/3 and X68000 captions identify main-unit-only scope.

These first passes retain estimated details and reconstructed lettering. The
MO5 uses low rubber keys; the C128, Atmos and HX-10 use tapered mechanical caps.
The source receipts select the accepted first-pass checkpoints, including the
corrected Vectrex badge and fitted C128/HX-10 keyboard beds. The 27 added views
supply 81 responsive WebP files; reference photographs remain excluded.
