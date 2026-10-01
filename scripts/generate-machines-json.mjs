#!/usr/bin/env node
// Writes the kit's machines.json from src/content/systems/*.yaml, the source.
// Run from the website root: node scripts/generate-machines-json.mjs ~/Projects/198x-ui/machines.json
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';
import { machinesJson } from '../src/lib/machine-colours.ts'; // Node strips the types natively

const out = process.argv[2];
if (!out) { console.error('usage: generate-machines-json.mjs <out.json>'); process.exit(2); }
const dir = 'src/content/systems';
const systems = readdirSync(dir).filter((f) => f.endsWith('.yaml')).map((f) => ({
  id: f.replace(/\.yaml$/, ''),
  data: yaml.load(readFileSync(join(dir, f), 'utf8')),
}));
const machines = machinesJson(systems);
writeFileSync(out, JSON.stringify(machines, null, 2) + '\n');
console.log(`${Object.keys(machines).length} machines → ${out}`);
