import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const machines = ['acorn-electron', 'commodore-pet', 'commodore-vic-20', 'mattel-aquarius'];
const route = (machine: string) => `/patterns/${machine}/assembly/rendering/tile-region/`;

test('cell regions expose maintained code, calls, captures and source evidence', async ({ page }) => {
  await page.goto('/patterns/cross-platform/rendering/tile-region/');
  const links = await page.locator('.pattern-prose a').evaluateAll(a => a.map(link => link.getAttribute('href')));
  for (const machine of machines) {
    expect(links).toContain(route(machine));
    await page.goto(route(machine));
    const prose = page.locator('.pattern-prose');
    await expect(prose).toContainText('18 calls');
    await expect(prose).toContainText('NR+6');
    await expect(prose).toContainText('in isolation');
    await expect(page.locator('.code-error')).toHaveCount(0);
    const code = page.locator('.lesson-listing code');
    await expect(code).toHaveCount(machine === 'acorn-electron' ? 3 : 4);
    expect(await code.last().innerText()).toContain('region_paint');
    expect(await code.nth(machine === 'acorn-electron' ? 1 : 2).innerText()).toContain('region_draw');
    const image = prose.locator('img').first();
    await image.scrollIntoViewIfNeeded();
    expect(await image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth >= 230)).toBe(true);
    await expect(prose.getByRole('link', {name: 'Complete caller and execution evidence'})).toHaveAttribute('href', /\/tree\/[0-9a-f]{40}\//);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('discovery preserves fixed-ROM, writable-character and bitmap distinctions', async ({ page }) => {
  for (const [machine, term] of [['acorn-electron', 'X_STEP=8'], ['commodore-pet', 'no per-cell colour RAM'], ['commodore-vic-20', 'RAM character base'], ['mattel-aquarius', 'cell zero']]) {
    await page.goto('/patterns/');
    await page.getByLabel('Search patterns', {exact: true}).fill('region');
    await page.getByRole('combobox', {name: 'Machine', exact: true}).selectOption(machine);
    await expect(page.locator(`[data-pattern]:visible a[href="${route(machine)}"]`)).toHaveCount(1);
    await page.goto(route(machine));
    await expect(page.locator('.pattern-prose')).toContainText(term);
    if (['commodore-pet', 'mattel-aquarius'].includes(machine)) {
      await expect(page.locator('.pattern-prose')).toContainText('original diagnostic font ROM');
      await expect(page.locator('.pattern-prose')).toContainText('not the stock font');
    }
  }
});

test('cell-region readers stay accessible in both colour preferences', async ({ page }) => {
  test.setTimeout(120_000);
  for (const colorScheme of ['light', 'dark'] as const) {
    await page.emulateMedia({colorScheme});
    for (const machine of machines) {
      await page.goto(route(machine));
      expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
    }
  }
});
