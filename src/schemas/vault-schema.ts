// Vault Schema Definitions for Code Like It's 198x
// This defines the structure for all Vault entries across categories

// Base fields that ALL vault entries must have
export interface VaultEntryBase {
  slug: string;           // URL-friendly identifier
  name: string;           // Display name
  status: 'available' | 'coming' | 'draft';
  category: string;
  tags: string[];         // Cross-referencing tags
  description: string;    // Brief one-line description
  content?: string;       // Long-form markdown content
  relatedEntries?: {     // Links to other vault entries
    [category: string]: Array<{
      name: string;
      slug: string;
      available: boolean;
    }>;
  };
  lastUpdated: Date;
  featured?: boolean;     // For highlighting important entries
}

// HARDWARE - Systems, chips, peripherals
export interface HardwareEntry extends VaultEntryBase {
  category: 'hardware';
  type: 'computer' | 'console' | 'chip' | 'peripheral' | 'addon';
  year: number;
  endYear?: number;       // When discontinued
  manufacturer: string;

  // Technical specs (optional based on type)
  cpu?: string;
  cpuSpeed?: string;
  memory?: string;
  graphics?: string;
  sound?: string;
  storage?: string;
  media?: string[];       // ['cartridge', 'cassette', 'disk']

  // Commercial info
  price?: string;         // Launch price
  unitsSold?: string;
  marketRegions?: string[];

  // For chips/components
  chipType?: 'processor' | 'graphics' | 'sound' | 'memory' | 'custom';
  architecture?: string;
  transistorCount?: number;
}

// PEOPLE - Developers, designers, executives
export interface PersonEntry extends VaultEntryBase {
  category: 'people';
  type: 'engineer' | 'designer' | 'executive' | 'artist' | 'musician' | 'programmer';

  birthDate?: Date;
  birthPlace?: string;
  nationality?: string;

  // Career highlights
  companies?: Array<{
    name: string;
    role: string;
    period: string;
  }>;

  notableWorks?: string[];  // Major contributions
  awards?: string[];
  quotes?: Array<{
    text: string;
    context: string;
    year?: number;
  }>;

  links?: {
    wikipedia?: string;
    personal?: string;
    twitter?: string;
  };
}

// COMPANIES - Manufacturers, publishers, developers
export interface CompanyEntry extends VaultEntryBase {
  category: 'companies';
  type: 'manufacturer' | 'publisher' | 'developer' | 'distributor';

  founded: number;
  defunct?: number;
  headquarters: string;

  founders?: string[];
  keyPeople?: Array<{
    name: string;
    role: string;
    period?: string;
  }>;

  parentCompany?: string;
  subsidiaries?: string[];

  notableProducts?: string[];
  notableGames?: string[];

  fate?: string;  // "Acquired by X", "Bankruptcy", "Still operating"
}

// SOFTWARE - Games, applications, operating systems
export interface SoftwareEntry extends VaultEntryBase {
  category: 'software';
  type: 'game' | 'application' | 'os' | 'utility' | 'demo' | 'language';

  year: number;
  platforms: string[];     // ['commodore-64', 'zx-spectrum']

  developer: string;
  publisher?: string;

  genre?: string[];        // ['platformer', 'shooter', 'adventure']

  // Technical details
  language?: string;       // 'Assembly', 'BASIC', 'C'
  size?: string;          // '64KB', '2 disks'
  media?: string;         // 'cassette', 'disk', 'cartridge'

  // Game-specific
  players?: string;       // '1-2', 'multiplayer'

  // Reception
  reviews?: Array<{
    publication: string;
    score: string;
    quote?: string;
  }>;

  legacy?: string[];      // Notable influences or innovations
}

// TECHNIQUES - Programming tricks, effects, algorithms
export interface TechniqueEntry extends VaultEntryBase {
  category: 'techniques';
  type: 'graphics' | 'sound' | 'optimization' | 'algorithm' | 'hardware-trick';

  platforms: string[];    // Which systems this applies to
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';

  // Technical details
  prerequisites?: string[];  // Required knowledge
  memoryUsage?: string;
  cpuUsage?: string;

  // Code examples
  examples?: Array<{
    platform: string;
    language: string;
    code: string;
    explanation: string;
  }>;

  pioneers?: string[];     // Who invented/popularized it
  notableUses?: string[];  // Games/demos that used it

  tutorials?: Array<{
    title: string;
    url: string;
  }>;
}

