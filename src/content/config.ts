import { defineCollection, z } from 'astro:content';

const platformCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    type: z.enum(['Home Computer', 'Console', 'Other']),
    manufacturer: z.string().optional(),
    year: z.number().optional(),
    order: z.number().optional(), // For sorting lists
  }),
});

const tutorialCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    platform: z.array(z.string()), // Can tag multiple platforms if applicable
    tags: z.array(z.string()), // e.g., ['basic', 'assembly', 'graphics', 'sound', 'beginner']
    // Potentially add 'series' identifier
  }),
});

const conceptCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const postCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = {
  'platforms': platformCollection,
  'tutorials': tutorialCollection,
  'concepts': conceptCollection,
  'posts': postCollection,
}; 