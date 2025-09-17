// Vault category configuration
// This centralizes all category-specific data for dynamic routing

export const VAULT_CATEGORIES = {
  applications: {
    title: "Applications - The Vault",
    heroTitle: "Applications",
    heroSubtitle: "Creative software that unleashed artistic potential",
    heroIcon: "🎨",
    heroColor: "#8b5cf6",
    infoTitle: "About the Applications Collection",
    infoDescription: "From music trackers to art packages, these applications defined what was possible for creative expression on classic computers. Each entry documents the technical innovations and creative workflows that made digital art and music creation accessible.",
    stats: [
      { label: "Art Packages", value: 0, filter: (entry) => entry.t === 'art' },
      { label: "Music Software", value: 0, filter: (entry) => entry.t === 'music' },
      { label: "Productivity", value: 0, filter: (entry) => entry.t === 'productivity' },
      { label: "Utilities", value: 0, filter: (entry) => entry.t === 'utility' }
    ]
  },

  companies: {
    title: "Companies - The Vault",
    heroTitle: "Companies",
    heroSubtitle: "The pioneers who built the digital revolution",
    heroIcon: "🏢",
    heroColor: "#6366f1",
    infoTitle: "About the Companies Collection",
    infoDescription: "From bedroom startups to corporate giants, these companies shaped the landscape of home computing. Each entry chronicles their contributions, key products, and lasting impact on the industry.",
    stats: [
      { label: "Hardware", value: 0, filter: (entry) => entry.t === 'manufacturer' },
      { label: "Software", value: 0, filter: (entry) => entry.t === 'publisher' },
      { label: "Services", value: 0, filter: (entry) => entry.t === 'service' }
    ]
  },

  culture: {
    title: "Culture - The Vault",
    heroTitle: "Culture",
    heroSubtitle: "The movements and communities that defined an era",
    heroIcon: "🌐",
    heroColor: "#a855f7",
    infoTitle: "About the Culture Collection",
    infoDescription: "Computing didn't happen in isolation. This collection documents the cultural movements, social phenomena, and community traditions that grew around classic computers and shaped how we think about technology today.",
    stats: [
      { label: "Movements", value: 0, filter: (entry) => entry.t === 'movement' },
      { label: "Communities", value: 0, filter: (entry) => entry.t === 'community' },
      { label: "Traditions", value: 0, filter: (entry) => entry.t === 'tradition' }
    ]
  },

  demos: {
    title: "Demos - The Vault",
    heroTitle: "Demos",
    heroSubtitle: "Art through code - pushing hardware beyond its limits",
    heroIcon: "🎬",
    heroColor: "#06b6d4",
    infoTitle: "About the Demos Collection",
    infoDescription: "Demos represent the purest form of technical artistry - code written not for utility but for beauty. This collection celebrates the productions that amazed audiences and pushed hardware far beyond what anyone thought possible."
  },

  'development-tools': {
    title: "Development Tools - The Vault",
    heroTitle: "Development Tools",
    heroSubtitle: "The tools that empowered a generation of coders",
    heroIcon: "🔧",
    heroColor: "#ec4899",
    infoTitle: "About the Development Tools Collection",
    infoDescription: "Before modern IDEs, developers crafted their programs with specialized tools. This collection documents the assemblers, debuggers, and development environments that made programming accessible on classic systems."
  },

  emulators: {
    title: "Emulators - The Vault",
    heroTitle: "Emulators",
    heroSubtitle: "Preserving computing history through software",
    heroIcon: "💾",
    heroColor: "#8b5cf6",
    infoTitle: "About the Emulators Collection",
    infoDescription: "When the original hardware becomes rare or fails, emulators keep the software alive. This collection honors the dedication of developers who reverse-engineered entire computer systems to preserve digital heritage.",
    stats: [
      { label: "Computer", value: 0, filter: (entry) => entry.t === 'computer' },
      { label: "Console", value: 0, filter: (entry) => entry.t === 'console' },
      { label: "Arcade", value: 0, filter: (entry) => entry.t === 'arcade' },
      { label: "Multi-System", value: 0, filter: (entry) => entry.t === 'multi' }
    ]
  },

  events: {
    title: "Events - The Vault",
    heroTitle: "Events",
    heroSubtitle: "Gatherings that shaped computing culture",
    heroIcon: "🎪",
    heroColor: "#ec4899",
    infoTitle: "About the Events Collection",
    infoDescription: "From trade shows to demoparties, these events brought the computing community together, launched products, and created lasting memories. Each entry captures the atmosphere and significance of these milestone gatherings."
  },

  formats: {
    title: "Formats - The Vault",
    heroTitle: "Formats",
    heroSubtitle: "Data structures that enabled digital creativity",
    heroIcon: "💾",
    heroColor: "#fb923c",
    infoTitle: "About the Formats Collection",
    infoDescription: "Behind every image, sound, or program was a file format. This collection documents the data structures that made digital content portable, explaining how technical constraints shaped creative possibilities."
  },

  games: {
    title: "Games - The Vault",
    heroTitle: "Games",
    heroSubtitle: "Entertainment software that defined generations",
    heroIcon: "🎮",
    heroColor: "#f59e0b",
    infoTitle: "About the Games Collection",
    infoDescription: "From groundbreaking technical achievements to pure gameplay innovation, these games represent the creativity and technical mastery of their era. Each entry includes historical context, technical details, and connections to the hardware and people that made them possible.",
    stats: [
      { label: "Action", value: 0, filter: (entry) => entry.t === 'action' },
      { label: "Adventure", value: 0, filter: (entry) => entry.t === 'adventure' },
      { label: "Puzzle", value: 0, filter: (entry) => entry.t === 'puzzle' },
      { label: "Simulation", value: 0, filter: (entry) => entry.t === 'simulation' },
      { label: "Platform", value: 0, filter: (entry) => entry.t === 'platformer' }
    ]
  },

  groups: {
    title: "Groups - The Vault",
    heroTitle: "Groups",
    heroSubtitle: "Collectives that pushed boundaries together",
    heroIcon: "👥",
    heroColor: "#14b8a6",
    infoTitle: "About the Groups Collection",
    infoDescription: "Whether cracking software, creating demos, or developing games, groups amplified individual talent through collaboration. This collection chronicles the teams that achieved what no single person could accomplish alone."
  },

  hardware: {
    title: "Hardware - The Vault",
    heroTitle: "Hardware",
    heroSubtitle: "Systems, chips, and peripherals that defined an era",
    heroIcon: "🖥️",
    heroColor: "#3b82f6",
    infoTitle: "About the Hardware Collection",
    infoDescription: "This collection documents the computers, consoles, chips, and peripherals that shaped the golden age of home computing. Each entry includes technical specifications, historical context, and connections to related software and techniques.",
    stats: [
      { label: "Computers", value: 0, filter: (entry) => entry.t === 'computer' },
      { label: "Consoles", value: 0, filter: (entry) => entry.t === 'console' },
      { label: "Chips", value: 0, filter: (entry) => entry.t === 'chip' },
      { label: "Peripherals", value: 0, filter: (entry) => entry.t === 'peripheral' }
    ]
  },

  'operating-systems': {
    title: "Operating Systems - The Vault",
    heroTitle: "Operating Systems",
    heroSubtitle: "The software foundations that made computers usable",
    heroIcon: "💻",
    heroColor: "#64748b",
    infoTitle: "About the Operating Systems Collection",
    infoDescription: "Operating systems bridged the gap between raw hardware and user applications. This collection documents the system software that defined how millions of users interacted with their computers."
  },

  people: {
    title: "People - The Vault",
    heroTitle: "People",
    heroSubtitle: "Visionaries who shaped the digital age",
    heroIcon: "👤",
    heroColor: "#10b981",
    infoTitle: "About the People Collection",
    infoDescription: "Behind every innovation was a person with vision, determination, and skill. This collection celebrates the programmers, designers, entrepreneurs, and dreamers who built the foundation of our digital world.",
    stats: [
      { label: "Programmers", value: 0, filter: (entry) => entry.t === 'programmer' },
      { label: "Designers", value: 0, filter: (entry) => entry.t === 'designer' },
      { label: "Executives", value: 0, filter: (entry) => entry.t === 'executive' },
      { label: "Engineers", value: 0, filter: (entry) => entry.t === 'engineer' }
    ]
  },

  'programming-languages': {
    title: "Programming Languages - The Vault",
    heroTitle: "Programming Languages",
    heroSubtitle: "The vocabularies that spoke to computers",
    heroIcon: "📝",
    heroColor: "#10b981",
    infoTitle: "About the Programming Languages Collection",
    infoDescription: "Each programming language represented a different philosophy about how humans should communicate with computers. This collection explores the languages that democratized programming and enabled new forms of creative expression."
  },

  publications: {
    title: "Publications - The Vault",
    heroTitle: "Publications",
    heroSubtitle: "The magazines and books that spread knowledge",
    heroIcon: "📚",
    heroColor: "#6366f1",
    infoTitle: "About the Publications Collection",
    infoDescription: "Before the internet, knowledge spread through magazines, books, and newsletters. This collection honors the publications that educated a generation and preserved computing culture in print.",
    stats: [
      { label: "Magazines", value: 0, filter: (entry) => entry.t === 'magazine' },
      { label: "Books", value: 0, filter: (entry) => entry.t === 'book' },
      { label: "Newsletters", value: 0, filter: (entry) => entry.t === 'newsletter' }
    ]
  },

  techniques: {
    title: "Techniques - The Vault",
    heroTitle: "Techniques",
    heroSubtitle: "Programming tricks that pushed hardware to its limits",
    heroIcon: "⚡",
    heroColor: "#ef4444",
    infoTitle: "About the Techniques Collection",
    infoDescription: "When hardware limitations seemed insurmountable, clever programmers found ways around them. This collection documents the programming techniques that made the impossible possible.",
    stats: [
      { label: "Graphics", value: 0, filter: (entry) => entry.t === 'graphics' },
      { label: "Sound", value: 0, filter: (entry) => entry.t === 'sound' },
      { label: "Optimization", value: 0, filter: (entry) => entry.t === 'optimization' },
      { label: "Memory", value: 0, filter: (entry) => entry.t === 'memory' }
    ]
  },

  utilities: {
    title: "Utilities - The Vault",
    heroTitle: "Utilities",
    heroSubtitle: "Essential tools that made computing practical",
    heroIcon: "🛠️",
    heroColor: "#14b8a6",
    infoTitle: "About the Utilities Collection",
    infoDescription: "Utilities were the unsung heroes of classic computing - small programs that solved specific problems and made daily computer use more productive. This collection celebrates the tools that kept systems running smoothly."
  }
};

// Helper function to get category config
export function getCategoryConfig(categorySlug) {
  return VAULT_CATEGORIES[categorySlug];
}

// Helper function to get all category slugs (for static path generation)
export function getAllCategorySlugs() {
  return Object.keys(VAULT_CATEGORIES);
}