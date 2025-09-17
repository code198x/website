import { defineCollection, z } from "astro:content";
import {
  VALIDATION,
  PLATFORM_TIERS,
  VAULT_STATUS,
  PLATFORM_STATUS,
  DIFFICULTY_LEVELS,
} from "../config/constants";

// ============================================================================
// VAULT COLLECTIONS - Encyclopedia of Retro Computing
// ============================================================================

// Base schema that all vault entries share
const vaultBaseSchema = z.object({
  name: z.string(),
  status: z.enum(["available", "coming", "draft"] as const).default(VAULT_STATUS.DRAFT),
  tags: z.array(z.string()).default([]),
  description: z.string(),
  featured: z.boolean().default(false),
  lastUpdated: z.date().default(() => new Date()),
  relatedEntries: z
    .record(
      z.array(
        z.object({
          name: z.string(),
          slug: z.string(),
          available: z.boolean().default(false),
        })
      )
    )
    .optional(),
});

// Hardware (systems, chips, peripherals) - NEW VAULT COLLECTION
const hardware = defineCollection({
  type: "content",
  schema: vaultBaseSchema.extend({
    type: z.enum(["computer", "console", "chip", "peripheral", "addon"]),
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
    chipType: z.enum(["processor", "graphics", "sound", "memory", "custom"]).optional(),
    architecture: z.string().optional(),
    transistorCount: z.number().optional(),
  }),
});

// People (developers, designers, executives) - ENHANCED VAULT COLLECTION
const people = defineCollection({
  type: "content",
  schema: vaultBaseSchema.extend({
    type: z.enum(["engineer", "designer", "executive", "artist", "musician", "programmer"]),
    birthDate: z.date().optional(),
    birthPlace: z.string().optional(),
    nationality: z.string().optional(),

    companies: z
      .array(
        z.object({
          name: z.string(),
          role: z.string(),
          period: z.string(),
        })
      )
      .optional(),

    notableWorks: z.array(z.string()).optional(),
    awards: z.array(z.string()).optional(),
    quotes: z
      .array(
        z.object({
          text: z.string(),
          context: z.string(),
          year: z.number().optional(),
        })
      )
      .optional(),

    links: z
      .object({
        wikipedia: z.string().url().optional(),
        personal: z.string().url().optional(),
        twitter: z.string().optional(),
      })
      .optional(),
  }),
});

// Companies
const companies = defineCollection({
  type: "content",
  schema: vaultBaseSchema.extend({
    type: z.enum(["manufacturer", "publisher", "developer", "distributor"]),
    founded: z.number(),
    defunct: z.number().optional(),
    headquarters: z.string(),

    founders: z.array(z.string()).optional(),
    keyPeople: z
      .array(
        z.object({
          name: z.string(),
          role: z.string(),
          period: z.string().optional(),
        })
      )
      .optional(),

    parentCompany: z.string().optional(),
    subsidiaries: z.array(z.string()).optional(),

    notableProducts: z.array(z.string()).optional(),
    notableGames: z.array(z.string()).optional(),

    fate: z.string().optional(),
  }),
});

// Techniques
const techniques = defineCollection({
  type: "content",
  schema: vaultBaseSchema.extend({
    type: z.enum(["graphics", "sound", "optimization", "algorithm", "hardware-trick"]),
    year: z.number().optional(), // When the technique was discovered/popularized
    platforms: z.array(z.string()),
    difficulty: z.enum(["beginner", "intermediate", "advanced", "expert"]),

    prerequisites: z.array(z.string()).optional(),
    memoryUsage: z.string().optional(),
    cpuUsage: z.string().optional(),

    pioneers: z.array(z.string()).optional(),
    notableUses: z.array(z.string()).optional(),

    tutorials: z
      .array(
        z.object({
          title: z.string(),
          url: z.string().url(),
        })
      )
      .optional(),
  }),
});

// Publications
const publications = defineCollection({
  type: "content",
  schema: vaultBaseSchema.extend({
    type: z.enum(["magazine", "book", "manual", "newsletter", "fanzine"]),

    publisher: z.string(),
    firstIssue: z.date().optional(),
    lastIssue: z.date().optional(),
    frequency: z.enum(["weekly", "monthly", "bi-monthly", "quarterly", "annual"]).optional(),

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

    digitalArchive: z.string().url().optional(),
  }),
});

// Events
const events = defineCollection({
  type: "content",
  schema: vaultBaseSchema.extend({
    type: z.enum(["trade-show", "launch", "competition", "demo-party", "conference"]),

    date: z.date(),
    endDate: z.date().optional(),
    recurring: z.boolean().default(false),

    location: z.object({
      venue: z.string().optional(),
      city: z.string(),
      country: z.string(),
    }),

    organizer: z.string().optional(),
    attendance: z.number().optional(),

    highlights: z.array(z.string()).optional(),

    competitions: z
      .array(
        z.object({
          category: z.string(),
          winner: z.string(),
          production: z.string(),
        })
      )
      .optional(),

    links: z
      .object({
        official: z.string().url().optional(),
        results: z.string().url().optional(),
        productions: z.string().url().optional(),
      })
      .optional(),
  }),
});

