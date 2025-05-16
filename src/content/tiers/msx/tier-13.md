---
title: "Tier 13: Custom Loaders and Boot Sequences"
system: "msx"
tier: "tier-13"
order: 13
description: "Make your own loader. Launch from BASIC, show an intro, and preload code or assets before the game proper begins."
image: "/images/msx/tier-13.png"
---

Time to create a proper intro.

You’ll:
- Launch code using `BLOAD` or `CALL` from MSX BASIC
- Display loading screens while decompressing assets
- Use simple BIOS hooks to set up your launch path
- Create splash screens with music or scrolling text

Your software deserves a dramatic entrance — not just a blinking cursor.
