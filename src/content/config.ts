import { defineCollection, z } from "astro:content";

// ============================================================================
// VAULT COLLECTIONS - Encyclopedia of Retro Computing
// ============================================================================

// Base schema that all vault entries share
const vaultBaseSchema = z.object({
  name: z.string(),
  status: z.enum(['available', 'coming', 'draft']).default('draft'),
  tags: z.array(z.string()).default([]),
  description: z.string(),
  featured: z.boolean().default(false),
  lastUpdated: z.date().default(() => new Date()),
  relatedEntries: z.record(
    z.array(z.object({
      name: z.string(),
      slug: z.string(),
      available: z.boolean().default(false)
    }))
  ).optional()
});

// Hardware (systems, chips, peripherals) - NEW VAULT COLLECTION
const hardware = defineCollection({
  type: "content",
  schema: vaultBaseSchema.extend({
    type: z.enum(['computer', 'console', 'chip', 'peripheral', 'addon']),
    year: z.number(),
    endYear: z.number().optional(),
    manufacturer: z.string(),

    // Technical specs
    cpu: z.string().optional(),
    cpuSpeed: z.string().optional(),
    memory: z.string().optional(),
    graphics: z.string().optional(),
    sound: z.string().optional(),
    storage: z.string().optional(),
    media: z.array(z.string()).optional(),

    // Commercial info
    price: z.string().optional(),
    unitsSold: z.string().optional(),
    marketRegions: z.array(z.string()).optional(),

    // For chips/components
    chipType: z.enum(['processor', 'graphics', 'sound', 'memory', 'custom']).optional(),
    architecture: z.string().optional(),
    transistorCount: z.number().optional()
  })
});

// People (developers, designers, executives) - ENHANCED VAULT COLLECTION
const people = defineCollection({
  type: "content",
  schema: vaultBaseSchema.extend({
    type: z.enum(['engineer', 'designer', 'executive', 'artist', 'musician', 'programmer']),
    birthDate: z.date().optional(),
    birthPlace: z.string().optional(),
    nationality: z.string().optional(),

    companies: z.array(z.object({
      name: z.string(),
      role: z.string(),
      period: z.string()
    })).optional(),

    notableWorks: z.array(z.string()).optional(),
    awards: z.array(z.string()).optional(),
    quotes: z.array(z.object({
      text: z.string(),
      context: z.string(),
      year: z.number().optional()
    })).optional(),

    links: z.object({
      wikipedia: z.string().url().optional(),
      personal: z.string().url().optional(),
      twitter: z.string().optional()
    }).optional()
  })
});

// Companies
const companies = defineCollection({
  type: "content",
  schema: vaultBaseSchema.extend({
    type: z.enum(['manufacturer', 'publisher', 'developer', 'distributor']),
    founded: z.number(),
    defunct: z.number().optional(),
    headquarters: z.string(),

    founders: z.array(z.string()).optional(),
    keyPeople: z.array(z.object({
      name: z.string(),
      role: z.string(),
      period: z.string().optional()
    })).optional(),

    parentCompany: z.string().optional(),
    subsidiaries: z.array(z.string()).optional(),

    notableProducts: z.array(z.string()).optional(),
    notableGames: z.array(z.string()).optional(),

    fate: z.string().optional()
  })
});

// Software
const software = defineCollection({
  type: "content",
  schema: vaultBaseSchema.extend({
    type: z.enum(['game', 'application', 'os', 'utility', 'demo', 'language']),
    year: z.number(),
    platforms: z.array(z.string()),

    developer: z.string(),
    publisher: z.string().optional(),

    genre: z.array(z.string()).optional(),

    language: z.string().optional(),
    size: z.string().optional(),
    media: z.string().optional(),

    players: z.string().optional(),

    reviews: z.array(z.object({
      publication: z.string(),
      score: z.string(),
      quote: z.string().optional()
    })).optional(),

    legacy: z.array(z.string()).optional()
  })
});

