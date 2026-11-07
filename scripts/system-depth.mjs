/**
 * System depth: how much the site offers about each system, derived from the
 * content and never stored (docs: specifications/system-profile.md).
 *
 * Depth sits beside readiness (`tier`) and the support surfaces, and changes
 * neither. Each missing item is a gap the content factory can pick up.
 *
 * Usage:
 *   npm run systems:depth                      every system, thinnest first
 *   npm run systems:depth -- --tier planned    one tier
 *   npm run systems:depth -- --system oric-atmos
 *   npm run systems:depth -- --json
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load as loadYaml } from 'js-yaml';
import { CAPABILITY_FIELDS } from '../src/lib/system-capability.ts';

const TIERS = ['live', 'next', 'planned', 'edge', 'beyond'];
// Pattern platforms that predate the system slugs they mean.
const PATTERN_ALIASES = { 'nintendo-nes': 'nintendo-entertainment-system' };

/** Frontmatter as an object; an entry without any yields {}. */
export function frontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match ? (loadYaml(match[1]) ?? {}) : {};
}

/**
 * Depth per system from plain inputs, so tests can build them by hand.
 * systems: [{ slug, tier, emu198x, devReady, capability }]
 * vault:   [{ path: 'category/slug', category, platforms, reviewed }]
 * patterns: [{ platform }]; lessons: ['<system>/...'] lesson ids.
 */
export function systemDepth({ systems, vault, patterns, lessons }) {
  return systems.map((system) => {
    const naming = vault.filter((entry) => entry.platforms?.includes(system.slug));
    const ownPath = system.vaultEntry ?? `systems/${system.slug}`;
    const own = vault.find((entry) => entry.path === ownPath);
    const fields = CAPABILITY_FIELDS.filter(({ key }) => system.capability?.[key]).map(({ key }) => key);
    const depth = {
      slug: system.slug,
      tier: system.tier,
      surfaces: ['emu198x', 'devReady'].filter((flag) => system[flag]),
      vaultEntry: own ? (own.reviewed ? 'reviewed' : 'unreviewed') : 'none',
      capability: fields.length,
      games: naming.filter((entry) => entry.category === 'games').length,
      techniques: naming.filter((entry) => entry.category === 'techniques').length,
      otherVault: naming.filter((entry) => !['games', 'techniques'].includes(entry.category) && entry !== own).length,
      patterns: patterns.filter((p) => (PATTERN_ALIASES[p.platform] ?? p.platform) === system.slug).length,
      lessons: lessons.filter((id) => id.startsWith(`${system.slug}/`)).length,
    };
    depth.gaps = [
      depth.vaultEntry === 'none' && (system.vaultEntry ? `Vault entry (${system.vaultEntry} is named but not published)` : 'Vault entry'),
      depth.vaultEntry === 'unreviewed' && 'Vault review',
      depth.capability < CAPABILITY_FIELDS.length &&
        `capability (${CAPABILITY_FIELDS.length - depth.capability} of ${CAPABILITY_FIELDS.length} fields missing)`,
      depth.games === 0 && 'games',
      depth.techniques === 0 && 'techniques',
      depth.patterns === 0 && 'patterns',
    ].filter(Boolean);
    return depth;
  });
}

function files(dir, test) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((d) => d.isFile() && test(d.name))
    .map((d) => join(d.parentPath, d.name));
}

export function readSite(root) {
  const content = join(root, 'src/content');
  const systems = files(join(content, 'systems'), (n) => n.endsWith('.yaml')).map((file) => {
    const data = loadYaml(readFileSync(file, 'utf8'));
    return { slug: relative(join(content, 'systems'), file).replace(/\.yaml$/, ''), ...data };
  });
  const vault = files(join(content, 'vault'), (n) => n.endsWith('.mdx')).map((file) => {
    const data = frontmatter(readFileSync(file, 'utf8'));
    const path = relative(join(content, 'vault'), file).replace(/\.mdx$/, '');
    return { path, category: path.split('/')[0], platforms: data.platforms ?? [], reviewed: data.reviewed === true };
  });
  const patterns = files(join(content, 'patterns'), (n) => n.endsWith('.mdx'))
    .map((file) => ({ platform: frontmatter(readFileSync(file, 'utf8')).platform }));
  const lessons = files(join(content, 'curriculum'), (n) => /^unit-.*\.mdx$/.test(n))
    .map((file) => relative(join(content, 'curriculum'), file));
  return { systems, vault, patterns, lessons };
}

function main(argv) {
  const value = (flag) => { const i = argv.indexOf(flag); return i >= 0 ? argv[i + 1] : undefined; };
  const tier = value('--tier');
  const only = value('--system');
  if (tier && !TIERS.includes(tier)) throw new Error(`--tier must be one of ${TIERS.join(', ')}`);
  const root = join(dirname(fileURLToPath(import.meta.url)), '..');
  const all = systemDepth(readSite(root));
  const rows = all
    .filter((d) => (!tier || d.tier === tier) && (!only || d.slug === only))
    .sort((a, b) => TIERS.indexOf(a.tier) - TIERS.indexOf(b.tier) || b.gaps.length - a.gaps.length || a.slug.localeCompare(b.slug));
  if (only && rows.length === 0) throw new Error(`no system called ${only}`);
  if (argv.includes('--json')) {
    console.log(JSON.stringify(rows, null, 2));
    return;
  }
  const count = (test) => rows.filter(test).length;
  console.log(`System depth: ${rows.length} systems. Derived from content; tier and support flags are unchanged.`);
  console.log(`  Vault entry: ${count((d) => d.vaultEntry === 'reviewed')} reviewed, ${count((d) => d.vaultEntry === 'unreviewed')} unreviewed, ${count((d) => d.vaultEntry === 'none')} none`);
  console.log(`  Capability: ${count((d) => d.capability === CAPABILITY_FIELDS.length)} complete, ${count((d) => d.capability > 0 && d.capability < CAPABILITY_FIELDS.length)} partial, ${count((d) => d.capability === 0)} none`);
  console.log('');
  for (const d of rows) {
    const surfaces = d.surfaces.length ? d.surfaces.join('+') : '-';
    console.log(
      `${d.slug.padEnd(30)} ${d.tier.padEnd(8)} ${surfaces.padEnd(16)} vault:${d.vaultEntry.padEnd(10)} capability ${d.capability}/${CAPABILITY_FIELDS.length}  ` +
      `games ${d.games}  techniques ${d.techniques}  other ${d.otherVault}  patterns ${d.patterns}  lessons ${d.lessons}`,
    );
    if (d.gaps.length) console.log(`${''.padEnd(30)} gaps: ${d.gaps.join('; ')}`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    console.error(`FAIL: ${error.message}`);
    process.exit(1);
  }
}
