import { defineCollection, z } from 'astro:content';

// Systems collection - the 4 main vintage computing platforms
const systems = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    full_name: z.string().optional(), // Full official name if different
    manufacturer: z.string(),
    model_number: z.string().optional(),
    alternative_names: z.array(z.string()).optional(), // Nicknames, regional names
    
    // Hardware specifications
    cpu: z.string(),
    cpu_details: z.object({
      architecture: z.string().optional(), // "8-bit", "16-bit", "16/32-bit hybrid"
      instruction_set: z.string().optional(), // "6502", "Z80", "68000"
      addressing_modes: z.array(z.string()).optional(),
      registers: z.string().optional(), // Description of register set
    }).optional(),
    
    clock_speed: z.string().optional(),
    ram: z.string(),
    ram_details: z.object({
      user_available: z.string().optional(), // How much is actually available to programs
      video_ram: z.string().optional(),
      expansion_options: z.array(z.string()).optional(),
    }).optional(),
    
    rom: z.string().optional(),
    rom_contents: z.array(z.string()).optional(), // "BASIC interpreter", "KERNAL", "Character ROM"
    
    // Graphics capabilities
    video: z.object({
      processor: z.string().optional(),
      resolution: z.string(),
      colors: z.string(),
      display_modes: z.array(z.string()).optional(),
      sprites: z.object({
        count: z.number().optional(),
        size: z.string().optional(),
        colors_per_sprite: z.number().optional(),
      }).optional(),
      hardware_scrolling: z.boolean().optional(),
      raster_interrupts: z.boolean().optional(),
    }).optional(),
    
    // Audio capabilities
    audio: z.object({
      chip: z.string().optional(),
      channels: z.number().optional(),
      features: z.array(z.string()).optional(),
      sample_playback: z.boolean().optional(),
      synthesis_types: z.array(z.string()).optional(), // "FM", "PSG", "PCM"
    }).optional(),
    
    // Storage and I/O
    storage: z.array(z.string()),
    storage_details: z.object({
      built_in: z.array(z.string()).optional(), // What storage is built in
      expansion: z.array(z.string()).optional(), // What can be added
      typical_capacity: z.object({
        cassette: z.string().optional(),
        floppy: z.string().optional(),
        cartridge: z.string().optional(),
      }).optional(),
    }).optional(),
    
    io_ports: z.array(z.string()).optional(),
    expansion_options: z.array(z.string()).optional(), // Expansion slots, ports, etc.
    
    // Commercial information
    price_at_launch: z.object({
      global: z.string().optional(),
      countries: z.array(z.object({
        country: z.string(),
        price: z.string(),
        currency: z.string(),
      })).optional(),
    }).optional(),
    
    price_history: z.array(z.object({
      year: z.number(),
      price: z.string(),
      currency: z.string(),
      notes: z.string().optional(), // "After price cut", "With bundle"
    })).optional(),
    
    release_date: z.object({
      global: z.date(),
      countries: z.array(z.object({
        country: z.string(),
        date: z.date(),
      })).optional(),
    }),
    
    discontinued: z.date().optional(),
    production_run: z.string().optional(), // "1982-1994"
    units_sold: z.string().optional(),
    market_share: z.object({
      peak_year: z.number().optional(),
      percentage: z.string().optional(),
      region: z.string().optional(),
    }).optional(),
    
    // System information
    country_of_origin: z.string(),
    operating_system: z.string().optional(),
    programming_languages: z.array(z.string()).optional(), // Built-in languages
    
    // Target market and positioning
    target_market: z.array(z.string()).optional(), // "Home users", "Education", "Business"
    market_positioning: z.string().optional(), // How it was marketed
    competition: z.array(z.string()).optional(), // Main competitors
    
    // Variants and models
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
      significance: z.string().optional(),
    })).optional(),
    
    // Software ecosystem
    notable_software: z.array(z.object({
      name: z.string(),
      type: z.string(),
      year: z.number(),
      developer: z.string(),
      publisher: z.string(),
      significance: z.string().optional(),
    })).optional(),
    
    software_library_size: z.object({
      commercial_games: z.string().optional(),
      applications: z.string().optional(),
      total_titles: z.string().optional(),
    }).optional(),
    
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
    educational_value: z.object({
      programming_concepts: z.array(z.string()).optional(),
      hardware_concepts: z.array(z.string()).optional(),
      historical_lessons: z.array(z.string()).optional(),
      why_study_this_system: z.string().optional(),
    }).optional(),
    
    learning_advantages: z.array(z.string()).optional(), // What makes this good for learning
    common_beginner_projects: z.array(z.string()).optional(),
    
    // Modern preservation and emulation
    emulated: z.boolean().default(true),
    emulators: z.array(z.object({
      name: z.string(),
      platform: z.string(), // "Windows", "macOS", "Linux", "Web"
      accuracy: z.enum(['cycle_accurate', 'high', 'good', 'basic']).optional(),
      notes: z.string().optional(),
    })).optional(),
    
    preservation_status: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
    hardware_availability: z.enum(['common', 'available', 'rare', 'extremely_rare']).optional(),
    
    // Documentation and resources
    technical_documentation: z.array(z.object({
      title: z.string(),
      type: z.enum(['service_manual', 'programming_guide', 'hardware_reference', 'user_manual']),
      url: z.string().optional(),
    })).optional(),
    
    // Media
    description: z.string().optional(),
    image: z.string(),
    additional_images: z.array(z.object({
      url: z.string(),
      caption: z.string(),
      type: z.enum(['system_photo', 'motherboard', 'packaging', 'advertisement']).optional(),
    })).optional(),
    
    // Metadata
    order: z.number(), // For display ordering
  }),
});

