import { defineCollection, z } from 'astro:content';

// Systems collection - the 4 main vintage computing platforms
const systems = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    manufacturer: z.string(),
    model_number: z.string().optional(),
    cpu: z.string(),
    clock_speed: z.string().optional(),
    ram: z.string(),
    rom: z.string().optional(),
    video: z.object({
      processor: z.string().optional(),
      resolution: z.string(),
      colors: z.string(),
      display_modes: z.array(z.string()).optional(),
    }).optional(),
    audio: z.object({
      chip: z.string().optional(),
      channels: z.number().optional(),
      features: z.array(z.string()).optional(),
    }).optional(),
    storage: z.array(z.string()),
    io_ports: z.array(z.string()).optional(),
    price_at_launch: z.object({
      global: z.string().optional(),
      countries: z.array(z.object({
        country: z.string(),
        price: z.string(),
        currency: z.string(),
      })).optional(),
    }).optional(),
    release_date: z.object({
      global: z.date(),
      countries: z.array(z.object({
        country: z.string(),
        date: z.date(),
      })).optional(),
    }),
    discontinued: z.date().optional(),
    units_sold: z.string().optional(),
    country_of_origin: z.string(),
    operating_system: z.string().optional(),
    emulated: z.boolean().default(true),
    emulators: z.array(z.string()).optional(),
    variants: z.array(z.object({
      name: z.string(),
      model_number: z.string().optional(),
      release_date: z.object({
        global: z.date(),
        countries: z.array(z.object({
          country: z.string(),
          date: z.date(),
        })).optional(),
      }).optional(),
      discontinued: z.date().optional(),
      price_at_launch: z.object({
        countries: z.array(z.object({
          country: z.string(),
          price: z.string(),
          currency: z.string(),
        })).optional(),
      }).optional(),
      differences: z.string(),
    })).optional(),
    notable_software: z.array(z.object({
      name: z.string(),
      type: z.string(),
      year: z.number(),
      developer: z.string(),
      publisher: z.string(),
    })).optional(),
    historical_significance: z.string().optional(),
    image: z.string(),
    order: z.number(), // For display ordering
  }),
});

// Phases collection - 8 phases per system (1-8)
const phases = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    system: z.string(), // References system slug
    phase_number: z.number().min(1).max(8),
    description: z.string(),
    learning_objectives: z.array(z.string()),
    prerequisites: z.array(z.string()).optional(),
    estimated_duration: z.string(), // e.g., "8-12 weeks"
    difficulty_level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
    tools_required: z.array(z.string()).optional(),
    order: z.number(),
  }),
});

// Tiers collection - 16 tiers per phase
const tiers = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    system: z.string(),
    phase_number: z.number().min(1).max(8),
    tier_number: z.number().min(1).max(16),
    description: z.string(),
    learning_objectives: z.array(z.string()),
    concepts_introduced: z.array(z.string()),
    estimated_duration: z.string(), // e.g., "1-2 weeks"
    game_project: z.object({
      name: z.string(),
      description: z.string(),
      tier_range: z.string(), // e.g., "Tiers 1-4"
    }).optional(), // Only every 4th tier has a game
    order: z.number(),
  }),
});

// Lessons collection - 32 lessons per tier
const lessons = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    system: z.string(),
    phase_number: z.number().min(0).max(7),
    tier_number: z.number().min(1).max(16),
    lesson_number: z.number().min(1).max(32),
    description: z.string(),
    learning_objectives: z.array(z.string()),
    concepts: z.array(z.string()),
    estimated_duration: z.string(), // e.g., "30-45 minutes"
    difficulty: z.enum(['easy', 'medium', 'hard']),
    prerequisites: z.array(z.string()).optional(),
    code_examples: z.boolean().default(false),
    practical_exercise: z.boolean().default(false),
    related_lessons: z.array(z.string()).optional(), // References to other lesson slugs
    external_resources: z.array(z.object({
      title: z.string(),
      url: z.string(),
      type: z.enum(['documentation', 'video', 'article', 'tool']),
    })).optional(),
    order: z.number(),
  }),
});

// Games collection - Original games created during the course
const games = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    system: z.string(),
    phase_number: z.number().min(0).max(7),
    tier_range: z.string(), // e.g., "1-4", "5-8", etc.
    genre: z.string(),
    description: z.string(),
    gameplay_mechanics: z.array(z.string()),
    technical_features: z.array(z.string()),
    concepts_demonstrated: z.array(z.string()),
    estimated_dev_time: z.string(),
    source_code_available: z.boolean().default(true),
    playable_online: z.boolean().default(false),
    screenshots: z.array(z.string()).optional(),
    order: z.number(),
  }),
});

// People collection - Historical figures in computing
const people = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    birth_date: z.date().optional(),
    death_date: z.date().optional(),
    nationality: z.string(),
    occupation: z.array(z.string()),
    notable_contributions: z.array(z.string()),
    companies_founded: z.array(z.string()).optional(),
    companies_worked_for: z.array(z.string()).optional(),
    awards: z.array(z.string()).optional(),
    legacy: z.string().optional(),
    image: z.string().optional(),
    external_links: z.array(z.object({
      title: z.string(),
      url: z.string(),
    })).optional(),
  }),
});

// Companies collection - Computing companies
const companies = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    founded: z.date(),
    dissolved: z.date().optional(),
    headquarters: z.string(),
    country: z.string(),
    founders: z.array(z.string()),
    key_people: z.array(z.string()).optional(),
    notable_products: z.array(z.string()),
    business_focus: z.array(z.string()),
    acquired_by: z.string().optional(),
    acquisition_date: z.date().optional(),
    legacy: z.string().optional(),
    logo: z.string().optional(),
    external_links: z.array(z.object({
      title: z.string(),
      url: z.string(),
    })).optional(),
  }),
});

// Software collection - Notable applications and games
const software = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    type: z.enum(['game', 'application', 'utility', 'operating_system', 'programming_language']),
    systems: z.array(z.string()), // Which systems it ran on
    developer: z.string(),
    publisher: z.string().optional(),
    release_date: z.date(),
    genre: z.string().optional(), // For games
    category: z.string().optional(), // For applications
    description: z.string(),
    significance: z.string(),
    technical_innovations: z.array(z.string()).optional(),
    sales_figures: z.string().optional(),
    awards: z.array(z.string()).optional(),
    screenshots: z.array(z.string()).optional(),
    external_links: z.array(z.object({
      title: z.string(),
      url: z.string(),
    })).optional(),
  }),
});

// Events collection - Historical timeline events
const events = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    category: z.enum(['Technology', 'Gaming History', 'World History', 'Computing', 'Gaming', 'Business', 'Cultural', 'Political', 'Scientific']),
    location: z.string().optional(),
    description: z.string(),
    significance: z.string(),
    impact_on_computing: z.string().optional(),
    related_people: z.array(z.string()).optional(),
    related_companies: z.array(z.string()).optional(),
    related_systems: z.array(z.string()).optional(),
    external_links: z.array(z.object({
      title: z.string(),
      url: z.string(),
    })).optional(),
  }),
});

export const collections = {
  systems,
  phases,
  tiers,
  lessons,
  games,
  people,
  companies,
  software,
  events,
};