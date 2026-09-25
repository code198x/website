import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { lessonContext, stagedLessonFiles } from './lesson-artefacts';

describe('lessonContext', () => {
  it('reads system, language, module and unit from a lesson URL', () => {
    expect(lessonContext('/systems/commodore-64/assembly/starfield/unit-03/'))
      .toEqual({ system: 'commodore-64', language: 'assembly', module: 'starfield', unit: 3 });
  });
  it('reads descriptive unit slugs', () => {
    expect(lessonContext('/systems/sinclair-zx-spectrum/basic/meet-basic/unit-01-make-the-spectrum-answer/')?.unit).toBe(1);
  });
  it('returns null outside a system lesson', () => {
    expect(lessonContext('/foundations/basics/unit-02/')).toBeNull();
  });
});

describe('stagedLessonFiles', () => {
  const dir = () => mkdtempSync(path.join(tmpdir(), 'lesson-'));
  it('lists runnable files in the unit folder, sorted', () => {
    const d = dir(); writeFileSync(path.join(d, 'b.prg'), ''); writeFileSync(path.join(d, 'a.prg'), ''); writeFileSync(path.join(d, 'a.asm'), '');
    expect(stagedLessonFiles(d, ['.prg'])).toEqual(['a.prg', 'b.prg']);
  });
  it('falls back to the last numbered step', () => {
    const d = dir(); mkdirSync(path.join(d, 'steps'));
    for (const n of ['step-2.prg', 'step-10.prg', 'step-9.prg']) writeFileSync(path.join(d, 'steps', n), '');
    expect(stagedLessonFiles(d, ['.prg'])).toEqual(['steps/step-10.prg']);
  });
  it('returns nothing for a missing folder', () => {
    expect(stagedLessonFiles('/no/such/folder', ['.prg'])).toEqual([]);
  });
});
