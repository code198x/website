import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

// Platform/system definitions - the source of truth for all platform data
const platforms = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: 'src/content/platforms' }),
  schema: z.object({
    // Identity
    name: z.string(),
    shortName: z.string(),
    year: z.number(),
    color: z.string(),
    tagline: z.string(),

    // Classification
    type: z.enum(['computer', 'console', 'handheld']),
    bits: z.enum(['8', '16', '32', '64', '128']),
    region: z.enum(['US', 'UK', 'Japan', 'Europe', 'Netherlands']),
    manufacturer: z.string(), // references manufacturers collection
    cpu: z.string(),
    cpuArchitecture: z.enum([
      // 8-bit families
      '8080',      // Intel 8080/8085
      'f8',        // Fairchild F8
      '1802',      // RCA CDP1802
      'mcs48',     // Intel MCS-48 (8048/8049)
      'cp1610',    // General Instrument CP1610
      'tms9900',   // Texas Instruments TMS9900
      '6502',      // MOS 6502 and variants
      'z80',       // Zilog Z80
      '6809',      // Motorola 6809
      // 16-bit families
      '65c816',    // WDC 65C816 (16-bit 6502)
      'x86',       // Intel 8086/8088 and successors
      '68000',     // Motorola 68000
      // 32-bit families
      'arm',       // ARM (Acorn RISC Machine)
      'sh2',       // Hitachi SuperH SH-2
      'v810',      // NEC V810
      'mips',      // MIPS R3000/R4300
      // Later generations
      'sh4',       // Hitachi SuperH SH-4
      'tlcs900',   // Toshiba TLCS-900
    ]),

    // Toolchain (optional for coming-soon platforms)
    assembler: z.string().optional(),
    assemblerLanguage: z.enum(['6502', 'z80', 'm68k', 'ca65']).optional(),
    emulator: z.string().optional(),
    buildOutput: z.string().optional(),
    toolchainExtras: z.array(z.string()).default([]),
    dockerImage: z.string().optional(),

    // Navigation & Status
    status: z.enum(['active', 'coming-soon']),
    // Honest fleet tier (drives /systems/ wall). live = shipping; next = validated, in build;
    // planned = skeleton + subscribe; edge = strains the method (vector/3D-first/add-ons);
    // beyond = outside the curriculum's domain (kit micros, CD-multimedia, gen-6 consoles).
    tier: z.enum(['live', 'next', 'planned', 'edge', 'beyond']).optional(),
    curriculumStatus: z.string().optional(), // e.g. "Game 1 Phase 2 live"
    recommendationTag: z.string().optional(), // Optional badge for systems page recommendations
    navOrder: z.number(),
  }),
});

const vault = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: 'src/content/vault' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    summary: z.string(),
    category: z.enum([
      'people',
      'companies',
      'groups',        // Scene collectives, informal organisations (Fairlight, Future Crew)
      'games',
      'demos',         // Demo scene productions (Second Reality, State of the Art)
      'techniques',
      'hardware',
      'systems',
      'culture',
      'events',        // Demo parties, LAN events, conferences (Assembly, QuakeCon)
      'magazines',     // Gaming press (CRASH, ZZAP!64, Your Sinclair)
      'books',         // Books about gaming/programming
      'phenomena',     // Cultural phenomena (video game crash, bedroom coding)
      'tools',         // Development tools, trackers, archives (ProTracker, HVSC)
      'genres',        // Game genres (JRPG, roguelike, immersive sim)
      'emulators',     // Emulation software (VICE, MAME)
      'distribution',  // Software distribution methods (shareware, budget games, cover tapes)
      'communities'    // Subcultures and communities (demo scene, modding, speedrunning)
    ]),
    // Platforms can be any string - vault covers more systems than the curriculum
    platforms: z.array(z.string()).optional(),
    tags: z.array(z.string()).default([]),

    // Category-specific date fields (all optional, use null for unknown/ongoing)
    // People: birth and death years
    born: z.number().nullable().optional(),
    died: z.number().nullable().optional(),
    // Companies: founding and dissolution/merger
    founded: z.number().nullable().optional(),
    dissolved: z.number().nullable().optional(),
    // Games: release year
    released: z.number().nullable().optional(),
    // Techniques: when originated and deprecated (if applicable)
    originated: z.number().nullable().optional(),
    deprecated: z.number().nullable().optional(),
    // Culture: emergence and ending (if applicable)
    emerged: z.number().nullable().optional(),
    ended: z.number().nullable().optional(),
    // Hardware/Systems: introduction and discontinuation
    introduced: z.number().nullable().optional(),
    discontinued: z.number().nullable().optional(),
  }),
});

