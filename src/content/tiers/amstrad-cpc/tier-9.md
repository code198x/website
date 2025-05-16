---
title: "Tier 9: Smooth Scrolling and Raster Tricks"
system: "amstrad-cpc"
tier: "tier-9"
order: 9
description: "The CPC doesn't have hardware scrolling — but that won’t stop us. Learn to scroll the screen smoothly with CRTC magic and clever memory tricks."
image: "/images/amstrad-cpc/tier-9.png"
---

Time to slide the screen like it's on rails.

You’ll:
- Use the CRTC register `$C000` to shift display start
- Implement vertical and horizontal scrolling in software
- Optimise tilemaps for scrolling redraws
- Use partial redraws for game HUDs and split screens

This is the start of arcade-like motion — all done without hardware support.
