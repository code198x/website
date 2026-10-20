import {test, expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {mkdirSync} from 'node:fs';
import path from 'node:path';

const machines = ['acorn-atom','acorn-electron','commodore-64','commodore-amiga'];
const primitive = (m: string) => `/patterns/${m}/assembly/rendering/pixels-and-boxes/`;
const text = '/patterns/commodore-amiga/assembly/rendering/bitmap-text/';
const pixels = '/patterns/cross-platform/rendering/pixels-and-boxes/';
const labels = '/patterns/cross-platform/rendering/bitmap-text/';
const maths = '/craft/maths-for-games/unit-13/';
const routes = [...machines.map(primitive),text,pixels,labels,maths];

for (const route of routes) {
  test(`@built ${route} provides usable code, source links and whole native images`, async ({page},info) => {
    await page.goto(route);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.code-error')).toHaveCount(0);
    const prose = page.locator('.pattern-prose');
    if (machines.some(m => route === primitive(m))) {
      await expect(prose.locator('.lesson-listing code').first()).toContainText('bp_box');
      await expect(prose).toContainText('32 byte stores at X24 and 40 at X25');
      await expect(prose).toContainText(route.includes('acorn-atom') ? '169 calls completed' : '173 calls completed');
      await expect(prose).toContainText('non-re-entrant');
      if (!route.includes('amiga')) await expect(prose).toContainText('Decimal mode must be off on entry');
      if (route.includes('commodore-64')) {
        await expect(prose).toContainText('192 tail bytes');
        await expect(prose).toContainText('screen RAM');
      }
      if (route.includes('amiga')) await expect(prose).toContainText('Chip RAM');
    }
    if (route === text) {
      await expect(prose.locator('.lesson-listing code').first()).toContainText('text_string');
      await expect(prose).toContainText('32-bit source pointers');
      await expect(prose).toContainText('81 calls completed');
      await expect(prose).toContainText('$FFFFFF');
      await expect(prose).toContainText('888 assembled bytes');
    }
    for (const detail of await prose.locator('details').all()) {
      await detail.locator('summary').click();
      await expect(detail.locator('code')).not.toBeEmpty();
      await detail.locator('summary').click();
    }
    if (machines.some(m => route === primitive(m)) || route === text) {
      await expect(prose.getByRole('link',{name:'Complete caller and execution evidence'})).toHaveAttribute('href',/\/tree\/[0-9a-f]{40}\//);
    }
    const hrefs = await page.locator('main a[href^="/"]').evaluateAll(nodes => [...new Set(nodes.map(n=>n.getAttribute('href')!))]);
    for (const href of hrefs) expect((await page.request.get(href)).status(),href).toBe(200);
    for (const image of await page.locator('main .figure img').all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(()=>image.evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true);
      const box=(await image.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(-1);
      expect(box.x+box.width).toBeLessThanOrEqual(await page.evaluate(()=>innerWidth)+1);
      expect(await image.evaluate((img:HTMLImageElement)=>{
        const parent=img.parentElement!.getBoundingClientRect(), own=img.getBoundingClientRect();
        return own.left>=parent.left-1&&own.right<=parent.right+1;
      })).toBe(true);
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    if(process.env.BITMAP_REVIEW_DIR){
      mkdirSync(process.env.BITMAP_REVIEW_DIR,{recursive:true});
      const name=route.split('/').filter(Boolean).join('-');
      await page.screenshot({path:path.join(process.env.BITMAP_REVIEW_DIR,`${name}-${info.project.name}.png`),fullPage:true});
      await page.evaluate(()=>scrollTo(0,0));
      await page.screenshot({path:path.join(process.env.BITMAP_REVIEW_DIR,`${name}-${info.project.name}-opening.png`)});
    }
  });
}

test('@built the expanded bitmap readers fit 320px without losing controls or captures',async({page})=>{
  await page.setViewportSize({width:320,height:900});
  for(const route of routes){
    await page.goto(route);
    await page.evaluate(()=>document.fonts.ready);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth),route).toBeLessThanOrEqual(1);
    for(const image of await page.locator('main .figure img').all()){
      await image.scrollIntoViewIfNeeded();
      const b=(await image.boundingBox())!;
      expect(b.x,route).toBeGreaterThanOrEqual(-1);
      expect(b.x+b.width,route).toBeLessThanOrEqual(321);
    }
    for(const summary of await page.locator('.pattern-prose details summary').all()){
      await summary.click();await expect(summary.locator('..').locator('code')).not.toBeEmpty();await summary.click();
    }
  }
});

test('@built all four machines expose their new reusable routines in discovery',async({page})=>{
  for(const machine of machines){
    await page.goto(`/patterns/platform/${machine}/`);
    await expect(page.locator(`[data-pattern] a[href="${primitive(machine)}"]`)).toHaveCount(1);
    if(machine==='commodore-amiga')await expect(page.locator(`[data-pattern] a[href="${text}"]`)).toHaveCount(1);
  }
  await page.goto(pixels);
  await expect(page.locator('.pattern-prose table tbody tr')).toHaveCount(11);
  for(const machine of machines)await expect(page.locator(`table a[href="${primitive(machine)}"]`)).toHaveCount(1);
  await page.goto(labels);
  await expect(page.locator('.pattern-prose table').first().locator('tbody tr')).toHaveCount(5);
  await expect(page.locator(`table a[href="${text}"]`)).toHaveCount(1);
  await expect(page.locator('.pattern-prose')).toContainText('397 calls completed');
});

test('@built bitmap readers remain accessible in both colour preferences',async({page})=>{
  test.setTimeout(240_000);
  for(const colorScheme of ['light','dark'] as const){
    await page.emulateMedia({colorScheme});
    for(const route of routes){
      await page.goto(route);
      expect((await new AxeBuilder({page}).analyze()).violations,`${route} ${colorScheme}`).toEqual([]);
    }
  }
});