const patterns = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: 'src/content/patterns' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    platform: z.enum([
      'commodore-64',
      'sinclair-zx-spectrum',
      'commodore-amiga',
      'nintendo-nes',
      'cross-platform'
    ]),
    category: z.enum([
      'rendering',
      'input',
      'audio',
      'physics',
      'ai',
      'framework'
    ]),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    taught_in: z.string().optional(),
    tags: z.array(z.string()).default([]),
    evolution: z.object({
      previous: z.string().nullable(),
      next: z.string().nullable(),
    }).optional(),
    related: z.object({
      patterns: z.array(z.string()).default([]),
      vault: z.array(z.string()).default([]),
    }).optional(),
  }),
});

const timeline = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: 'src/content/timeline' }),
  schema: z.object({
    title: z.string(),
    year: z.number(),
    month: z.number().optional(),
    day: z.number().optional(),
    category: z.enum(['politics', 'culture', 'technology', 'economics', 'science']),
    summary: z.string(),
  }),
});

// Pattern library categories (rendering, input, audio, etc.)
const patternCategories = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: 'src/content/pattern-categories' }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    icon: z.string(), // Lucide icon name
    order: z.number(),
  }),
});

// Pattern library difficulty levels
const patternDifficulties = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: 'src/content/pattern-difficulties' }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    icon: z.string(), // Lucide icon name
    color: z.string(), // CSS color or variable
    order: z.number(),
  }),
});

// Manufacturers - companies that made the platforms
const manufacturers = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: 'src/content/manufacturers' }),
  schema: z.object({
    name: z.string(),
    shortName: z.string(),
    country: z.string(),
    city: z.string(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
    founded: z.number(),
    defunct: z.number().optional(),
    color: z.string().optional(),
  }),
});

// CPU architectures - groupings for the systems page
const architectures = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: 'src/content/architectures' }),
  schema: z.object({
    name: z.string(),
    shortName: z.string(),
    description: z.string(),
    era: z.enum(['early', 'classic-8bit', '16bit', '32bit', 'later']),
    bits: z.enum(['8', '16', '32', '64', '128']),
    order: z.number(),
  }),
});

// Vault categories (systems, hardware, people, etc.)
const vaultCategories = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: 'src/content/vault-categories' }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    icon: z.string(), // Lucide icon name or emoji
    color: z.string(), // CSS color for category accent
    order: z.number(),
  }),
});

// Games catalogue - curriculum games organised by platform and track
// Note: units and unitsAvailable are computed from the units collection
const games = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: 'src/content/games' }),
  schema: z.object({
    platform: z.string(), // e.g., commodore-64, sinclair-zx-spectrum
    track: z.enum(['assembly', 'basic', 'amos']),
    games: z.array(z.object({
      number: z.number(),
      slug: z.string(),
      name: z.string(),
      tagline: z.string(),
      skills: z.array(z.string()),
      status: z.enum(['in-progress', 'coming-soon', 'complete']),
      thumbnail: z.string().optional(),
      phase: z.string().optional(),
    })),
  }),
});

// Unit details for each game - phases and individual unit information
const units = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: 'src/content/units' }),
  schema: z.object({
    platform: z.string(),
    track: z.enum(['assembly', 'basic', 'amos']),
    gameSlug: z.string(),
    phases: z.array(z.object({
      name: z.string(),
      description: z.string(),
      hours: z.string(), // e.g., "16-24"
      start: z.number(),
      end: z.number(),
    })),
    units: z.array(z.object({
      number: z.number(),
      title: z.string(),
      available: z.boolean().default(false),
      description: z.string().optional(),
      thumbnail: z.string().optional(),
    })),
  }),
});

// MDX page collections — migrated from src/pages/ file-based routing
// Computed fields (layout, prevLesson, nextLesson, totalUnits, system, gameName)
// are derived at render time from the entry's ID path in [...slug].astro

const unitPages = defineCollection({
  loader: glob({ pattern: '**/unit-*.mdx', base: 'src/content/curriculum' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date().optional(),
    game: z.number(),
    unit: z.number(),
    tags: z.array(z.string()).default([]),
    status: z.string().optional(),
    heroImage: z.string().optional(),
    learningTime: z.number().optional(),
  }),
});

const gamePages = defineCollection({
  loader: glob({ pattern: '**/index.mdx', base: 'src/content/curriculum' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    status: z.enum(['in-progress', 'coming-soon', 'complete']).optional(),
    game: z.number().optional(),
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(),
    units: z.array(z.object({
      number: z.number(),
      title: z.string(),
      available: z.boolean().default(false),
    })).default([]),
  }),
});

const gettingStartedPages = defineCollection({
  loader: glob({ pattern: '**/getting-started.mdx', base: 'src/content/curriculum' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    systemSlug: z.string().optional(),
    accentColor: z.string().optional(),
  }),
});

export const collections = {
  platforms,
  manufacturers,
  architectures,
  vault,
  patterns,
  timeline,
  games,
  units,
  'pattern-categories': patternCategories,
  'pattern-difficulties': patternDifficulties,
  'vault-categories': vaultCategories,
  'unit-pages': unitPages,
  'game-pages': gamePages,
  'getting-started-pages': gettingStartedPages,
};
