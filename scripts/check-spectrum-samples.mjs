#!/usr/bin/env node
/** Audit Spectrum catalogue → lesson → maintained source → clean build.
 * Run from the website: node scripts/check-spectrum-samples.mjs --build
 * --report /tmp/spectrum-audit.json [--asm /path/to/asm198x]
 * [--build198x /path/to/build198x] [--samples /path/to/code-samples].
 * Builds use an isolated copy of tracked samples, never existing artefacts.
 * This checks delivery and source continuity; it does not prove execution.
 */
import { createHash } from 'node:crypto';
import { existsSync, globSync, mkdirSync, mkdtempSync, readFileSync, copyFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { parseArgs } from 'node:util';
import { load } from 'js-yaml';
import { stagedLessonFiles } from '../src/lib/lesson-artefacts.ts';

const { values } = parseArgs({ options: {
  build: { type: 'boolean', default: false },
  samples: { type: 'string' }, report: { type: 'string' },
  asm: { type: 'string', default: 'asm198x' },
  build198x: { type: 'string', default: 'build198x' },
} });
const website = path.resolve(import.meta.dirname, '..');
const samples = path.resolve(values.samples ?? process.env.CODE_SAMPLES_PATH ?? path.join(website, '../code-samples'));
const content = path.join(website, 'src/content');
const system = 'sinclair-zx-spectrum';
const curriculum = path.join(content, 'curriculum', system);
const hash = file => createHash('sha256').update(readFileSync(file)).digest('hex');
const report = { executionVerified: false, sources: {}, lessons: [], builds: [], errors: [] };
function error(message) { report.errors.push(message); }
function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  if (result.error || result.status !== 0) throw new Error(`${command}: ${result.error?.message ?? result.stderr ?? result.stdout}`);
  return result.stdout;
}
function sourceReference(src, lesson, props = {}) {
  const file = path.resolve(samples, src);
  if (!file.startsWith(samples + path.sep)) { error(`${lesson}: sample escapes root: ${src}`); return; }
  if (!existsSync(file)) { error(`${lesson}: missing source ${src}`); return; }
  report.sources[src] = hash(file);
  if (props.from && props.to) {
    const text = readFileSync(file, 'utf8');
    const start = text.indexOf(props.from), end = text.indexOf(props.to, start + props.from.length);
    if (start < 0 || end < 0) error(`${lesson}: missing excerpt markers in ${src}`);
  }
}
function tapePayload(file) {
  const data = readFileSync(file);
  let cursor = 0, payload;
  while (cursor < data.length) {
    if (cursor + 2 > data.length) throw new Error('truncated TAP block length');
    const length = data.readUInt16LE(cursor);
    cursor += 2;
    if (length < 2 || cursor + length > data.length) throw new Error('truncated TAP block');
    const block = data.subarray(cursor, cursor + length);
    if (block.reduce((xor, byte) => xor ^ byte, 0) !== 0) throw new Error('TAP checksum mismatch');
    if (block[0] === 255) payload = block.subarray(1, -1);
    cursor += length;
  }
  if (!payload) throw new Error('TAP has no data block');
  return payload;
}

