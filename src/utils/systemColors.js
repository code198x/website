/**
 * System Colors Utility
 * Bridge between new TypeScript system-colors and existing JavaScript code
 */

// Import from the new TypeScript configuration
import {
  getSystemColors as getSystemConfig,
  getDifficultyIcon as getDiffIcon,
} from "../data/system-colors";

/**
 * Get system colors for use in components
 * Maintains backward compatibility with existing code
 */
export const getSystemColors = (slug) => {
  const systemConfig = getSystemConfig(slug);

  // Return in the format expected by existing components
  return {
    primary: systemConfig.colors.primary,
    secondary: systemConfig.colors.secondary,
    light: systemConfig.colors.light,
    gradient: systemConfig.colors.primary, // For backward compatibility
    className: systemConfig.className,
    // Additional properties from new config
    tertiary: systemConfig.colors.tertiary,
    accent: systemConfig.colors.accent,
    dark: systemConfig.colors.dark,
    gradients: systemConfig.gradients,
    palette: systemConfig.palette,
    name: systemConfig.name,
  };
};

/**
 * Get difficulty icon
 * Re-export from new TypeScript configuration
 */
export const getDifficultyIcon = getDiffIcon;
