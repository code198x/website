#!/usr/bin/env python3
"""Generate the synthetic diagrams for the Colour Clash entry.

These are drawings, not captures, and the entry marks that three ways: they
carry no Spectrum bezel (`frame="none"` where the captured frames use
`frame="spectrum"`), their filenames begin `diagram-`, and their captions
open with "Diagram". A page whose two other figures are evidence from real
tapes cannot afford a reader mistaking an illustration for one.

Why a script rather than four hand-drawn PNGs: the capture manifests record
exactly how every published frame was reached, and a diagram should be no
less reproducible. Re-run this and the figures regenerate identically.

Scenes and controls are the same artefact
-----------------------------------------
`build_scenes()` returns Spectrum-geometry raster frames (352x296, active
area at (48,48)) built to exact cell boundaries. Two of them are what
verify-clash.py's --self-test asserts against, and the published figures are
magnified crops of those same frames. So the detector's positive control and
the picture explaining the artefact are one thing: if the detector ever stops
being able to see clash, the self-test fails AND the published figure visibly
changes. A fixture nobody looks at rots; a fixture on the page does not.

    diagrams.py            write the four PNGs
    diagrams.py --list     print what would be written
"""

import argparse
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

CELL = 8
RASTER = (352, 296)
ORIGIN = (48, 48)                      # top-left of the 256x192 active area

BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
RED = (194, 0, 0)                      # non-bright red, as the Dizzy hut
GRID = (86, 92, 112)
PAGE = (18, 18, 22)
LABEL = (176, 182, 200)

OUT = Path(__file__).resolve().parents[2] / "public/images/vault/techniques/colour-clash"

# The scene: a brick wall on the right, a 2x2-cell figure crossing into it.
WALL_X, WALL_Y, WALL_W, WALL_H = 16, 10, 3, 4      # in cells
SPRITE_CELLS = 2
SPRITE_Y = 11
VIEW = (13, 9, 8, 6)                               # crop window in cells: x,y,w,h

# Two overlaps, because the two figures need different things visible. A NUDGE
# barely crosses the seam, so the cell it touches is nearly all wall and the
# whole cell flipping colour is unmissable. A HALF overlap puts enough of the
# figure inside the wall's cells to show the figure itself being recoloured.
_SPRITE_W = CELL * SPRITE_CELLS
CLEAR_X_PX = WALL_X * CELL - _SPRITE_W - 8
NUDGE_X_PX = WALL_X * CELL - _SPRITE_W + 3
HALF_X_PX = WALL_X * CELL - CELL


def _font(size):
    for path in ("/System/Library/Fonts/Monaco.ttf",
                 "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"):
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


def _blank():
    return Image.new("RGB", RASTER, BLACK)


def _cell_box(cx, cy):
    return (ORIGIN[0] + cx * CELL, ORIGIN[1] + cy * CELL)


