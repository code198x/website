/**
 * Unified System Color Configuration
 * Central source of truth for all retro system colors and theming
 */

export interface SystemColor {
  slug: string;
  name: string;
  className: string;
  colors: {
    primary: string;
    secondary: string;
    tertiary?: string;
    accent?: string;
    light: string;
    dark?: string;
  };
  gradients: {
    main: string;
    vertical?: string;
    subtle?: string;
  };
  palette?: string[]; // Additional palette colors for the system
  description?: string;
}

export const SYSTEM_COLORS: Record<string, SystemColor> = {
  "commodore-64": {
    slug: "commodore-64",
    name: "Commodore 64",
    className: "system-c64",
    colors: {
      primary: "#4169E1", // Classic C64 blue
      secondary: "#1E3A8A", // Darker blue
      tertiary: "#8B7355", // Brown/tan from original case
      accent: "#A6A6FF", // Light blue
      light: "rgba(65, 105, 225, 0.1)",
      dark: "#0F1F4A",
    },
    gradients: {
      main: "var(--gradient-system-c64)",
      vertical: "var(--gradient-system-c64-vertical)",
      subtle: "linear-gradient(135deg, rgba(65, 105, 225, 0.2) 0%, rgba(30, 58, 138, 0.1) 100%)",
    },
    palette: [
      "#000000",
      "#FFFFFF",
      "#883932",
      "#67B6BD",
      "#8B3F96",
      "#55A049",
      "#40318D",
      "#BFCD7A",
    ],
    description: "The breadbox that launched a million programmers",
  },

  "zx-spectrum": {
    slug: "zx-spectrum",
    name: "ZX Spectrum",
    className: "system-spectrum",
    colors: {
      primary: "#FF0000", // Red from rainbow stripe
      secondary: "#0000FF", // Blue from rainbow stripe
      tertiary: "#00FF00", // Green from rainbow stripe
      accent: "#FFFF00", // Yellow
      light: "rgba(255, 0, 0, 0.1)",
      dark: "#000000",
    },
    gradients: {
      main: "var(--gradient-system-spectrum)",
      vertical: "var(--gradient-system-spectrum-vertical)",
      subtle:
        "linear-gradient(135deg, rgba(255, 0, 0, 0.2) 0%, rgba(0, 255, 0, 0.2) 50%, rgba(0, 0, 255, 0.2) 100%)",
    },
    palette: [
      "#000000",
      "#0000FF",
      "#FF0000",
      "#FF00FF",
      "#00FF00",
      "#00FFFF",
      "#FFFF00",
      "#FFFFFF",
    ],
    description: "Britain's rubber-keyed revolution",
  },

  "nintendo-entertainment-system": {
    slug: "nintendo-entertainment-system",
    name: "Nintendo Entertainment System",
    className: "system-nes",
    colors: {
      primary: "#E60012", // Nintendo red
      secondary: "#850008", // Darker red
      tertiary: "#C4C4C4", // Gray from console
      accent: "#FFD700", // Gold accents
      light: "rgba(230, 0, 18, 0.1)",
      dark: "#4A0006",
    },
    gradients: {
      main: "var(--gradient-system-nes)",
      vertical: "var(--gradient-system-nes-vertical)",
      subtle: "linear-gradient(135deg, rgba(230, 0, 18, 0.2) 0%, rgba(133, 0, 8, 0.1) 100%)",
    },
    palette: [
      "#7C7C7C",
      "#0000FC",
      "#0000BC",
      "#4428BC",
      "#940084",
      "#A80020",
      "#A81000",
      "#881400",
    ],
    description: "8-bit gaming perfection",
  },

  "commodore-amiga": {
    slug: "commodore-amiga",
    name: "Commodore Amiga",
    className: "system-amiga",
    colors: {
      primary: "#FF6B35", // Amiga orange
      secondary: "#F7931E", // Lighter orange
      tertiary: "#0055AA", // Blue accent
      accent: "#FF8800", // Bright orange
      light: "rgba(255, 107, 53, 0.1)",
      dark: "#CC4422",
    },
    gradients: {
      main: "var(--gradient-system-amiga)",
      vertical: "linear-gradient(180deg, #FF6B35 0%, #F7931E 100%)",
      subtle: "linear-gradient(135deg, rgba(255, 107, 53, 0.2) 0%, rgba(247, 147, 30, 0.1) 100%)",
    },
    palette: [
      "#000000",
      "#FFFFFF",
      "#FF0000",
      "#00FF00",
      "#0000FF",
      "#FFFF00",
      "#00FFFF",
      "#FF00FF",
    ],
    description: "The multimedia powerhouse",
  },

  "apple-ii": {
    slug: "apple-ii",
    name: "Apple II",
    className: "system-apple-ii",
    colors: {
      primary: "#2E8B57", // Sea green
      secondary: "#228B22", // Forest green
      tertiary: "#61B329", // Apple green
      accent: "#A2C93A", // Light green
      light: "rgba(46, 139, 87, 0.1)",
      dark: "#1A5534",
    },
    gradients: {
      main: "var(--gradient-system-apple-ii)",
      vertical: "linear-gradient(180deg, #2E8B57 0%, #228B22 100%)",
      subtle: "linear-gradient(135deg, rgba(46, 139, 87, 0.2) 0%, rgba(34, 139, 34, 0.1) 100%)",
    },
    palette: ["#000000", "#FF6060", "#00FF00", "#FFFFFF", "#0000FF", "#FF00FF"],
    description: "The computer that started it all",
  },

  "atari-800": {
    slug: "atari-800",
    name: "Atari 800",
    className: "system-atari-800",
    colors: {
      primary: "#8B4513", // Saddle brown
      secondary: "#A0522D", // Sienna
      tertiary: "#D2691E", // Chocolate
      accent: "#DEB887", // Burlywood
      light: "rgba(139, 69, 19, 0.1)",
      dark: "#5C2E0A",
    },
    gradients: {
      main: "var(--gradient-system-atari-800)",
      vertical: "linear-gradient(180deg, #8B4513 0%, #A0522D 100%)",
      subtle: "linear-gradient(135deg, rgba(139, 69, 19, 0.2) 0%, rgba(160, 82, 45, 0.1) 100%)",
    },
    palette: ["#000000", "#FFFFFF", "#8B4513", "#CD853F", "#DEB887", "#F5DEB3"],
    description: "The 8-bit computer wars champion",
  },

  "atari-2600": {
    slug: "atari-2600",
    name: "Atari 2600",
    className: "system-atari-2600",
    colors: {
      primary: "#FFD700", // Gold
      secondary: "#FFA500", // Orange
      tertiary: "#FF8C00", // Dark orange
      accent: "#FFE4B5", // Moccasin
      light: "rgba(255, 215, 0, 0.1)",
      dark: "#CC8800",
    },
    gradients: {
      main: "var(--gradient-system-atari-2600)",
      vertical: "linear-gradient(180deg, #FFD700 0%, #FFA500 100%)",
      subtle: "linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 165, 0, 0.1) 100%)",
    },
    palette: [
      "#000000",
      "#404040",
      "#6C6C6C",
      "#909090",
      "#B0B0B0",
      "#C8C8C8",
      "#DCD0C0",
      "#FFFFFF",
    ],
    description: "The console that started it all",
  },

  // Default fallback
  default: {
    slug: "default",
    name: "Default System",
    className: "system-default",
    colors: {
      primary: "#64748b",
      secondary: "#475569",
      tertiary: "#334155",
      accent: "#94a3b8",
      light: "rgba(100, 116, 139, 0.1)",
      dark: "#1e293b",
    },
    gradients: {
      main: "linear-gradient(135deg, #64748b 0%, #475569 100%)",
      vertical: "linear-gradient(180deg, #64748b 0%, #475569 100%)",
      subtle: "linear-gradient(135deg, rgba(100, 116, 139, 0.2) 0%, rgba(71, 85, 105, 0.1) 100%)",
    },
    description: "Classic retro styling",
  },
};

