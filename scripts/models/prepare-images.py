"""Prepare responsive publication images from the retained family model renders."""

import argparse
import hashlib
import json
import shutil
import subprocess
import tempfile
from pathlib import Path

SITE = Path(__file__).resolve().parents[2]
SIZES = (640, 1280, 1920)


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def prepare(library):
    sources = json.loads(Path(__file__).with_name("sources.json").read_text())
    output = SITE / "public/images/models"
    output.mkdir(parents=True, exist_ok=True)
    manifest = {}
    with tempfile.TemporaryDirectory(prefix="code198x-model-images-") as scratch:
        for model, views in sources.items():
            manifest[model] = {}
            for view, spec in views.items():
                relative = spec if isinstance(spec, str) else spec['path']
                crop = None if isinstance(spec, str) else spec.get('crop')
                source = library / relative
                if model == 'sinclair-zx-spectrum':
                    # A plausible filename is not evidence that a portrait is current.
                    receipt = json.loads(source.with_suffix('.png.json').read_text())
                    native = source.parent.parent / 'spectrum.sc'
                    if receipt['source']['native_sha256'] != digest(native):
                        raise ValueError('Spectrum portrait does not match the current native model')
                    recorded = receipt['images']
                    image = next(value for name, value in recorded.items() if Path(name).name == source.name)
                    if image['sha256'] != digest(source):
                        raise ValueError('Spectrum portrait differs from its provenance')
                # Remove only empty alpha borders. Authored opaque studio framing stays intact.
                framed = Path(scratch) / "framed.png"
                opaque = subprocess.check_output([
                    "magick", "identify", "-format", "%[opaque]", str(source),
                ], text=True).strip().lower() == "true"
                if crop:
                    subprocess.run([
                        'magick', str(source), '-crop', crop, '+repage', str(framed),
                    ], check=True)
                elif opaque:
                    shutil.copyfile(source, framed)
                else:
                    subprocess.run([
                        "magick", str(source), "-trim", "+repage", "-bordercolor", "none",
                        "-border", "5%", str(framed),
                    ], check=True)
                derivatives = {}
                for width in SIZES:
                    target = output / f"{model}-{view}-{width}.webp"
                    subprocess.run([
                        "magick", str(framed), "-resize", f"{width}x", "-quality", "88", str(target),
                    ], check=True)
                    dimensions = subprocess.check_output([
                        "magick", "identify", "-format", "%w %h", str(target),
                    ], text=True).split()
                    derivatives[str(width)] = {
                        "sha256": digest(target), "bytes": target.stat().st_size,
                        "width": int(dimensions[0]), "height": int(dimensions[1]),
                    }
                manifest[model][view] = {"source_sha256": digest(source), "images": derivatives}
                if crop:
                    manifest[model][view]['crop'] = crop
    (output / "provenance.json").write_text(json.dumps(manifest, indent=2) + "\n")
    print(f"Prepared {sum(len(v) for v in sources.values())} views at three sizes.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("library", type=Path, help="Path to the family workspace containing assets/")
    prepare(parser.parse_args().library.resolve())
