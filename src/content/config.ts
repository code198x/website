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
    years: z.array(z.number()).optional(),
  }),
});

export const collections = { vault };
