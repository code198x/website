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