// Phases collection - 8 phases per system (0-8, Phase 0 is foundation)
const phases = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    system: z.string(), // References system slug
    phase_number: z.number().min(0).max(8), // Allow Phase 0
    description: z.string(),
    learning_objectives: z.array(z.string()),
    prerequisites: z.array(z.string()).optional(),
    estimated_duration: z.string(), // e.g., "8-12 weeks"
    difficulty_level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
    tools_required: z.array(z.string()).optional(),
    
    // Phase 0 specific fields
    is_foundation: z.boolean().default(false), // True for Phase 0
    programming_language: z.enum(['basic', 'asm', 'forth', 'amos', 'mixed']).optional(),
    total_lessons: z.number().optional(), // Total lessons in phase (128 for Phase 0)
    
    order: z.number(),
  }),
});

// Tiers are now nested under phases
const tiers = defineCollection({
  type: 'content', 
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
    programming_language: z.enum(['basic', 'asm', 'forth', 'amos', 'mixed']).optional(),
    lessons_count: z.number().default(16), // 16 lessons per tier in Phase 0
    
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
    difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
    prerequisites: z.array(z.string()).optional(),
    code_examples: z.boolean().default(true), // Default true for Phase 0
    practical_exercise: z.boolean().default(true), // Default true for Phase 0
    related_lessons: z.array(z.string()).optional(), // References to other lesson slugs
    external_resources: z.array(z.object({
      title: z.string(),
      url: z.string(),
      type: z.enum(['documentation', 'video', 'article', 'tool']),
    })).optional(),
    
    // Phase 0 lesson structure
    programs: z.array(z.object({
      number: z.number(),
      title: z.string(),
      code: z.string(),
      explanation: z.string(),
      language: z.enum(['basic', 'asm', 'forth', 'amos']).default('basic'),
    })).optional(),
    
    challenges: z.array(z.string()).optional(),
    common_problems: z.array(z.object({
      problem: z.string(),
      solution: z.string(),
    })).optional(),
    
    fun_fact: z.string().optional(),
    next_lesson_preview: z.string().optional(),
    download_links: z.array(z.object({
      name: z.string(),
      url: z.string(),
      type: z.enum(['bas', 'asm', 'prg', 'tap', 'disk', 'rom']),
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

// People collection - Historical figures in computing
const people = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    full_name: z.string().optional(), // Full legal name if different
    aliases: z.array(z.string()).optional(), // Nicknames, pen names, etc.
    birth_date: z.date().optional(),
    birth_place: z.string().optional(),
    death_date: z.date().optional(),
    death_place: z.string().optional(),
    nationality: z.string(),
    
    // Professional information
    occupation: z.array(z.string()),
    education: z.array(z.object({
      institution: z.string(),
      degree: z.string().optional(),
      field: z.string().optional(),
      year: z.number().optional(),
    })).optional(),
    
    // Career and contributions
    notable_contributions: z.array(z.object({
      contribution: z.string(),
      year: z.number().optional(),
      context: z.string().optional(), // Additional context about the contribution
      significance: z.string().optional(),
    })),
    
    // Company relationships
    companies_founded: z.array(z.object({
      company: z.string(),
      year: z.number().optional(),
      role: z.string().optional(), // "Co-founder", "Founder", etc.
    })).optional(),
    
    companies_worked_for: z.array(z.object({
      company: z.string(),
      role: z.string().optional(),
      start_year: z.number().optional(),
      end_year: z.number().optional(),
      achievements: z.array(z.string()).optional(),
    })).optional(),
    
    // Recognition and impact
    awards: z.array(z.object({
      name: z.string(),
      year: z.number().optional(),
      organization: z.string().optional(),
      reason: z.string().optional(),
    })).optional(),
    
    patents: z.array(z.object({
      title: z.string(),
      number: z.string().optional(),
      year: z.number().optional(),
      description: z.string().optional(),
    })).optional(),
    
    publications: z.array(z.object({
      title: z.string(),
      type: z.enum(['book', 'paper', 'article', 'manual']),
      year: z.number().optional(),
      co_authors: z.array(z.string()).optional(),
    })).optional(),
    
    // Personal and contextual information
    personal_story: z.string().optional(), // Interesting personal background
    career_highlights: z.array(z.string()).optional(),
    philosophy: z.string().optional(), // Their approach to work/technology
    influence_on_others: z.array(z.string()).optional(), // People they mentored/influenced
    
    // Legacy and modern relevance
    legacy: z.string().optional(),
    modern_relevance: z.string().optional(),
    continued_influence: z.array(z.string()).optional(),
    
    // Educational value
    educational_significance: z.object({
      lessons_for_students: z.array(z.string()).optional(),
      programming_concepts: z.array(z.string()).optional(),
      business_lessons: z.array(z.string()).optional(),
    }).optional(),
    
    // Relationships to other vault content
    collaborated_with: z.array(z.string()).optional(), // Other people
    influenced_by: z.array(z.string()).optional(),
    related_technologies: z.array(z.string()).optional(),
    related_events: z.array(z.string()).optional(),
    
    // Media and resources
    image: z.string().optional(),
    quotes: z.array(z.object({
      quote: z.string(),
      context: z.string().optional(),
      year: z.number().optional(),
    })).optional(),
    
    external_links: z.array(z.object({
      title: z.string(),
      url: z.string(),
      type: z.enum(['biography', 'interview', 'obituary', 'documentary', 'archive', 'official']).optional(),
    })).optional(),
  }),
});

// Companies collection - Computing companies
const companies = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    legal_name: z.string().optional(), // Full legal corporate name
    alternative_names: z.array(z.string()).optional(), // Previous names, subsidiaries, brands
    
    // Corporate information
    founded: z.date(),
    dissolved: z.date().optional(),
    headquarters: z.string(),
    country: z.string(),
    headquarters_history: z.array(z.object({
      location: z.string(),
      start_year: z.number(),
      end_year: z.number().optional(),
    })).optional(),
    
    // People and leadership
    founders: z.array(z.object({
      name: z.string(),
      role: z.string().optional(), // "Co-founder", "Founder and CEO", etc.
      background: z.string().optional(),
    })),
    
    key_people: z.array(z.object({
      name: z.string(),
      role: z.string(),
      tenure: z.string().optional(), // "1975-1982", "1980-present"
      contributions: z.array(z.string()).optional(),
    })).optional(),
    
    // Business information
    business_focus: z.array(z.string()),
    business_model: z.string().optional(), // How they made money
    target_markets: z.array(z.string()).optional(), // "Home users", "Business", "Education"
    
    // Products and services
    notable_products: z.array(z.object({
      name: z.string(),
      type: z.string(), // "Computer", "Software", "Peripheral"
      year: z.number().optional(),
      significance: z.string().optional(),
      commercial_success: z.enum(['major_hit', 'moderate_success', 'commercial_failure']).optional(),
    })),
    
    product_lines: z.array(z.object({
      name: z.string(),
      category: z.string(),
      years_active: z.string(), // "1975-1982"
      description: z.string().optional(),
    })).optional(),
    
    // Financial and corporate history
    initial_funding: z.object({
      amount: z.string(),
      currency: z.string(),
      investors: z.array(z.string()).optional(),
    }).optional(),
    
    revenue_peak: z.object({
      amount: z.string(),
      currency: z.string(),
      year: z.number(),
    }).optional(),
    
    employee_count: z.object({
      peak: z.number().optional(),
      year: z.number().optional(),
    }).optional(),
    
    // Corporate relationships
    parent_company: z.string().optional(),
    subsidiaries: z.array(z.string()).optional(),
    partnerships: z.array(z.object({
      partner: z.string(),
      type: z.string(), // "OEM", "Distribution", "Technology"
      description: z.string().optional(),
    })).optional(),
    
    competitors: z.array(z.string()).optional(),
    
    // End of company
    acquired_by: z.string().optional(),
    acquisition_date: z.date().optional(),
    acquisition_price: z.object({
      amount: z.string(),
      currency: z.string(),
    }).optional(),
    
    dissolution_reason: z.string().optional(), // Why the company ended
    assets_disposition: z.string().optional(), // What happened to IP, employees, etc.
    
    // Impact and legacy
    market_impact: z.string().optional(),
    technical_innovations: z.array(z.string()).optional(),
    industry_influence: z.string().optional(),
    cultural_significance: z.string().optional(),
    legacy: z.string().optional(),
    
    // Educational relevance
    educational_value: z.object({
      business_lessons: z.array(z.string()).optional(),
      technical_contributions: z.array(z.string()).optional(),
      industry_insights: z.array(z.string()).optional(),
    }).optional(),
    
    // Timeline and milestones
    major_milestones: z.array(z.object({
      date: z.date(),
      event: z.string(),
      significance: z.string().optional(),
    })).optional(),
    
    // Related content
    related_people: z.array(z.string()).optional(),
    related_companies: z.array(z.string()).optional(),
    related_events: z.array(z.string()).optional(),
    
    // Media and resources
    logo: z.string().optional(),
    historical_photos: z.array(z.object({
      url: z.string(),
      caption: z.string(),
      year: z.number().optional(),
    })).optional(),
    
    external_links: z.array(z.object({
      title: z.string(),
      url: z.string(),
      type: z.enum(['official', 'history', 'archive', 'documentary', 'news', 'analysis']).optional(),
    })).optional(),
  }),
});

