import {test, expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {mkdirSync} from 'node:fs';
import path from 'node:path';

const machines = ['sinclair-zx-spectrum','bbc-micro','dragon-32','amstrad-cpc'];
const geometry = (machine: string) => `/patterns/${machine}/assembly/rendering/geometry/`;
const family = '/patterns/cross-platform/rendering/geometry/';
const maths = '/craft/maths-for-games/unit-12/';
const cpc = '/patterns/amstrad-cpc/assembly/rendering/pixels-and-boxes/';

for (const machine of machines) {
  test(`@built ${machine} geometry exposes usable code and bounded native evidence`, async ({page}, info) => {
    await page.goto(geometry(machine));
    await expect(page.locator('h1')).toContainText('Lines, Circles and Ellipses');
    await expect(page.locator('.code-error')).toHaveCount(0);
    const prose = page.locator('.pattern-prose');
    await expect(prose).toContainText('−512..511');
    await expect(prose).toContainText('160 bytes at G plus 48 at BP');
    await expect(prose).toContainText('non-re-entrant');
    await expect(prose).toContainText('stack');
    await expect(prose).toContainText('interrupt');
    await expect(prose).toContainText(machine === 'amstrad-cpc' ? '382 calls completed' : '215 calls completed');
    await expect(prose.locator('.lesson-listing code').first()).toContainText('geo_ellipse');
    await expect(prose.getByRole('link', {name:'Complete caller and execution evidence'})).toHaveAttribute('href', /\/tree\/[0-9a-f]{40}\//);
    await expect(prose.getByRole('link',{name:'Draw with integer error'})).toHaveAttribute('href', maths);
    await prose.locator('summary').click();
    await expect(prose.locator('details code')).toContainText('geo_fill_ellipse');
    await prose.locator('summary').click();
    const image = prose.locator('img').first();
    await image.scrollIntoViewIfNeeded();
    expect(await image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth >= 256)).toBe(true);
    const bounds = await image.boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.x).toBeGreaterThanOrEqual(-1);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(await page.evaluate(() => innerWidth) + 1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (process.env.GEOMETRY_REVIEW_DIR) {
      mkdirSync(process.env.GEOMETRY_REVIEW_DIR, {recursive:true});
      await page.screenshot({path:path.join(process.env.GEOMETRY_REVIEW_DIR, `${machine}-${info.project.name}.png`), fullPage:true});
      await page.evaluate(() => scrollTo(0,0));
      await page.screenshot({path:path.join(process.env.GEOMETRY_REVIEW_DIR, `${machine}-${info.project.name}-opening.png`)});
    }
  });
}

test('@built geometry, CPC packing and Maths links resolve in both directions', async ({page}, info) => {
  for (const route of [family, maths, cpc]) {
    await page.goto(route);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.code-error')).toHaveCount(0);
    const hrefs = await page.locator('main a[href^="/"]').evaluateAll(nodes => [...new Set(nodes.map(n => n.getAttribute('href')!))]);
    for (const href of hrefs) expect((await page.request.get(href)).status(), href).toBe(200);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (const image of await page.locator('main .figure img').all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
      const bounds = await image.boundingBox();
      expect(bounds!.x).toBeGreaterThanOrEqual(-1);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(await page.evaluate(() => innerWidth) + 1);
    }
    if (process.env.GEOMETRY_REVIEW_DIR) {
      const name = route === maths ? 'maths' : route === cpc ? 'cpc-backend' : 'family';
      await page.screenshot({path:path.join(process.env.GEOMETRY_REVIEW_DIR, `${name}-${info.project.name}.png`), fullPage:true});
      if (route === maths) await page.locator('.figure').first().screenshot({path:path.join(process.env.GEOMETRY_REVIEW_DIR, `line-diagram-${info.project.name}.png`)});
    }
  }
  await page.goto(family);
  for (const machine of machines) await expect(page.locator(`a[href="${geometry(machine)}"]`)).toHaveCount(1);
  await page.goto(maths);
  await expect(page.locator(`a[href="${family}"]`)).toHaveCount(2);
  await expect(page.locator(`a[href="${cpc}"]`)).toHaveCount(1);
  await expect(page.locator('main')).toContainText('75 pixels in seven spans');
  await expect(page.locator('main')).toContainText('94,739,400');
  await page.goto(cpc);
  await expect(page.locator('.pattern-prose')).toContainText('$E0A3');
  await expect(page.locator('.pattern-prose')).toContainText('384 unused bytes');
  await expect(page.locator('.lesson-listing code').first()).toContainText('bp_pixel');
  await page.goto('/craft/maths-for-games/');
  await expect(page.getByRole('link',{name:'01 Draw with integer error',exact:true})).toHaveCount(1);
  await page.goto('/patterns/platform/bbc-micro/');
  await expect(page.locator(`[data-pattern] a[href="${geometry('bbc-micro')}"]`)).toHaveCount(1);
  await page.goto('/patterns/platform/amstrad-cpc/');
  for (const href of [cpc,geometry('amstrad-cpc')]) await expect(page.locator(`[data-pattern] a[href="${href}"]`)).toHaveCount(1);
});

test('@built new geometry readers are accessible in both colour preferences', async ({page}) => {
  test.setTimeout(180_000);
  for (const colorScheme of ['light','dark'] as const) {
    await page.emulateMedia({colorScheme});
    for (const route of [...machines.map(geometry),family,cpc,maths]) {
      await page.goto(route);
      expect((await new AxeBuilder({page}).analyze()).violations, `${route} ${colorScheme}`).toEqual([]);
    }
  }
});