// PUBLICATIONS - Magazines, books, manuals
export interface PublicationEntry extends VaultEntryBase {
  category: 'publications';
  type: 'magazine' | 'book' | 'manual' | 'newsletter' | 'fanzine';

  // Publication details
  publisher: string;
  firstIssue?: Date;
  lastIssue?: Date;
  frequency?: 'weekly' | 'monthly' | 'bi-monthly' | 'quarterly' | 'annual';

  // Magazine specific
  issueCount?: number;
  circulation?: string;

  // Book specific
  author?: string[];
  isbn?: string;
  pages?: number;
  edition?: string;

  // Content focus
  focus?: string[];       // ['reviews', 'type-in programs', 'hardware', 'tutorials']
  platforms?: string[];   // Systems covered

  notableFeatures?: string[];  // Regular columns, features
  notableContributors?: string[];

  // Availability
  digitalArchive?: string;  // URL to archive.org or similar
}

// EVENTS - Trade shows, launches, competitions, parties
export interface EventEntry extends VaultEntryBase {
  category: 'events';
  type: 'trade-show' | 'launch' | 'competition' | 'demo-party' | 'conference';

  date: Date;
  endDate?: Date;         // For multi-day events
  recurring?: boolean;

  location: {
    venue?: string;
    city: string;
    country: string;
  };

  organizer?: string;
  attendance?: number;

  highlights?: string[];   // Major announcements, winners

  // Demo party specific
  competitions?: Array<{
    category: string;
    winner: string;
    production: string;
  }>;

  links?: {
    official?: string;
    results?: string;
    productions?: string;
  };
}

// GROUPS - Demo groups, cracking groups, dev teams
export interface GroupEntry extends VaultEntryBase {
  category: 'groups';
  type: 'demo' | 'cracking' | 'development' | 'music' | 'art';

  formed: number;
  disbanded?: number;
  country: string;

  members?: Array<{
    handle: string;     // Nickname/handle
    realName?: string;
    role: string;       // 'coder', 'musician', 'graphics'
    period?: string;
  }>;

  notableReleases?: Array<{
    name: string;
    year: number;
    type: string;       // 'demo', 'intro', 'musicdisk'
    platform: string;
  }>;

  affiliates?: string[];  // Related/sister groups

  legacy?: string;        // Impact on the scene
}

// FORMATS - File formats, media types, standards
export interface FormatEntry extends VaultEntryBase {
  category: 'formats';
  type: 'file' | 'media' | 'video' | 'audio' | 'protocol';

  extension?: string;     // '.d64', '.tap'
  mimeType?: string;

  creator?: string;       // Company/person who created it
  year?: number;

  platforms?: string[];   // Systems that use this format

  // Technical details
  structure?: string;     // Description of format structure
  maxSize?: string;
  compression?: boolean;

  // For media
  capacity?: string;      // '170KB', '880KB'
  physicalSize?: string;  // '5.25"', '3.5"'

  tools?: Array<{        // Tools that work with this format
    name: string;
    platform: string;
    url?: string;
  }>;

  successor?: string;     // What replaced it
}

// CULTURE - Scenes, movements, phenomena
export interface CultureEntry extends VaultEntryBase {
  category: 'culture';
  type: 'scene' | 'movement' | 'phenomenon' | 'community' | 'practice';

  period: {
    start: number;
    end?: number;
    peak?: string;        // e.g., "1987-1992"
  };

  origins?: string;       // How it started
  regions?: string[];     // Where it was prominent

  keyFigures?: string[];  // Important people
  keyGroups?: string[];   // Important groups
  keyEvents?: string[];   // Important events

  characteristics?: string[];  // Defining features

  influence?: string[];   // Impact on computing/gaming culture
  modernLegacy?: string;  // How it continues today
}

// Timeline entry for chronological view
export interface TimelineEntry {
  date: Date;
  title: string;
  category: VaultEntryBase['category'];
  slug: string;
  description: string;
  significance?: 'major' | 'moderate' | 'minor';
  image?: string;
}

// Type guard functions
export const isHardwareEntry = (entry: VaultEntryBase): entry is HardwareEntry =>
  'category' in entry && entry.category === 'hardware';

export const isPersonEntry = (entry: VaultEntryBase): entry is PersonEntry =>
  'category' in entry && entry.category === 'people';

// Add more type guards as needed...

// Export all types
export type VaultEntry =
  | HardwareEntry
  | PersonEntry
  | CompanyEntry
  | SoftwareEntry
  | TechniqueEntry
  | PublicationEntry
  | EventEntry
  | GroupEntry
  | FormatEntry
  | CultureEntry;