import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const machines = ['colecovision', 'sord-m5', 'memotech-mtx', 'tatung-einstein', 'msx', 'spectravideo-svi-328', 'sega-sg-1000', 'sega-master-system', 'sega-game-gear'];
const family = '/patterns/cross-platform/rendering/tile-region/';
const route = (machine: string) => `/patterns/${machine}/assembly/rendering/tile-region/`;

test('nine native region entries expose maintained calls, code and actual captures', async ({ page }) => {
  await page.goto(family);
  const links = await page.locator('.pattern-prose a').evaluateAll(elements => elements.map(a => a.getAttribute('href')));
  for (const machine of machines) {
    expect(links).toContain(route(machine));
    await page.goto(route(machine));
    await expect(page.locator('.pattern-reading-header h1')).toHaveCount(1);
    const prose = page.locator('.pattern-prose');
    await expect(prose).toContainText('NR+6');
    await expect(prose).toContainText('22 calls');
    await expect(prose.getByRole('link', { name: 'Complete caller and retained execution evidence' })).toHaveAttribute('href', /\/tree\/[0-9a-f]{40}\//);
    const code = page.locator('.lesson-listing code');
    expect(await code.count()).toBe(3);
    expect((await code.last().innerText())).toContain('region_draw:');
    await expect(page.locator('.code-error')).toHaveCount(0);
    const image = prose.locator('img').first();
    await image.scrollIntoViewIfNeeded();
    await expect(image).toBeVisible();
    await expect(image).toHaveJSProperty('complete', true);
    expect(await image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 100)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('native drawing is discoverable without changing map-query coverage', async ({ page }) => {
  await page.goto('/patterns/');
  await page.getByLabel('Search patterns', { exact: true }).fill('regions');
  for (const machine of machines) {
    await page.getByRole('combobox', { name: 'Machine', exact: true }).selectOption(machine);
    await expect(page.locator(`[data-pattern]:visible a[href="${route(machine)}"]`)).toHaveCount(1);
  }
  await page.goto(route('sega-game-gear'));
  await expect(page.locator('.pattern-prose')).toContainText('6–25');
  await expect(page.locator('.pattern-prose')).toContainText('off screen');
  await page.goto(route('msx'));
  await expect(page.locator('.lesson-listing code').first()).toContainText('ld a,(7)');
  await page.goto(route('spectravideo-svi-328'));
  await expect(page.locator('.pattern-prose')).toContainText('read port is 84');
});

test('native region pages and captures are accessible in light and dark', async ({ page }) => {
  test.setTimeout(120_000);
  for (const colorScheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme });
    for (const url of [family, route('msx'), route('tatung-einstein'), route('sega-game-gear')]) {
      await page.goto(url);
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    }
  }
});
