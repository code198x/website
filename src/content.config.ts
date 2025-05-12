import { defineCollection, z } from 'astro:content';

const systems = defineCollection({
  schema: z.object({
    title: z.string(),
    release_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // ISO date string (YYYY-MM-DD)
    manufacturer: z.string(),
    summary: z.string(),
    discontinued: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // ISO date string (YYYY-MM-DD)
    variants: z.array(
      z.object({
        name: z.string(),
        release_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        discontinued: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        regions: z.array(z.string()),
        notes: z.string().optional(),
      })
    ).optional(),
  }),
});

const concepts = defineCollection({
  schema: z.object({
    title: z.string(),
    summary: z.string().optional(),
  }),
});

const people = defineCollection({
  schema: z.object({
    name: z.string(),
    bio: z.string().optional(),
  }),
});

const companies = defineCollection({
  schema: z.object({
    name: z.string(),
    summary: z.string().optional(),
    role: z.array(z.enum(['manufacturer', 'publisher', 'retailer'])).optional(),
    systems: z.array(z.string()).optional(),
    founded: z.string().regex(/^\d{4}(-\d{2}-\d{2})?$/).optional(),
  }),
});

const timelines = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

const lessons = defineCollection({
  schema: z.object({
    title: z.string(),
    system: z.string(), // e.g., 'zx-spectrum'
    phase: z.union([z.string(), z.number()]),
    order: z.number(), // for ordering within a phase
    summary: z.string().optional(),
    prerequisites: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = {
  systems,
  concepts,
  people,
  companies,
  timelines,
  lessons,
}; 