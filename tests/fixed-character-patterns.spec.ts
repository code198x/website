import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {mkdirSync} from 'node:fs';
import path from 'node:path';
const machines=['commodore-pet','mattel-aquarius','sinclair-zx80','sinclair-zx81'];
const route=(m:string)=>`/patterns/${m}/assembly/rendering/fixed-characters/`;
for(const machine of machines){
 test(`@built ${machine} offers reusable code, native output and real links`,async({page},info)=>{
  await page.goto(route(machine));
  const prose=page.locator('.pattern-prose');
  await expect(page.locator('.code-error')).toHaveCount(0);
  await expect(prose.locator('.lesson-listing code').first()).toContainText('character_span');
  await expect(prose).toContainText('24 private bytes');
  await expect(prose).toContainText('before any display write');
  await expect(prose.getByRole('link',{name:'Move a glyph'})).toBeVisible();
  const detail=prose.locator('details');await detail.locator('summary').click();
  await expect(detail.locator('code').first()).toContainText('character_span:');
  if(machine.startsWith('sinclair'))await expect(detail.locator('code').first()).toContainText('fc_preflight:');
  if(machine==='mattel-aquarius')await expect(prose).toContainText('surround');
  if(machine==='commodore-pet')await expect(prose).toContainText('no per-cell colour RAM');
  const links=await page.locator('main a[href^="/"]').evaluateAll(ns=>[...new Set(ns.map(n=>n.getAttribute('href')!))]);
  for(const link of links)expect((await page.request.get(link)).status(),link).toBe(200);
  const image=prose.locator('img').first();await image.scrollIntoViewIfNeeded();
  await expect.poll(()=>image.evaluate((i:HTMLImageElement)=>i.complete&&i.naturalWidth>0)).toBe(true);
  await expect(prose.getByRole('link',{name:'Reusable source, caller and execution records'})).toHaveAttribute('href',/\/tree\/[0-9a-f]{40}\//);
  for(const width of [1440,320]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);}
  await page.setViewportSize(info.project.name==='mobile'?{width:393,height:851}:{width:1440,height:900});
  await page.evaluate(()=>scrollTo(0,0));
  if(process.env.FIXED_REVIEW_DIR){mkdirSync(process.env.FIXED_REVIEW_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.FIXED_REVIEW_DIR,`${machine}-${info.project.name}.png`),fullPage:true});}
 });
}
test('@built fixed-ROM entries are discoverable and accessible',async({page})=>{
 for(const machine of machines){
  await page.goto(`/patterns/platform/${machine}/`);await expect(page.locator(`[data-pattern] a[href="${route(machine)}"]`)).toHaveCount(1);
  for(const colorScheme of ['light','dark'] as const){await page.emulateMedia({colorScheme,reducedMotion:'reduce'});await page.goto(route(machine));expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);}
 }
});
