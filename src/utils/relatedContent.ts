/// <reference types="astro/client" />

import type { CollectionEntry } from 'astro:content';

// Define a generic type for content entries that have tags
// Add other collections here if they eventually get tags (e.g., 'concepts')
type ContentWithTags =
  | CollectionEntry<'posts'>
  | CollectionEntry<'tutorials'>;

// Define the structure for the related item result, now including collection
interface RelatedItem {
  slug: string;
  title: string;
  collection: ContentWithTags['collection']; // e.g., 'posts' or 'tutorials'
}

interface FindRelatedParams {
  currentItem: ContentWithTags;
  allItems: ContentWithTags[]; // This now accepts a mix of types
  limit?: number;
}

/**
 * Finds related content items based on shared tags, across specified collections.
 * @param currentItem The item for which to find related content.
 * @param allItems All items from potentially related collections.
 * @param limit Maximum number of related items to return.
 * @returns An array of related items ({ slug, title, collection }).
 */
export function findRelated({
  currentItem,
  allItems,
  limit = 5, // Default to 5 related items
}: FindRelatedParams): RelatedItem[] {
  const currentTags = currentItem.data.tags || [];
  if (currentTags.length === 0) {
    return []; // No tags to compare
  }

  const relatedItems = allItems
    .filter(item => {
      // Exclude the current item itself (check across collections)
      if (item.collection === currentItem.collection && item.slug === currentItem.slug) {
        return false;
      }
      // Check for shared tags
      const itemTags = item.data.tags || [];
      // Ensure itemTags is treated as an array even if undefined/null in some frontmatter
      if (!Array.isArray(itemTags)) return false; 
      return itemTags.some(tag => currentTags.includes(tag));
    })
    // Optional: Sort by relevance (e.g., number of shared tags) - simple version for now
    // .sort((a, b) => { ... }) 
    .slice(0, limit) // Apply the limit
    .map(item => ({ // Map to the desired output format including collection
      slug: item.slug,
      title: item.data.title,
      collection: item.collection, // Add the collection name
    }));

  return relatedItems;
} 