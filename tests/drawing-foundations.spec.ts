import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const entries = [
  ['sinclair-zx-spectrum', 'pixels-and-boxes'],
  ['bbc-micro', 'pixels-and-boxes'],
  ['dragon-32', 'pixels-and-boxes'],
  ['commodore-vic-20', 'custom-glyphs'],
  ['msx', 'custom-glyphs'],
  ['game-boy', 'custom-glyphs'],
];
const route = (machine: string, slug: string) => `/patterns/${machine}/assembly/rendering/${slug}/`;

test('@built six components expose real includes, usable calls, maths and native output', async ({ page }, testInfo) => {
  for (const [machine, slug] of entries) {
    await page.goto(route(machine, slug));
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.code-error')).toHaveCount(0);
    const prose = page.locator('.pattern-prose');
    await expect(prose).toContainText(/not re-entrant|non-re-entrant/);
    await expect(prose).toContainText('interrupt');
    await expect(prose).toContainText('stack');
    await expect(prose.getByRole('link', { name: 'Complete caller and execution evidence' })).toHaveAttribute('href', /\/tree\/[0-9a-f]{40}\//);
    await expect(prose.getByRole('link', { name: 'Place a point' })).toHaveAttribute('href', '/craft/maths-for-games/unit-06/');
    expect(await prose.locator('.lesson-listing code').first().innerText()).toContain(slug === 'custom-glyphs' ? 'glyph_install' : 'bp_pixel');
    await prose.locator('summary').click();
    const include = prose.locator('details .lesson-listing code');
    await expect(include).toBeVisible();
    await expect(include).toContainText(slug === 'custom-glyphs' ? 'glyph_select' : 'bp_fill');
    const image = prose.locator('img[src$=".png"]').first();
    await image.scrollIntoViewIfNeeded();
    expect(await image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth >= 160)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await prose.locator('summary').click();
    if (process.env.DRAWING_REVIEW_DIR) {
      mkdirSync(process.env.DRAWING_REVIEW_DIR, { recursive: true });
      await page.screenshot({path: path.join(process.env.DRAWING_REVIEW_DIR, `${machine}-${testInfo.project.name}.png`), fullPage: true, animations: 'disabled'});
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({path: path.join(process.env.DRAWING_REVIEW_DIR, `${machine}-${testInfo.project.name}-opening.png`), animations: 'disabled'});
    }
  }
});

test('@built families and reciprocal Maths connection resolve', async ({ page }) => {
  for (const slug of ['pixels-and-boxes', 'custom-glyphs']) {
    await page.goto(`/patterns/cross-platform/rendering/${slug}/`);
    for (const [machine, family] of entries.filter(([, family]) => family === slug)) {
      await expect(page.locator(`.pattern-prose a[href="${route(machine, family)}"]`)).toHaveCount(1);
    }
  }
  await page.goto('/craft/maths-for-games/unit-06/');
  await expect(page.locator('a[href="/patterns/cross-platform/rendering/pixels-and-boxes/"]')).toHaveCount(1);
  await expect(page.locator('a[href="/patterns/cross-platform/rendering/custom-glyphs/"]')).toHaveCount(1);
  await page.goto('/patterns/game-boy/assembly/rendering/custom-glyphs/');
  const crates = page.getByRole('link', {name: 'Crates opening lesson'});
  const response = await page.request.get((await crates.getAttribute('href'))!);
  expect(response.status()).toBe(200);
});

test('@built all six readers remain accessible in both colour preferences', async ({ page }) => {
  test.setTimeout(180_000);
  for (const colorScheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme });
    for (const [machine, slug] of entries) {
      await page.goto(route(machine, slug));
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    }
  }
});
