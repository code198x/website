import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {test,expect} from '@playwright/test';

for(const machine of ['commodore-pet','commodore-vic-20']){
 test(`${machine} BASIC deadline exposes maintained pieces and stock-memory evidence`,async({page},info)=>{
  const route=`/patterns/${machine}/basic/framework/turn-deadline/`;
  const root=process.env.CODE_SAMPLES_PATH||'../code-samples';
  const own=`${machine}/patterns/basic/framework/turn-deadline`;
  const shared='commodore-64/patterns/basic/framework/turn-deadline';
  await page.goto(route);
  const prose=page.locator('.pattern-prose');
  await expect(page.locator('.code-error')).toHaveCount(0);
  for(const text of ['An untimed action stays untimed','Expiry wins','5,184,000','1,016','191 bytes','Deliberately broken adapter','cassette buffer'])await expect(prose).toContainText(text);
  await expect(prose).toContainText(machine==='commodore-pet'?'4.8 seconds':'2,430 bytes');
  const code=await prose.locator('.lesson-listing').evaluateAll(ns=>ns.map(n=>n.getAttribute('data-code')));
  for(const file of [`${own}/caller.bas`,`${own}/customise.bas`,`${shared}/routines.bas`,`${shared}/clock.bas`,`${shared}/monitor.bas`,`${shared}/mistakes/reset-baseline.bas`,'commodore-64/patterns/basic/framework/command-loop/routines.bas','commodore-pet/patterns/basic/framework/turn-deadline/presentation.bas'])expect(code,file).toContain(readFileSync(path.join(root,file),'utf8'));
  for(const [name,native]of [['working','working-expiry'],['wrong','wrong-expiry']]){
   const url=`/images/patterns/${machine}/basic-deadline-${name}.png`;
   const img=prose.locator(`img[src="${url}"]`);await img.scrollIntoViewIfNeeded();
   await expect.poll(()=>img.evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth>0)).toBe(true);
   const response=await page.request.get(url);expect(response.status()).toBe(200);
   expect(createHash('sha256').update(await response.body()).digest('hex')).toBe(createHash('sha256').update(readFileSync(path.join(root,own,`verification/${native}.png`))).digest('hex'));
  }
  for(const href of await prose.locator('a[href^="/"]').evaluateAll(ns=>[...new Set(ns.map(n=>n.getAttribute('href')!))]))expect((await page.request.get(href)).status(),href).toBe(200);
  const sources=await prose.locator('a[href*="github.com/code198x/code-samples/"]').evaluateAll(ns=>ns.map(n=>n.getAttribute('href')!));expect(sources.length).toBeGreaterThanOrEqual(2);for(const href of sources)expect(href).toMatch(/\/(?:tree|blob)\/[a-f0-9]{40}\//);
  await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:info.outputPath(`${machine}-opening.png`)});
  await page.setViewportSize({width:320,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  for(const img of await prose.locator('img').all()){
   await img.scrollIntoViewIfNeeded();const box=(await img.boundingBox())!;expect(box.x).toBeGreaterThanOrEqual(-1);expect(box.x+box.width).toBeLessThanOrEqual(321);
  }
  await page.goto(`/patterns/platform/${machine}/`);await page.getByLabel('Search patterns',{exact:true}).fill('Give a BASIC turn a deadline');await expect(page.locator(`[data-pattern]:visible a[href="${route}"]`)).toHaveCount(1);
 });
}
test('comparison keeps PET and VIC BASIC routes distinct from assembly',async({page})=>{
 await page.goto('/patterns/cross-platform/framework/game-loop-choices/');
 for(const machine of ['commodore-pet','commodore-vic-20'])await expect(page.locator(`.pattern-prose a[href="/patterns/${machine}/basic/framework/turn-deadline/"]`)).toHaveCount(1);
});
