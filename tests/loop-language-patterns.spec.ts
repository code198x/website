import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {test,expect} from '@playwright/test';

for(const machine of ['acorn-atom','bbc-micro','acorn-electron','amstrad-cpc']){
 test(`${machine} exposes its language-specific loop and exact native evidence`,async({page})=>{
  const basic=['bbc-micro','acorn-electron'].includes(machine);
  const suffix=basic?'basic/framework/turn-loop':'assembly/framework/command-loop';
  const route=`/patterns/${machine}/${suffix}/`;
  await page.goto(route);const prose=page.locator('.pattern-prose');
  await expect(page.locator('.code-error')).toHaveCount(0);
  const root=process.env.CODE_SAMPLES_PATH||'../code-samples';
  const folder=`${machine}/patterns/${suffix}`;
  const source=basic?'bbc-micro/patterns/basic/framework/turn-loop':folder;
  const files=basic?['caller.bas','routines.bas','mistakes/no-edge.bas','mistakes/no-wait.bas'].map(n=>`${source}/${n}`):['demo.asm','settings.inc','dispatch.inc','mistakes/reset-each-command.inc'].map(n=>`${source}/${n}`).concat(`cross-platform/patterns/framework/command-turns/${machine==='acorn-atom'?'6502':'z80'}.inc`);
  const code=await prose.locator('.lesson-listing').evaluateAll(ns=>ns.map(n=>n.getAttribute('data-code')));
  for(const file of files)expect(code,file).toContain(readFileSync(path.join(root,file),'utf8'));
  const record=JSON.parse(readFileSync(path.join(root,folder,'verification/results.json'),'utf8'));
  await expect(prose).toContainText('254 → 255 → 0');
  await expect(prose).toContainText('firmware-entered and emulator-executed');
  if(basic){await expect(prose).toContainText('0 → 1 → 1 → 2');await expect(prose).toContainText(`${record.cases['no-wait'].updates_per_30_fields} iterations in 30 native fields`);}
  else{await expect(prose).toContainText('four private, consecutive writable bytes');await expect(prose).toContainText('Character arrival is not physical press detection');}
  if(machine==='acorn-atom'){await expect(prose).toContainText('full 32 KiB Atom');await expect(prose).toContainText('$FFE3');}
  if(machine==='amstrad-cpc'){await expect(prose).toContainText('MEMORY &8FEF');await expect(prose).toContainText('&BB06');}
  const imageFolder=basic?'basic-turn-loop':'assembly-command-loop';
  for(const [published,native]of [['working','default-action'],['step-two','step-two-action'],basic?['no-edge','wrong-held']:['reset-mistake','wrong-action']]){
   const url=`/images/${machine}/patterns/${imageFolder}/${published}.png`;
   const img=prose.locator(`img[src="${url}"]`);await img.scrollIntoViewIfNeeded();await expect.poll(()=>img.evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth>0)).toBe(true);
   const response=await page.request.get(url);expect(response.status()).toBe(200);
   expect(createHash('sha256').update(await response.body()).digest('hex')).toBe(createHash('sha256').update(readFileSync(path.join(root,folder,`verification/${native}.png`))).digest('hex'));
  }
  const links=await prose.locator('a[href^="/"]').evaluateAll(ns=>[...new Set(ns.map(n=>n.getAttribute('href')!))]);
  for(const url of links)expect((await page.request.get(url)).status(),url).toBe(200);
  await page.setViewportSize({width:320,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  for(const img of await prose.locator('img').all()){await img.scrollIntoViewIfNeeded();const box=(await img.boundingBox())!;expect(box.x).toBeGreaterThanOrEqual(-1);expect(box.x+box.width).toBeLessThanOrEqual(321);}
  await page.goto(`/patterns/platform/${machine}/`);await page.getByLabel('Search patterns',{exact:true}).fill(basic?'Sample keys':'command in');await expect(page.locator(`[data-pattern]:visible a[href="${route}"]`)).toHaveCount(1);
 });
}

test('comparison retains the existing callers and links all four new language paths',async({page})=>{
 await page.goto('/patterns/cross-platform/framework/game-loop-choices/');const prose=page.locator('.pattern-prose');
 for(const machine of ['acorn-atom','amstrad-cpc']){await expect(prose.locator(`a[href="/patterns/${machine}/basic/framework/command-loop/"]`)).toHaveCount(1);await expect(prose.locator(`a[href="/patterns/${machine}/assembly/framework/command-loop/"]`)).toHaveCount(1);}
 for(const machine of ['bbc-micro','acorn-electron'])await expect(prose.locator(`a[href="/patterns/${machine}/basic/framework/turn-loop/"]`)).toHaveCount(1);
 for(const machine of ['atari-2600','atari-5200','atari-7800'])await expect(prose.locator(`a[href="/patterns/${machine}/assembly/framework/turn-loop/"]`)).toHaveCount(1);
});
