import { test, expect } from '@playwright/test';
import { mkdtemp, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const rules = [
  { step: 1, rule: 'immediate', args: [240, -1, 1 / 60, 240], expected: -240, helper: false },
  { step: 2, rule: 'acceleration', args: [0, 1, 1 / 60, 600], expected: 10, helper: true },
  { step: 3, rule: 'braking', args: [60, 0, 1 / 60, 120], expected: 58, helper: true },
  { step: 4, rule: 'reversal', args: [240, -1, 1 / 60, 240], expected: 236, helper: true },
];

for (const { step, rule, args, expected, helper } of rules) {
  test(`the downloaded ${rule} movement rule runs on its own files`, async ({ page }) => {
    const folder = await mkdtemp(join(tmpdir(), 'code198x-movement-'));
    try {
      const response = await page.goto(`/craft/game-feel/unit-${String(step).padStart(2, '0')}/`);
      expect(response?.ok()).toBe(true);
      const files = [[page.getByRole('link', { name: 'Movement rule source (JavaScript)', exact: true }), `${rule}.mjs`]] as const;
      const helperLink = page.getByRole('link', { name: 'Download helper (approach.mjs)', exact: true });
      await expect(helperLink).toHaveCount(helper ? 1 : 0);

      for (const [link, name] of [...files, ...(helper ? [[helperLink, 'approach.mjs']] as const : [])]) {
        const [download] = await Promise.all([page.waitForEvent('download'), link.click()]);
        expect(download.suggestedFilename()).toBe(name);
        await download.saveAs(join(folder, name));
      }
      expect((await readdir(folder)).sort()).toEqual((helper ? ['approach.mjs', `${rule}.mjs`] : [`${rule}.mjs`]).sort());

      const fittedRule = await import(pathToFileURL(join(folder, `${rule}.mjs`)).href);
      expect(fittedRule[rule](...args)).toBeCloseTo(expected);
    } finally {
      await rm(folder, { recursive: true, force: true });
    }
  });
}
