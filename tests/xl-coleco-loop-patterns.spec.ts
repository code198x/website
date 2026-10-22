import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {test,expect} from '@playwright/test';

const configs=[['atari-800','atari-800xl','basic','command-loop'],['atari-800','atari-800xl','assembly','turn-loop'],['colecovision','coleco-colecovision','assembly','turn-loop']];
for(const[machine,sourceMachine,language,slug]of configs){
 test(`${machine} ${language} exposes reusable loops with exact native evidence`,async({page})=>{
  const basic=language==='basic',coleco=machine==='colecovision';
  const route=`/patterns/${machine}/${language}/framework/${slug}/`;const root=process.env.CODE_SAMPLES_PATH||'../code-samples';const folder=`${sourceMachine}/patterns/${language}/framework/${slug}`;
  await page.goto(route);const prose=page.locator('.pattern-prose');await expect(page.locator('.code-error')).toHaveCount(0);
  const code=await prose.locator('.lesson-listing').evaluateAll(ns=>ns.map(n=>n.getAttribute('data-code')));
  const files=basic?['caller.bas','routines.bas','customise.bas','mistakes/reset-each-turn.bas'].map(n=>`${folder}/${n}`):['demo.asm','settings.inc','customise.inc','frame.inc','mistakes/no-wait.inc'].map(n=>`${folder}/${n}`).concat(coleco?[`${folder}/turn.inc`,`${folder}/mistakes/held-as-press.inc`]:['cross-platform/patterns/framework/atari-turn-loops/turn.inc','cross-platform/patterns/framework/atari-turn-loops/mistakes/held-as-press.inc']);
  for(const file of files)expect(code,file).toContain(readFileSync(path.join(root,file),'utf8'));
  await expect(prose).toContainText('254 → 255 → 0');await expect(prose).toContainText('0.44.1');
  if(!basic){const record=JSON.parse(readFileSync(path.join(root,folder,'verification/results.json'),'utf8'));await expect(prose).toContainText(`${record.variants['bad-wait'].service_ticks_in_30_frames} service ticks in 30 native fields`);await expect(prose).toContainText('seven private, consecutive RAM bytes');}
  if(coleco){await expect(prose).toContainText('DI alone does not stop it');await expect(prose).toContainText('NMI');await expect(prose).toContainText('BASIC compiler/runtime/load path');}
  if(!basic&&!coleco){await expect(prose).toContainText('$06E0–$06E6');await expect(prose).toContainText('decimal mode clear');await expect(prose).toContainText('PLA');await expect(prose).toContainText('SAVMSC');}
  const publicFolder=basic?'basic-command-loop':'assembly-turn-loop';const nativeFolder=basic?'verification/reusable':'verification';
  for(const[dest,src]of(basic?[['working','working-action-2'],['step-two','customise-action-2'],['reset-mistake','reset-mistake-action-2']]:[['working','working-second'],['step-two','customise-second'],['held-mistake','held-as-press-held']])){
   const url=`/images/${sourceMachine}/patterns/${publicFolder}/${dest}.png`;const img=prose.locator(`img[src="${url}"]`);await img.scrollIntoViewIfNeeded();await expect.poll(()=>img.evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth>0)).toBe(true);
   const response=await page.request.get(url);expect(response.status()).toBe(200);expect(createHash('sha256').update(await response.body()).digest('hex')).toBe(createHash('sha256').update(readFileSync(path.join(root,folder,nativeFolder,src+'.png'))).digest('hex'));
  }
  const links=await prose.locator('a[href^="/"]').evaluateAll(ns=>[...new Set(ns.map(n=>n.getAttribute('href')!))]);for(const url of links)expect((await page.request.get(url)).status(),url).toBe(200);
  await page.setViewportSize({width:320,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  for(const img of await prose.locator('img').all()){await img.scrollIntoViewIfNeeded();const box=(await img.boundingBox())!;expect(box.x).toBeGreaterThanOrEqual(-1);expect(box.x+box.width).toBeLessThanOrEqual(321);}
  await page.goto(`/patterns/platform/${machine}/`);await page.getByLabel('Search patterns',{exact:true}).fill(basic?'Wait for a command':'new fire press');await expect(page.locator(`[data-pattern]:visible a[href="${route}"]`)).toHaveCount(1);
 });
}
