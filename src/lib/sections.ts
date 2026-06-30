/**
 * Cross-platform sections — areas of the curriculum that sit *outside* any single
 * platform. The Foundations layer (universal — General Programming, Numbers & Bits)
 * lives here — the genuinely machine-independent groundwork. Per-machine and
 * per-language teaching stays with its machine; the curriculum's subject is each
 * machine's own character, not shared instruction sets.
 *
 * A section's content is laid out as `{section}/{module}/unit-NN` — one level
 * shallower than a platform's `{platform}/{track}/{module}/unit-NN`, because a
 * section has no language track. The route and UnitLayout branch on `getSection()`
 * to brand these neutrally and parse the shorter path; everything else is unchanged.
 */
export interface Section {
  slug: string;
  name: string;
  /** Neutral accent — deliberately not any platform's colour. */
  color: string;
  tagline: string;
}

const SECTIONS: Record<string, Section> = {
  foundations: {
    slug: 'foundations',
    name: 'Foundations',
    color: '#64748b',
    tagline: 'The ideas every machine and language shares — taught once, before you pick one.',
  },
};

export function getSection(slug: string): Section | undefined {
  return SECTIONS[slug];
}

export function isSection(slug: string): boolean {
  return Object.prototype.hasOwnProperty.call(SECTIONS, slug);
}

export function getAllSections(): Section[] {
  return Object.values(SECTIONS);
}
