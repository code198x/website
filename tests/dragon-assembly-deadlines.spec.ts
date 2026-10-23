import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {test,expect} from '@playwright/test';

test('Dragon 6809 deadline exposes reusable code and qualified feedback',async({page},info)=>{
 const route='/patterns/dragon-32/assembly/framework/turn-deadline/';
 const root=process.env.CODE_SAMPLES_PATH||'../code-samples';
 const own='dragon-32/patterns/assembly/framework/turn-deadline';
 await page.goto(route);const prose=page.locator('.pattern-prose');
 await expect(page.locator('.code-error')).toHaveCount(0);
 for(const text of ['65536','expiry win','66 assembled bytes','246 bytes','twelve writable bytes','X/Y/U/DP'])await expect(prose).toContainText(text);
 const listings=await prose.locator('.lesson-listing').evaluateAll(ns=>ns.map(n=>n.getAttribute('data-code')));
 for(const file of ['demo.asm','caller.inc','deadline.inc','clock.inc','dispatch.inc','customise.asm','mistakes/reset-baseline.inc'])expect(listings,file).toContain(readFileSync(path.join(root,own,file),'utf8'));
 for(const name of ['working','wrong']){
  const url=`/images/patterns/dragon-32/assembly-deadline-${name}.png`;const img=prose.locator(`img[src="${url}"]`);await img.scrollIntoViewIfNeeded();
  await expect.poll(()=>img.evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth>0)).toBe(true);
  const response=await page.request.get(url);expect(response.status()).toBe(200);
  expect(createHash('sha256').update(await response.body()).digest('hex')).toBe(createHash('sha256').update(readFileSync(path.join(root,own,`verification/${name}.png`))).digest('hex'));
 }
 for(const href of await prose.locator('a[href^="/"]').evaluateAll(ns=>[...new Set(ns.map(n=>n.getAttribute('href')!))]))expect((await page.request.get(href)).status(),href).toBe(200);
 const sourceLinks=await prose.locator('a[href*="github.com/code198x/code-samples/"]').evaluateAll(ns=>ns.map(n=>n.getAttribute('href')!));expect(sourceLinks.length).toBeGreaterThanOrEqual(2);for(const href of sourceLinks)expect(href).toMatch(/\/(?:tree|blob)\/[a-f0-9]{40}\//);
 await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:info.outputPath('dragon-assembly-opening.png')});
 await page.setViewportSize({width:320,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
 await page.goto('/patterns/platform/dragon-32/');await page.getByLabel('Search patterns',{exact:true}).fill('Give a 6809 turn a deadline');await expect(page.locator(`[data-pattern]:visible a[href="${route}"]`)).toHaveCount(1);
});
