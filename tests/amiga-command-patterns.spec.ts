import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {test,expect} from '@playwright/test';

for(const [track,extension,label]of [['amos','amos','AMOS BASIC'],['blitz','bb2','Blitz BASIC']]){
 test(`${track} offers exact reusable code, native variants and a distinct language`,async({page})=>{
  const route=`/patterns/commodore-amiga/${track}/framework/command-loop/`;
  await page.goto(route);const prose=page.locator('.pattern-prose');
  await expect(page.locator('.code-error')).toHaveCount(0);
  await expect(page.locator('.pattern-reading-meta')).toContainText(label);
  const folder=path.join(process.env.CODE_SAMPLES_PATH||'../code-samples',`commodore-amiga/patterns/${track}/framework/command-loop`);
  const code=await prose.locator('.lesson-listing').evaluateAll(ns=>ns.map(n=>n.getAttribute('data-code')));
  for(const f of [`caller.${extension}`,`routines.${extension}`,`customise.${extension}`,`mistakes/reset-each-command.${extension}`])expect(code,f).toContain(readFileSync(path.join(folder,f),'utf8'));
  for(const [published,native]of [['working','working-2'],['step-three','custom-2'],['reset-mistake','wrong-2']]){
   const url=`/images/commodore-amiga/patterns/${track}-command-loop/${published}.png`;
   const image=prose.locator(`img[src="${url}"]`);await image.scrollIntoViewIfNeeded();await expect.poll(()=>image.evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth>0)).toBe(true);
   const response=await page.request.get(url);expect(response.status()).toBe(200);
   expect(createHash('sha256').update(await response.body()).digest('hex')).toBe(createHash('sha256').update(readFileSync(path.join(folder,'verification',`published-${published}.png`))).digest('hex'));
  }
  await expect(prose).toContainText('254 → 255 → 0');await expect(prose).toContainText('0 → 1 → 1 → 2');
  await expect(prose).toContainText('not tokenised');
  if(track==='amos')await expect(prose).toContainText('retain it across calls');
  else await expect(prose).toContainText('AmiBlitz/PED');
  const links=await prose.locator('a[href^="/"]').evaluateAll(ns=>[...new Set(ns.map(n=>n.getAttribute('href')!))]);
  for(const url of links)expect((await page.request.get(url)).status(),url).toBe(200);
  await page.setViewportSize({width:320,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  for(const image of await prose.locator('img').all()){await image.scrollIntoViewIfNeeded();const b=(await image.boundingBox())!;expect(b.x).toBeGreaterThanOrEqual(-1);expect(b.x+b.width).toBeLessThanOrEqual(321);}
  await page.goto('/patterns/platform/commodore-amiga/');await page.getByLabel('Search patterns',{exact:true}).fill(label);await expect(page.locator(`[data-pattern]:visible a[href="${route}"]`)).toHaveCount(1);
  await page.goto('/patterns/cross-platform/framework/game-loop-choices/');await expect(page.locator(`.pattern-prose a[href="${route}"]`)).toHaveCount(1);
 });
}
