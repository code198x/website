import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {test,expect} from '@playwright/test';

const machines=['colecovision','sord-m5','memotech-mtx','tatung-einstein','spectravideo-svi-328','sega-sg-1000'];
const route=(m:string)=>`/patterns/${m}/assembly/rendering/custom-glyphs/`;
const captures={opening:'positive-startup.png',customise:'customise-startup.png','wrong-stride':'stride-fault-startup.png','fixed-stride':'stride-fixed-startup.png'};
for(const machine of machines){
 test(`@built ${machine} supplies usable four-tile characters and independent captures`,async({page})=>{
  await page.goto(route(machine));const prose=page.locator('.pattern-prose');
  await expect(page.locator('.code-error')).toHaveCount(0);
  for(const text of ['893 native observations','eight more private bytes at Q','92 code bytes and eight RAM bytes','before any VDP access','column 0–30 and row 0–22','four name bytes plus four control bytes'])await expect(prose).toContainText(text);
  await expect(prose.getByRole('heading',{name:'Make a larger character from four tiles',exact:true})).toHaveCount(1);
  const code=await prose.locator('.lesson-listing code').allTextContents();
  expect(code.some(s=>s.includes('call glyph_install')&&s.includes('call quad_select'))).toBe(true);
  expect(code.some(s=>s.includes('quad_select:')&&s.includes('cp 253')&&s.includes('ld de,736'))).toBe(true);
  expect(code.some(s=>s.includes('FIRST_CELL equ 734')&&s.includes('ASSET_OFFSET equ 32'))).toBe(true);
  const folder=machine==='colecovision'?'coleco-colecovision':machine;
  for(const [name,retained] of Object.entries(captures)){
   const url=`/images/${machine}/patterns/character-quads/${name}.png`;const image=prose.locator(`img[src="${url}"]`);
   await image.scrollIntoViewIfNeeded();await expect.poll(()=>image.evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth>0)).toBe(true);
   const response=await page.request.get(url);expect(response.status()).toBe(200);
   const source=path.join(process.env.CODE_SAMPLES_PATH||'../code-samples',folder,'patterns/assembly/rendering/character-quads/verification',retained);
   expect(createHash('sha256').update(await response.body()).digest('hex')).toBe(createHash('sha256').update(readFileSync(source)).digest('hex'));
   const b=(await image.boundingBox())!;expect(b.x).toBeGreaterThanOrEqual(-1);expect(b.x+b.width).toBeLessThanOrEqual(page.viewportSize()!.width+1);
  }
  await expect(prose.getByRole('link',{name:"Prepared assets, callers and native evidence",exact:true})).toHaveAttribute('href',/\/tree\/[0-9a-f]{40}\//);
  const links=await prose.locator('a[href^="/"]').evaluateAll(ns=>[...new Set(ns.map(n=>n.getAttribute('href')!))]);
  for(const url of links)expect((await page.request.get(url)).status(),url).toBe(200);
  await page.setViewportSize({width:320,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  for(const name of Object.keys(captures)){
   const image=prose.locator(`img[src="/images/${machine}/patterns/character-quads/${name}.png"]`);await image.scrollIntoViewIfNeeded();const b=(await image.boundingBox())!;expect(b.x).toBeGreaterThanOrEqual(-1);expect(b.x+b.width).toBeLessThanOrEqual(321);
  }
  await page.goto(`/patterns/platform/${machine}/`);await page.getByLabel('Search patterns',{exact:true}).fill('large characters');await expect(page.locator(`[data-pattern]:visible a[href="${route(machine)}"]`)).toHaveCount(1);
 });
}

test('@built larger-character comparison and Maths links preserve their distinct grids',async({page})=>{
 await page.goto('/patterns/cross-platform/rendering/custom-glyphs/');const prose=page.locator('.pattern-prose');
 await expect(prose).toContainText('A 16×16 letter can be four ordinary 8×8 tiles');
 for(const machine of machines)await expect(prose.locator(`a[href="${route(machine)}#make-a-larger-character-from-four-tiles"]`)).toHaveCount(1);
 await page.goto('/craft/maths-for-games/unit-13/');await page.locator('main a[href="/patterns/cross-platform/rendering/custom-glyphs/#bigger-pictures-on-an-ordinary-character-grid"]').click();await expect(page).toHaveURL(/#bigger-pictures-on-an-ordinary-character-grid$/);
});
