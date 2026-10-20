import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const machines = ['oric-atmos', 'atari-800', 'game-boy', 'commodore-amiga'];
const route = (machine: string) => `/patterns/${machine}/assembly/rendering/tile-region/`;

test('native adapters expose maintained calls, captures and machine ownership', async ({ page }) => {
  await page.goto('/patterns/cross-platform/rendering/tile-region/');
  const links = await page.locator('.pattern-prose a').evaluateAll(a => a.map(link => link.getAttribute('href')));
  for (const machine of machines) {
    expect(links).toContain(route(machine));
    await page.goto(route(machine));
    const prose = page.locator('.pattern-prose');
    await expect(prose).toContainText('region_draw');
    await expect(prose).toContainText('in isolation');
    await expect(prose).toContainText('interrupt');
    await expect(page.locator('.code-error')).toHaveCount(0);
    const code = page.locator('.lesson-listing code');
    expect(await code.count()).toBeGreaterThanOrEqual(3);
    expect(await code.last().innerText()).toContain('region_draw');
    const image = prose.locator('img').first();
    await image.scrollIntoViewIfNeeded();
    expect(await image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth >= 160)).toBe(true);
    await expect(prose.getByRole('link', {name: 'Complete caller and execution evidence'})).toHaveAttribute('href', /\/tree\/[0-9a-f]{40}\//);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('machine-specific rules and the reusable blitter remain discoverable', async ({ page }) => {
  for (const [machine, contract] of [['oric-atmos', '6×8'], ['atari-800', '4 KB boundary'], ['game-boy', 'LCD-off calls only'], ['commodore-amiga', 'synchronous']]) {
    await page.goto('/patterns/');
    await page.getByLabel('Search patterns', {exact: true}).fill('region');
    await page.getByRole('combobox', {name: 'Machine', exact: true}).selectOption(machine);
    await expect(page.locator(`[data-pattern]:visible a[href="${route(machine)}"]`)).toHaveCount(1);
    await page.goto(route(machine));
    await expect(page.locator('.pattern-prose')).toContainText(contract);
  }
  await page.goto('/patterns/commodore-amiga/assembly/rendering/blitter-copy/');
  const prose = page.locator('.pattern-prose');
  await expect(prose).toContainText('region_blit_plane');
  await expect(prose).toContainText('BLTDMOD=38');
  await expect(prose).not.toContainText('Code status: illustrative');
  await expect(page.locator('.code-error')).toHaveCount(0);
  await expect(page.locator('.lesson-listing code')).toHaveCount(2);
});

test('native readers remain accessible in both colour preferences', async ({ page }) => {
  test.setTimeout(120_000);
  for (const colorScheme of ['light', 'dark'] as const) {
    await page.emulateMedia({colorScheme});
    for (const machine of [...machines, 'blitter']) {
      await page.goto(machine === 'blitter' ? '/patterns/commodore-amiga/assembly/rendering/blitter-copy/' : route(machine));
      expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
    }
  }
});
