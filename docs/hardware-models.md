# Hardware model publication

The shared gallery is `/systems/models/`. The Amiga, C64, Spectrum, NES and
Game Boy system pages also include their model. `src/data/hardware-models.ts`
owns their names, views, captions and credits.

Renders are the default. The viewer and its GLB download load only after
**Explore in 3D** is selected. Alternate images and full-size image links work
without JavaScript. The 3D view has touch, mouse, keyboard and button controls,
and returns to images if loading or WebGL fails. Only one renderer is active
per page; leaving the page releases it. Rendering happens on changes rather
than in a continuous animation loop.

## Publication assets

`public/images/models/` contains responsive WebP renders at 640, 1280 and 1920
pixels. `public/models/` contains separate, compressed display meshes. Both
directories include SHA-256 provenance manifests. These are checked-in
publication media: normal website builds need neither Blender nor the family
asset library.

Original CAD, Blender documents, source meshes and reference photographs stay
in the umbrella asset library. The website exports do not modify them. The
web meshes use simplification and quantisation and are illustrations, not
manufacturing geometry. Public manifests omit authoring paths and private
metadata.

## Regenerate

From this repository, with ImageMagick and Blender installed:

```sh
python3 scripts/models/prepare-images.py /path/to/198x
blender --background --factory-startup --python scripts/models/export-special-models.py -- --library /path/to/198x --output /tmp/code198x-model-exports
node scripts/models/prepare-web-models.mjs /path/to/198x /tmp/code198x-model-exports
```

`scripts/models/sources.json` identifies accepted render inputs. The mesh
preparer identifies the accepted Amiga, C64 and NES GLBs. Blender exports the
Game Boy's complete exterior with its lettering and the Spectrum's selected
exterior OBJ. The Spectrum reference motherboard is excluded. OBJ material
colours are converted from sRGB to linear values before GLB export to match
the portrait renderer.

The optimiser uses pinned glTF Transform and Meshoptimizer packages. It merges
draw calls, preserves borders when simplifying, and uses 16-bit positions and
12-bit normals. Thin printed artwork receives a depth offset in the viewer so
it remains visible against its backing surface. After any export change,
compare source and compressed meshes in the same viewer and inspect key
legends, artwork, ports and silhouettes at useful zoom levels.

## Credits and scope

The C64 keycap typeface is Levente Szabadkai's
[CC0 keyboard font](https://github.com/szabadkai/c64-keyboard-font).
The Game Boy shell references include
[Wesk's Unlicense scans](https://bitbuilt.net/forums/threads/dmg-gameboy-scan.4479/).
Both credits appear beside the relevant model. Existing asset provenance and
rights remain authoritative; this publication does not assign a new blanket
licence to the library. User-supplied eBay photographs are comparison
references and are not published as gallery media.

## Verify

Run the normal type, content and build checks, then
`playwright test tests/hardware-models.spec.ts --workers=1` against the local
site. The tests cover deferred downloads, every model, controls, recovery,
system-page links, no-JavaScript access and accessibility at desktop and mobile
sizes. Inspect desktop, tablet and phone screenshots as well: passing interaction
tests does not establish visual fidelity.
