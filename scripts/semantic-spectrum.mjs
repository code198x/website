// Static, allowlisted semantic projection. No service, graph store or network access.
// Usage: node scripts/semantic-spectrum.mjs [output-path]
// Requires existing dev dependency js-yaml.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import * as yaml from 'js-yaml';

const ROOT = path.resolve(import.meta.dirname, '..');
const ENTITY = 'https://code198x.com/id/systems/sinclair-zx-spectrum';
const VOCAB = 'https://code198x.com/ns/semantic#';
// Pilot-only identifiers; not yet committed to public URI resolution.
// A source link is disclosed only after an explicit source-identity review.
const POLICY_FILE = path.join(ROOT, 'scripts/semantic-spectrum-policy.json');
const DEFAULT_POLICY = JSON.parse(fs.readFileSync(POLICY_FILE, 'utf8'));
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
function requirePermission(value, description) {
  if (value !== true) throw Error('Publication decision denied: ' + description);
}
function stableToken(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex').slice(0, 24);
}
function sourceNodes(sources, claimId, policy) {
  if (!Array.isArray(sources) || sources.length === 0) throw Error('No evidence for claim');
  const seen = new Set();
  return sources.map((s) => {
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
    requirePermission(policy.decisions?.sources?.[s.ref]?.identity, 'source identity');
    requirePermission(policy.decisions?.sources?.[s.ref]?.usage, 'source usage');
    if (s.kind !== 'magazine' && s.kind !== 'advertisement') throw Error('Unexpected source kind');
    // The key identifies a specific evidence occurrence, not its list position.
    // Do not publish locator metadata; use it only to disambiguate usages.
    const key = stableToken([s.ref, s.kind, s.date ?? null, s.issue ?? null, s.page ?? null]);
    if (seen.has(key)) throw Error('Duplicate evidence occurrence');
    seen.add(key);
    return {
      '@id': claimId + '/source/' + key,
      '@type': VOCAB + 'SourceUsage',
      [VOCAB + 'source']: { '@id': 'https://code198x.com/vault/' + s.ref },
      [VOCAB + 'sourceKind']: s.kind,
    };
  }).filter(Boolean);
}
export function buildSemanticGraph(entry, system, policy = DEFAULT_POLICY) {
  if (policy.version !== 1 || policy.status !== 'pilot-only-not-approved-for-publication') throw Error('Unknown pilot policy version or status');
  requirePermission(policy.decisions?.entity?.publish, 'entity');
  requirePermission(policy.decisions?.claim?.introduced?.publish, 'introduction claim');
  requirePermission(policy.decisions?.claim?.introduced?.derived, 'derived introduction claim');
  for (const relation of ['assertion', 'subject', 'predicate', 'year', 'evidenceUsage', 'source', 'sourceKind']) {
    requirePermission(policy.decisions?.relationships?.[relation]?.publish, 'relationship ' + relation);
  }
  if (policy.identities?.machine !== ENTITY || policy.identities?.cpu !== 'https://code198x.com/id/cpu/z80' || policy.identities?.manufacturer !== 'https://code198x.com/id/organisations/sinclair') throw Error('Identity policy mismatch');
  if (entry.category !== 'systems' || entry.reviewed !== true) throw Error('Unreviewed or unexpected entry');
  if (entry.title !== 'Sinclair ZX Spectrum' || system.name !== entry.title) throw Error('Identity mismatch');
  if (!entry.platforms?.includes('sinclair-zx-spectrum')) throw Error('Platform mismatch');
  if (system.cpuArchitecture !== 'z80' || system.manufacturer !== 'sinclair') throw Error('Technical identity mismatch');
  const year = safeYear(entry.introduced);
  if (safeYear(system.year) !== year) throw Error('Conflicting introduction year');
  // Distinct immutable assertion IDs for distinct stated years. A correction
  // becomes another assertion, never a mutation of the previous identifier.
  const claimId = ENTITY + '/claims/introduced/' + year;
  const usages = sourceNodes(entry.sources?.introduced, claimId, policy);
  if (usages.length === 0) throw Error('No publicly identified evidence');
  return {
    '@context': {
      schema: 'https://schema.org/',
      x: VOCAB,
      year: { '@id': 'schema:dateCreated', '@type': 'http://www.w3.org/2001/XMLSchema#gYear' },
      'x:year': { '@id': VOCAB + 'year', '@type': 'http://www.w3.org/2001/XMLSchema#gYear' },
    },
    '@graph': [
      { '@id': ENTITY, '@type': 'schema:Product', 'schema:name': entry.title,
        'x:assertion': { '@id': claimId } },
      { '@id': claimId, '@type': 'x:HistoricalAssertion', 'x:subject': { '@id': ENTITY },
        'x:predicate': { '@id': VOCAB + 'introduced' }, 'x:year': String(year),
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
  // The manifest is an internal test fixture, not a legal rights approval.
  // Never enable production publication without a separate reviewed release decision.
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(generate(), null, 2) + '\n');
  console.log('Wrote ' + path.relative(ROOT, out));
}
