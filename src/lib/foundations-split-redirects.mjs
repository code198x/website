// Foundations split, 2026-09-05. General Programming (19 units) became five
// modules and Numbers & Bits (9 units) became two, so every old URL under the two
// slugs has a new home. Module landings go to the first module of the run; each
// unit goes to the module that now holds it. See Code198x
// docs/specifications/curriculum.md
const RUNS = {
  'general-programming': [['basics', 5], ['working-it-out', 3], ['decisions', 4], ['repeating', 3], ['structure', 4]],
  'numbers-and-bits': [['counting-in-twos', 4], ['working-the-bits', 5]],
};

export function foundationsSplitRedirects() {
  const out = {};
  for (const [old, modules] of Object.entries(RUNS)) {
    out[`/foundations/${old}`] = `/foundations/${modules[0][0]}`;
    let n = 1;
    for (const [slug, count] of modules) {
      for (let i = 1; i <= count; i += 1, n += 1) {
        out[`/foundations/${old}/unit-${String(n).padStart(2, '0')}`] = `/foundations/${slug}/unit-${String(i).padStart(2, '0')}`;
      }
    }
  }
  return out;
}
