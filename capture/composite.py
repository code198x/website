#!/usr/bin/env python3
"""Stack captured C64 frames into one labelled figure.

The geometry matches the print-vs-poke composite so figures built from
different captures sit consistently on the page: 680 wide, 20px margins,
panels at 2x the 320x200 active area, a monospace label above each.

The panels themselves are unretouched captures. Only the label band and the
background are drawn here — nothing is painted over a frame.
"""
import sys

from PIL import Image, ImageDraw, ImageFont

BG = (18, 18, 22)
FG = (222, 222, 228)
MARGIN = 20
PANEL_W, PANEL_H = 640, 400
LABEL_BAND = 34          # space above a panel for its label
GAP = 52                 # label band plus breathing room between panels

# The 320x200 active area within the 416x312 PAL raster.
CROP = (48, 56, 368, 256)

FONT_CANDIDATES = [
    "/System/Library/Fonts/SFNSMono.ttf",
    "/System/Library/Fonts/Supplemental/Andale Mono.ttf",
    "/Library/Fonts/DejaVuSansMono.ttf",
]


def load_font(size=17):
    for path in FONT_CANDIDATES:
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


def build(panels, out):
    """panels: list of (png_path, label)."""
    n = len(panels)
    height = MARGIN + LABEL_BAND + n * PANEL_H + (n - 1) * GAP + MARGIN
    canvas = Image.new("RGB", (MARGIN * 2 + PANEL_W, height), BG)
    draw = ImageDraw.Draw(canvas)
    font = load_font()

    y = MARGIN + LABEL_BAND
    for path, label in panels:
        frame = Image.open(path).convert("RGB").crop(CROP)
        frame = frame.resize((PANEL_W, PANEL_H), Image.NEAREST)
        draw.text((MARGIN, y - LABEL_BAND + 6), label, fill=FG, font=font)
        canvas.paste(frame, (MARGIN, y))
        y += PANEL_H + GAP

    canvas.save(out)
    print(f"{out} {canvas.size[0]}x{canvas.size[1]} from {n} panel(s)")


if __name__ == "__main__":
    out = sys.argv[1]
    args = sys.argv[2:]
    build(list(zip(args[0::2], args[1::2])), out)
