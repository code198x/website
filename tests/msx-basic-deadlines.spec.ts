import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {test,expect} from '@playwright/test';

test("Give an MSX BASIC turn a deadline",async({page},info)=>{
 const route="/patterns/msx/basic/framework/turn-deadline/";const own="msx/patterns/basic/framework/turn-deadline";const root=process.env.CODE_SAMPLES_PATH||'../code-samples';
 await page.goto(route);const prose=page.locator('.pattern-prose');await expect(page.locator('.code-error')).toHaveCount(0);
 for(const text of ["TIME", "1,055", "199 bytes", "77 bytes", "double-precision"])await expect(prose).toContainText(text);
 const code=await prose.locator('.lesson-listing').evaluateAll(ns=>ns.map(n=>n.getAttribute('data-code')));
 for(const file of ["msx/patterns/basic/framework/turn-deadline/caller.bas", "msx/patterns/basic/framework/turn-deadline/clock.bas", "msx/patterns/basic/framework/turn-deadline/presentation.bas", "msx/patterns/basic/framework/turn-deadline/customise.bas", "msx/patterns/basic/framework/turn-deadline/mistakes/reset-baseline.bas", "dragon-32/patterns/basic/framework/turn-deadline/routines.bas"])expect(code,file).toContain(readFileSync(path.join(root,file),'utf8'));
 for(const name of ['working','wrong']){
  const url=`/images/patterns/msx/basic-deadline-${name}.png`;const img=prose.locator(`img[src="${url}"]`);await img.scrollIntoViewIfNeeded();await expect.poll(()=>img.evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth>0)).toBe(true);
  const r=await page.request.get(url);expect(r.status()).toBe(200);expect(createHash('sha256').update(await r.body()).digest('hex')).toBe(createHash('sha256').update(readFileSync(path.join(root,own,`verification/${name}-expiry.png`))).digest('hex'));
 }
 for(const href of await prose.locator('a[href^="/"]').evaluateAll(ns=>[...new Set(ns.map(n=>n.getAttribute('href')!))]))expect((await page.request.get(href)).status(),href).toBe(200);
 const links=await prose.locator('a[href*="github.com/code198x/code-samples/"]').evaluateAll(ns=>ns.map(n=>n.getAttribute('href')!));expect(links.length).toBeGreaterThanOrEqual(2);for(const href of links)expect(href).toMatch(/\/(?:tree|blob)\/[a-f0-9]{40}\//);
 await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:info.outputPath('opening.png')});
 await page.setViewportSize({width:320,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
 await page.goto('/patterns/platform/msx/');await page.getByLabel('Search patterns',{exact:true}).fill("Give an MSX BASIC turn a deadline");await expect(page.locator(`[data-pattern]:visible a[href="${route}"]`)).toHaveCount(1);
});
