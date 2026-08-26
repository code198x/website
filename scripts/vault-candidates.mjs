#!/usr/bin/env node
/**
 * Surface entries the Vault talks about but does not have.
 *
 * Hand-maintained backlogs rot; this regenerates. It reads every vault entry,
 * pulls out the names and titles the prose emphasises (bold and italic), drops
 * anything that already resolves to an entry or is obviously not a subject,
 * and ranks what is left by how often the prose mentions it.
 *
 * Usage:  node scripts/vault-candidates.mjs [--min 2] [--category games]
 *
 * Known limitation: it matches on the exact emphasised string, so a subject the
 * prose calls "OutRun" while the entry is slugged out-run reads as missing. Those
 * rows are not noise — they mark places the prose should be linking and is not.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'src/content/vault';
const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(`--${n}`); return i < 0 ? d : args[i + 1]; };
const MIN = Number(opt('min', 2));
const ONLY = opt('category', null);

const walk = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? walk(p) : p.endsWith('.mdx') ? [p] : [];
});

const files = walk(ROOT);
const slugs = new Set(files.map((f) => f.split('/').slice(-2).join('/').replace(/\.mdx$/, '')));
const bare = new Set([...slugs].map((s) => s.split('/')[1]));

const norm = (s) => s.toLowerCase()
  .replace(/[’']/g, '').replace(/&/g, 'and')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Words that are emphasised constantly but are not subjects.
const STOP = new Set([
  'crash','sinclair-user','your-sinclair','zzap-64','the-games-machine','ace','c-vg',
  'yes','no','not','and','but','the','a','an','producer','author','retail-price',
  'spectrum','zx-spectrum','commodore-64','amiga','not-rated','unrateable',
  // Emphasised prose words that are not subjects. Kept explicit rather than
  // heuristic, so adding one is a deliberate act with a visible diff.
  'graphics','sound','developer','publisher','designer','director','animation',
  'community','innovation','cost','quality','resolution','style','games','born',
  'documentation','preservation','distribution','music','gameplay','price',
  'legacy','purpose','origin','setting','platform','platforms','company',
  'status','role','era','players','sales','cpu','memory','speed','colour','color',
  'c64','snes','nes','pc','arcade','uk','us','japan','europe','britain',
]);

const hits = new Map(); // key -> {label, count, seenIn:Set}
for (const f of files) {
  const text = readFileSync(f, 'utf8');
  const body = text.replace(/^---\n[\s\S]*?\n---/, '');
  // linked things are already accounted for; strip them first
  const unlinked = body.replace(/\[[^\]]+\]\([^)]+\)/g, ' ');
  const marks = [
    ...unlinked.matchAll(/\*\*\*([^*\n]{3,50})\*\*\*/g),
    ...unlinked.matchAll(/\*\*([^*\n]{3,50})\*\*/g),
    ...unlinked.matchAll(/(?<!\*)\*([A-Z][^*\n]{2,49})\*(?!\*)/g),
  ];
  for (const m of marks) {
    const raw = m[1].trim();
    // A trailing colon means this is a Fast-facts field label (**Developer:**),
    // not a subject. Reject before stripping punctuation, or the signal is lost.
    if (/:$/.test(raw)) continue;
    const label = raw.replace(/[.,;!?]+$/, '');
    if (!/^[A-Z]/.test(label)) continue;          // subjects are capitalised
    if (/^\d/.test(label)) continue;              // scores, prices, years
    if (label.split(/\s+/).length > 6) continue;  // sentences, not names
    if (/^(The|A|An)$/i.test(label)) continue;
    const key = norm(label);
    if (!key || key.length < 3 || STOP.has(key)) continue;
    if (bare.has(key)) continue;                   // already an entry
    const rec = hits.get(key) || { label, count: 0, seenIn: new Set() };
    rec.count += 1;
    rec.seenIn.add(f.split('/').slice(-2).join('/').replace(/\.mdx$/, ''));
    hits.set(key, rec);
  }
}

const rows = [...hits.values()]
  .filter((r) => r.seenIn.size >= MIN)
  .filter((r) => !ONLY || [...r.seenIn].some((s) => s.startsWith(`${ONLY}/`)))
  .sort((a, b) => b.seenIn.size - a.seenIn.size || b.count - a.count);

console.log(`Vault candidates — named in ${MIN}+ entries, no entry of their own\n`);
console.log(`${'subject'.padEnd(38)}${'entries'.padStart(8)}${'  mentioned in'}`);
for (const r of rows.slice(0, 40)) {
  const where = [...r.seenIn].slice(0, 3).join(', ') + (r.seenIn.size > 3 ? ` +${r.seenIn.size - 3}` : '');
  console.log(`${r.label.slice(0, 36).padEnd(38)}${String(r.seenIn.size).padStart(8)}  ${where}`);
}
console.log(`\n${rows.length} candidates at --min ${MIN}. Raise --min to narrow.`);