def _paint_wall(px, ink=RED):
    """A brick course, drawn so its lit pixels are identical in every frame.

    The pattern matters: the background-side test only considers pixels lit in
    BOTH frames, so art that shifted would fail it for the wrong reason.
    """
    for cy in range(WALL_Y, WALL_Y + WALL_H):
        for cx in range(WALL_X, WALL_X + WALL_W):
            ox, oy = _cell_box(cx, cy)
            for y in range(CELL):
                for x in range(CELL):
                    course = (y // 4) % 2
                    mortar = y % 4 == 3 or (x + course * 4) % 8 == 0
                    if not mortar:
                        px[ox + x, oy + y] = ink


def _paint_sprite(px, x_px, ink=WHITE, halo=0):
    """A blocky 16x16 figure, positioned in pixels so it can straddle a seam.

    halo is the masking trick's black surround in pixels: the figure blanks
    what it approaches instead of sharing a cell with it, so nothing coloured
    is left in the cell to be recoloured — and nothing of the wall survives
    there either, which is the cost.
    """
    ox, oy = ORIGIN[0] + x_px, _cell_box(0, SPRITE_Y)[1]
    if halo:
        for y in range(-halo, _SPRITE_W + halo):
            for x in range(-halo, _SPRITE_W + halo):
                sx, sy = ox + x, oy + y
                if ORIGIN[0] <= sx < ORIGIN[0] + 256 and ORIGIN[1] <= sy < ORIGIN[1] + 192:
                    px[sx, sy] = BLACK
    body = [
        "..######..######",
        ".########.######",
        "###..###########",
        "###..###########",
        "################",
        "################",
        "###..###..######",
        "####...#########",
        "################",
        "################",
        ".##############.",
        "..############..",
        "...####..####...",
        "...###....###...",
        "..####....####..",
        "..####....####..",
    ]
    for y, row in enumerate(body):
        for x, ch in enumerate(row):
            if ch == "#":
                px[ox + x, oy + y] = ink


def _recolour(px, x_px, ink):
    """Force every lit pixel of the SHARED cells to one ink.

    This is the artefact itself: the cell holds one attribute, so whatever is
    inside it — wall, figure, or both — is drawn in that single colour.

    Only cells the figure and the wall actually share are affected. Cells
    holding nothing but the figure keep its own ink, which is why a clashing
    sprite appears in two colours at once rather than changing wholesale — the
    Dizzy capture on this page is six cells white and two the hut's red.
    """
    first = max(x_px // CELL, WALL_X)
    last = min((x_px + _SPRITE_W - 1) // CELL, WALL_X + WALL_W - 1)
    for cy in range(SPRITE_Y, SPRITE_Y + SPRITE_CELLS):
        for cx in range(first, last + 1):
            ox, oy = _cell_box(cx, cy)
            for y in range(CELL):
                for x in range(CELL):
                    if px[ox + x, oy + y] != BLACK:
                        px[ox + x, oy + y] = ink


def _scene(x_px=None, recolour=None, halo=0):
    frame = _blank()
    px = frame.load()
    _paint_wall(px)
    if x_px is not None:
        _paint_sprite(px, x_px, halo=halo)
        if recolour:
            _recolour(px, x_px, recolour)
    return frame


def build_scenes():
    """The raster frames the published figures and the self-test controls share."""
    return {
        # Barely across the seam: the touched cell is nearly all wall, so the
        # whole cell changing colour is the only thing that can be read into it.
        "clear": _scene(CLEAR_X_PX),
        "nudged": _scene(NUDGE_X_PX, recolour=WHITE),
        # Half in: enough of the figure inside the wall's cells to show it
        # being recoloured, which the nudge is too small to demonstrate.
        "baseline": _scene(),
        "intruder_wins": _scene(HALF_X_PX, recolour=WHITE),
        "scenery_wins": _scene(HALF_X_PX, recolour=RED),
        "masked": _scene(HALF_X_PX, halo=3),
    }


def _panel(frame, scale=8, view=VIEW):
    """Magnified crop of a scene with the character grid drawn over it."""
    cx, cy, cw, ch = view
    box = (ORIGIN[0] + cx * CELL, ORIGIN[1] + cy * CELL,
           ORIGIN[0] + (cx + cw) * CELL, ORIGIN[1] + (cy + ch) * CELL)
    im = frame.crop(box).resize((cw * CELL * scale, ch * CELL * scale), Image.NEAREST)
    draw = ImageDraw.Draw(im)
    for i in range(cw + 1):
        x = i * CELL * scale
        draw.line([(x, 0), (x, im.height)], fill=GRID)
    for i in range(ch + 1):
        y = i * CELL * scale
        draw.line([(0, y), (im.width, y)], fill=GRID)
    return im


def _compose(panels, labels, gutter=20, margin=16, label_h=30):
    font = _font(20)
    w = sum(p.width for p in panels) + gutter * (len(panels) - 1) + margin * 2
    h = panels[0].height + margin * 2 + label_h
    sheet = Image.new("RGB", (w, h), PAGE)
    draw = ImageDraw.Draw(sheet)
    x = margin
    for panel, text in zip(panels, labels):
        sheet.paste(panel, (x, margin))
        draw.text((x, margin + panel.height + 8), text, fill=LABEL, font=font)
        x += panel.width + gutter
    return sheet


def figure_mechanism(scenes):
    return _compose([_panel(scenes["clear"]), _panel(scenes["nudged"])],
                    ["figure clear of the wall", "three pixels across the seam"])


def figure_two_sides(scenes):
    return _compose([_panel(scenes["intruder_wins"]), _panel(scenes["scenery_wins"])],
                    ["the intruder wins the cell", "the standing art wins"])


def figure_masking(scenes):
    return _compose([_panel(scenes["scenery_wins"]), _panel(scenes["masked"])],
                    ["unmasked: the figure is recoloured", "masked: the figure blanks the cell"])


def figure_attribute_byte():
    """One byte, sixty-four pixels. Nothing is 'taken' — the byte governs
    whatever is in the cell, whoever drew it."""
    font = _font(21)
    small = _font(17)
    fields = [("FLASH", 7, (120, 120, 132)), ("BRIGHT", 6, (232, 196, 84)),
              ("PAPER", 5, (108, 148, 232)), ("PAPER", 4, (108, 148, 232)),
              ("PAPER", 3, (108, 148, 232)), ("INK", 2, (226, 96, 96)),
              ("INK", 1, (226, 96, 96)), ("INK", 0, (226, 96, 96))]
    bw, bh, gap, margin = 92, 76, 6, 22
    w = bw * 8 + gap * 7 + margin * 2
    sheet = Image.new("RGB", (w, bh + margin * 2 + 92), PAGE)
    draw = ImageDraw.Draw(sheet)
    x = margin
    for name, bit, colour in fields:
        draw.rectangle([x, margin, x + bw, margin + bh], fill=colour)
        draw.text((x + 8, margin + 10), name, fill=(16, 16, 18), font=small)
        draw.text((x + 8, margin + 38), f"bit {bit}", fill=(16, 16, 18), font=small)
        x += bw + gap
    draw.text((margin, margin + bh + 20),
              "one byte per 8x8 cell — it governs every pixel in that cell,",
              fill=LABEL, font=font)
    draw.text((margin, margin + bh + 50),
              "whatever drew them: scenery, sprite, or both at once",
              fill=LABEL, font=font)
    return sheet


FIGURES = {
    "diagram-clash-mechanism.png": lambda s: figure_mechanism(s),
    "diagram-clash-two-sides.png": lambda s: figure_two_sides(s),
    "diagram-attribute-byte.png": lambda s: figure_attribute_byte(),
    "diagram-sprite-masking.png": lambda s: figure_masking(s),
}


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--list", action="store_true", help="print targets, write nothing")
    args = ap.parse_args()

    if args.list:
        for name in FIGURES:
            print(OUT / name)
        return 0

    scenes = build_scenes()
    OUT.mkdir(parents=True, exist_ok=True)
    for name, make in FIGURES.items():
        make(scenes).save(OUT / name)
        print("wrote", OUT / name)
    return 0


if __name__ == "__main__":
    sys.exit(main())
