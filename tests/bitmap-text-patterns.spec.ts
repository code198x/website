import {test, expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {mkdirSync} from 'node:fs';
import path from 'node:path';

const textMachines = ['sinclair-zx-spectrum', 'bbc-micro', 'dragon-32', 'amstrad-cpc'];
const primitiveMachines = ['oric-atmos', 'atari-800', 'atari-5200'];
const textRoute = (machine: string) => `/patterns/${machine}/assembly/rendering/bitmap-text/`;
const primitiveRoute = (machine: string) => `/patterns/${machine}/assembly/rendering/pixels-and-boxes/`;
const family = '/patterns/cross-platform/rendering/bitmap-text/';
const maths = '/craft/maths-for-games/unit-13/';
const pixels = '/patterns/cross-platform/rendering/pixels-and-boxes/';
const routes = [...textMachines.map(textRoute), ...primitiveMachines.map(primitiveRoute), family, maths, pixels];

for (const route of routes) {
  test(`@built ${route} exposes working code, links and uncropped figures`, async ({page}, info) => {
    await page.goto(route);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.code-error')).toHaveCount(0);
    const prose = page.locator('.pattern-prose');
    if (textMachines.some(m => route === textRoute(m))) {
      await expect(prose).toContainText('96 bytes at T plus 48 at BP');
      await expect(prose).toContainText('non-re-entrant');
      await expect(prose).toContainText('before destination writes');
      await expect(prose.locator('.lesson-listing code').first()).toContainText('text_string');
      for (const detail of await prose.locator('details').all()) {
        await detail.locator('summary').click();
        await expect(detail.locator('code')).not.toBeEmpty();
        await detail.locator('summary').click();
      }
      await expect(prose.getByRole('link', {name:'Complete caller and execution evidence'})).toHaveAttribute('href', /\/tree\/[0-9a-f]{40}\//);
      await expect(prose).toContainText(route.includes('amstrad-cpc') ? '88 calls completed' : '76 calls completed');
    }
    if (primitiveMachines.some(m => route === primitiveRoute(m))) {
      await expect(prose.locator('.lesson-listing code').first()).toContainText('bp_box');
      await expect(prose).toContainText('48 zero-page bytes at BP');
      await expect(prose).toContainText(route.includes('oric') ? '143 calls completed' : '155 calls completed');
      await expect(prose).toContainText(route.includes('oric') ? 'canonical' : '4 KiB');
      if (route.includes('5200')) await expect(prose).toContainText('not the manufacturer BIOS');
      await prose.locator('summary').click();
      await expect(prose.locator('details code')).toContainText('bp_fill');
      await prose.locator('summary').click();
    }
    const hrefs = await page.locator('main a[href^="/"]').evaluateAll(nodes => [...new Set(nodes.map(n => n.getAttribute('href')!))]);
    for (const href of hrefs) expect((await page.request.get(href)).status(), href).toBe(200);
    for (const image of await page.locator('main .figure img').all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
      const box = (await image.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(-1);
      expect(box.x + box.width).toBeLessThanOrEqual(await page.evaluate(() => innerWidth) + 1);
      // The complete native frame is visible within its figure, not cropped by a fixed wrapper.
      expect(await image.evaluate((img: HTMLImageElement) => {
        const parent = img.parentElement!.getBoundingClientRect();
        const own = img.getBoundingClientRect();
        return own.left >= parent.left - 1 && own.right <= parent.right + 1;
      })).toBe(true);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (process.env.TEXT_REVIEW_DIR) {
      mkdirSync(process.env.TEXT_REVIEW_DIR, {recursive:true});
      const name = route.split('/').filter(Boolean).join('-');
      await page.screenshot({path:path.join(process.env.TEXT_REVIEW_DIR, `${name}-${info.project.name}.png`), fullPage:true});
      await page.evaluate(() => scrollTo(0,0));
      await page.screenshot({path:path.join(process.env.TEXT_REVIEW_DIR, `${name}-${info.project.name}-opening.png`)});
    }
  });
}

test('@built text and primitive entries are discoverable without implying curriculum support', async ({page}) => {
  for (const machine of [...textMachines, ...primitiveMachines]) {
    await page.goto(`/patterns/platform/${machine}/`);
    const target = textMachines.includes(machine) ? textRoute(machine) : primitiveRoute(machine);
    await expect(page.locator(`[data-pattern] a[href="${target}"]`)).toHaveCount(1);
  }
  await page.goto(family);
  for (const machine of textMachines) await expect(page.locator(`a[href="${textRoute(machine)}"]`)).toHaveCount(1);
  await page.goto('/craft/maths-for-games/');
  await expect(page.locator(`a[href="${maths.slice(0, -1)}"]`)).toHaveCount(1);
  await page.goto(maths);
  await expect(page.locator('main')).toContainText('screenX = 21+3 = 24');
  await expect(page.locator('main')).toContainText('screenY = 37+5 = 42');
  await expect(page.locator(`a[href="${family}"]`)).toHaveCount(2);
});

test('@built bitmap text and backend readers are accessible in both colour preferences', async ({page}) => {
  test.setTimeout(240_000);
  for (const colorScheme of ['light', 'dark'] as const) {
    await page.emulateMedia({colorScheme});
    for (const route of routes) {
      await page.goto(route);
      expect((await new AxeBuilder({page}).analyze()).violations, `${route} ${colorScheme}`).toEqual([]);
    }
  }
});


test('@built bitmap readers retain the 320px frame', async ({page}) => {
  await page.setViewportSize({width:320,height:900});
  for (const route of routes) {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth-innerWidth),route).toBeLessThanOrEqual(1);
  }
});
