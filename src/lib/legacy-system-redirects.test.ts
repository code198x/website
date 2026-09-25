import { describe, expect, it } from 'vitest';
import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { legacySystemRedirects } from './legacy-system-redirects.mjs';

const CURRICULUM = 'src/content/curriculum';
const SECTIONS = new Set(['foundations', 'craft']);

/** Module folders that hold at least one lesson, as the site builds them. */
function modulesWithLessons(dir = CURRICULUM, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (!statSync(full).isDirectory()) continue;
    const files = readdirSync(full);
    if (files.includes('index.mdx') && files.some((f) => /^unit-.+\.mdx$/.test(f))) {
      out.push(path.relative(CURRICULUM, full).split(path.sep).join('/'));
    }
    modulesWithLessons(full, out);
  }
  return out;
}

describe('legacySystemRedirects', () => {
  const redirects = legacySystemRedirects();
  const modules = modulesWithLessons().filter((m) => !SECTIONS.has(m.split('/')[0]));

  it('finds modules with descriptively named lessons', () => {
    expect(modules).toContain('sinclair-zx-spectrum/basic/meet-basic');
  });

  it('never redirects a module page that has lessons', () => {
    const redirected = modules.filter((m) => `/systems/${m}` in redirects);
    expect(redirected).toEqual([]);
  });

  it('sends a planned game with no page to its track', () => {
    expect(redirects['/systems/sinclair-zx-spectrum/assembly/lamplight']).toBe('/systems/sinclair-zx-spectrum/assembly');
    expect(redirects['/commodore-64/assembly/platform-panic']).toBe('/systems/commodore-64/assembly');
  });
});
