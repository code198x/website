import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const basic = [
  'acorn-atom', 'amstrad-cpc', 'atari-800', 'commodore-pet',
  'commodore-vic-20', 'dragon-32', 'mattel-aquarius', 'msx',
  'oric-atmos', 'spectravideo-svi-328',
];
const native = [
  'bbc-micro', 'acorn-electron', 'commodore-64', 'commodore-amiga',
  'nintendo-nes', 'sinclair-zx-spectrum', 'jupiter-ace', 'sinclair-zx80',
  'sinclair-zx81', 'colecovision', 'sord-m5', 'memotech-mtx',
  'tatung-einstein', 'sega-master-system', 'sega-game-gear', 'sega-sg-1000',
  'game-boy', 'atari-2600', 'atari-5200', 'atari-7800',
];
const implementations = [
  ...basic.map(slug => ({ slug, track: 'basic' })),
  ...native.map(slug => ({ slug, track: 'assembly' })),
];
const family = '/patterns/cross-platform/rendering/tile-map-queries/';

function route(slug: string, track: string): string {
  return `/patterns/${slug}/${track}/rendering/tile-map/`;
}

test('all thirty machines have linked entries with actual maintained code', async ({ page }) => {
  test.setTimeout(180_000);
  await page.goto(family);
  const links = await page.locator('.pattern-prose a').evaluateAll(
    elements => elements.map(a => a.getAttribute('href')),
  );
  for (const { slug, track } of implementations) {
    const url = route(slug, track);
    expect(links).toContain(url);
    await page.goto(url);
    await expect(page.locator('.pattern-reading-header h1')).toHaveCount(1);
    const code = page.locator('.lesson-listing code');
    expect(await code.count()).toBeGreaterThan(0);
    expect((await code.first().innerText()).length).toBeGreaterThan(100);
    await expect(page.locator('.code-error')).toHaveCount(0);
    await expect(page.getByText('Code sample unavailable')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('every implemented machine can be found through the directory', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('/patterns/');
  await page.getByLabel('Search patterns', { exact: true }).fill('tilemaps');
  for (const { slug, track } of implementations) {
    await page.getByRole('combobox', { name: 'Machine', exact: true }).selectOption(slug);
    await expect(page.locator(`[data-pattern]:visible a[href="${route(slug, track)}"]`)).toHaveCount(1);
  }
});

test('family and new-system entries are accessible in both colour preferences', async ({ page }) => {
  test.setTimeout(180_000);
  const routes = [
    family, route('acorn-atom', 'basic'), route('commodore-vic-20', 'basic'),
    route('game-boy', 'assembly'), route('tatung-einstein', 'assembly'),
  ];
  for (const colorScheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme });
    for (const url of routes) {
      await page.goto(url);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    }
  }
});
