import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {test,expect} from '@playwright/test';
import entries from './playtools-entries.json' with {type:'json'};
for(const entry of entries) test(`batch ${entry.batch}: ${entry.title} (${entry.route})`,async({page},info)=>{
 const root=process.env.CODE_SAMPLES_PATH||'../code-samples';
 await page.goto(entry.route);
 const prose=page.locator('.pattern-prose');
 await expect(prose).toBeVisible();
 await expect(page.locator('.code-error')).toHaveCount(0);
 for(const file of entry.files) {
  let code=readFileSync(path.join(root,file.src),'utf8');
  if('from' in file) {
   const from=String(file.from),start=code.indexOf(from),end='to' in file?code.indexOf(String(file.to),start+from.length):code.length;
   expect(start,file.src).toBeGreaterThanOrEqual(0);expect(end,file.src).toBeGreaterThan(start);
   code=code.slice(start,end).trimEnd();
  }
  await expect(prose.locator('.lesson-listing[data-code]').nth(file.index),file.src).toHaveAttribute('data-code',code);
 }
 for(const img of entry.images){
  const picture=prose.locator(`img[src="${img.url}"]`);await picture.scrollIntoViewIfNeeded();
  await expect.poll(()=>picture.evaluate((n:HTMLImageElement)=>n.complete&&n.naturalWidth>0)).toBe(true);
  const r=await page.request.get(img.url);expect(r.status()).toBe(200);
  expect(createHash('sha256').update(await r.body()).digest('hex')).toBe(createHash('sha256').update(readFileSync(path.join(root,img.source))).digest('hex'));
 }
 for(const href of await prose.locator('a[href^="/"]').evaluateAll(ns=>[...new Set(ns.map(n=>n.getAttribute('href')!))]))expect((await page.request.get(href)).status(),href).toBe(200);
 await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:info.outputPath('opening.png')});
 await prose.locator('.lesson-listing').last().scrollIntoViewIfNeeded();await page.screenshot({path:info.outputPath('routine.png')});
 await page.setViewportSize({width:320,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
 await page.goto(`/patterns/platform/${entry.platform}/`);await page.getByLabel('Search patterns',{exact:true}).fill(entry.title);
 await expect(page.locator(`[data-pattern]:visible a[href="${entry.route}"]`)).toHaveCount(1);
});
