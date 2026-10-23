import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {test,expect} from '@playwright/test';

for(const machine of ['commodore-64','bbc-micro']){
 test(`${machine} deadline exposes reusable code, exact evidence and native limits`,async({page},info)=>{
  const route=`/patterns/${machine}/basic/framework/turn-deadline/`;
  const root=process.env.CODE_SAMPLES_PATH||'../code-samples';
  const folder=`${machine}/patterns/basic/framework/turn-deadline`;
  await page.goto(route);
  const prose=page.locator('.pattern-prose');
  await expect(page.locator('.code-error')).toHaveCount(0);
  await expect(prose).toContainText('An untimed action stays untimed');
  await expect(prose).toContainText('Expiry wins');
  await expect(prose).toContainText('Deliberately broken adapter');
  await expect(prose).toContainText(machine==='bbc-micro'?'655.36 seconds':'5,184,000 ticks');
  const code=await prose.locator('.lesson-listing').evaluateAll(ns=>ns.map(n=>n.getAttribute('data-code')));
  for(const file of ['caller.bas','routines.bas','monitor.bas','clock.bas','customise.bas','mistakes/reset-baseline.bas']){
   expect(code,file).toContain(readFileSync(path.join(root,folder,file),'utf8'));
  }
  const turn=machine==='bbc-micro'?`${folder}/turn.bas`:'commodore-64/patterns/basic/framework/command-loop/routines.bas';
  expect(code).toContain(readFileSync(path.join(root,turn),'utf8'));
  for(const [image,native]of [['basic-deadline-working','working-expiry'],['basic-deadline-wrong','wrong-expiry']]){
   const url=`/images/patterns/${machine}/${image}.png`;
   const img=prose.locator(`img[src="${url}"]`);await img.scrollIntoViewIfNeeded();
   await expect.poll(()=>img.evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth>0)).toBe(true);
   const response=await page.request.get(url);expect(response.status()).toBe(200);
   expect(createHash('sha256').update(await response.body()).digest('hex')).toBe(createHash('sha256').update(readFileSync(path.join(root,folder,`verification/${native}.png`))).digest('hex'));
  }
  for(const link of await prose.locator('a[href^="/"]').evaluateAll(ns=>[...new Set(ns.map(n=>n.getAttribute('href')!))]))expect((await page.request.get(link)).status(),link).toBe(200);
  const sourceLinks=await prose.locator('a[href*="github.com/code198x/code-samples/"]').evaluateAll(ns=>ns.map(n=>n.getAttribute('href')!));
  expect(sourceLinks.length).toBeGreaterThanOrEqual(2);
  for(const link of sourceLinks)expect(link).toMatch(/\/(?:tree|blob)\/[a-f0-9]{40}\//);
  await page.evaluate(()=>scrollTo(0,0));
  await page.screenshot({path:info.outputPath(`${machine}-opening.png`)});
  await page.setViewportSize({width:320,height:900});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  for(const img of await prose.locator('img').all()){
   await img.scrollIntoViewIfNeeded();const box=(await img.boundingBox())!;
   expect(box.x).toBeGreaterThanOrEqual(-1);expect(box.x+box.width).toBeLessThanOrEqual(321);
  }
  await page.goto(`/patterns/platform/${machine}/`);
  await page.getByLabel('Search patterns',{exact:true}).fill('Give a BASIC turn a deadline');
  await expect(page.locator(`[data-pattern]:visible a[href="${route}"]`)).toHaveCount(1);
 });
}

test('clock comparison links both BASIC deadline choices',async({page})=>{
 await page.goto('/patterns/cross-platform/framework/game-loop-choices/');
 for(const machine of ['commodore-64','bbc-micro'])await expect(page.locator(`.pattern-prose a[href="/patterns/${machine}/basic/framework/turn-deadline/"]`)).toHaveCount(1);
});
