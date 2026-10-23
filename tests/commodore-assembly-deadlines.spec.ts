import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {test,expect} from '@playwright/test';

for (const machine of ['commodore-64','commodore-vic-20']) {
 test(`${machine} KERNAL deadline exposes maintained code and native evidence`,async({page},info)=>{
  const route=`/patterns/${machine}/assembly/framework/turn-deadline/`;
  const root=process.env.CODE_SAMPLES_PATH||'../code-samples';
  const own=`${machine}/patterns/assembly/framework/turn-deadline`;
  await page.goto(route);
  const prose=page.locator('.pattern-prose');
  await expect(page.locator('.code-error')).toHaveCount(0);
  for (const text of ['An untimed action stays untimed','Expiry wins','5,184,000','A low, X middle, Y high','delivered characters','Deliberately broken dispatcher','Make it your own']) await expect(prose).toContainText(text);
  const listings=await prose.locator('.lesson-listing').evaluateAll(ns=>ns.map(n=>n.getAttribute('data-code')));
  for(const file of [`${own}/settings.inc`,`${own}/demo.asm`,'cross-platform/patterns/framework/elapsed-deadline/6502.inc','commodore-64/patterns/assembly/framework/turn-deadline/clock.inc','commodore-64/patterns/assembly/framework/turn-deadline/input.inc','bbc-micro/patterns/assembly/framework/turn-deadline/dispatch.inc','bbc-micro/patterns/assembly/framework/turn-deadline/mistakes/input-gated-expiry.inc'])expect(listings,file).toContain(readFileSync(path.join(root,file),'utf8'));
  for(const [name,native] of [['working','working'],['wrong','wrong-input-gate']]){
   const url=`/images/patterns/${machine}/kernal-deadline-${name}.png`;
   const img=prose.locator(`img[src="${url}"]`);await img.scrollIntoViewIfNeeded();
   await expect.poll(()=>img.evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth>0)).toBe(true);
   const response=await page.request.get(url);expect(response.status()).toBe(200);
   expect(createHash('sha256').update(await response.body()).digest('hex')).toBe(createHash('sha256').update(readFileSync(path.join(root,own,`verification/${native}.png`))).digest('hex'));
  }
  for(const link of await prose.locator('a[href^="/"]').evaluateAll(ns=>[...new Set(ns.map(n=>n.getAttribute('href')!))]))expect((await page.request.get(link)).status(),link).toBe(200);
  const sources=await prose.locator('a[href*="github.com/code198x/code-samples/"]').evaluateAll(ns=>ns.map(n=>n.getAttribute('href')!));
  expect(sources.length).toBeGreaterThanOrEqual(2);for(const url of sources)expect(url).toMatch(/\/(?:tree|blob)\/[a-f0-9]{40}\//);
  await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:info.outputPath(`${machine}-opening.png`)});
  await page.setViewportSize({width:320,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  await page.goto(`/patterns/platform/${machine}/`);await page.getByLabel('Search patterns',{exact:true}).fill('Give a turn a KERNAL deadline');await expect(page.locator(`[data-pattern]:visible a[href="${route}"]`)).toHaveCount(1);
 });
}
test('comparison links both KERNAL deadline callers',async({page})=>{
 await page.goto('/patterns/cross-platform/framework/game-loop-choices/');
 for(const machine of ['commodore-64','commodore-vic-20'])await expect(page.locator(`.pattern-prose a[href="/patterns/${machine}/assembly/framework/turn-deadline/"]`)).toHaveCount(1);
});
