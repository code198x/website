# Hardware illustrations

The model renders are editorial images, embedded directly in the five system
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
