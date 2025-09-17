import { getCategoryIcon, getCategoryDisplayName } from "./categoryInfo";

export function getEntryIcon(category: string): string {
  return getCategoryIcon(category);
}

export { getCategoryDisplayName };
