/**
 * Central configuration constants for the Code Like It's 198x curriculum structure.
 * This file provides a single source of truth for all curriculum dimensions
 * and platform configurations.
 */

// ============================================================================
// CURRICULUM STRUCTURE CONSTANTS
// ============================================================================

/** Total number of phases per system (0-8, where Phase 0 is foundation) */
export const MAX_PHASES = 8;

/** Total number of tiers per phase (1-16) */
export const MAX_TIERS = 16;

/** Total number of lessons per tier (1-32) */
export const MAX_LESSONS = 32;

/** Phase 0 specific configuration */
export const PHASE_ZERO = {
  NUMBER: 0,
  NAME: "Foundation",
  TOTAL_LESSONS: 128,
  TIERS: 4,
  LESSONS_PER_TIER: 32,
} as const;

/** Platform medal tiers and their lesson counts */
export const PLATFORM_TIERS = {
  PLATINUM: { lessons: 4096, games: { min: 30, max: 40 }, duration: "6-12 months" },
  GOLD: { lessons: 2048, games: { min: 20, max: 25 }, duration: "3-6 months" },
  SILVER: { lessons: 1024, games: { min: 12, max: 15 }, duration: "2-3 months" },
  BRONZE: { lessons: 512, games: { min: 6, max: 8 }, duration: "1-2 months" },
} as const;

/** Calculate total lessons for a platform */
export const calculateTotalLessons = (phases: number = MAX_PHASES): number => {
  return phases * MAX_TIERS * MAX_LESSONS;
};

// ============================================================================
// VALIDATION RANGES
// ============================================================================

export const VALIDATION = {
  phase: { min: 0, max: MAX_PHASES },
  tier: { min: 1, max: MAX_TIERS },
  lesson: { min: 1, max: MAX_LESSONS },
} as const;

// ============================================================================
// PLATFORM STATUS
// ============================================================================

export const PLATFORM_STATUS = {
  ACTIVE: "active", // Has lessons available
  PLANNED: "planned", // Future curriculum
  VAULT: "vault", // Historical reference only
} as const;

export const DIFFICULTY_LEVELS = [
  "beginner",
  "intermediate",
  "advanced",
  "expert",
  "historical",
] as const;

// ============================================================================
// VAULT ENTRY STATUS
// ============================================================================

export const VAULT_STATUS = {
  AVAILABLE: "available",
  COMING: "coming",
  DRAFT: "draft",
} as const;

// ============================================================================
// NAVIGATION CONSTANTS
// ============================================================================

export const NAV_ITEMS = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/getting-started", label: "Get Started", icon: "🚀" },
  { href: "/lessons", label: "Learn", icon: "📚" },
  { href: "/vault", label: "The Vault", icon: "🗄️" },
  { href: "/about", label: "About", icon: "ℹ️" },
] as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate a lesson URL path
 */
export const getLessonPath = (
  system: string,
  phase: number,
  tier: number,
  lesson: number
): string => {
  const lessonStr = String(lesson).padStart(3, "0");
  return `/lessons/${system}/phase-${phase}/tier-${tier}/lesson-${lessonStr}`;
};

/**
 * Parse lesson number from URL slug (e.g., "lesson-001" -> 1)
 */
export const parseLessonNumber = (slug: string): number => {
  const match = slug.match(/lesson-(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

/**
 * Format lesson number for display (e.g., 1 -> "001")
 */
export const formatLessonNumber = (num: number): string => {
  return String(num).padStart(3, "0");
};

/**
 * Check if a phase/tier/lesson combination is valid
 */
export const isValidCurriculumPath = (phase: number, tier: number, lesson: number): boolean => {
  return (
    phase >= VALIDATION.phase.min &&
    phase <= VALIDATION.phase.max &&
    tier >= VALIDATION.tier.min &&
    tier <= VALIDATION.tier.max &&
    lesson >= VALIDATION.lesson.min &&
    lesson <= VALIDATION.lesson.max
  );
};

/**
 * Get tier name based on number
 */
export const getTierName = (tier: number): string => {
  const tierNames = [
    "Foundation",
    "Fundamentals",
    "Core Concepts",
    "Advanced Topics",
    "Expert Techniques",
    "System Mastery",
    "Creative Projects",
    "Professional Skills",
    "Community Contributions",
    "Research & Innovation",
    "Legacy & History",
    "Modern Applications",
    "Cross-Platform",
    "Optimization",
    "Architecture Deep Dive",
    "Capstone",
  ];
  return tierNames[tier - 1] || `Tier ${tier}`;
};

/**
 * Get phase name based on number
 */
export const getPhaseName = (phase: number): string => {
  const phaseNames = [
    "Foundation", // Phase 0
    "Assembly Fundamentals", // Phase 1
    "Graphics & Display", // Phase 2
    "Sound & Music", // Phase 3
    "Input & Control", // Phase 4
    "Storage & Memory", // Phase 5
    "Advanced Techniques", // Phase 6
    "Game Development", // Phase 7
    "System Mastery", // Phase 8
  ];
  return phaseNames[phase] || `Phase ${phase}`;
};
