import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {test,expect} from '@playwright/test';
const entries = [{"lang": "assembly", "title": "Give an Atari XL turn a VBI-clock deadline", "files": ["atari-800xl/patterns/assembly/framework/turn-deadline/demo.asm", "cross-platform/patterns/framework/elapsed-deadline/6502.inc", "atari-800xl/patterns/assembly/framework/turn-deadline/clock.inc", "atari-800xl/patterns/assembly/framework/turn-deadline/input.inc", "atari-800xl/patterns/assembly/framework/turn-deadline/dispatch.inc", "atari-800xl/patterns/assembly/framework/turn-deadline/caller.inc", "atari-800xl/patterns/assembly/framework/turn-deadline/customise.asm", "atari-800xl/patterns/assembly/framework/turn-deadline/mistakes/reset-baseline.inc"]}];
for (const entry of entries) test(entry.title, async ({page}, info) => {
 const root=process.env.CODE_SAMPLES_PATH||'../code-samples';
 const route=`/patterns/atari-800/${entry.lang}/framework/turn-deadline/`;
 await page.goto(route);
 const prose=page.locator('.pattern-prose');
 await expect(prose.locator('.lesson-listing').first()).toBeVisible();
 await expect(page.locator('.code-error')).toHaveCount(0);
 const code=await prose.locator('.lesson-listing').evaluateAll(ns=>ns.map(n=>n.getAttribute('data-code')));
 for(const file of entry.files) expect(code,file).toContain(readFileSync(path.join(root,file),'utf8'));
 for(const name of ['working','wrong']) {
  const url=`/images/patterns/atari-800xl/${entry.lang}-deadline-${name}.png`;
  const img=prose.locator(`img[src="${url}"]`); await img.scrollIntoViewIfNeeded();
  await expect.poll(()=>img.evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth>0)).toBe(true);
  const response=await page.request.get(url); expect(response.status()).toBe(200);
  const native=`${name}.png`;
  expect(createHash('sha256').update(await response.body()).digest('hex')).toBe(createHash('sha256').update(readFileSync(path.join(root,`atari-800xl/patterns/${entry.lang}/framework/turn-deadline/verification`,native))).digest('hex'));
 }
 for(const href of await prose.locator('a[href^="/"]').evaluateAll(ns=>[...new Set(ns.map(n=>n.getAttribute('href')!))])) expect((await page.request.get(href)).status(),href).toBe(200);
 const sources=await prose.locator('a[href*="github.com/code198x/code-samples/"]').evaluateAll(ns=>ns.map(n=>n.getAttribute('href')!));
 expect(sources.length).toBeGreaterThanOrEqual(2); for(const href of sources) expect(href).toMatch(/\/(?:tree|blob)\/[a-f0-9]{40}\//);
 await page.evaluate(()=>scrollTo(0,0)); await page.screenshot({path:info.outputPath('opening.png')});
 await prose.locator('.lesson-listing').first().scrollIntoViewIfNeeded(); await page.screenshot({path:info.outputPath('routine.png')});
 await page.setViewportSize({width:320,height:900}); expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
 await page.goto('/patterns/platform/atari-800/'); await page.getByLabel('Search patterns',{exact:true}).fill(entry.title);
 await expect(page.locator(`[data-pattern]:visible a[href="${route}"]`)).toHaveCount(1);
});
