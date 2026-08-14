#!/usr/bin/env python3
"""Decide whether a Spectrum capture actually shows attribute clash.

Written because three frames were published or nearly published during the
first Vault capture session on the strength of "that looks like clash", and
none of them were. Two showed an uninterrupted background that had been read
as a broken one; the third was argued from a misidentified sprite. On a page
whose subject is a visual artefact, an eye that wants to see the artefact is
not evidence.

Clash has two sides, and one test cannot see both
-------------------------------------------------
A cell holds one ink. When two things share a cell, one of them is repainted
in the other's colour — but *which* one is repainted decides how you can
measure it, and the two cases need different instruments.

**Background side** — the intruder wins the cell and the standing art changes
colour under it. Measurable by pairing frames: art that keeps its shape but
changes colour was repainted. `compare()` does this.

**Sprite side** — the standing art wins the cell and the *intruder* is
repainted, so a character walks past a wall with one limb in the wall's
colour. This is the famous form, and the pair test is blind to it by
construction: it only considers pixels lit in BOTH frames, and a moving
sprite's pixels never coincide with themselves. `compare_sprite()` does this
instead, by differencing against a baseline frame of the same scene with the
sprite elsewhere, then asking whether what is left is drawn in more than one
ink. One object, two colours, split on the character grid.

Missing the second case is not hypothetical: the Dizzy capture session found
zero background-side clash across ~200 frames and read that as "this game
does not clash", while a frame in hand showed the player with a red foot.

Usage
-----
    verify-clash.py FRAME_A FRAME_B          compare two frames
    verify-clash.py --sweep DIR/GLOB         compare every consecutive pair
    verify-clash.py --sprite BASE FRAME      is the sprite itself recoloured?
    verify-clash.py --self-test              prove the detector still works

Always run --self-test before trusting a negative. A detector that silently
stopped working reports "no clash" for every frame, which is exactly what a
correct run also looks like.
"""

import argparse
import glob
import sys
import tempfile
from pathlib import Path

from PIL import Image

ACTIVE = (48, 48, 304, 240)   # the 256x192 picture inside the Spectrum raster
BLACK_MAX = 40                # a channel max at or below this counts as unlit
MIN_COMMON = 8                # cells with fewer shared lit pixels prove nothing
RECOLOUR_RATIO = 0.8          # share of shared lit pixels that must have moved


def _cells(path):
    im = Image.open(path).convert("RGB").crop(ACTIVE)
    px = im.load()
    for cy in range(24):
        for cx in range(32):
            yield cx, cy, [[px[cx * 8 + x, cy * 8 + y] for x in range(8)]
                           for y in range(8)]


def _lit(colour):
    return max(colour) > BLACK_MAX


def compare(path_a, path_b):
    """Cells whose shared lit pixels were wholly recoloured between frames."""
    before = {(cx, cy): grid for cx, cy, grid in _cells(path_a)}
    hits = []
    for cx, cy, after in _cells(path_b):
        prior = before[(cx, cy)]
        shared = [(prior[y][x], after[y][x])
                  for y in range(8) for x in range(8)
                  if _lit(prior[y][x]) and _lit(after[y][x])]
        if len(shared) < MIN_COMMON:
            continue
        moved = sum(1 for p, q in shared if p != q)
        if moved >= len(shared) * RECOLOUR_RATIO:
            hits.append((cx, cy, len(shared)))
    return hits


def _sprite_inks(path_base, path_shot):
    """Cell -> ink, for cells holding pixels the baseline frame does not.

    Differencing against a baseline of the same scene leaves whatever arrived:
    the sprite, and anything else that moved. Each surviving cell is recorded
    with the single ink it is drawn in, which is all a Spectrum cell can hold.
    """
    base = Image.open(path_base).convert("RGB").crop(ACTIVE).load()
    shot = Image.open(path_shot).convert("RGB").crop(ACTIVE).load()
    inks = {}
    for cy in range(24):
        for cx in range(32):
            for y in range(8):
                for x in range(8):
                    px, py = cx * 8 + x, cy * 8 + y
                    here = shot[px, py]
                    if _lit(here) and not _lit(base[px, py]):
                        inks.setdefault((cx, cy), here)
    return inks


def _clusters(cells):
    """Group cells into 8-connected blobs — one blob per moving object.

    Clustering at cell granularity rather than pixel granularity is deliberate.
    A sprite straddling a cell boundary is often masked to a blank column at
    the seam, so its two halves are not pixel-connected; they are always cell-
    adjacent. The artefact lives on the cell grid, so measure on the cell grid.
    """
    remaining, blobs = set(cells), []
    while remaining:
        stack, blob = [remaining.pop()], []
        while stack:
            cx, cy = stack.pop()
            blob.append((cx, cy))
            for dx in (-1, 0, 1):
                for dy in (-1, 0, 1):
                    n = (cx + dx, cy + dy)
                    if n in remaining:
                        remaining.discard(n)
                        stack.append(n)
        blobs.append(sorted(blob))
    return blobs


def _standing_inks(path_base):
    """Cell -> the ink the standing art is drawn in, for cells that hold any."""
    base = Image.open(path_base).convert("RGB").crop(ACTIVE).load()
    inks = {}
    for cy in range(24):
        for cx in range(32):
            for y in range(8):
                for x in range(8):
                    here = base[cx * 8 + x, cy * 8 + y]
                    if _lit(here):
                        inks.setdefault((cx, cy), here)
    return inks


