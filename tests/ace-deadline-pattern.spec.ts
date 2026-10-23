import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {test,expect} from '@playwright/test';

test('Ace FORTH deadline includes exact reusable words, native images and limits',async({page},info)=>{
 const route='/patterns/jupiter-ace/forth/framework/turn-deadline/';
 const root=process.env.CODE_SAMPLES_PATH||'../code-samples';
 const folder='jupiter-ace/patterns/forth/framework/turn-deadline';
 await page.goto(route);const prose=page.locator('.pattern-prose');
 await expect(page.locator('.code-error')).toHaveCount(0);
 for(const text of ['230 dictionary bytes','630 bytes','An untimed action stays untimed','Expiry wins','Deliberately broken service','FORTH binds a word reference','signed comparison treats 65535 as -1'])await expect(prose).toContainText(text);
 const code=await prose.locator('.lesson-listing').evaluateAll(ns=>ns.map(n=>n.getAttribute('data-code')));
 for(const file of ['routines.fth','clock.fth','service.fth','input.fth','caller.fth','settings.fth','customise.fth','mistakes/reset-baseline.fth'])expect(code,file).toContain(readFileSync(path.join(root,folder,file),'utf8'));
 for(const variant of ['working','wrong']){
  const url=`/images/patterns/jupiter-ace/forth-deadline-${variant}.png`;
  const img=prose.locator(`img[src="${url}"]`);await img.scrollIntoViewIfNeeded();
  await expect.poll(()=>img.evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth===320)).toBe(true);
  const response=await page.request.get(url);expect(response.status()).toBe(200);
  expect(createHash('sha256').update(await response.body()).digest('hex')).toBe(createHash('sha256').update(readFileSync(path.join(root,folder,`verification/${variant}-expiry.png`))).digest('hex'));
 }
 for(const link of await prose.locator('a[href^="/"]').evaluateAll(ns=>[...new Set(ns.map(n=>n.getAttribute('href')!))]))expect((await page.request.get(link)).status(),link).toBe(200);
 for(const link of await prose.locator('a[href*="github.com/code198x/code-samples/"]').evaluateAll(ns=>ns.map(n=>n.getAttribute('href')!)))expect(link).toMatch(/\/(?:tree|blob)\/[a-f0-9]{40}\//);
 await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:info.outputPath('ace-deadline-opening.png')});
 await page.setViewportSize({width:320,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
 await page.goto('/patterns/platform/jupiter-ace/');await page.getByLabel('Search patterns',{exact:true}).fill('Give a FORTH turn');await expect(page.locator(`[data-pattern]:visible a[href="${route}"]`)).toHaveCount(1);
 await page.goto('/patterns/cross-platform/framework/game-loop-choices/');await expect(page.locator(`.pattern-prose a[href="${route}"]`)).toHaveCount(1);
});
