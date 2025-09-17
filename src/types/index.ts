/**
 * Centralized type definitions for the Code198x platform.
 * This file consolidates all shared TypeScript interfaces and types.
 */

// ============================================================================
// CURRICULUM TYPES
// ============================================================================

export interface LessonMeta {
  system: string;
  systemSlug: string;
  phase: number;
  tier: number;
  lesson: number;
  title: string;
  slug: string;
  path: string;
}

export interface TierMeta {
  system: string;
  systemSlug: string;
  phase: number;
  tier: number;
  name: string;
  description?: string;
  totalLessons: number;
  path: string;
}

export interface PhaseMeta {
  system: string;
  systemSlug: string;
  phase: number;
  name: string;
  description?: string;
  totalTiers: number;
  totalLessons: number;
  path: string;
}

export interface SystemMeta {
  name: string;
  slug: string;
  description?: string;
  medalTier?: "platinum" | "gold" | "silver" | "bronze";
  totalPhases: number;
  totalLessons: number;
  status: "active" | "planned" | "vault";
  path: string;
}

// ============================================================================
// VAULT TYPES
// ============================================================================

export interface VaultEntry {
  c: string; // category
  n: string; // name
  d: string; // description
  s: string; // slug
  t?: string; // type
  g?: string[]; // tags
  y?: number; // year
  st: "available" | "coming" | "draft"; // status
}

export interface VaultCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  count?: number;
}

export interface RelatedEntry {
  name: string;
  slug: string;
  category: string;
  available: boolean;
}

// ============================================================================
// NAVIGATION TYPES
// ============================================================================

export interface NavItem {
  href: string;
  label: string;
  icon?: string;
  isActive?: boolean;
  children?: NavItem[];
}

export interface Breadcrumb {
  label: string;
  href: string;
  isActive?: boolean;
}

// ============================================================================
// SEARCH TYPES
// ============================================================================

export interface SearchResult {
  type: "lesson" | "vault" | "system" | "page";
  title: string;
  description?: string;
  path: string;
  category?: string;
  tags?: string[];
  year?: number;
  score?: number;
}

export interface SearchFilter {
  id: string;
  label: string;
  type: "select" | "text" | "multiselect" | "range";
  options?: Array<{
    value: string;
    label: string;
    icon?: string;
  }>;
  value?: string | string[] | number | [number, number];
}

// ============================================================================
// TIMELINE TYPES
// ============================================================================

export interface TimelineEvent {
  id: string;
  year: number;
  month?: number;
  title: string;
  description: string;
  category: string;
  icon?: string;
  link?: string;
  tags?: string[];
}

export interface TimelineYear {
  year: number;
  events: TimelineEvent[];
  categories: Set<string>;
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

export interface PageLayoutProps {
  title: string;
  description?: string;
  ogImage?: string;
  noIndex?: boolean;
  currentPath?: string;
  bodyClass?: string;
}

export interface CardProps {
  title: string;
  description?: string;
  href?: string;
  icon?: string;
  tags?: string[];
  variant?: "default" | "featured" | "compact";
  className?: string;
}

export interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: "left" | "right";
  className?: string;
  children: any;
}

// ============================================================================
// CONTENT COLLECTION TYPES
// ============================================================================

export interface BaseCollectionEntry {
  name: string;
  status: "available" | "coming" | "draft";
  tags: string[];
  description: string;
  featured: boolean;
  lastUpdated: Date;
  relatedEntries?: Record<string, RelatedEntry[]>;
}

export interface HardwareEntry extends BaseCollectionEntry {
  type: "computer" | "console" | "chip" | "peripheral" | "addon";
  year: number;
  endYear?: number;
  manufacturer: string;
  cpu?: string;
  cpuSpeed?: string;
  memory?: string;
  graphics?: string;
  sound?: string;
  storage?: string;
  media?: string[];
  price?: string;
  unitsSold?: string;
  marketRegions?: string[];
  chipType?: "processor" | "graphics" | "sound" | "memory" | "custom";
  architecture?: string;
  transistorCount?: number;
}

export interface PersonEntry extends BaseCollectionEntry {
  type: "engineer" | "designer" | "executive" | "artist" | "musician" | "programmer";
  birthDate?: Date;
  birthPlace?: string;
  nationality?: string;
  companies?: Array<{
    name: string;
    role: string;
    period: string;
  }>;
  notableWorks?: string[];
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

export interface CompanyEntry extends BaseCollectionEntry {
  type: "manufacturer" | "publisher" | "developer" | "distributor";
  founded: number;
  defunct?: number;
  headquarters: string;
  founders?: string[];
  keyPeople?: Array<{
    name: string;
    role: string;
    period?: string;
  }>;
  products?: Array<{
    name: string;
    year: number;
    category: string;
  }>;
  acquisitions?: Array<{
    company: string;
    year: number;
    price?: string;
  }>;
}

export interface GameEntry extends BaseCollectionEntry {
  type: "arcade" | "home" | "computer" | "handheld";
  year: number;
  developer: string;
  publisher: string;
  platforms: string[];
  genre: string[];
  modes?: string[];
  media?: string;
  codeSize?: string;
  notableTechniques?: string[];
  legacy?: string;
  preservation?: {
    status: string;
    romAvailable: boolean;
    sourceAvailable: boolean;
    remakes?: string[];
  };
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type ValueOf<T> = T[keyof T];
