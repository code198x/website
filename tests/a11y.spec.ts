import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';

/**
 * Accessibility smoke tests — one representative page per template type.
 *
 * Fails on any serious/critical WCAG 2.1 A/AA violation that is NOT in
 * tests/a11y-baseline.json. The baseline captures known pre-existing issues
 * (brand-colour contrast, structural code-block focus) so the suite protects
 * against new regressions while that debt is burned down. Moderate/minor
 * issues are logged for triage but don't break the build.
 */
const PAGES: Record<string, string> = {
  home: '/',
  'system landing': '/sinclair-zx-spectrum',
  // The `[platform]` stub — 137 machines with no curriculum yet, and the only
  // surface carrying the Asm198x instruction-reference card. It had no a11y
  // coverage at all until that card was added to it.
  'system stub': '/intellivision',
  'module index': '/sinclair-zx-spectrum/basic/touchdown',
  unit: '/sinclair-zx-spectrum/basic/touchdown/unit-03',
  'getting started': '/sinclair-zx-spectrum/getting-started',
  vault: '/vault',
  family: '/family',
  'family emu198x': '/family/emu198x',
  'family asm198x': '/family/asm198x',
  'family cat198x': '/family/cat198x',
  setup: '/setup',
  'setup roms': '/setup/roms',
  'setup native': '/setup/sinclair-zx-spectrum/native',
  'pattern category': '/patterns/category/hardware-access',
  about: '/about',
  browse: '/browse',
  contribute: '/contribute',
  timeline: '/timeline',
  systems: '/systems',
  patterns: '/patterns',
  'patterns platform': '/patterns/platform/sinclair-zx-spectrum',
  'commodore-64 landing': '/commodore-64',
  'crash-live': '/crash-live',
  notfound: '/404',
  'commodore-amiga landing': '/commodore-amiga',
  'nintendo landing': '/nintendo-entertainment-system',
  'vault detail': '/vault/hardware/sid-chip',
  // A Vault entry WITH code blocks. sid-chip has none, so the vault-detail gate
  // never saw the dark code surface and missed text sitting on it at 1.14:1.
  'vault detail with code': '/vault/techniques/screen-memory',
  // The C64 native page is the one that actually uses `.step-note code`; the
  // Spectrum page has .step-note but never with code inside it.
  'setup native c64': '/setup/commodore-64/native',
  // Amiga too: it carries the same ROM link, and Amiga orange is the accent the
  // a11y notes single out as hardest to keep above AA.
  'setup native amiga': '/setup/commodore-amiga/native',
};

const baseline: { allow: { rule: string; fg?: string }[] } = JSON.parse(
  readFileSync('tests/a11y-baseline.json', 'utf8'),
);

function isBaselined(ruleId: string, node: any): boolean {
  return baseline.allow.some((a) => {
    if (a.rule !== ruleId) return false;
    if (!a.fg) return true;
    const fg: string | undefined = node.any?.[0]?.data?.fgColor;
    return !!fg && fg.toLowerCase() === a.fg.toLowerCase();
  });
}

const THEMES = ['light', 'dark'] as const;

for (const [name, path] of Object.entries(PAGES)) {
  for (const theme of THEMES) {
    test(`a11y: ${name} (${path}) [${theme}]`, async ({ page }) => {
    await page.addInitScript((t) => localStorage.setItem('theme', t), theme);
    await page.goto(path);
    await page.emulateMedia({ colorScheme: theme });
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const newViolations: string[] = [];
    for (const v of results.violations) {
      if (v.impact !== 'serious' && v.impact !== 'critical') continue;
      for (const node of v.nodes) {
        if (isBaselined(v.id, node)) continue;
        newViolations.push(`[${v.impact}] ${v.id}: ${node.target.join(' ')}`);
      }
    }

    if (results.violations.length) {
      console.log(
        `\n[a11y] ${name} — ${results.violations.length} violation type(s), ` +
          `${newViolations.length} not baselined:\n` +
          results.violations
            .map((v) => `  [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s))`)
            .join('\n'),
      );
    }

    expect(
      newViolations,
      `non-baselined serious/critical a11y violations on ${path} [${theme}]`,
    ).toEqual([]);
    });
  }
}
