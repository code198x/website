---
title: "Tier 14: Raster Effects and Timing Tricks"
system: "msx"
tier: "tier-14"
order: 14
description: "There’s no raster interrupt, but there is raster *timing*. Use scanline polling to split screens, animate colours, and layer effects."
image: "/images/msx/tier-14.png"
---

Push the VDP to its limits.

You’ll:
- Poll the VDP status to wait for specific scanlines
- Change palette or scroll registers mid-frame
- Create vertical splits for UI/gameplay separation
- Animate colour registers in real-time

These are the tricks that made 1980s demos sing on MSX hardware.
