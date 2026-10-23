import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {test,expect} from '@playwright/test';

test('Blitz deadline includes exact reusable modules, native images and limits',async({page},info)=>{
 const route='/patterns/commodore-amiga/blitz/framework/turn-deadline/';
 const root=process.env.CODE_SAMPLES_PATH||'../code-samples';
 const folder='commodore-amiga/patterns/blitz/framework/turn-deadline';
 await page.goto(route);const prose=page.locator('.pattern-prose');
 await expect(page.locator('.code-error')).toHaveCount(0);
 for(const text of ['28 bytes of numeric payload','An untimed action stays untimed','Expiry wins','Deliberately broken service','Blitz names are case-sensitive','36 explicit data bytes','three exact-expiry results'])await expect(prose).toContainText(text);
 const code=await prose.locator('.lesson-listing').evaluateAll(ns=>ns.map(n=>n.getAttribute('data-code')));
 for(const file of ['routines.bb2','clock.bb2','input.bb2','caller.bb2','customise.bb2','mistakes/reset-baseline.bb2','monitor.bb2'])expect(code,file).toContain(readFileSync(path.join(root,folder,file),'utf8'));
 for(const variant of ['working','wrong']){
  const url=`/images/patterns/commodore-amiga/blitz-deadline-${variant}.png`;
  const img=prose.locator(`img[src="${url}"]`);await img.scrollIntoViewIfNeeded();
  await expect.poll(()=>img.evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth===768)).toBe(true);
  const response=await page.request.get(url);expect(response.status()).toBe(200);
  expect(createHash('sha256').update(await response.body()).digest('hex')).toBe(createHash('sha256').update(readFileSync(path.join(root,folder,`verification/published-${variant}.png`))).digest('hex'));
 }
 for(const link of await prose.locator('a[href^="/"]').evaluateAll(ns=>[...new Set(ns.map(n=>n.getAttribute('href')!))]))expect((await page.request.get(link)).status(),link).toBe(200);
 for(const link of await prose.locator('a[href*="github.com/code198x/code-samples/"]').evaluateAll(ns=>ns.map(n=>n.getAttribute('href')!)))expect(link).toMatch(/\/(?:tree|blob)\/[a-f0-9]{40}\//);
 await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:info.outputPath('blitz-deadline-opening.png')});
 await page.setViewportSize({width:320,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
 await page.goto('/patterns/platform/commodore-amiga/');await page.getByLabel('Search patterns',{exact:true}).fill('Give a Blitz BASIC turn');await expect(page.locator(`[data-pattern]:visible a[href="${route}"]`)).toHaveCount(1);
 await page.goto('/patterns/cross-platform/framework/game-loop-choices/');await expect(page.locator(`.pattern-prose a[href="${route}"]`)).toHaveCount(1);
});
