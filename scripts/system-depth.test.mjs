import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { systemDepth, readSite, frontmatter } from './system-depth.mjs';

const field = { value: 'x', sources: ['A manual, p. 1'] };
const base = () => ({
  systems: [{ slug: 'oric-atmos', tier: 'planned', emu198x: true }],
  vault: [
    { path: 'games/the-hobbit', category: 'games', platforms: ['oric-atmos', 'sinclair-zx-spectrum'], reviewed: true },
    { path: 'magazines/oric-owner', category: 'magazines', platforms: ['oric-atmos'], reviewed: true },
  ],
  patterns: [{ platform: 'oric-atmos' }, { platform: 'commodore-64' }],
  lessons: ['sinclair-zx-spectrum/basic/unit-01.mdx'],
});

test('a thin system reports what it lacks, and keeps its tier and surfaces', () => {
  const [d] = systemDepth(base());
  assert.equal(d.tier, 'planned');
  assert.deepEqual(d.surfaces, ['emu198x']);
  assert.equal(d.vaultEntry, 'none');
  assert.deepEqual([d.games, d.techniques, d.otherVault, d.patterns, d.lessons], [1, 0, 1, 1, 0]);
  assert.deepEqual(d.gaps, ['Vault entry', 'capability (8 of 8 fields missing)', 'techniques']);
});

test('depth changes when a profile lands, and only the profile changes it', () => {
  const before = systemDepth(base())[0];
  const site = base();
  site.systems[0].capability = { configuration: 'Oric Atmos, 48K', processor: field, memory: field, display: field };
  site.vault.push({ path: 'systems/oric-atmos', category: 'systems', platforms: ['oric-atmos'], reviewed: false });
  const after = systemDepth(site)[0];
  assert.equal(after.capability, 3);
  assert.equal(after.vaultEntry, 'unreviewed');
  assert.equal(after.otherVault, before.otherVault, 'its own entry is not counted as related reading');
  assert.equal(after.tier, before.tier);
  assert.deepEqual(after.surfaces, before.surfaces);
  assert.ok(after.gaps.includes('Vault review'));
  assert.ok(after.gaps.includes('capability (5 of 8 fields missing)'));
});

test('a complete, reviewed profile leaves no profile gaps', () => {
  const site = base();
  site.systems[0].capability = Object.fromEntries(
    ['processor', 'memory', 'display', 'sound', 'input', 'storage', 'expansion', 'firmware'].map((k) => [k, field]),
  );
  site.vault.push({ path: 'systems/oric-atmos', category: 'systems', platforms: ['oric-atmos'], reviewed: true });
  site.vault.push({ path: 'techniques/serial-attributes', category: 'techniques', platforms: ['oric-atmos'], reviewed: true });
  assert.deepEqual(systemDepth(site)[0].gaps, []);
});

test('patterns written for the NES count for its system slug', () => {
  const site = base();
  site.systems = [{ slug: 'nintendo-entertainment-system', tier: 'live' }];
  site.patterns = [{ platform: 'nintendo-nes' }];
  assert.equal(systemDepth(site)[0].patterns, 1);
});

test('the real site reads: every system, vault entries with frontmatter, lessons by system', () => {
  const root = join(dirname(fileURLToPath(import.meta.url)), '..');
  const site = readSite(root);
  assert.ok(site.systems.length > 100);
  assert.ok(site.systems.every((s) => s.tier && s.slug && !s.slug.endsWith('.yaml')));
  assert.ok(site.vault.length > 1000);
  assert.ok(site.lessons.some((id) => id.startsWith('sinclair-zx-spectrum/')));
  const depth = systemDepth(site);
  const spectrum = depth.find((d) => d.slug === 'sinclair-zx-spectrum');
  assert.equal(spectrum.vaultEntry, 'reviewed');
  assert.ok(spectrum.lessons > 0 && spectrum.games > 0);
  assert.deepEqual(frontmatter('no frontmatter'), {});
});

test('capability sources must be public works, never local or library paths', async () => {
  const { PRIVATE_SOURCE } = await import('../src/lib/system-capability.ts');
  for (const bad of ['/Users/someone/library/oric.pdf', 'reference/by-system/oric/manual.md', 'reference/_raw-extracts/x', 'facts.sqlite']) {
    assert.ok(PRIVATE_SOURCE.test(bad), bad);
  }
  for (const good of ['Oric service manual, section 2', 'https://example.org/home/oric', 'The Oric Atmos Handbook (Century, 1984), p. 12']) {
    assert.ok(!PRIVATE_SOURCE.test(good), good);
  }
});

test('the schema lists exactly the capability fields the page and report use', async () => {
  const { readFileSync } = await import('node:fs');
  const { CAPABILITY_FIELDS } = await import('../src/lib/system-capability.ts');
  const config = readFileSync(new URL('../src/content.config.ts', import.meta.url), 'utf8');
  const block = config.match(/capability: z\.object\(\{([\s\S]*?)\}\)\.strict\(\)/)[1];
  const keys = [...block.matchAll(/^\s+(\w+): capabilityField\.optional\(\)/gm)].map((m) => m[1]);
  assert.deepEqual(keys, CAPABILITY_FIELDS.map((f) => f.key));
});

test('a system can name a Vault entry with a different slug', () => {
  const site = base();
  site.systems[0].vaultEntry = 'systems/oric';
  assert.equal(systemDepth(site)[0].vaultEntry, 'none');
  assert.ok(systemDepth(site)[0].gaps.includes('Vault entry (systems/oric is named but not published)'));
  site.vault.push({ path: 'systems/oric', category: 'systems', platforms: ['oric-atmos'], reviewed: false });
  const d = systemDepth(site)[0];
  assert.equal(d.vaultEntry, 'unreviewed');
  assert.equal(d.otherVault, 1, 'the named entry is its own, not related reading');
});