// Groups
const groups = defineCollection({
  type: "content",
  schema: vaultBaseSchema.extend({
    type: z.enum(["demo", "cracking", "development", "music", "art"]),

    formed: z.number(),
    disbanded: z.number().optional(),
    country: z.string(),

    members: z
      .array(
        z.object({
          handle: z.string(),
          realName: z.string().optional(),
          role: z.string(),
          period: z.string().optional(),
        })
      )
      .optional(),

    notableReleases: z
      .array(
        z.object({
          name: z.string(),
          year: z.number(),
          type: z.string(),
          platform: z.string(),
        })
      )
      .optional(),

    affiliates: z.array(z.string()).optional(),

    legacy: z.string().optional(),
  }),
});

// Formats
const formats = defineCollection({
  type: "content",
  schema: vaultBaseSchema.extend({
    type: z.enum(["file", "media", "video", "audio", "protocol"]),

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

    tools: z
      .array(
        z.object({
          name: z.string(),
          platform: z.string(),
          url: z.string().url().optional(),
        })
      )
      .optional(),

    successor: z.string().optional(),
  }),
});

// Games - Entertainment software
const games = defineCollection({
  type: "content",
  schema: vaultBaseSchema.extend({
    type: z.enum([
      "arcade",
      "adventure",
      "platformer",
      "puzzle",
      "shooter",
      "strategy",
      "rpg",
      "sports",
      "simulation",
      "racing",
      "fighting",
    ]),
    year: z.number(),
    platform: z.string(), // Primary platform
    platforms: z.array(z.string()).optional(), // All platforms it was released on

    developer: z.string(),
    publisher: z.string(),

    genre: z.array(z.string()),
    players: z.string(), // "1", "1-2", "1-4", etc.

    media: z.array(z.string()).optional(), // cartridge, disk, tape, download

    technicalAchievements: z.array(z.string()).optional(),
    graphicsMode: z.string().optional(), // "Mode 7", "FMV", "Vector", etc.
    soundChip: z.string().optional(),

    reviews: z
      .array(
        z.object({
          source: z.string(),
          score: z.string(),
          quote: z.string().optional(),
        })
      )
      .optional(),

    series: z.string().optional(), // Part of a series
    sequels: z.array(z.string()).optional(),
    ports: z
      .array(
        z.object({
          platform: z.string(),
          year: z.number(),
          developer: z.string().optional(),
        })
      )
      .optional(),

    preservationStatus: z.enum(["playable", "preserved", "at-risk", "lost"]).optional(),
    emulationNotes: z.string().optional(),
  }),
});

// Demos - Demoscene productions
const demos = defineCollection({
  type: "content",
  schema: vaultBaseSchema.extend({
    type: z.enum(["demo", "intro", "invitation", "musicdisk", "diskmag", "wild"]),
    year: z.number(),
    platform: z.string(),

    group: z.string(), // Primary group/crew
    collaborations: z.array(z.string()).optional(), // Other groups involved

    event: z
      .object({
        name: z.string(),
        year: z.number(),
        placement: z.number().optional(),
        category: z.string().optional(),
      })
      .optional(),

    credits: z
      .array(
        z.object({
          handle: z.string(),
          role: z.string(), // code, graphics, music, design
        })
      )
      .optional(),

    effects: z.array(z.string()).optional(), // Effects showcased
    techniques: z.array(z.string()).optional(), // Technical achievements

    size: z.string().optional(), // "64k", "4k", etc.

    music: z
      .object({
        format: z.string(), // MOD, SID, YM, etc.
        composer: z.string(),
      })
      .optional(),

    downloads: z
      .array(
        z.object({
          type: z.string(), // executable, video, source
          url: z.string().url(),
        })
      )
      .optional(),

    pouetId: z.number().optional(), // pouet.net ID for reference
    demozooId: z.number().optional(), // demozoo.org ID
  }),
});

