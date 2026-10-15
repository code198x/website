import { describe, expect, it } from 'vitest';
import { mkdtemp, readFile, writeFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import snapshot from '../data/project-progress.json';
import { publicProgressUrl, validateProgressSnapshot } from './project-progress.mjs';
import { importProgress } from '../../scripts/import-project-progress.mjs';

const copy = () => structuredClone(snapshot);

describe('reviewed project progress', () => {
  it('has complete project and execution membership with consistent passing totals', () => {
    const data = validateProgressSnapshot(copy());
    expect(data.briefing.map(p => p.id)).toEqual(['code','emu','asm']);
    expect(data.capabilities.map(c => c.id).sort()).toEqual(['aabb','amiga','c64','nes','spectrum']);
    expect(data.verified_count).toBe(data.capabilities.filter(c => c.state === 'verified').length);
    expect(data.capabilities.flatMap(c => c.sources)).toHaveLength(18);
  });

  it('rejects empty, duplicate and unsupported projections', () => {
    for (const change of [
      d => { d.briefing = []; },
      d => { d.capabilities[1] = d.capabilities[0]; },
      d => { d.projects.pop(); },
      d => { d.schema_version = 2; },
      d => { d.capabilities[0].sources = []; },
      d => { d.briefing[0].sources = []; },
    ]) { const data = copy(); change(data); expect(() => validateProgressSnapshot(data)).toThrow(); }
  });

  it('cannot render zero measurements or stale bindings as execution verified', () => {
    for (const change of [
      d => { d.capabilities[0].metrics = {}; },
      d => { d.capabilities[0].metrics['pixel coordinates'] = 0; },
      d => { d.capabilities[0].sources[0].current_sha256 = null; d.capabilities[0].sources[0].matches_current_source = false; },
      d => { d.verified_count++; },
      d => { d.projects[0].verified_count++; },
      d => { d.capabilities[0].state_label = 'Everything works'; },
    ]) { const data = copy(); change(data); expect(() => validateProgressSnapshot(data)).toThrow(); }
  });

  it('retains a truthful stale assessment without changing runtime evidence', () => {
    const data = copy();
    const p = data.briefing[0];
    p.sources[0].current_sha256 = null; p.sources[0].matches = false;
    p.assessment_state = 'needs_review'; p.assessment_label = 'Assessment needs review';
    const result = validateProgressSnapshot(data);
    expect(result.verified_count).toBe(snapshot.verified_count);
    expect(result.briefing[0].assessment).toBe(snapshot.briefing[0].assessment);
    expect(result.briefing[0].assessment_state).toBe('needs_review');
  });

  it('requires assessment state and fingerprint equality to agree', () => {
    const data = copy(); data.briefing[0].sources[0].current_sha256 = null;
    expect(() => validateProgressSnapshot(data)).toThrow(/freshness/);
  });

  it('rejects private locations and unknown raw fields rather than publishing them', () => {
    for (const change of [
      d => { d.extra = { payload: 'not public' }; },
      d => { d.capabilities[0].private_note = 'internal'; },
      d => { d.briefing[0].assessment = '/Users/test/private'; },
      d => { d.capabilities[0].observations.payload = [1,2,3]; },
      d => { d.capabilities[0].observations.unexpected = 'private text'; },
      d => { d.capabilities[0].reference_image = 'ghcr.io/private/store@sha256:' + 'a'.repeat(64); },
    ]) { const data = copy(); change(data); expect(() => validateProgressSnapshot(data)).toThrow(); }
  });

  it('rejects unreviewed, script and traversal URLs', () => {
    for (const url of [
      'javascript:alert(1)', 'https://github.com/private/repo/blob/main/a',
      'https://github.com/stevehill1981/198x/blob/main/README.md',
      'https://github.com/code198x/docs/../private',
      'https://github.com/code198x/docs/%2e%2e/private',
      'https://github.com/code198x/docs?token=secret',
      'https://github.com@evil.example/code198x/docs',
    ]) expect(() => publicProgressUrl(url)).toThrow();
  });

  it('preserves stale/failed execution labels instead of replacing them with a green count', () => {
    const data = copy(); const c = data.capabilities[0];
    c.state = 'failed'; c.state_label = 'Recorded checks failed'; c.metrics = {}; c.issues = ['Required check failed'];
    data.verified_count--;
    for (const p of data.projects) if (p.capabilities.includes(c.id)) p.verified_count--;
    expect(validateProgressSnapshot(data).capabilities[0].state).toBe('failed');
  });

  it('imports valid bytes and preserves existing data on invalid/empty input', async () => {
    const folder = await mkdtemp(join(tmpdir(), 'progress-import-'));
    try {
      const source = join(folder, 'input.json'); const target = join(folder, 'current.json');
      const original = JSON.stringify(snapshot);
      await writeFile(source, original);
      await importProgress(source, target);
      expect(await readFile(target, 'utf8')).toBe(original);
      for (const invalid of ['', '{}', JSON.stringify({ ...snapshot, briefing: [] })]) {
        await writeFile(source, invalid);
        await expect(importProgress(source, target)).rejects.toThrow();
        expect(await readFile(target, 'utf8')).toBe(original);
      }
      expect((await readdir(folder)).sort()).toEqual(['current.json','input.json']);
    } finally { await rm(folder, { recursive: true, force: true }); }
  });

  it('reports a real nonzero CLI result for an invalid projection', async () => {
    const folder = await mkdtemp(join(tmpdir(), 'progress-cli-'));
    try {
      const source = join(folder, 'empty.json'); await writeFile(source, '{}');
      expect(() => execFileSync(process.execPath, ['scripts/import-project-progress.mjs', source], { stdio: 'pipe' })).toThrow();
    } finally { await rm(folder, { recursive: true, force: true }); }
  });
});
