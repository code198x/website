// Generate Vault Data from Content Collections
// This script runs at build time to create the centralized vault data

import { getCollection } from "astro:content";
import fs from "fs";
import path from "path";

// Map collection names to category codes
const categoryMap = {
  hardware: "hardware",
  people: "people",
  companies: "companies",
  games: "games",
  demos: "demos",
  emulators: "emulators",
  groups: "groups",
  techniques: "techniques",
  applications: "applications",
  developmentTools: "development-tools",
  utilities: "utilities",
  drivers: "drivers",
  plugins: "plugins",
  operatingSystems: "operating-systems",
  programmingLanguages: "programming-languages",
  publications: "publications",
  events: "events",
  formats: "formats",
  culture: "culture",
};

// Generate minimal entry structure for client-side
function createEntry(category, entry) {
  const data = entry.data;

  // Extract year from various possible fields
  let year = data.year || data.releaseYear || data.birthDate || data.foundedYear;
  if (data.period?.start) {
    year = data.period.start;
  }
  if (year && typeof year === "string") {
    year = parseInt(year.match(/\d{4}/)?.[0] || "0");
  }

  return {
    c: category, // category
    n: data.name || entry.id, // name
    d: (data.description || "").substring(0, 200), // description (truncated)
    s: entry.slug || entry.id, // slug
    t: data.type || "unknown", // type
    g: data.tags || [], // tags
    y: year || 0, // year
    st: data.status || "available", // status
  };
}

export async function generateVaultData() {
  const allData = [];
  const categoryData = {};

  // Process each collection
  for (const [collectionName, categoryCode] of Object.entries(categoryMap)) {
    try {
      const collection = await getCollection(collectionName);
      if (collection && collection.length > 0) {
        const entries = collection.map((entry) => createEntry(categoryCode, entry));
        allData.push(...entries);
        categoryData[categoryCode] = entries;
        console.log(`✓ Processed ${collection.length} entries from ${collectionName}`);
      }
    } catch (error) {
      // Collection doesn't exist or is empty
      categoryData[categoryCode] = [];
    }
  }

  // Sort all data by year, then name
  allData.sort((a, b) => {
    if (a.y !== b.y) return (a.y || 9999) - (b.y || 9999);
    return a.n.localeCompare(b.n);
  });

  // Generate the data file
  const dataContent = `// Auto-generated Vault Data
// Generated at build time from content collections
// DO NOT EDIT MANUALLY - this file is regenerated on each build

export const vaultData = ${JSON.stringify(allData, null, 2)};

export const vaultCategories = ${JSON.stringify(categoryData, null, 2)};

// Helper function to get entries by category
export function getEntriesByCategory(category) {
  return vaultData.filter(entry => entry.c === category);
}

// Helper function to get entry by slug and category
export function getEntry(category, slug) {
  return vaultData.find(entry =>
    entry.c === category && entry.s === slug
  );
}

// Helper to get all unique tags with counts
export function getAllTags() {
  const tagCounts = {};
  vaultData.forEach(entry => {
    (entry.g || []).forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  return tagCounts;
}

// Helper to get all unique categories
export function getAllCategories() {
  return [...new Set(vaultData.map(entry => entry.c))];
}

// Export for use in browser
if (typeof window !== 'undefined') {
  window.vaultData = vaultData;
  window.vaultCategories = vaultCategories;
}

// Metadata
export const metadata = {
  generatedAt: '${new Date().toISOString()}',
  totalEntries: ${allData.length},
  categories: ${Object.keys(categoryData).length}
};
`;

  // Write the file
  const outputPath = path.join(process.cwd(), "src/data/vault-data-generated.js");
  fs.writeFileSync(outputPath, dataContent);

  console.log(`\n✨ Generated vault data with ${allData.length} total entries`);
  console.log(`📁 Output: ${outputPath}`);

  return {
    data: allData,
    categories: categoryData,
    totalEntries: allData.length,
  };
}

// If running directly (for testing)
if (import.meta.url === `file://${process.argv[1]}`) {
  generateVaultData().catch(console.error);
}
