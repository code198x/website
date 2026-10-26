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
// Emu198x's system registry names every machine it ships, one `machine_id`
// per machine, including the ones that share a runner (the C128 inside the
// C64's, the CoCo inside the Dragon's). Reading it, not the crates folder,
// keeps chip crates out of the cross-check and counts shared runners once per
// machine. The read is guarded by `existsSync`, so a fresh website-only
// checkout skips the cross-check and says so.
const emuRegistry = join(root, '../../Emu198x/emu198x/docs/status/systems.toml');

// Emu198x machine id → website system slug. `null` means the machine has no
// system page of its own yet; the report lists it so the gap is visible.
// Extend when the registry gains a machine (unmapped ids are reported).
const MACHINE_SLUGS = {
  'acorn-atom': 'acorn-atom',
  'acorn-bbc-micro': 'bbc-micro',
  'acorn-electron': 'acorn-electron',
  'amstrad-cpc': 'amstrad-cpc',
  'atari-2600': 'atari-2600',
  'atari-5200': 'atari-5200',
  'atari-7800': 'atari-7800',
  'atari-800xl': 'atari-800',
  'atari-st': 'atari-st',
  'coleco-colecovision': 'colecovision',
  'commodore-amiga': 'commodore-amiga',
  'commodore-c64': 'commodore-64',
  'commodore-c128': 'commodore-128',
  'commodore-pet': 'commodore-pet',
  'commodore-vic-20': 'commodore-vic-20',
  'dragon': 'dragon-32',
  'jupiter-ace': 'jupiter-ace',
  'mattel-aquarius': 'mattel-aquarius',
  'memotech-mtx': 'memotech-mtx',
  'microsoft-msx1': 'msx',
  'microsoft-msx2': 'msx2',
  'nintendo-game-boy': 'game-boy',
  'nintendo-nes': 'nintendo-entertainment-system',
  'nintendo-snes': 'super-nintendo',
  'oric': 'oric-atmos',
  'sega-game-gear': 'sega-game-gear',
  'sega-master-system': 'sega-master-system',
  'sega-mega-drive': 'sega-mega-drive',
  'sega-sg-1000': 'sega-sg-1000',
  'sinclair-zx-spectrum': 'sinclair-zx-spectrum',
  'sinclair-zx80': 'sinclair-zx80',
  'sinclair-zx81': 'sinclair-zx81',
  'snk-neo-geo': 'neo-geo',
  'sord-m5': 'sord-m5',
  'spectravideo-svi-328': 'spectravideo-svi-328',
  'tandy-coco': 'tandy-coco',
  'tatung-einstein': 'tatung-einstein',
};

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
let unmappedMachines = [];
let pagelessMachines = [];
if (existsSync(emuRegistry)) {
  const machines = [...readFileSync(emuRegistry, 'utf8').matchAll(/^machine_id = "([^"]+)"$/gm)].map(m => m[1]);
  if (machines.length === 0) throw new Error(`no machine_id entries in ${emuRegistry}`);
  for (const id of machines) {
    if (!(id in MACHINE_SLUGS)) unmappedMachines.push(id);
    else if (MACHINE_SLUGS[id] === null) pagelessMachines.push(id);
    else if (!bySlug.has(MACHINE_SLUGS[id])) unmappedMachines.push(`${id} → ${MACHINE_SLUGS[id]} (no such system)`);
    else coreSlugs.add(MACHINE_SLUGS[id]);
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
if (unmappedMachines.length) {
  console.log(`  unmapped Emu198x machines (extend MACHINE_SLUGS): ${unmappedMachines.join(', ')}`);
}
if (pagelessMachines.length) {
  console.log(`  Emu198x machines with no system page: ${pagelessMachines.join(', ')}`);
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
