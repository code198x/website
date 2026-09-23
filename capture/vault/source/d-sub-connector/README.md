# D-sub technical illustrations

Original Code198x geometry and vector artwork. No third-party meshes, photographs or textures.

`de9-male.blend` is the editable model: frame 1 assembled, frame 90 exploded. `build.py` recreates it with Blender 5.2.1. `technical_plate.py` projects the evaluated geometry and tests edge visibility to generate the labelled SVG. `export.py` extracts compact views for the Vault entry. SVG labels remain editable in Inkscape.

Rebuild from this folder:

```sh
blender --background --factory-startup --python build.py
blender --background de9-male.blend --python technical_plate.py
python3 export.py
```

The model is illustrative, not tolerance-controlled. Jackpost threads and retention details are omitted; the contact tails are simplified. The exploded arrangement is explanatory, not a verified manufacturing sequence.

Proportions and material roles were informed by Amphenol's *D-Subminiature (D-sub) Economy Range Connectors*, pp. 2–5:
https://cdn.amphenol-cs.com/media/wysiwyg/files/documentation/datasheet/inputoutput/io_dsub_economy.pdf

The manufacturer drawing, not this model, is the authority for dimensions and tolerances.

`compatibility-switch.svg` is editable original vector artwork. Copy it unchanged to `public/images/vault/hardware/d-sub-connector/` after editing. It illustrates a possible selector circuit, not a verified commercial design. MSX trigger B wiring follows ASCII Corporation, *MSX2 Technical Handbook*, chapter 5, figure 5.23; C64 assignments follow its Programmer’s Reference Guide p. 395. Both panels show connection to a C64.