// Techniques
const techniques = defineCollection({
  type: "content",
  schema: vaultBaseSchema.extend({
    type: z.enum(['graphics', 'sound', 'optimization', 'algorithm', 'hardware-trick']),
    platforms: z.array(z.string()),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),

    prerequisites: z.array(z.string()).optional(),
    memoryUsage: z.string().optional(),
    cpuUsage: z.string().optional(),

    pioneers: z.array(z.string()).optional(),
    notableUses: z.array(z.string()).optional(),

    tutorials: z.array(z.object({
      title: z.string(),
      url: z.string().url()
    })).optional()
  })
});

// Publications
const publications = defineCollection({
  type: "content",
  schema: vaultBaseSchema.extend({
    type: z.enum(['magazine', 'book', 'manual', 'newsletter', 'fanzine']),

    publisher: z.string(),
    firstIssue: z.date().optional(),
    lastIssue: z.date().optional(),
    frequency: z.enum(['weekly', 'monthly', 'bi-monthly', 'quarterly', 'annual']).optional(),

    issueCount: z.number().optional(),
    circulation: z.string().optional(),

    author: z.array(z.string()).optional(),
    isbn: z.string().optional(),
    pages: z.number().optional(),
    edition: z.string().optional(),

    focus: z.array(z.string()).optional(),
    platforms: z.array(z.string()).optional(),

    notableFeatures: z.array(z.string()).optional(),
    notableContributors: z.array(z.string()).optional(),

    digitalArchive: z.string().url().optional()
  })
});

// Events
const events = defineCollection({
  type: "content",
  schema: vaultBaseSchema.extend({
    type: z.enum(['trade-show', 'launch', 'competition', 'demo-party', 'conference']),

    date: z.date(),
    endDate: z.date().optional(),
    recurring: z.boolean().default(false),

    location: z.object({
      venue: z.string().optional(),
      city: z.string(),
      country: z.string()
    }),

    organizer: z.string().optional(),
    attendance: z.number().optional(),

    highlights: z.array(z.string()).optional(),

    competitions: z.array(z.object({
      category: z.string(),
      winner: z.string(),
      production: z.string()
    })).optional(),

    links: z.object({
      official: z.string().url().optional(),
      results: z.string().url().optional(),
      productions: z.string().url().optional()
    }).optional()
  })
});

// Groups
const groups = defineCollection({
  type: "content",
  schema: vaultBaseSchema.extend({
    type: z.enum(['demo', 'cracking', 'development', 'music', 'art']),

    formed: z.number(),
    disbanded: z.number().optional(),
    country: z.string(),

    members: z.array(z.object({
      handle: z.string(),
      realName: z.string().optional(),
      role: z.string(),
      period: z.string().optional()
    })).optional(),

    notableReleases: z.array(z.object({
      name: z.string(),
      year: z.number(),
      type: z.string(),
      platform: z.string()
    })).optional(),

    affiliates: z.array(z.string()).optional(),

    legacy: z.string().optional()
  })
});

// Formats
const formats = defineCollection({
  type: "content",
  schema: vaultBaseSchema.extend({
    type: z.enum(['file', 'media', 'video', 'audio', 'protocol']),

    extension: z.string().optional(),
    mimeType: z.string().optional(),

    creator: z.string().optional(),
    year: z.number().optional(),

    platforms: z.array(z.string()).optional(),

    structure: z.string().optional(),
    maxSize: z.string().optional(),
    compression: z.boolean().default(false),

    capacity: z.string().optional(),
    physicalSize: z.string().optional(),

    tools: z.array(z.object({
      name: z.string(),
      platform: z.string(),
      url: z.string().url().optional()
    })).optional(),

    successor: z.string().optional()
  })
});

// Culture
const culture = defineCollection({
  type: "content",
  schema: vaultBaseSchema.extend({
    type: z.enum(['scene', 'movement', 'phenomenon', 'community', 'practice']),

    period: z.object({
      start: z.number(),
      end: z.number().optional(),
      peak: z.string().optional()
    }),

    origins: z.string().optional(),
    regions: z.array(z.string()).optional(),

    keyFigures: z.array(z.string()).optional(),
    keyGroups: z.array(z.string()).optional(),
    keyEvents: z.array(z.string()).optional(),

    characteristics: z.array(z.string()).optional(),

    influence: z.array(z.string()).optional(),
    modernLegacy: z.string().optional()
  })
});

