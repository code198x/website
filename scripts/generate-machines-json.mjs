#!/usr/bin/env node
// Writes the kit's machines.json from src/content/systems/*.yaml, the source.
// Run from the website root: node scripts/generate-machines-json.mjs ~/Projects/198x-ui/machines.json
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';

const out = process.argv[2];
if (!out) { console.error('usage: generate-machines-json.mjs <out.json>'); process.exit(2); }
const dir = 'src/content/systems';
const systems = readdirSync(dir).filter((f) => f.endsWith('.yaml')).sort().map((f) => {
  const d = yaml.load(readFileSync(join(dir, f), 'utf8'));
  return [f.replace(/\.yaml$/, ''), { name: d.name, short: d.shortName, year: String(d.year), color: d.color, colours: d.colours ?? [] }];
});
writeFileSync(out, JSON.stringify(Object.fromEntries(systems), null, 2) + '\n');
console.log(`${systems.length} machines → ${out}`);
