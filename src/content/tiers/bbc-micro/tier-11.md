---
title: "Tier 11: Compression and Asset Loading"
system: "bbc-micro"
tier: "tier-11"
order: 11
description: "64K isn’t a lot — so make it go further. Compress data, build custom file formats, and decompress to RAM or screen at runtime."
image: "/images/bbc-micro/tier-11.png"
---

Space is tight, but clever wins.

You’ll:
- Compress graphics and maps with RLE or simple packers
- Build a decompression routine in 6502
- Store assets in a binary format for fast loading
- Chain files together or use overlays for level data

The Beeb has fast disk I/O — let’s take full advantage of it.
