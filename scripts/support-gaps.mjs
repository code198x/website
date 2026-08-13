/**
 * Fleet support-gap report: which systems haven't met each family surface's
 * bar, and which are closest to lighting up next.
 *
 * Reads the systems collection YAML directly (flat scalars only) and, when the
 * umbrella checkout is present, cross-checks the Emu198x crates folder so
 * cores that exist but aren't flagged here get surfaced for verification.
 *
 * Usage: npm run surfaces:gaps
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ASM198X_ISAS } from '../src/lib/surfaces.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const systemsDir = join(root, 'src/content/systems');
// `Emu198x/` is the org *container*; the flagship repo is `Emu198x/emu198x/`
// inside it, so the crates live one level deeper than this once pointed. The
// cross-check is guarded by `existsSync`, so the wrong path did not error — it
// silently skipped, and every core that exists but is unflagged went unreported.
const emuCratesDir = join(root, '../../Emu198x/emu198x/crates');

// Emu198x machine crates → website system slug. Extend when a new core lands
// (unmapped crates are listed by the report). Non-machine crates are skipped.
const CRATE_SLUGS = {
  'emu198x-acorn-atom': 'acorn-atom',
  'emu198x-acorn-bbc-micro': 'bbc-micro',
  'emu198x-acorn-electron': 'acorn-electron',
  'emu198x-amiga': 'commodore-amiga',
  'emu198x-atari-800xl': 'atari-800',
  'emu198x-atari-2600': 'atari-2600',
  'emu198x-atari-5200': 'atari-5200',
  'emu198x-atari-7800': 'atari-7800',
  'emu198x-c64': 'commodore-64',
  'emu198x-colecovision': 'colecovision',
  'emu198x-commodore-pet': 'commodore-pet',
  'emu198x-commodore-vic-20': 'commodore-vic-20',
  'emu198x-dragon': 'dragon-32',
  'emu198x-game-boy': 'game-boy',
  'emu198x-jupiter-ace': 'jupiter-ace',
  'emu198x-mattel-aquarius': 'mattel-aquarius',
  'emu198x-memotech-mtx': 'memotech-mtx',
  'emu198x-msx': 'msx',
  'emu198x-nes': 'nintendo-entertainment-system',
  'emu198x-oric-atmos': 'oric-atmos',
  'emu198x-sega-master-system': 'sega-master-system',
  'emu198x-sega-sg-1000': 'sega-sg-1000',
  'emu198x-sinclair-zx80': 'sinclair-zx80',
  'emu198x-sinclair-zx81': 'zx81',
  'emu198x-sord-m5': 'sord-m5',
  'emu198x-spectravideo-svi-328': 'spectravideo-svi-328',
  'emu198x-spectrum': 'sinclair-zx-spectrum',
  'emu198x-tatung-einstein': 'tatung-einstein',
};
const NON_MACHINE_CRATES = new Set([
  'emu198x-catalogue',
  'emu198x-native-video',
  'emu198x-shell',
  'emu198x-test-skip',
  'emu198x-ui',
]);

const scalar = (src, key) => {
  const m = src.match(new RegExp(`^${key}: *"?([^"\\n]+)"?$`, 'm'));
  return m ? m[1].trim() : undefined;
};
const flowList = (src, key) => {
  const m = src.match(new RegExp(`^${key}: *\\[([^\\]]*)\\]`, 'm'));
  return m ? m[1].split(',').map(v => v.trim().replace(/"/g, '')).filter(Boolean) : [];
};

const systems = readdirSync(systemsDir)
  .filter(f => f.endsWith('.yaml'))
  .map(f => {
    const src = readFileSync(join(systemsDir, f), 'utf8');
    return {
      slug: f.replace(/\.yaml$/, ''),
      name: scalar(src, 'name'),
      tier: scalar(src, 'tier'),
      cpu: scalar(src, 'cpuArchitecture'),
      secondaryCpus: flowList(src, 'secondaryCpuArchitectures'),
      emu198x: scalar(src, 'emu198x') === 'true',
      devReady: scalar(src, 'devReady') === 'true',
    };
  });

const bySlug = new Map(systems.map(s => [s.slug, s]));

let coreSlugs = new Set();
let unmappedCrates = [];
if (existsSync(emuCratesDir)) {
  const crates = readdirSync(emuCratesDir).filter(
    c => c.startsWith('emu198x-') && !NON_MACHINE_CRATES.has(c)
  );
  for (const crate of crates) {
    const slug = CRATE_SLUGS[crate];
    if (!slug) unmappedCrates.push(crate);
    else if (!bySlug.has(slug)) unmappedCrates.push(`${crate} → ${slug} (no such system)`);
    else coreSlugs.add(slug);
  }
} else {
  console.log('(Emu198x checkout not found — skipping core cross-check)\n');
}

// A system counts as ISA-covered only when the primary AND every secondary
// CPU is in the spec — a Mega Drive sound engine is Z80 code.
const cpuCovered = s => [s.cpu, ...s.secondaryCpus].every(c => ASM198X_ISAS.has(c));
const label = s => `${s.slug} [${[s.cpu, ...s.secondaryCpus].join('+')}, ${s.tier}]`;
const byCpu = list => {
  const groups = new Map();
  for (const s of list) {
    if (!groups.has(s.cpu)) groups.set(s.cpu, []);
    groups.get(s.cpu).push(s.slug);
  }
  return [...groups.entries()].sort((a, b) => b[1].length - a[1].length);
};

console.log(`Fleet support gaps — ${systems.length} systems`);
console.log(`  emu198x: ${systems.filter(s => s.emu198x).length} flagged`);
console.log(`  devReady: ${systems.filter(s => s.devReady).length} flagged\n`);

const closest = systems.filter(
  s => !s.devReady && cpuCovered(s) && (s.emu198x || coreSlugs.has(s.slug))
);
console.log(`CLOSEST TO LIGHTING UP — emulator core + ISA covered, packaging path missing (${closest.length}):`);
for (const s of closest) console.log(`  ${label(s)}`);

const coreUnflagged = [...coreSlugs].filter(slug => !bySlug.get(slug).emu198x);
console.log(`\nEMULATOR — core exists, flag unset; verify boots-and-validates, then set emu198x: true (${coreUnflagged.length}):`);
for (const slug of coreUnflagged.sort()) console.log(`  ${label(bySlug.get(slug))}`);
if (unmappedCrates.length) {
  console.log(`  unmapped crates (extend CRATE_SLUGS): ${unmappedCrates.join(', ')}`);
}

const noCore = systems.filter(s => !s.emu198x && !coreSlugs.has(s.slug));
console.log(`\nEMULATOR — no core yet (${noCore.length}), by CPU:`);
for (const [cpu, slugs] of byCpu(noCore)) {
  console.log(`  ${cpu} (${slugs.length}): ${slugs.join(', ')}`);
}

const asmOnly = systems.filter(s => !s.devReady && cpuCovered(s) && !s.emu198x && !coreSlugs.has(s.slug));
console.log(`\nTOOLCHAIN — ISA covered but not devReady and no core (${asmOnly.length}), by CPU:`);
for (const [cpu, slugs] of byCpu(asmOnly)) {
  console.log(`  ${cpu} (${slugs.length}): ${slugs.join(', ')}`);
}

const isaGap = systems.filter(s => !cpuCovered(s));
console.log(`\nTOOLCHAIN — CPU not in the ISA spec (${isaGap.length}), by CPU:`);
for (const [cpu, slugs] of byCpu(isaGap)) {
  console.log(`  ${cpu} (${slugs.length}): ${slugs.join(', ')}`);
}
