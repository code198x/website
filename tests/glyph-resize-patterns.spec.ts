import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import {test, expect} from '@playwright/test';

const machines = ['sinclair-zx-spectrum', 'bbc-micro', 'dragon-32', 'amstrad-cpc'];
const captures = {
  opening: 'positive-startup.png',
  customise: 'customise-startup.png',
  'wrong-sampling': 'sampling-fault-sampling.png',
  'fixed-sampling': 'sampling-fixed-sampling.png',
};
for (const machine of machines) {
  test(`@built ${machine} supplies independent reusable glyph shrinking`, async ({page}) => {
    await page.goto(`/patterns/${machine}/assembly/rendering/bitmap-text/`);
    const prose = page.locator('.pattern-prose');
    await expect(page.locator('.code-error')).toHaveCount(0);
    for (const text of ['543 native observations', 'GLYPH_WIDTH/GLYPH_HEIGHT from 5/7 to 8/4', 'Per-call overlap safety does not make an overlapping bank traversal safe', 'before source/destination access', '32 writable bytes']) {
      await expect(prose).toContainText(text);
    }
    await expect(prose.getByRole('heading', {name:'Shrink the ink, keep the cell',exact:true})).toHaveCount(1);
    await expect(prose.getByRole('heading', {name:'Make it your own: a short, wide icon',exact:true})).toHaveCount(1);
    await expect(prose.getByRole('heading', {name:'Common mistake: crop instead of resample',exact:true})).toHaveCount(1);
    const detail = prose.locator('details').filter({has: page.locator('summary', {hasText:'Open the glyph shrinking routine'})});
    await detail.locator('summary').click();
    await expect(detail.locator('code')).toContainText('glyph_resize');
    await expect(detail.locator('code')).toContainText('resize_snapshot');
    await expect(detail.locator('code')).toContainText('resize_x_sample');
    for (const [name, retained] of Object.entries(captures)) {
      const url = `/images/${machine}/patterns/glyph-resize/${name}.png`;
      const image = prose.locator(`img[src="${url}"]`);
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
      const bounds = await image.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x+bounds!.width).toBeLessThanOrEqual(page.viewportSize()!.width+1);
      const response = await page.request.get(url);
      expect(response.status()).toBe(200);
      const source = path.join(process.env.CODE_SAMPLES_PATH || '../code-samples', machine, 'patterns/assembly/rendering/glyph-resize/verification', retained);
      expect(createHash('sha256').update(await response.body()).digest('hex')).toBe(createHash('sha256').update(readFileSync(source)).digest('hex'));
    }
    const links = await prose.locator('a[href^="/"]').evaluateAll(nodes => [...new Set(nodes.map(n => n.getAttribute('href')!))]);
    for (const link of links) expect((await page.request.get(link)).status(),link).toBe(200);
    for (const width of [1440,320]) {
      await page.setViewportSize({width,height:900});
      expect(await page.evaluate(() => document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
    }
    for (const colorScheme of ['light','dark'] as const) {
      await page.emulateMedia({colorScheme,reducedMotion:'reduce'});
      expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
    }
    await page.goto(`/patterns/platform/${machine}/`);
    await page.getByLabel('Search patterns',{exact:true}).fill('shrinking');
    await expect(page.locator(`[data-pattern]:visible a[href="/patterns/${machine}/assembly/rendering/bitmap-text/"]`)).toHaveCount(1);
  });
}

test('@built glyph comparison keeps native implementations and reciprocal Maths link',async ({page}) => {
  await page.goto('/patterns/cross-platform/rendering/bitmap-text/');
  const prose=page.locator('.pattern-prose');
  await expect(prose).toContainText('2,172 native observations');
  await expect(prose).toContainText('has not gained this resize port');
  for (const machine of machines) await expect(prose.locator(`a[href="/patterns/${machine}/assembly/rendering/bitmap-text/"]`)).toHaveCount(1);
  await prose.locator('a[href="/craft/maths-for-games/unit-06/"]').last().click();
  await expect(page).toHaveURL(/\/craft\/maths-for-games\/unit-06\/$/);
  await page.locator('main a[href="/patterns/cross-platform/rendering/bitmap-text/#shrink-the-ink-keep-the-cell"]').click();
  await expect(page).toHaveURL(/\/patterns\/cross-platform\/rendering\/bitmap-text\/#shrink-the-ink-keep-the-cell$/);
});
