import {test, expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {mkdirSync} from 'node:fs';
import path from 'node:path';

const machines = ['commodore-64', 'nintendo-nes', 'sega-master-system', 'sega-game-gear'];
const route = (m: string) => `/patterns/${m}/assembly/rendering/custom-glyphs/`;
const family = '/patterns/cross-platform/rendering/custom-glyphs/';
const maths = '/craft/maths-for-games/unit-13/';
const routes = [...machines.map(route), family, maths];

for (const url of routes) {
  test(`@built ${url} supplies usable glyph code, native images and working links`, async ({page}, info) => {
    await page.goto(url);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.code-error')).toHaveCount(0);
    if (machines.some(m => url === route(m))) {
      const prose = page.locator('.pattern-prose');
      await expect(prose.locator('.lesson-listing code').nth(0)).toContainText(url.includes('commodore-64')?'!source "glyphs.inc"':'include');
      const sega=url.includes('sega-');
      await expect(prose.locator('.lesson-listing code').nth(1)).toContainText(sega?'call pattern_install':'jsr glyph_install');
      await expect(prose.locator('.lesson-listing code').nth(1)).toContainText(sega?'call pattern_select':'jsr glyph_select');
      await expect(prose).toContainText(sega?'40 calls completed':'20 calls completed');
      await expect(prose).toContainText('non-re-entrant');
      await expect(prose).toContainText('wrong-slot');
      await expect(prose).toContainText('wrong-name');
      if(sega){
        await expect(prose).toContainText('0–447');
        await expect(prose).toContainText('four plane bytes');
      }
      if(url.includes('nintendo-nes')) await expect(prose).toContainText('$2001 is write-only');
      await expect(prose.getByRole('link', {name:'Complete caller and execution evidence'})).toHaveAttribute('href', /\/tree\/[0-9a-f]{40}\//);
      const detail = prose.locator('details');
      await detail.locator('summary').click();
      await expect(detail.locator('code')).toContainText(sega?'pattern_replace:':'glyph_replace:');
      await detail.locator('summary').click();
    }
    const hrefs = await page.locator('main a[href^="/"]').evaluateAll(nodes => [...new Set(nodes.map(n=>n.getAttribute('href')!))]);
    for (const href of hrefs) expect((await page.request.get(href)).status(), href).toBe(200);
    for (const image of await page.locator('main .figure img').all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(()=>image.evaluate((img:HTMLImageElement)=>img.complete && img.naturalWidth>0)).toBe(true);
      const b=(await image.boundingBox())!;
      expect(b.x).toBeGreaterThanOrEqual(-1);
      expect(b.x+b.width).toBeLessThanOrEqual(await page.evaluate(()=>innerWidth)+1);
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    if (process.env.GLYPH_REVIEW_DIR) {
      mkdirSync(process.env.GLYPH_REVIEW_DIR,{recursive:true});
      const name=url.split('/').filter(Boolean).join('-');
      await page.screenshot({path:path.join(process.env.GLYPH_REVIEW_DIR,`${name}-${info.project.name}.png`),fullPage:true});
      await page.evaluate(()=>scrollTo(0,0));
      await page.screenshot({path:path.join(process.env.GLYPH_REVIEW_DIR,`${name}-${info.project.name}-opening.png`)});
    }
  });
}

test('@built all four native glyph backends appear once in their machine discovery and family comparison', async ({page}) => {
  for(const machine of machines){
    await page.goto(`/patterns/platform/${machine}/`);
    await expect(page.locator(`[data-pattern] a[href="${route(machine)}"]`)).toHaveCount(1);
    await page.goto(`/patterns/${machine}/assembly/rendering/${machine.startsWith('sega-')?'tile-region':'tile-map'}/`);
    await expect(page.locator(`.pattern-prose a[href="${route(machine)}"]`)).toHaveCount(1);
  }
  await page.goto(family);
  await expect(page.locator('.pattern-prose table tbody tr')).toHaveCount(13);
  for(const machine of machines) await expect(page.locator(`table a[href="${route(machine)}"]`)).toHaveCount(1);
});

test('@built glyph entries, captures and the comparison fit 320px with usable code', async ({page}) => {
  await page.setViewportSize({width:320,height:900});
  for (const url of routes) {
    await page.goto(url);
    await page.evaluate(()=>document.fonts.ready);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth),url).toBeLessThanOrEqual(1);
    for (const image of await page.locator('main .figure img').all()) {
      await image.scrollIntoViewIfNeeded();
      const b=(await image.boundingBox())!;
      expect(b.x,url).toBeGreaterThanOrEqual(-1);
      expect(b.x+b.width,url).toBeLessThanOrEqual(321);
    }
    for(const summary of await page.locator('.pattern-prose details summary').all()){
      await summary.click(); await expect(summary.locator('..').locator('code')).not.toBeEmpty(); await summary.click();
    }
  }
});

test('@built glyph readers remain accessible in light and dark themes', async ({page}) => {
  for(const colorScheme of ['light','dark'] as const){
    await page.emulateMedia({colorScheme,reducedMotion:'reduce'});
    for(const url of routes){
      await page.goto(url);
      await page.evaluate(()=>document.fonts.ready);
      await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important}'});
      expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze()).violations,url).toEqual([]);
    }
  }
});