// Inspect authored pages, including retained lessons, rather than only complete modules.
const pages = globSync('**/*.mdx', { cwd: curriculum }).sort();
const references = new Map();
for (const page of pages) {
  const text = readFileSync(path.join(curriculum, page), 'utf8');
  const refs = [];
  for (const tag of text.matchAll(/<(CodeFromFile|AssembleAndRun|BasicAndRun|AssemblyExcerpt|MeteorExperiment)\b([\s\S]*?)\/>/g)) {
    const props = Object.fromEntries([...tag[2].matchAll(/(\w+)="([^"]*)"/g)].map(m => [m[1], m[2]]));
    let src = props.src;
    if (['AssemblyExcerpt', 'MeteorExperiment'].includes(tag[1])) {
      if (!props.checkpoint) { error(`${page}: checkpoint needs explicit audit support`); continue; }
      src = `${system}/assembly/meteor-storm/checkpoints/${props.checkpoint}/meteor-storm.asm`;
      if (tag[1] === 'MeteorExperiment') {
        const assets = path.posix.join(path.posix.dirname(src), 'assets.inc');
        if (existsSync(path.join(samples, assets))) sourceReference(assets, page);
      }
    }
    if (!src) { error(`${page}: ${tag[1]} source needs explicit audit support`); continue; }
    refs.push({ component: tag[1], src });
    sourceReference(src, page, props);
    // Explicit companion paths in includes={{...}} are maintained samples too.
    for (const companion of tag[2].matchAll(/['"](sinclair-zx-spectrum\/[^'"]+)['"]/g)) {
      sourceReference(companion[1], page);
    }
  }
  references.set(page, refs);
}

const catalogues = globSync('**/*.yaml', { cwd: path.join(content, 'units', system) }).sort();
for (const file of catalogues) {
  const catalogue = load(readFileSync(path.join(content, 'units', system, file), 'utf8'));
  for (const unit of catalogue.units ?? []) {
    if (!unit.available) continue;
    const stem = `unit-${String(unit.number).padStart(2, '0')}`;
    const page = `${catalogue.track}/${catalogue.moduleSlug}/${unit.slug ?? stem}.mdx`;
    if (!existsSync(path.join(curriculum, page))) error(`${file}: available unit has no page ${page}`);
    report.lessons.push({ page, sampleDirectory: `${system}/${catalogue.track}/${catalogue.moduleSlug}/${stem}`, references: references.get(page) ?? [] });
  }
}

if (values.build) {
  const temporary = mkdtempSync(path.join(tmpdir(), 'spectrum-samples-'));
  report.buildDirectory = temporary;
  const asmVersion = spawnSync(values.asm, ['--version'], { encoding: 'utf8' });
  if (asmVersion.error || asmVersion.status !== 0) throw new Error('asm198x is unavailable');
  report.assembler = (asmVersion.stdout + asmVersion.stderr).trim();
  const buildVersion = spawnSync(values.build198x, ['--version'], { encoding: 'utf8' });
  if (buildVersion.error || buildVersion.status !== 0) throw new Error('build198x is unavailable');
  report.build198x = (buildVersion.stdout + buildVersion.stderr).trim();
  const tracked = run('git', ['ls-files', '-z', '--', system], samples).split('\0').filter(Boolean);
  const media = /\.(tap|tzx|sna|z80|bin|sym)$/i;
  for (const rel of tracked) {
    if (media.test(rel)) continue;
    const dest = path.join(temporary, rel);
    mkdirSync(path.dirname(dest), { recursive: true });
    copyFileSync(path.join(samples, rel), dest);
  }
  const asm = values.asm.includes('/') ? path.resolve(values.asm) : values.asm;
  const build = values.build198x.includes('/') ? path.resolve(values.build198x) : values.build198x;
  for (const makefile of globSync(`${system}/**/Makefile`, { cwd: temporary }).sort()) {
    const directory = path.posix.dirname(makefile);
    try {
      run('make', ['-B', '-s', `ASM=${asm}`, `BUILD198X=${build}`], path.join(temporary, directory));
      report.builds.push({ directory, passed: true });
    } catch (e) {
      report.builds.push({ directory, passed: false }); error(`${directory}: ${e.message}`);
    }
  }
  // The website deploy builds this introductory source without a Makefile.
  const border = `${system}/assembly/meet-the-machine/unit-01`;
  try { run(asm, ['--dialect', 'pasmo', '--cpu', 'z80', '--tapbas', 'border.asm', '-o', 'border.tap'], path.join(temporary, border)); }
  catch (e) { error(`${border}: ${e.message}`); }
  const rawPrograms = new Map();
  for (const lesson of report.lessons) {
    const directory = path.join(temporary, lesson.sampleDirectory);
    lesson.outputs = stagedLessonFiles(directory, ['.tap', '.tzx', '.sna', '.z80']);
    lesson.outputHashes = Object.fromEntries(lesson.outputs.map(file => [file, hash(path.join(directory, file))]));
    for (const file of lesson.outputs.filter(file => file.endsWith('.tap'))) {
      try { tapePayload(path.join(directory, file)); }
      catch (e) { error(`${lesson.page}: ${file}: ${e.message}`); }
    }
    const track = lesson.page.split('/')[0];
    // Machine-orientation lessons do not claim a runnable program.
    if (track !== 'machine' && !lesson.outputs.length) error(`${lesson.page}: no clean-built unit download`);
    if (track === 'basic' && existsSync(path.join(directory, 'Makefile'))) {
      const full = lesson.references.filter(r => r.component === 'CodeFromFile' && !r.src.includes('/snippets/')).map(r => r.src);
      for (const match of readFileSync(path.join(directory, 'Makefile'), 'utf8').matchAll(/[^\s:]+\.bas/g)) {
        const file = path.resolve(directory, match[0]);
        if (!existsSync(file)) continue;
        const src = path.relative(temporary, file).split(path.sep).join('/');
        if (full.length && !full.includes(src)) error(`${lesson.page}: Makefile builds ${src}, absent from its full listings`);
      }
    }
    const experiment = lesson.references.find(r => r.component === 'MeteorExperiment');
    if (experiment && lesson.outputs.length) {
      try {
        if (!rawPrograms.has(experiment.src)) {
          const binary = path.join(temporary, `checkpoint-${rawPrograms.size}.bin`);
          run(asm, ['--dialect', 'pasmo', '--cpu', 'z80', path.join(temporary, experiment.src), '-o', binary]);
          rawPrograms.set(experiment.src, readFileSync(binary));
        }
        const tape = lesson.outputs.find(file => file.endsWith('.tap'));
        if (!tape || !tapePayload(path.join(directory, tape)).equals(rawPrograms.get(experiment.src))) {
          error(`${lesson.page}: downloadable tape differs from its interactive checkpoint`);
        } else lesson.checkpointPayloadMatches = true;
      } catch (e) { error(`${lesson.page}: checkpoint parity: ${e.message}`); }
    }
  }
  const listings = tracked.filter(rel => rel.endsWith('.bas') && rel !== `${system}/basic/meet-basic/unit-04/steps/step-03.bas`);
  try { run(build, ['basic', 'lint', '--machine', system, ...listings.map(rel => path.join(temporary, rel))]); }
  catch (e) { error(`Spectrum BASIC lint: ${e.message}`); }
  report.lintedListings = listings.length;
}
console.log(`${pages.length} authored pages, ${report.lessons.length} available units, ${Object.keys(report.sources).length} maintained files.`);
if (values.build) console.log(`${report.builds.length} clean Makefile builds; ${report.lintedListings} BASIC listings checked.`);
for (const message of report.errors) console.error(message);
if (values.report) {
  mkdirSync(path.dirname(path.resolve(values.report)), { recursive: true });
  writeFileSync(values.report, JSON.stringify(report, null, 2) + '\n');
}
if (report.errors.length) process.exitCode = 1;