// ============================================================================
// LESSON/CONTENT COLLECTIONS
// ============================================================================

// Systems collection - the 4 main vintage computing platforms
const systems = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    full_name: z.string().optional(), // Full official name if different
    manufacturer: z.string(),
    model_number: z.string().optional(),
    alternative_names: z.array(z.string()).optional(), // Nicknames, regional names

    // Hardware specifications
    cpu: z.string(),
    cpu_details: z
      .object({
        architecture: z.string().optional(), // "8-bit", "16-bit", "16/32-bit hybrid"
        instruction_set: z.string().optional(), // "6502", "Z80", "68000"
        addressing_modes: z.array(z.string()).optional(),
        registers: z.string().optional(), // Description of register set
      })
      .optional(),

    clock_speed: z.string().optional(),
    ram: z.string(),
    ram_details: z
      .object({
        user_available: z.string().optional(), // How much is actually available to programs
        video_ram: z.string().optional(),
        expansion_options: z.array(z.string()).optional(),
      })
      .optional(),

    rom: z.string().optional(),
    rom_contents: z.array(z.string()).optional(), // "BASIC interpreter", "KERNAL", "Character ROM"

    // Graphics capabilities
    video: z
      .object({
        processor: z.string().optional(),
        resolution: z.string(),
        colors: z.string(),
        display_modes: z.array(z.string()).optional(),
        sprites: z
          .object({
            count: z.number().optional(),
            size: z.string().optional(),
            colors_per_sprite: z.number().optional(),
          })
          .optional(),
        hardware_scrolling: z.boolean().optional(),
        raster_interrupts: z.boolean().optional(),
      })
      .optional(),

    // Audio capabilities
    audio: z
      .object({
        chip: z.string().optional(),
        channels: z.number().optional(),
        features: z.array(z.string()).optional(),
        sample_playback: z.boolean().optional(),
        synthesis_types: z.array(z.string()).optional(), // "FM", "PSG", "PCM"
      })
      .optional(),

    // Storage and I/O
    storage: z.array(z.string()),
    storage_details: z
      .object({
        built_in: z.array(z.string()).optional(), // What storage is built in
        expansion: z.array(z.string()).optional(), // What can be added
        typical_capacity: z
          .object({
            cassette: z.string().optional(),
            floppy: z.string().optional(),
            cartridge: z.string().optional(),
          })
          .optional(),
      })
      .optional(),

    io_ports: z.array(z.string()).optional(),
    expansion_options: z.array(z.string()).optional(), // Expansion slots, ports, etc.

    // Commercial information
    price_at_launch: z
      .object({
        global: z.string().optional(),
        countries: z
          .array(
            z.object({
              country: z.string(),
              price: z.string(),
              currency: z.string(),
            })
          )
          .optional(),
      })
      .optional(),

    price_history: z
      .array(
        z.object({
          year: z.number(),
          price: z.string(),
          currency: z.string(),
          notes: z.string().optional(), // "After price cut", "With bundle"
        })
      )
      .optional(),

    release_date: z.object({
      global: z.date(),
      countries: z
        .array(
          z.object({
            country: z.string(),
            date: z.date(),
          })
        )
        .optional(),
    }),

    discontinued: z.date().optional(),
    production_run: z.string().optional(), // "1982-1994"
    units_sold: z.string().optional(),
    market_share: z
      .object({
        peak_year: z.number().optional(),
        percentage: z.string().optional(),
        region: z.string().optional(),
      })
      .optional(),

    // System information
    country_of_origin: z.string(),
    operating_system: z.string().optional(),
    programming_languages: z.array(z.string()).optional(), // Built-in languages

    // Target market and positioning
    target_market: z.array(z.string()).optional(), // "Home users", "Education", "Business"
    market_positioning: z.string().optional(), // How it was marketed
    competition: z.array(z.string()).optional(), // Main competitors

    // Variants and models
    variants: z
      .array(
        z.object({
          name: z.string(),
          model_number: z.string().optional(),
          release_date: z
            .object({
              global: z.date(),
              countries: z
                .array(
                  z.object({
                    country: z.string(),
                    date: z.date(),
                  })
                )
                .optional(),
            })
            .optional(),
          discontinued: z.date().optional(),
          price_at_launch: z
            .object({
              countries: z
                .array(
                  z.object({
                    country: z.string(),
                    price: z.string(),
                    currency: z.string(),
                  })
                )
                .optional(),
            })
            .optional(),
          differences: z.string(),
          significance: z.string().optional(),
        })
      )
      .optional(),

    // Software ecosystem
    notable_software: z
      .array(
        z.object({
          name: z.string(),
          type: z.string(),
          year: z.number(),
          developer: z.string(),
          publisher: z.string(),
          significance: z.string().optional(),
        })
      )
      .optional(),

    software_library_size: z
      .object({
        commercial_games: z.string().optional(),
        applications: z.string().optional(),
        total_titles: z.string().optional(),
      })
      .optional(),

    // Development and programming
    development_tools: z.array(z.string()).optional(), // Available assemblers, compilers, etc.
    programming_characteristics: z.array(z.string()).optional(), // What made it unique to program
    hardware_quirks: z.array(z.string()).optional(), // Notable hardware limitations or features

    // Cultural and historical impact
    historical_significance: z.string().optional(),
    cultural_impact: z.string().optional(),
    innovation_highlights: z.array(z.string()).optional(),
    industry_influence: z.string().optional(),

    // Educational relevance
    educational_value: z
      .object({
        programming_concepts: z.array(z.string()).optional(),
        hardware_concepts: z.array(z.string()).optional(),
        historical_lessons: z.array(z.string()).optional(),
        why_study_this_system: z.string().optional(),
      })
      .optional(),

    learning_advantages: z.array(z.string()).optional(), // What makes this good for learning
    common_beginner_projects: z.array(z.string()).optional(),

    // Modern preservation and emulation
    emulated: z.boolean().default(true),
    emulators: z
      .array(
        z.object({
          name: z.string(),
          platform: z.string(), // "Windows", "macOS", "Linux", "Web"
          accuracy: z.enum(["cycle_accurate", "high", "good", "basic"]).optional(),
          notes: z.string().optional(),
        })
      )
      .optional(),

    preservation_status: z.enum(["excellent", "good", "fair", "poor"]).optional(),
    hardware_availability: z.enum(["common", "available", "rare", "extremely_rare"]).optional(),

    // Documentation and resources
    technical_documentation: z
      .array(
        z.object({
          title: z.string(),
          type: z.enum([
            "service_manual",
            "programming_guide",
            "hardware_reference",
            "user_manual",
          ]),
          url: z.string().optional(),
        })
      )
      .optional(),

    // Media
    description: z.string().optional(),

    // Platform Classification (Olympic Medal System)
    medal_tier: z.enum(["platinum", "gold", "silver", "bronze"]).optional(),
    total_lessons: z.number().optional(), // 4096, 2048, 1024, or 512
    total_games: z.number().optional(), // 30-40, 20-25, 12-15, or 6-8
    estimated_duration: z.string().optional(), // "6-12 months", "3-6 months", etc.
    cpu_architecture: z.string().optional(), // "6502", "Z80", "68000", etc.
    prerequisite_platforms: z.array(z.string()).optional(), // Other platforms to complete first
    difficulty_level: z
      .enum(["beginner", "intermediate", "advanced", "expert", "historical"])
      .optional(),

    // Platform Status
    status: z.enum(["active", "planned", "vault"]).default("planned"), // 'active' = has lessons, 'planned' = future curriculum, 'vault' = historical reference only

    // Learning Path Information
    architecture_family: z.string().optional(), // For grouping in architecture tracks
    recommended_next: z.array(z.string()).optional(), // Suggested platforms to learn next

    // Metadata
    order: z.number(), // For display ordering
  }),
});