def compare_sprite(path_base, path_shot):
    """Moving objects recoloured by the standing art they crossed into.

    Two inks in one object is necessary but NOT sufficient, and taking it as
    sufficient reads a deliberately two-tone sprite as an artefact. La Espada
    Sagrada (Topo Soft, 1990) draws its hero yellow and his sword white in the
    neighbouring cell: one object, two inks, and no clash anywhere near it —
    the game is *using* the grid to buy a second colour.

    Clash is the narrower case where a minority ink matches the ink of the
    standing art in the very cells carrying it. That is what makes it the
    scenery's colour rather than the sprite's own: the cell was already that
    colour before the sprite arrived, and the sprite was drawn in it.
    """
    inks = _sprite_inks(path_base, path_shot)
    standing = _standing_inks(path_base)
    hits = []
    for blob in _clusters(inks.keys()):
        by_ink = {}
        for cell in blob:
            by_ink.setdefault(inks[cell], []).append(cell)
        if len(by_ink) < 2:
            continue
        # Which of these inks was already the cell's before the sprite arrived?
        imposed = {ink: cells for ink, cells in by_ink.items()
                   if any(standing.get(c) == ink for c in cells)}
        if imposed and len(imposed) < len(by_ink):
            hits.append((blob, by_ink))
    return hits


def _scene_paths():
    """Render the entry's diagram scenes to a temp dir and return their paths.

    The controls are the same scenes the published diagrams are drawn from
    (capture/vault/diagrams.py). That is deliberate: a fixture nobody ever
    looks at rots quietly, and this one is on the page. If the detector stops
    being able to see clash, this test fails AND the figure visibly changes.
    """
    here = Path(__file__).resolve().parent
    sys.path.insert(0, str(here / "vault"))
    try:
        import diagrams
    except ImportError:
        sys.exit("self-test needs capture/vault/diagrams.py, which is missing")
    tmp = Path(tempfile.mkdtemp(prefix="clash-selftest-"))
    paths = {}
    for name, frame in diagrams.build_scenes().items():
        paths[name] = str(tmp / f"{name}.png")
        frame.save(paths[name])
    return paths


def self_test():
    """Prove the instrument can still see each artefact it claims to measure.

    A negative result is only worth anything if the instrument works, so this
    builds positive controls rather than depending on a fixture — and one
    negative control, because a detector that flags everything also "finds"
    clash and is just as useless as one that flags nothing.
    """
    s = _scene_paths()

    # Background side: a figure three pixels across the seam, so the two wall
    # cells it touches repaint while the identical bricks beside them do not.
    got = [(cx, cy) for cx, cy, _ in compare(s["clear"], s["nudged"])]
    expected = [(16, 11), (16, 12)]
    if got != expected:
        print(f"self-test FAIL (background side) — expected {expected}, got {got}")
        return 1
    print("self-test PASS — detector flags art repainted by an intruder")

    # Sprite side: the pair test cannot reach this, so a working compare()
    # says nothing at all about compare_sprite().
    hits = compare_sprite(s["baseline"], s["scenery_wins"])
    if not (len(hits) == 1 and len(hits[0][1]) == 2):
        print(f"self-test FAIL (sprite side) — expected one two-ink object, got {hits}")
        return 1
    print("self-test PASS — detector flags a figure split across two inks")

    # Negative control: the same crossing with the figure masked. A black
    # surround means it shares no cell with the wall, so there is nothing to
    # find and a correct detector finds nothing.
    clean = compare_sprite(s["baseline"], s["masked"])
    if clean:
        print(f"self-test FAIL (negative control) — masked figure flagged: {clean}")
        return 1
    print("self-test PASS — detector stays silent on a masked figure")
    return 0


def report(path_a, path_b):
    hits = compare(path_a, path_b)
    label = f"{path_a.split('/')[-1]} -> {path_b.split('/')[-1]}"
    if not hits:
        print(f"{label}: no clash")
        return 0
    print(f"{label}: {len(hits)} repainted cell(s)")
    for cx, cy, shared in hits:
        print(f"    cell ({cx:2d},{cy:2d})  {shared} px lit in both, all recoloured")
    return len(hits)


def report_sprite(path_base, path_shot):
    hits = compare_sprite(path_base, path_shot)
    label = f"{path_base.split('/')[-1]} -> {path_shot.split('/')[-1]}"
    if not hits:
        print(f"{label}: no sprite-side clash — every moving object is one ink")
        return 0
    print(f"{label}: {len(hits)} object(s) drawn in more than one ink")
    for blob, by_ink in hits:
        print(f"    object spanning {len(blob)} cell(s):")
        for ink, cells in sorted(by_ink.items(), key=lambda kv: -len(kv[1])):
            listed = " ".join(f"({cx},{cy})" for cx, cy in cells)
            print(f"        {str(ink):>18}  {listed}")
    return len(hits)


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("frames", nargs="*", help="two frames, or a glob with --sweep")
    ap.add_argument("--sweep", action="store_true",
                    help="compare every consecutive pair in the given frames")
    ap.add_argument("--sprite", action="store_true",
                    help="BASE FRAME: is a moving object itself split across inks?")
    ap.add_argument("--self-test", action="store_true",
                    help="verify the detector against a synthetic clash cell")
    args = ap.parse_args()

    if args.self_test:
        return self_test()

    if args.sprite:
        if len(args.frames) != 2:
            sys.exit("--sprite needs a baseline frame and a frame to test")
        report_sprite(*args.frames)
        return 0

    if args.sweep:
        frames = sorted(f for pattern in args.frames for f in glob.glob(pattern))
        if len(frames) < 2:
            sys.exit("--sweep needs at least two frames")
        total = sum(report(a, b) for a, b in zip(frames, frames[1:]))
        print(f"\n{total} repainted cell(s) across {len(frames) - 1} pair(s)")
        return 0

    if len(args.frames) != 2:
        sys.exit("give two frames, or use --sweep with a glob")
    report(*args.frames)
    return 0


if __name__ == "__main__":
    sys.exit(main())
