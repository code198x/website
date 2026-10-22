import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {test,expect} from '@playwright/test';

for(const machine of ['atari-2600','atari-5200','atari-7800']){
 test(`${machine} supplies reusable turn routines and its own timing contract`,async({page})=>{
  const route=`/patterns/${machine}/assembly/framework/turn-loop/`;
  await page.goto(route);const prose=page.locator('.pattern-prose');
  await expect(page.locator('.code-error')).toHaveCount(0);
  const root=process.env.CODE_SAMPLES_PATH||'../code-samples';const folder=`${machine}/patterns/assembly/framework/turn-loop`;
  const code=await prose.locator('.lesson-listing').evaluateAll(ns=>ns.map(n=>n.getAttribute('data-code')));
  for(const file of [`${folder}/demo.asm`,`${folder}/customise.inc`,`${folder}/settings.inc`,'cross-platform/patterns/framework/atari-turn-loops/turn.inc','cross-platform/patterns/framework/atari-turn-loops/edge-filter.inc','cross-platform/patterns/framework/atari-turn-loops/mistakes/held-as-press.inc'])expect(code).toContain(readFileSync(path.join(root,file),'utf8'));
  await expect(prose).toContainText('decimal mode clear');await expect(prose).toContainText('seven private, consecutive RAM bytes');await expect(prose).toContainText('254 → 255 → 0');
  if(machine==='atari-2600'){
   await expect(prose).toContainText('59,736');await expect(prose).toContainText('59,964');await expect(prose).toContainText('30 overscan lines');
  }else{
   const file=`${folder}/frame.inc`;expect(code).toContain(readFileSync(path.join(root,file),'utf8'));
   await expect(prose).toContainText(machine==='atari-5200'?'VCOUNT at $D40B':'MSTAT at $28');
   await expect(prose).toContainText(machine==='atari-5200'?'BIOS hands control':'bypasses stock BIOS authentication');
  }
  const imageUrl=`/images/${machine}/patterns/turn-loop/pressed.png`;const img=prose.locator(`img[src="${imageUrl}"]`);await img.scrollIntoViewIfNeeded();await expect.poll(()=>img.evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth>0)).toBe(true);
  const response=await page.request.get(imageUrl);expect(response.status()).toBe(200);expect(createHash('sha256').update(await response.body()).digest('hex')).toBe(createHash('sha256').update(readFileSync(path.join(root,folder,'verification/working-pressed.png'))).digest('hex'));
  const links=await prose.locator('a[href^="/"]').evaluateAll(ns=>[...new Set(ns.map(n=>n.getAttribute('href')!))]);for(const url of links)expect((await page.request.get(url)).status(),url).toBe(200);
  await page.setViewportSize({width:320,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);await img.scrollIntoViewIfNeeded();const box=(await img.boundingBox())!;expect(box.x).toBeGreaterThanOrEqual(-1);expect(box.x+box.width).toBeLessThanOrEqual(321);
  await page.goto(`/patterns/platform/${machine}/`);await page.getByLabel('Search patterns',{exact:true}).fill('new press');await expect(page.locator(`[data-pattern]:visible a[href="${route}"]`)).toHaveCount(1);
 });
}

test('progression comparison preserves BASIC and Atari routes together',async({page})=>{
 await page.goto('/patterns/cross-platform/framework/game-loop-choices/');const prose=page.locator('.pattern-prose');
 for(const machine of ['acorn-atom','amstrad-cpc'])await expect(prose.locator(`a[href="/patterns/${machine}/basic/framework/command-loop/"]`)).toHaveCount(1);
 for(const machine of ['atari-2600','atari-5200','atari-7800'])await expect(prose.locator(`a[href="/patterns/${machine}/assembly/framework/turn-loop/"]`)).toHaveCount(1);
});