// Operating Systems
const operatingSystems = defineCollection({
  type: "content",
  schema: vaultBaseSchema.extend({
    type: z.enum(["os", "dos", "firmware", "monitor", "kernel"]),
    year: z.number(),
    version: z.string(),

    developer: z.string(),
    basedOn: z.string().optional(), // Unix, DOS, etc.

    platforms: z.array(z.string()), // Hardware it runs on
    architecture: z.array(z.string()), // x86, 68k, 6502, etc.

    minimumRequirements: z
      .object({
        cpu: z.string(),
        ram: z.string(),
        storage: z.string(),
      })
      .optional(),

    features: z.array(z.string()),
    fileSystem: z.array(z.string()).optional(),

    gui: z.boolean().default(false),
    multitasking: z.boolean().default(false),
    multiuser: z.boolean().default(false),
    networking: z.boolean().default(false),

    marketShare: z.string().optional(),
    unitsShipped: z.number().optional(),

    notableApplications: z.array(z.string()).optional(),

    versions: z
      .array(
        z.object({
          version: z.string(),
          year: z.number(),
          changes: z.array(z.string()),
        })
      )
      .optional(),

    successor: z.string().optional(),
    predecessor: z.string().optional(),
  }),
});

// Emulators - Preservation through emulation
const emulators = defineCollection({
  type: "content",
  schema: vaultBaseSchema.extend({
    type: z.enum(["emulator", "fpga-core", "simulator", "virtual-machine"]),
    year: z.number(), // First release

    developer: z.string(),
    license: z.enum(["open-source", "freeware", "commercial", "proprietary"]),

    systemsEmulated: z.array(z.string()), // Which systems it emulates

    platforms: z.array(z.string()), // Where the emulator runs (Windows, Linux, etc.)

    accuracy: z.enum(["cycle-accurate", "highly-accurate", "functional", "fast"]),

    features: z.array(z.string()), // save-states, rewind, netplay, debugger, etc.

    requirements: z
      .object({
        biosRequired: z.boolean(),
        romFormats: z.array(z.string()).optional(),
        minimumSpecs: z.string().optional(),
        recommendedSpecs: z.string().optional(),
      })
      .optional(),

    debugging: z
      .object({
        debugger: z.boolean(),
        disassembler: z.boolean(),
        memoryViewer: z.boolean(),
        profiler: z.boolean(),
        breakpoints: z.boolean(),
      })
      .optional(),

    display: z
      .object({
        filters: z.array(z.string()).optional(), // CRT, scanlines, etc.
        shaders: z.boolean().optional(),
        scaling: z.array(z.string()).optional(),
      })
      .optional(),

    input: z
      .object({
        controllers: z.array(z.string()).optional(),
        keyboard: z.boolean().optional(),
        mouse: z.boolean().optional(),
        lightgun: z.boolean().optional(),
      })
      .optional(),

    networking: z
      .object({
        netplay: z.boolean().optional(),
        linkCable: z.boolean().optional(),
        modem: z.boolean().optional(),
      })
      .optional(),

    developmentStatus: z.enum(["active", "maintained", "unmaintained", "abandoned"]),

    versions: z
      .array(
        z.object({
          version: z.string(),
          year: z.number(),
          changes: z.array(z.string()),
        })
      )
      .optional(),

    website: z.string().url().optional(),
    repository: z.string().url().optional(),

    alternatives: z.array(z.string()).optional(), // Other emulators for same systems
  }),
});

// Applications - Productivity and creative software
const applications = defineCollection({
  type: "content",
  schema: vaultBaseSchema.extend({
    type: z.enum([
      "productivity",
      "graphics",
      "music",
      "video",
      "cad",
      "desktop-publishing",
      "database",
    ]),
    year: z.number(),

    developer: z.string(),
    publisher: z.string().optional(),

    platforms: z.array(z.string()),

    category: z.string(), // Word processor, spreadsheet, paint program, etc.

    systemRequirements: z
      .object({
        minimumRam: z.string(),
        diskSpace: z.string().optional(),
        display: z.string().optional(),
        other: z.array(z.string()).optional(),
      })
      .optional(),

    fileFormats: z
      .object({
        native: z.array(z.string()),
        import: z.array(z.string()).optional(),
        export: z.array(z.string()).optional(),
      })
      .optional(),

    features: z.array(z.string()),

    competitors: z.array(z.string()).optional(),
    marketPosition: z.string().optional(),

    versions: z
      .array(
        z.object({
          version: z.string(),
          year: z.number(),
          changes: z.array(z.string()),
        })
      )
      .optional(),

    license: z.string().optional(),
    price: z.string().optional(),

    legacy: z.string().optional(),
  }),
});

// Development Tools - Compilers, assemblers, IDEs
const developmentTools = defineCollection({
  type: "content",
  schema: vaultBaseSchema.extend({
    type: z.enum(["compiler", "assembler", "ide", "debugger", "profiler", "linker", "build-tool"]),
    year: z.number(),

    developer: z.string(),

    platforms: z.array(z.string()), // Where the tool runs
    targetPlatforms: z.array(z.string()), // What it builds for

    languages: z.array(z.string()), // Languages supported

    features: z.array(z.string()),

    buildSystem: z
      .object({
        projectFiles: z.string().optional(),
        makefiles: z.boolean().optional(),
        libraries: z.boolean().optional(),
        linking: z.string().optional(),
      })
      .optional(),

    debugging: z
      .object({
        breakpoints: z.boolean(),
        stepping: z.boolean(),
        watches: z.boolean(),
        profiling: z.boolean(),
        disassembly: z.boolean(),
      })
      .optional(),

    optimizations: z.array(z.string()).optional(),

    outputFormats: z.array(z.string()),

    standardCompliance: z.array(z.string()).optional(),

    documentation: z.string().optional(),
    examples: z.boolean().optional(),

    license: z.string(),
    price: z.string().optional(),
  }),
});

