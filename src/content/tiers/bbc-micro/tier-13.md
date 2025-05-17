---
title: "Tier 13: Custom Start-up and Welcome Screens"
system: "bbc-micro"
tier: "tier-13"
order: 13
description: "Override the default boot and create your own intro routines. Display splash screens, logos, and play music before the main program starts."
image: "/images/bbc-micro/tier-13.png"
---

Tier 13 is all about first impressions.

You’ll:
- Patch the OS vectors to redirect the boot process
- Write inline assembly or BASIC stubs that launch on reset
- Display graphics and play sound while loading assets
- Implement multi-stage loaders from disk or tape

By controlling what happens at power-on, you set the tone for everything that follows.