// Software collection - Notable applications and games
const software = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    alternative_names: z.array(z.string()).optional(), // Regional variations, working titles
    type: z.enum(['game', 'application', 'utility', 'operating_system', 'programming_language', 'demo', 'educational']),
    
    // Original version information
    original_platform: z.string(), // The platform it was first created for
    original_developer: z.array(z.object({
      name: z.string(),
      role: z.string().optional(), // "Programming", "Graphics", "Music", "Design"
    })),
    original_publisher: z.string().optional(),
    original_release_date: z.date(),
    development_time: z.string().optional(), // "6 months", "2 years"
    development_budget: z.string().optional(), // When known
    
    // Platform-specific releases
    platform_releases: z.array(z.object({
      system: z.string(), // e.g., "commodore-64", "zx-spectrum"
      developer: z.array(z.object({
        name: z.string(),
        role: z.string().optional(),
      })),
      publisher: z.string().optional(),
      distributor: z.string().optional(), // Often different from publisher
      release_date: z.date(),
      regions: z.array(z.string()).optional(), // ["UK", "US", "Europe", "Japan"]
      version: z.string().optional(), // "1.0", "Enhanced Edition", etc.
      
      // Technical details
      memory_requirements: z.string().optional(), // "48K", "128K", "512K"
      storage_format: z.array(z.string()).optional(), // ["Cassette", "Disk", "Cartridge"]
      copy_protection: z.string().optional(), // Type of copy protection used
      loading_time: z.string().optional(), // "5 minutes", "30 seconds"
      
      // Quality and differences
      technical_notes: z.string().optional(),
      significant_changes: z.array(z.string()).optional(),
      port_quality: z.enum(['excellent', 'good', 'average', 'poor', 'broken']).optional(),
      port_notes: z.string().optional(), // Why it's good/poor
      
      // Pricing
      original_price: z.object({
        amount: z.string(),
        currency: z.string(), // "GBP", "USD", "DEM"
      }).optional(),
    })),
    
    // Classification
    genre: z.string().optional(), // For games
    subgenre: z.array(z.string()).optional(), // ["Turn-based", "Real-time", "Puzzle"]
    category: z.string().optional(), // For applications
    target_audience: z.array(z.string()).optional(), // ["Children", "Adults", "Professionals", "Hobbyists"]
    
    // Content
    description: z.string(),
    significance: z.string(),
    gameplay_description: z.string().optional(), // For games
    features: z.array(z.string()).optional(), // Key features/selling points
    
    // Technical and cultural impact
    technical_innovations: z.array(z.string()).optional(),
    programming_techniques: z.array(z.string()).optional(), // "Sprite multiplexing", "Raster interrupts"
    hardware_pushed: z.array(z.string()).optional(), // What hardware limits it pushed
    cultural_impact: z.string().optional(),
    influence_on_industry: z.string().optional(),
    
    // Commercial performance
    sales_figures: z.object({
      total: z.string().optional(),
      by_platform: z.array(z.object({
        system: z.string(),
        sales: z.string(),
        timeframe: z.string().optional(), // "First year", "Lifetime"
      })).optional(),
      commercial_success: z.enum(['major_hit', 'moderate_success', 'commercial_failure', 'cult_classic']).optional(),
    }).optional(),
    
    // Reception and recognition
    awards: z.array(z.object({
      name: z.string(),
      year: z.number().optional(),
      category: z.string().optional(),
    })).optional(),
    
    contemporary_reviews: z.array(z.object({
      publication: z.string(),
      score: z.string().optional(), // "8/10", "90%", "5 stars"
      system: z.string().optional(),
      year: z.number().optional(),
      quote: z.string().optional(), // Notable review quotes
    })).optional(),
    
    modern_reception: z.object({
      retrospective_rating: z.string().optional(),
      historical_significance: z.string().optional(),
      modern_playability: z.enum(['excellent', 'good', 'dated', 'unplayable']).optional(),
    }).optional(),
    
    // Development context
    development_story: z.string().optional(), // Interesting development anecdotes
    development_challenges: z.array(z.string()).optional(),
    cancelled_features: z.array(z.string()).optional(),
    development_tools: z.array(z.string()).optional(), // What tools were used
    
    // Legacy and preservation
    source_code_availability: z.enum(['available', 'partially_available', 'lost', 'proprietary']).optional(),
    preservation_status: z.enum(['well_preserved', 'partially_preserved', 'rare', 'lost']).optional(),
    modern_availability: z.array(z.object({
      platform: z.string(), // "Steam", "GOG", "Emulation"
      notes: z.string().optional(),
    })).optional(),
    
    // Media and documentation
    screenshots: z.array(z.object({
      url: z.string(),
      system: z.string(),
      caption: z.string().optional(),
      type: z.enum(['gameplay', 'title_screen', 'loading_screen', 'manual_page']).optional(),
    })).optional(),
    
    videos: z.array(z.object({
      url: z.string(),
      title: z.string(),
      type: z.enum(['gameplay', 'documentary', 'interview', 'commercial']).optional(),
    })).optional(),
    
    manuals: z.array(z.object({
      url: z.string(),
      system: z.string(),
      language: z.string().optional(),
      type: z.enum(['user_manual', 'reference_card', 'hint_book']).optional(),
    })).optional(),
    
    // Relationships
    part_of_series: z.string().optional(), // Series name
    sequels: z.array(z.string()).optional(),
    prequels: z.array(z.string()).optional(),
    related_software: z.array(z.string()).optional(),
    inspired_by: z.array(z.string()).optional(),
    influenced: z.array(z.string()).optional(),
    
    // Educational relevance
    educational_value: z.object({
      programming_concepts: z.array(z.string()).optional(),
      historical_significance: z.string().optional(),
      technical_learning: z.array(z.string()).optional(),
    }).optional(),
    
    // External resources
    external_links: z.array(z.object({
      title: z.string(),
      url: z.string(),
      type: z.enum(['official', 'wiki', 'review', 'technical', 'preservation', 'community']).optional(),
    })).optional(),
    
    // Metadata
    order: z.number(),
  }),
});