// Utilities - System utilities and tools
const utilities = defineCollection({
  type: "content",
  schema: vaultBaseSchema.extend({
    type: z.enum([
      "file-manager",
      "archiver",
      "disk-utility",
      "system-monitor",
      "backup",
      "security",
      "network-tool",
    ]),
    year: z.number(),

    developer: z.string(),

    platforms: z.array(z.string()),

    category: z.string(), // File management, system optimization, etc.

    features: z.array(z.string()),

    commandLine: z.boolean().default(false),
    gui: z.boolean().default(false),

    systemRequirements: z
      .object({
        minimumRam: z.string().optional(),
        adminRequired: z.boolean().optional(),
        dosVersion: z.string().optional(),
        other: z.array(z.string()).optional(),
      })
      .optional(),

    automation: z
      .object({
        scripting: z.boolean(),
        batch: z.boolean(),
        scheduling: z.boolean(),
      })
      .optional(),

    fileOperations: z.array(z.string()).optional(), // copy, move, delete, compress, etc.

    competitors: z.array(z.string()).optional(),

    license: z.string(),
    size: z.string().optional(), // Program size

    notableUses: z.array(z.string()).optional(),
  }),
});

// Programming Languages
const programmingLanguages = defineCollection({
  type: "content",
  schema: vaultBaseSchema.extend({
    type: z.enum(["compiled", "interpreted", "bytecode", "assembly", "macro"]),
    year: z.number(), // First appeared

    designer: z.string(),
    developer: z.string().optional(),

    paradigm: z.array(z.string()), // procedural, object-oriented, functional, etc.
    typingDiscipline: z.array(z.string()).optional(), // static, dynamic, strong, weak

    platforms: z.array(z.string()), // Where it runs

    influencedBy: z.array(z.string()).optional(),
    influenced: z.array(z.string()).optional(),

    fileExtensions: z.array(z.string()),

    implementations: z
      .array(
        z.object({
          name: z.string(),
          type: z.string(), // compiler, interpreter
          platform: z.string(),
          year: z.number().optional(),
        })
      )
      .optional(),

    features: z.array(z.string()),

    standardLibrary: z.array(z.string()).optional(), // Key libraries/modules

    helloWorld: z.string().optional(), // Hello World example

    notableProjects: z.array(z.string()).optional(),

    versions: z
      .array(
        z.object({
          version: z.string(),
          year: z.number(),
          changes: z.array(z.string()),
        })
      )
      .optional(),

    documentation: z
      .array(
        z.object({
          title: z.string(),
          url: z.string().url(),
        })
      )
      .optional(),
  }),
});

// Culture
const culture = defineCollection({
  type: "content",
  schema: vaultBaseSchema.extend({
    type: z.enum(["scene", "movement", "phenomenon", "community", "practice"]),

    period: z.object({
      start: z.number(),
      end: z.number().optional(),
      peak: z.string().optional(),
    }),

    origins: z.string().optional(),
    regions: z.array(z.string()).optional(),

    keyFigures: z.array(z.string()).optional(),
    keyGroups: z.array(z.string()).optional(),
    keyEvents: z.array(z.string()).optional(),

    characteristics: z.array(z.string()).optional(),

    influence: z.array(z.string()).optional(),
    modernLegacy: z.string().optional(),
  }),
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
    phase_number: z.number().min(VALIDATION.phase.min).max(VALIDATION.phase.max), // Allow Phase 0
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
    phase_number: z.number().min(VALIDATION.phase.min).max(VALIDATION.phase.max), // Allow Phase 0
    tier_number: z.number().min(VALIDATION.tier.min).max(VALIDATION.tier.max),
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
    phase_number: z.number().min(VALIDATION.phase.min).max(VALIDATION.phase.max), // Allow Phase 0
    tier_number: z.number().min(VALIDATION.tier.min).max(VALIDATION.tier.max),
    lesson_number: z.number().min(VALIDATION.lesson.min).max(VALIDATION.lesson.max),

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

  // Software categories (fully separated)
  applications,
  "development-tools": developmentTools,
  utilities,

  // Entertainment and creativity
  games,
  demos,

  // Systems and languages
  "operating-systems": operatingSystems,
  emulators,
  "programming-languages": programmingLanguages,

  // Knowledge and community
  techniques,
  publications,
  events,
  groups,
  formats,
  culture,
};
