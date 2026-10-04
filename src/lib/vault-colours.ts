/** Approved subject families; category names remain the precise identifiers. */
const groups: Record<string, string[]> = {
  machine: ['systems', 'hardware', 'emulators'],
  craft: ['techniques', 'languages', 'tools', 'reference', 'software', 'technologies'],
  play: ['games', 'genres', 'design', 'demos'],
  people: ['people', 'companies', 'groups', 'distribution'],
  culture: ['culture', 'magazines', 'books', 'events', 'phenomena', 'communities'],
};

export function vaultColourGroup(category: string): string {
  const family = Object.entries(groups).find(([, subjects]) => subjects.includes(category))?.[0];
  if (!family) throw new Error(`Vault category needs a colour family: ${category}`);
  return family;
}
