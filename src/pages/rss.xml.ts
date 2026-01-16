import rss from '@astrojs/rss';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  return rss({
    title: "Code Like It's 198x",
    description: "Learn assembly by building games on classic 8-bit and 16-bit systems. New lessons, tutorials, and articles about retro game development.",
    site: context.site?.toString() || 'https://code198x.stevehill.xyz',
    items: [
      // Featured items - manually curated for now
      // In future, could dynamically pull from content collections
      {
        title: "SID Symphony - Game 1 for Commodore 64",
        pubDate: new Date('2026-01-12'),
        description: "Build a complete rhythm game while learning 6510 assembly and the legendary SID chip.",
        link: '/commodore-64/assembly/game-01-sid-symphony/',
      },
      {
        title: "Ink War - Game 1 for ZX Spectrum",
        pubDate: new Date('2026-01-10'),
        description: "Create a territory control game while mastering Z80 assembly and the Spectrum's unique graphics.",
        link: '/sinclair-zx-spectrum/assembly/game-01-ink-war/',
      },
      {
        title: "Neon Nexus - Game 1 for NES",
        pubDate: new Date('2026-01-08'),
        description: "Build a cyberpunk-themed puzzle game while learning the NES architecture.",
        link: '/nintendo-entertainment-system/assembly/game-01-neon-nexus/',
      },
      {
        title: "Signal - Game 1 for Amiga",
        pubDate: new Date('2026-01-06'),
        description: "Create a Frogger-style game while mastering the Amiga's custom chipset.",
        link: '/commodore-amiga/assembly/game-01-signal/',
      },
    ],
    customData: `<language>en-gb</language>`,
  });
}
