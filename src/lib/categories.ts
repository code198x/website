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

// Categories that hold at least one pattern. An empty category gets no page
// and no browse link: a "nothing here yet" page is a dead end for readers and
// an empty page for search engines to index.
export async function getPopulatedPatternCategories(): Promise<PatternCategory[]> {
  const [categories, patterns] = await Promise.all([
    getPatternCategories(),
    getCollection('patterns'),
  ]);
  const used = new Set(patterns.map(p => p.data.category));
  return categories.filter(c => used.has(c.id));
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
