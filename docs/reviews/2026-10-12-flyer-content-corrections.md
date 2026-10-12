# Flyer content review

## Vault: bounded follow-up to #369

Reviewed the Mega Drive, YM2612 and Y-depth-sorting articles, including source
frontmatter and rendered Sources. Replaced restricted-manual quotations with
factual paraphrases and publicly checkable references. Ordinary published book
and magazine quotations are outside this correction.

- Sega’s public Mega Drive specifications give the NTSC Z80 clock as 3.58 MHz.
- Plutiedev’s VDP register reference describes register 7’s backdrop selection:
  a two-bit palette number plus a four-bit index can select any of 64 entries.
  The four transparent tile/sprite indices do not make four CRAM entries unusable.
- Ten 32-pixel-wide sprites consume 320 pixels, independently of the 20-sprite
  count limit in the wide display mode.
- Plutiedev documents the YM2612’s independent operator frequencies on channel 3,
  its SSG-EG modes and timer flags. Sega’s 21 February 1992 sound manual provides
  historical context, attributed by title/date without quotations or copy links.
- Pan Docs covers original Game Boy X-priority and native CGB OAM order. Fullsnes
  covers SNES priority rotation; that public source replaces the undated manual
  citation. Plutiedev covers the Mega Drive’s linked sprite order.

Validation: `npm run check:content` passed (including 25,970 internal references),
`npm run build` passed, and all three built pages returned 200 and rendered the
new public references. Source coverage reporting ran, but is not proof of claim
accuracy. The existing platform-balance advisory lists 51 entries; it is not a
failure of these corrections. Manual review checked the changed prose and notes.
Issue #369 remains open for its other work.

## Hexadecimal: #409 and #411

The original lesson assumed the reader had completed Unit 1 (opening and recap),
left bit/byte unexplained locally, and said “turn one off” gives 254. That last
claim is true only for the rightmost bit. The revised text defines those terms,
shows that bit explicitly, labels SHOW/BIN/HEX as pseudocode, explains a leading
zero and gives the high/low nibble weights. It retains the existing lesson scope.

Independent arithmetic:

- `1111`: 8 + 4 + 2 + 1 = 15, written F in hex.
- Table: `0000` = 0; `0101` = 4 + 1 = 5; `1001` = 8 + 1 = 9;
  `1010` = 8 + 2 = 10 = A; `1100` = 8 + 4 = 12 = C; `1111` = 15 = F.
- `11111111`: 128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = 255;
  FF = 15 × 16 + 15 = 255.
- `11111110`: the same sum without 1 = 254.
- `11110000`: 128 + 64 + 32 + 16 = 240; F0 = 15 × 16 + 0 = 240.
- `05` = 0 × 16 + 5 = 5; hex `10` = 1 × 16 + 0 = 16.

A separate check parsed all five SHOW results and all six table rows and compared
binary and hexadecimal conversions with the displayed decimal numbers. It also
required those nonzero case counts. The rendered check verified all eight bit
positions, the F0 bits/digits, caption and onward link. A deliberately corrupted
rendered digit was detected as a negative control.

The figure is original semantic HTML/CSS, following BitPicture's existing House
tokens. It is not a capture from a vintage machine. The visible caption supplies
the diagram's text equivalent; grouping, labels and arrows do not depend on colour.
No dependency, shared style or client JavaScript was added.

`npm run build` and `npm run check:content` passed. Chromium checks at 1280 × 900
and 360 × 800, with both light and dark preferences, found no horizontal overflow
and zero WCAG A/AA violations. The site's existing paper palette intentionally
remains light under a dark preference. Print-media rendering was legible. The
Impeccable detector reported no findings. Screenshots:

- [Desktop/light](2026-10-12-hexadecimal/desktop-light.png)
- [Desktop/dark preference](2026-10-12-hexadecimal/desktop-dark.png)
- [Mobile/light](2026-10-12-hexadecimal/mobile-light.png)
- [Mobile/dark preference](2026-10-12-hexadecimal/mobile-dark.png)
- [Print media](2026-10-12-hexadecimal/print.png)

The existing previous/overview/next links resolve. The next unit remains
`/foundations/counting-in-twos/unit-03/`, “Two Bytes Together”. This is an editorial
and arithmetic review, not an observed trial with an unfamiliar learner.
