#!/usr/bin/env node
/**
 * Check the curriculum's dependency graph before the site is built.
 *
 * The gentle ramp — "complexity rises gently and close to monotonically" — has
 * been an intention nobody could verify. Declared edges make it a property with
 * a test: a module may not require one later in its own catalogue, so a reorder
 * that inverts a dependency fails here instead of going unnoticed.
 *
 * Errors exit non-zero. Thread-name drift is a warning: `Reading a world` and
 * `Reading the world` fragment the grouping silently, but a near-duplicate is a
 * judgement call and should not block a deploy.
 *
 * See Code198x docs/specifications/content-model.md
 */
import { globSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { load } from 'js-yaml';
import {
  derivedRequires,
  findCycle,
  forwardReferences,
  unresolvedReferences,
  resolveRoute,
  threadVocabulary,
} from '../src/lib/routes.ts';

const ROOT = path.join(import.meta.dirname, '..', 'src', 'content', 'modules');

const scopes = globSync('**/*.yaml', { cwd: ROOT }).sort().map((rel) => {
  const data = load(readFileSync(path.join(ROOT, rel), 'utf8'));
  const id = data.section ?? `${data.platform}/${data.track}`;
  return { id, modules: data.modules ?? [] };
});

const errors = [];
const warnings = [];

for (const { from, ref, field } of unresolvedReferences(scopes)) {
  errors.push(`${from} ${field} ${ref}, which nothing defines`);
}

const cycle = findCycle(scopes);
if (cycle) errors.push(`dependency cycle: ${cycle.join(' → ')}`);

for (const scope of scopes) {
  for (const { from, to } of forwardReferences(scope)) {
    errors.push(
      `${scope.id}/${from} requires ${to}, which comes later in the same catalogue — ` +
      `the order and the dependencies disagree`,
    );
  }
}

// Termination needs no check of its own: a route can only fail to terminate
// through a cycle or a dangling reference, and both are errors above. What is
// worth reporting is the deepest route, because a route that grows without
// anyone noticing is the queue coming back.
let deepest = { at: '', length: 0 };
if (!cycle) {
  for (const scope of scopes) {
    for (const module of scope.modules) {
      const length = resolveRoute(scopes, scope.id, module.slug).length;
      if (length > deepest.length) deepest = { at: `${scope.id}/${module.slug}`, length };
    }
  }
}

/** Edit distance, so "Reading a world" and "Reading the world" are caught. */
function distance(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j += 1) d[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
  }
  return d[a.length][b.length];
}

for (const scope of scopes) {
  const vocab = [...threadVocabulary(scope).keys()];
  for (let i = 0; i < vocab.length; i += 1) {
    for (let j = i + 1; j < vocab.length; j += 1) {
      const a = vocab[i].toLowerCase();
      const b = vocab[j].toLowerCase();
      // A quarter of the shorter name, so near-duplicates flag and genuinely
      // distinct threads do not.
      if (distance(a, b) <= Math.max(2, Math.floor(Math.min(a.length, b.length) / 4))) {
        warnings.push(`${scope.id}: thread names are near-duplicates — "${vocab[i]}" and "${vocab[j]}"`);
      }
    }
  }
}

const edges = scopes.reduce(
  (n, s) => n + s.modules.reduce((m, mod) => m + (mod.requires?.length ?? 0), 0),
  0,
);

console.log(`\nCurriculum routes: ${scopes.length} catalogues, ${edges} declared edges.`);
if (deepest.length) console.log(`  longest route: ${deepest.length} steps, to ${deepest.at}`);
for (const scope of scopes) {
  const entries = scope.modules.filter(
    (m) => derivedRequires(scope, m).length + (m.requires?.length ?? 0) === 0,
  );
  const threads = [...threadVocabulary(scope).keys()];
  console.log(
    `  · ${scope.id} — ${scope.modules.length} modules, ${entries.length} entry points` +
    (threads.length ? `, threads: ${threads.join(', ')}` : ''),
  );
}

if (warnings.length) {
  console.warn('');
  for (const w of warnings) console.warn(`  warning: ${w}`);
}

if (errors.length) {
  console.error(`\nCurriculum routes: ${errors.length} error(s).\n`);
  for (const e of errors) console.error(`  · ${e}`);
  console.error('');
  process.exit(1);
}
