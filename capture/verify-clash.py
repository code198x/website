#!/usr/bin/env python3
"""Decide whether a Spectrum capture actually shows attribute clash.

Written because three frames were published or nearly published during the
first Vault capture session on the strength of "that looks like clash", and
none of them were. Two showed an uninterrupted background that had been read
as a broken one; the third was argued from a misidentified sprite. On a page
whose subject is a visual artefact, an eye that wants to see the artefact is
not evidence.

The measurement
---------------
Clash is a cell whose *background art keeps its shape but changes colour*,
because a sprite moved in and took the cell's single ink with it. So compare
two frames of the same scene and flag cells where pixels lit in BOTH frames
are a different colour in each.

That test is what makes it specific. Background art that merely scrolled or
animated fails it, because the lit pixels no longer coincide. A repainted
attribute passes it, because the shape is identical and only the colour moved.

Usage
-----
    verify-clash.py FRAME_A FRAME_B          compare two frames
    verify-clash.py --sweep DIR/GLOB         compare every consecutive pair
    verify-clash.py --self-test              prove the detector still works

Always run --self-test before trusting a negative. A detector that silently
stopped working reports "no clash" for every frame, which is exactly what a
correct run also looks like.
"""

import argparse
import glob
import sys

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


def self_test():
    """Repaint one cell of a synthetic frame and check the detector sees it.

    A negative result is only worth anything if the instrument still works, so
    this builds its own positive control rather than depending on a fixture.
    """
    base = Image.new("RGB", (352, 296), (0, 0, 0))
    px = base.load()
    for y in range(48, 240):                      # a filled green background
        for x in range(48, 304):
            px[x, y] = (0, 200, 0) if (x + y) % 3 else (0, 0, 0)
    control = base.copy()
    cpx = control.load()
    for y in range(12 * 8, 12 * 8 + 8):           # one cell repainted yellow
        for x in range(14 * 8, 14 * 8 + 8):
            if _lit(px[48 + x, 48 + y]):
                cpx[48 + x, 48 + y] = (255, 255, 0)

    base.save("/tmp/_clash_a.png")
    control.save("/tmp/_clash_b.png")
    hits = compare("/tmp/_clash_a.png", "/tmp/_clash_b.png")
    expected = [(14, 12)]
    got = [(cx, cy) for cx, cy, _ in hits]
    if got == expected:
        print("self-test PASS — detector flags a known repainted cell")
        return 0
    print(f"self-test FAIL — expected {expected}, got {got}")
    return 1


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


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("frames", nargs="*", help="two frames, or a glob with --sweep")
    ap.add_argument("--sweep", action="store_true",
                    help="compare every consecutive pair in the given frames")
    ap.add_argument("--self-test", action="store_true",
                    help="verify the detector against a synthetic clash cell")
    args = ap.parse_args()

    if args.self_test:
        return self_test()

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
