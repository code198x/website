/**
 * Cross-platform sections — areas of the curriculum that sit *outside* any single
 * platform. The Foundations layer (universal — General Programming, Numbers & Bits)
 * lives here — the genuinely machine-independent groundwork. The Craft layer sits
 * beside it: the cross-machine techniques of making games (fixed-point motion,
 * tables for trig, the chase), taught as a progression rather than the Pattern
 * Library's dip-in per-machine recipes. Per-machine and per-language teaching stays
 * with its machine; the curriculum's subject is each machine's own character, not
 * shared instruction sets.
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
    // Teal — a distinct identity that borrows no platform's colour (the catalogue is
    // reds/oranges/browns with two blues), alive in both light and dark. Teal-700 (not
    // -600) so small accent text clears WCAG AA on the cream ground (4.85:1). Layouts
    // derive a brightened variant for dark mode.
    color: '#0f766e',
    tagline: 'The ideas every machine and language shares — taught once, before you pick one.',
  },
  craft: {
    slug: 'craft',
    name: 'The Craft',
    // PROVISIONAL accent — wants a design review. Rose/magenta (~pink-700): distinct
    // from Foundations' teal, on the warm side of the wheel, dark enough to clear
    // WCAG AA on the light ground (~5.5:1). NOTE: the "borrows no platform's colour"
    // rule above is now effectively unsatisfiable — the systems catalogue has grown
    // to span the whole wheel (blues, greens, teals, purples, reds, oranges, browns,
    // golds; the GBA is rebeccapurple #663399), and even Foundations' teal sits near
    // several machine teals. This rose is picked to read as a neutral *section*
    // accent, not any one machine's identity. Confirm or replace.
    color: '#be185d',
    tagline: 'The techniques every game shares — learned once, built on any machine.',
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