// Additional systems can be added here
const ADDITIONAL_SYSTEMS = [
  "pet",
  "amstrad-cpc",
  "msx",
  "game-boy",
  "atari-st",
  "genesis",
  "snes",
  "jupiter-ace",
  "bbc-micro",
];

/**
 * Get system color configuration by slug
 */
export function getSystemColors(slug: string): SystemColor {
  // Normalize slug (handle variations)
  const normalizedSlug = slug.toLowerCase().replace(/_/g, "-");

  return SYSTEM_COLORS[normalizedSlug] || SYSTEM_COLORS["default"];
}

/**
 * Get all system slugs
 */
export function getAllSystemSlugs(): string[] {
  return Object.keys(SYSTEM_COLORS).filter((key) => key !== "default");
}

/**
 * Generate CSS custom properties for a system
 */
export function generateSystemCSSVars(system: SystemColor): string {
  return `
    --system-primary: ${system.colors.primary};
    --system-secondary: ${system.colors.secondary};
    --system-tertiary: ${system.colors.tertiary || system.colors.secondary};
    --system-accent: ${system.colors.accent || system.colors.primary};
    --system-light: ${system.colors.light};
    --system-dark: ${system.colors.dark || system.colors.secondary};
    --system-gradient: ${system.gradients.main};
    --system-gradient-vertical: ${system.gradients.vertical || system.gradients.main};
    --system-gradient-subtle: ${system.gradients.subtle || system.gradients.main};
  `;
}

/**
 * Get difficulty icon and color
 */
export function getDifficultyInfo(level?: string): { icon: string; color: string } {
  switch (level?.toLowerCase()) {
    case "easy":
    case "beginner":
      return { icon: "🟢", color: "#10b981" };
    case "intermediate":
    case "medium":
      return { icon: "🟡", color: "#f59e0b" };
    case "hard":
    case "advanced":
      return { icon: "🔴", color: "#ef4444" };
    case "expert":
      return { icon: "🟣", color: "#8b5cf6" };
    default:
      return { icon: "⚪", color: "#6b7280" };
  }
}

/**
 * Legacy compatibility - export getDifficultyIcon function
 */
export function getDifficultyIcon(level?: string): string {
  return getDifficultyInfo(level).icon;
}
