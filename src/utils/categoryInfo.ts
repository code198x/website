import { getCategoryConfig } from "../data/vault-categories.js";

export interface CategoryInfo {
  label: string;
  icon: string;
  color: string;
}

export function getCategoryInfo(categorySlug: string): CategoryInfo {
  const categoryConfig = getCategoryConfig(categorySlug);

  if (!categoryConfig) {
    // Fallback for unknown categories
    return {
      label: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1),
      icon: "📄",
      color: "#6b7280",
    };
  }

  return {
    label: categoryConfig.heroTitle,
    icon: categoryConfig.heroIcon,
    color: categoryConfig.heroColor,
  };
}

export function getCategoryDisplayName(categorySlug: string): string {
  return getCategoryInfo(categorySlug).label;
}

export function getCategoryIcon(categorySlug: string): string {
  return getCategoryInfo(categorySlug).icon;
}

export function getCategoryColor(categorySlug: string): string {
  return getCategoryInfo(categorySlug).color;
}
