/**
 * Category utilities - helpers for working with pattern and vault categories
 */
import { getCollection, type CollectionEntry } from 'astro:content';

// Pattern Categories
export type PatternCategory = CollectionEntry<'pattern-categories'>;

export async function getPatternCategories(): Promise<PatternCategory[]> {
  const categories = await getCollection('pattern-categories');
  return categories.sort((a, b) => a.data.order - b.data.order);
}

export async function getPatternCategoryBySlug(slug: string): Promise<PatternCategory | undefined> {
  const categories = await getCollection('pattern-categories');
  return categories.find(c => c.id === slug);
}

// Pattern Difficulties
export type PatternDifficulty = CollectionEntry<'pattern-difficulties'>;

export async function getPatternDifficulties(): Promise<PatternDifficulty[]> {
  const difficulties = await getCollection('pattern-difficulties');
  return difficulties.sort((a, b) => a.data.order - b.data.order);
}

export async function getPatternDifficultyBySlug(slug: string): Promise<PatternDifficulty | undefined> {
  const difficulties = await getCollection('pattern-difficulties');
  return difficulties.find(d => d.id === slug);
}

// Vault Categories
export type VaultCategory = CollectionEntry<'vault-categories'>;

export async function getVaultCategories(): Promise<VaultCategory[]> {
  const categories = await getCollection('vault-categories');
  return categories.sort((a, b) => a.data.order - b.data.order);
}

export async function getVaultCategoryBySlug(slug: string): Promise<VaultCategory | undefined> {
  const categories = await getCollection('vault-categories');
  return categories.find(c => c.id === slug);
}
