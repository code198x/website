// Static, allowlisted semantic projection. No service, graph store or network access.
// Usage: node scripts/semantic-spectrum.mjs [output-path]
// Requires existing dev dependency js-yaml.
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const ROOT = path.resolve(import.meta.dirname, '..');
const ENTITY = 'https://code198x.com/id/systems/sinclair-zx-spectrum';
const VOCAB = 'https://code198x.com/ns/semantic#';
const SOURCE = path.join(ROOT, 'src/content/vault/systems/sinclair-zx-spectrum.mdx');
const SYSTEM = path.join(ROOT, 'src/content/systems/sinclair-zx-spectrum.yaml');
const DEFAULT_OUT = path.join(ROOT, 'dist/semantic/sinclair-zx-spectrum.jsonld');

function frontmatter(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text);
  if (!match) throw Error('Vault entry lacks YAML frontmatter');
  return yaml.load(match[1], { schema: yaml.JSON_SCHEMA });
}
function safeSlug(value) {
  if (typeof value !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
    throw Error('Unsafe identifier');
  }
  return value;
}
function safeYear(value) {
  if (!Number.isInteger(value) || value < 1800 || value > 2100) throw Error('Invalid year');
  return value;
}
function sourceNodes(sources, claimId) {
  if (!Array.isArray(sources) || sources.length === 0) throw Error('No evidence for claim');
  return sources.map((s, index) => {
    if (!s || typeof s !== 'object') throw Error('Invalid evidence');
    // Deliberately narrow allowlist: no notes, locators, filenames, paths or URLs.
    // Source records are NOT asserted to be independent witnesses.
    if (s.ref !== undefined && !/^magazines\/[a-z0-9-]+$/.test(s.ref)) {
      throw Error('Source reference not allowlisted');
    }
    if (s.ref === undefined && typeof s.title !== 'string') throw Error('Unidentified source');
    if (s.ref === undefined) {
      // Free-text titles have not undergone rights classification: fail closed.
      return null;
    }
    if (s.kind !== 'magazine' && s.kind !== 'advertisement') throw Error('Unexpected source kind');
    return {
      '@id': claimId + '/source/' + (index + 1),
      '@type': VOCAB + 'SourceUsage',
      [VOCAB + 'source']: { '@id': 'https://code198x.com/vault/' + s.ref },
      [VOCAB + 'sourceKind']: s.kind,
    };
  }).filter(Boolean);
}
export function buildSemanticGraph(entry, system) {
  if (entry.category !== 'systems' || entry.reviewed !== true) throw Error('Unreviewed or unexpected entry');
  if (entry.title !== 'Sinclair ZX Spectrum' || system.name !== entry.title) throw Error('Identity mismatch');
  if (!entry.platforms?.includes('sinclair-zx-spectrum')) throw Error('Platform mismatch');
  if (system.cpuArchitecture !== 'z80' || system.manufacturer !== 'sinclair') throw Error('Technical identity mismatch');
  const year = safeYear(entry.introduced);
  if (safeYear(system.year) !== year) throw Error('Conflicting introduction year');
  const claimId = ENTITY + '/claims/introduced';
  const usages = sourceNodes(entry.sources?.introduced, claimId);
  if (usages.length === 0) throw Error('No publicly identified evidence');
  return {
    '@context': {
      schema: 'https://schema.org/',
      x: VOCAB,
      year: { '@id': 'schema:dateCreated', '@type': 'http://www.w3.org/2001/XMLSchema#gYear' },
    },
    '@graph': [
      { '@id': ENTITY, '@type': 'schema:Product', 'schema:name': entry.title,
        'x:cpuArchitecture': { '@id': 'https://code198x.com/id/cpu/z80' },
        'x:manufacturer': { '@id': 'https://code198x.com/id/organisations/sinclair' },
        'x:assertion': { '@id': claimId } },
      { '@id': claimId, '@type': 'x:HistoricalAssertion', 'x:subject': { '@id': ENTITY },
        'x:predicate': 'introduced', 'x:year': year,
        'x:evidenceUsage': usages.map(u => ({ '@id': u['@id'] })) },
      ...usages,
    ],
  };
}
export function generate() {
  const entry = frontmatter(fs.readFileSync(SOURCE, 'utf8'));
  const system = yaml.load(fs.readFileSync(SYSTEM, 'utf8'), { schema: yaml.JSON_SCHEMA });
  return buildSemanticGraph(entry, system);
}
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  const out = path.resolve(process.argv[2] || DEFAULT_OUT);
  if (!out.startsWith(ROOT + path.sep)) throw Error('Output must stay within repository');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(generate(), null, 2) + '\n');
  console.log('Wrote ' + path.relative(ROOT, out));
}
