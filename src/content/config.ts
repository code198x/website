import { defineCollection, z } from 'astro:content';

const systems = defineCollection({
  schema: z.object({
    name: z.string(),
    manufacturer: z.string(),
    model_number: z.string().optional(),
    cpu: z.string(),
    clock_speed: z.string().optional(),
    ram: z.string().optional(),
    video_output: z.string().optional(),
    storage: z.string().optional(),
    price_at_launch: z.string().optional(),
    release_date: z.date(),
    discontinued: z.date().optional(),
    units_sold: z.string().optional(),
    emulated: z.boolean().optional(),
    country_of_origin: z.string(),
  }),
});

const people = defineCollection({
  schema: z.object({
    name: z.string(),
  }),
});

const companies = defineCollection({
  schema: z.object({
    name: z.string(),
  }),
});

const games = defineCollection({
  schema: z.object({
    title: z.string(),
  }),
});

const lessons = defineCollection({
  schema: z.object({
    title: z.string(),
    system: z.string(),
    tier: z.number(),
    order: z.number(),
    slug: z.string().optional(),
    summary: z.string().optional(),
  }),
});


export const collections = {
  systems,
  people,
  companies,
  games,
  lessons,
}; 