// Phases collection - 8 phases per system (0-8, Phase 0 is foundation)
const phases = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    system: z.string(), // References system slug
    phase_number: z.number().min(0).max(8), // Allow Phase 0
    description: z.string(),
    learning_objectives: z.array(z.string()),
    prerequisites: z.array(z.string()).optional(),
    estimated_duration: z.string(), // e.g., "8-12 weeks"
    difficulty_level: z.enum(["beginner", "intermediate", "advanced", "expert"]),
    tools_required: z.array(z.string()).optional(),

    // Phase 0 specific fields
    is_foundation: z.boolean().default(false), // True for Phase 0
    programming_language: z.enum(["basic", "asm", "forth", "amos", "mixed"]).optional(),
    total_lessons: z.number().optional(), // Total lessons in phase (128 for Phase 0)

    order: z.number(),
  }),
});

// Tiers are now nested under phases
const tiers = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    system: z.string(),
    phase_number: z.number().min(0).max(8), // Allow Phase 0
    tier_number: z.number().min(1).max(16),
    description: z.string(),
    learning_objectives: z.array(z.string()),
    concepts_introduced: z.array(z.string()),
    estimated_duration: z.string(), // e.g., "1-2 weeks"

    // Phase 0 specific fields
    programming_language: z.enum(["basic", "asm", "forth", "amos", "mixed"]).optional(),
    lessons_count: z.number().default(16), // 16 lessons per tier in Phase 0

    game_project: z
      .object({
        name: z.string(),
        description: z.string(),
        tier_range: z.string(), // e.g., "Tiers 1-4"
      })
      .optional(), // Only every 4th tier has a game
    order: z.number(),
  }),
});

