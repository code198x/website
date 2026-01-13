import { defineCollection, z } from 'astro:content';

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

export const collections = { vault, patterns, timeline };
