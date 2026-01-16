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

export const collections = { platforms, vault, patterns, timeline };
