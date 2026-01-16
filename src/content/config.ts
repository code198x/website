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
    bits: z.enum(['8', '16', '32']),
    region: z.enum(['US', 'UK', 'Japan', 'Europe']),
    cpu: z.string(),
    cpuArchitecture: z.enum(['6502', 'z80', '68000']),

    // Toolchain
    assembler: z.string(),
    assemblerLanguage: z.enum(['6502', 'z80', 'm68k', 'ca65']),
    emulator: z.string(),
    buildOutput: z.string(),
    toolchainExtras: z.array(z.string()).default([]),
    dockerImage: z.string(),

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
      units: z.number(),
      unitsAvailable: z.number().optional(), // Computed from units collection when available
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
  vault,
  patterns,
  timeline,
  games,
  units,
  'pattern-categories': patternCategories,
  'pattern-difficulties': patternDifficulties,
  'vault-categories': vaultCategories,
};