// Lessons collection - 32 lessons per tier
const lessons = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    system: z.string(),
    phase_number: z.number().min(0).max(8), // Allow Phase 0
    tier_number: z.number().min(1).max(16),
    lesson_number: z.number().min(1).max(32),

    // Phase 0 specific fields (using platform instead of system for consistency)
    platform: z.string().optional(), // For Phase 0 lessons
    phase: z.number().min(0).max(8).optional(), // For Phase 0 lessons
    tier: z.number().min(1).max(16).optional(), // For Phase 0 lessons
    lesson: z.number().min(1).max(32).optional(), // For Phase 0 lessons

    description: z.string().optional(), // Optional for Phase 0 format
    learning_objectives: z.array(z.string()).optional(),
    concepts: z.array(z.string()).optional(),
    estimated_duration: z.string().optional(), // e.g., "30-45 minutes"
    difficulty: z.enum(["easy", "medium", "hard"]).optional(),
    prerequisites: z.array(z.string()).optional(),
    code_examples: z.boolean().default(true), // Default true for Phase 0
    practical_exercise: z.boolean().default(true), // Default true for Phase 0
    related_lessons: z.array(z.string()).optional(), // References to other lesson slugs
    external_resources: z
      .array(
        z.object({
          title: z.string(),
          url: z.string(),
          type: z.enum(["documentation", "video", "article", "tool"]),
        })
      )
      .optional(),

    // Phase 0 lesson structure
    programs: z
      .array(
        z.object({
          number: z.number(),
          title: z.string(),
          code: z.string(),
          explanation: z.string(),
          language: z.enum(["basic", "asm", "forth", "amos"]).default("basic"),
        })
      )
      .optional(),

    challenges: z.array(z.string()).optional(),
    common_problems: z
      .array(
        z.object({
          problem: z.string(),
          solution: z.string(),
        })
      )
      .optional(),

    fun_fact: z.string().optional(),
    next_lesson_preview: z.string().optional(),
    download_links: z
      .array(
        z.object({
          name: z.string(),
          url: z.string(),
          type: z.enum(["bas", "asm", "prg", "tap", "disk", "rom"]),
        })
      )
      .optional(),

    order: z.number(),
  }),
});

// Games collection - Original games created during the course
const games = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    system: z.string(),
    phase_number: z.number().min(1).max(8),
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

const setup = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    system: z.string(),
    difficulty: z.string(),
    estimated_time: z.string(),
    prerequisites: z.array(z.string()),
    tools_covered: z.array(z.string()),
    platforms_supported: z.array(z.string()),
    docker_image: z.string(),
    order: z.number(),
  }),
});

export const collections = {
  // Lesson/Content collections
  systems,
  phases,
  tiers,
  lessons,
  setup,

  // Vault collections (comprehensive knowledge base)
  hardware,
  people,
  companies,
  software,
  techniques,
  publications,
  events,
  groups,
  formats,
  culture,

  // Legacy collections (to be migrated)
  games,
};
