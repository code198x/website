import { defineCollection, z } from 'astro:content';

// Platform/system definitions - the source of truth for all platform data
const platforms = defineCollection({
  type: 'data',
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
    curriculumStatus: z.string().optional(), // e.g. "Game 1 Phase 2 live"
    navOrder: z.number(),
  }),
});

const vault = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    summary: z.string(),
    category: z.enum([
      'people',
      'companies',
      'games',
      'techniques',
      'hardware',
      'systems',
      'culture'
    ]),
    platforms: z.array(z.enum(['c64', 'spectrum', 'amiga', 'nes'])).optional(),
    tags: z.array(z.string()).default([]),
    years: z.array(z.number().nullable()).optional(),
  }),
});

const patterns = defineCollection({
  type: 'content',
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
  type: 'content',
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
  type: 'data',
  schema: z.object({
    name: z.string(),
    description: z.string(),
    icon: z.string(), // Lucide icon name
    order: z.number(),
  }),
});

// Pattern library difficulty levels
const patternDifficulties = defineCollection({
  type: 'data',
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
  type: 'data',
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
  type: 'data',
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
  type: 'data',
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
  type: 'data',
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
    })),
  }),
});

// Unit details for each game - phases and individual unit information
const units = defineCollection({
  type: 'data',
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
    })),
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
};
