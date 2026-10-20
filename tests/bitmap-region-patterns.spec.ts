import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const machines = ['bbc-micro', 'acorn-atom', 'dragon-32', 'amstrad-cpc'];
const route = (machine: string) => `/patterns/${machine}/assembly/rendering/tile-region/`;

test('bitmap routines expose actual calls, CPU code, native captures and contracts', async ({ page }) => {
  await page.goto('/patterns/cross-platform/rendering/tile-region/');
  const links = await page.locator('.pattern-prose a').evaluateAll(a => a.map(link => link.getAttribute('href')));
  for (const machine of machines) {
    expect(links).toContain(route(machine));
    await page.goto(route(machine));
    const prose = page.locator('.pattern-prose');
    await expect(prose).toContainText('18 calls');
    await expect(prose).toContainText('NR+6');
    await expect(prose).toContainText('in isolation');
    await expect(prose).toContainText('interrupt');
    const code = page.locator('.lesson-listing code');
    await expect(code).toHaveCount(3);
    expect(await code.nth(1).innerText()).toContain('region_draw');
    expect(await code.last().innerText()).toContain('region_paint');
    await expect(page.locator('.code-error')).toHaveCount(0);
    const image = prose.locator('img').first();
    await image.scrollIntoViewIfNeeded();
    expect(await image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth >= 300)).toBe(true);
    await expect(prose.getByRole('link', {name: 'Complete caller, tables and execution evidence'})).toHaveAttribute('href', /\/tree\/[0-9a-f]{40}\//);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('bitmap variants are discoverable and retain machine-specific differences', async ({ page }) => {
  await page.goto('/patterns/');
  await page.getByLabel('Search patterns', {exact: true}).fill('bitmap');
  for (const machine of machines) {
    await page.getByRole('combobox', {name: 'Machine', exact: true}).selectOption(machine);
    await expect(page.locator(`[data-pattern]:visible a[href="${route(machine)}"]`)).toHaveCount(1);
  }
  for (const [machine, contract] of [['bbc-micro', 'X_STEP=8'], ['acorn-atom', '6 KB graphics RAM'], ['dragon-32', 'unsigned D indexing'], ['amstrad-cpc', '$800 bytes apart']]) {
    await page.goto(route(machine));
    await expect(page.locator('.pattern-prose')).toContainText(contract);
  }
});

test('bitmap readers and listings remain accessible in both colour preferences', async ({ page }) => {
  test.setTimeout(120_000);
  for (const colorScheme of ['light', 'dark'] as const) {
    await page.emulateMedia({colorScheme});
    for (const machine of machines) {
      await page.goto(route(machine));
      expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
    }
  }
});