// Setup collection - Development environment setup guides
const setup = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    system: z.string(), // References system slug
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
    estimated_time: z.string(), // e.g., "15-30 minutes"
    prerequisites: z.array(z.string()).optional(),
    tools_covered: z.array(z.string()).optional(),
    platforms_supported: z.array(z.string()).optional(), // ["Windows", "macOS", "Linux"]
    docker_image: z.string().optional(), // Docker image name if applicable
    order: z.number(),
  }),
});

// Events collection - Historical timeline events
const events = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    alternative_names: z.array(z.string()).optional(), // Alternative names for the event
    
    // Temporal information
    date: z.date(),
    end_date: z.date().optional(), // For events spanning multiple days/years
    duration: z.string().optional(), // "3 days", "6 months", etc.
    date_precision: z.enum(['exact', 'approximate', 'year_only', 'decade_only']).optional(),
    
    // Categorisation
    category: z.enum(['Technology', 'Gaming History', 'World History', 'Computing', 'Gaming', 'Business', 'Cultural', 'Political', 'Scientific']),
    subcategory: z.string().optional(), // More specific categorisation
    event_type: z.enum(['announcement', 'release', 'founding', 'acquisition', 'conference', 'innovation', 'milestone', 'crisis', 'breakthrough']).optional(),
    
    // Location and context
    location: z.string().optional(),
    specific_venue: z.string().optional(), // "San Francisco Civic Center", "CES Convention"
    geographic_scope: z.enum(['local', 'regional', 'national', 'international', 'global']).optional(),
    
    // Content
    description: z.string(),
    background_context: z.string().optional(), // What led to this event
    key_details: z.array(z.string()).optional(), // Important specific details
    outcomes: z.array(z.string()).optional(), // What resulted from this event
    
    // Significance and impact
    significance: z.string(),
    immediate_impact: z.string().optional(),
    long_term_impact: z.string().optional(),
    impact_on_computing: z.string().optional(),
    impact_on_society: z.string().optional(),
    economic_impact: z.string().optional(),
    
    // People involved
    key_figures: z.array(z.object({
      name: z.string(),
      role: z.string(), // "Presenter", "Founder", "CEO", "Inventor"
      contribution: z.string().optional(),
    })).optional(),
    
    attendees: z.object({
      estimated_count: z.number().optional(),
      notable_attendees: z.array(z.string()).optional(),
    }).optional(),
    
    // Organisations involved
    primary_organisations: z.array(z.string()).optional(), // Main companies/orgs involved
    participating_organisations: z.array(z.string()).optional(),
    sponsoring_organisations: z.array(z.string()).optional(),
    
    // Technical and business details
    technologies_involved: z.array(z.string()).optional(),
    products_announced: z.array(z.object({
      name: z.string(),
      company: z.string(),
      significance: z.string().optional(),
    })).optional(),
    
    financial_details: z.object({
      amounts: z.array(z.object({
        amount: z.string(),
        currency: z.string(),
        context: z.string(), // "Acquisition price", "Investment amount"
      })),
    }).optional(),
    
    // Historical context
    preceded_by: z.array(z.string()).optional(), // Events that led to this
    followed_by: z.array(z.string()).optional(), // Events that resulted from this
    contemporary_events: z.array(z.string()).optional(), // Other events happening around the same time
    
    // Documentation and evidence
    primary_sources: z.array(z.object({
      title: z.string(),
      type: z.enum(['newspaper', 'press_release', 'interview', 'document', 'video', 'audio']),
      url: z.string().optional(),
      date: z.date().optional(),
    })).optional(),
    
    media_coverage: z.array(z.object({
      publication: z.string(),
      title: z.string(),
      url: z.string().optional(),
      type: z.enum(['news', 'analysis', 'review', 'retrospective']).optional(),
    })).optional(),
    
    // Educational value
    educational_significance: z.object({
      lessons_learned: z.array(z.string()).optional(),
      business_lessons: z.array(z.string()).optional(),
      technical_lessons: z.array(z.string()).optional(),
      historical_lessons: z.array(z.string()).optional(),
    }).optional(),
    
    teaching_applications: z.array(z.string()).optional(), // How this event can be used in education
    
    // Relationships
    related_people: z.array(z.string()).optional(),
    related_companies: z.array(z.string()).optional(),
    related_systems: z.array(z.string()).optional(),
    related_software: z.array(z.string()).optional(),
    related_events: z.array(z.string()).optional(),
    
    // Modern relevance
    modern_parallels: z.array(z.string()).optional(), // Similar events in modern times
    continuing_influence: z.string().optional(),
    commemoration: z.array(z.object({
      type: z.string(), // "Anniversary", "Documentary", "Museum exhibit"
      description: z.string(),
      year: z.number().optional(),
    })).optional(),
    
    // Media and resources
    images: z.array(z.object({
      url: z.string(),
      caption: z.string(),
      type: z.enum(['photograph', 'document', 'newspaper', 'advertisement']).optional(),
      credit: z.string().optional(),
    })).optional(),
    
    videos: z.array(z.object({
      url: z.string(),
      title: z.string(),
      type: z.enum(['news_footage', 'documentary', 'interview', 'recreation']).optional(),
    })).optional(),
    
    external_links: z.array(z.object({
      title: z.string(),
      url: z.string(),
      type: z.enum(['news', 'analysis', 'academic', 'archive', 'documentary', 'commemoration']).optional(),
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
  setup,
};