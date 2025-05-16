---
title: "Tier 4: Direct to VDP"
system: "msx"
tier: "tier-4"
order: 4
description: "The VDP is your canvas. This tier teaches how to manipulate name tables, tiles, and colour memory directly for better performance and control."
image: "/images/msx/tier-4.png"
---

The VDP isn't memory-mapped — it's a partner you talk to through ports.

You’ll:
- Write bytes into VRAM via ports `$98` (data) and `$99` (address)
- Set name table data to control characters on screen
- Switch modes and palettes via VDP register writes
- Create tile-based screens and control scrolling manually

This is real graphics programming — indirect, powerful, and deeply MSX.
