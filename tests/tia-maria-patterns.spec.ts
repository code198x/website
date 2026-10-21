import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const entries=[['atari-2600','playfield-kernel','pf_cell:','59,736'],['atari-7800','maria-objects','maria_append:','121 code bytes']];
for(const [machine,name,routine,cost] of entries){
 test(`@built ${machine} exposes the reusable native drawing contract`,async({page})=>{
  await page.goto(`/patterns/${machine}/assembly/rendering/${name}/`);
  const prose=page.locator('.pattern-prose');
  await expect(page.locator('.code-error')).toHaveCount(0);
  await expect(prose).toContainText(cost);
  await prose.locator('details summary').click();
  await expect(prose.locator('details code').first()).toContainText(routine);
  await expect(prose.getByRole('link',{name:'Reusable source, caller and execution records'})).toHaveAttribute('href',/\/tree\/[0-9a-f]{40}\//);
  const image=prose.locator('img').first();
  await expect.poll(()=>image.evaluate((i:HTMLImageElement)=>i.complete&&i.naturalWidth>0)).toBe(true);
  const links=await page.locator('main a[href^="/"]').evaluateAll(ns=>[...new Set(ns.map(n=>n.getAttribute('href')!))]);
  for(const link of links)expect((await page.request.get(link)).status(),link).toBe(200);
  for(const width of [1440,320]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);}
  for(const colorScheme of ['light','dark'] as const){await page.emulateMedia({colorScheme,reducedMotion:'reduce'});expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);}
  await page.goto(`/patterns/platform/${machine}/`);
  await expect(page.locator(`[data-pattern] a[href$="/${name}/"]`)).toHaveCount(1);
 });
}
