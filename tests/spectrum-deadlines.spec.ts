import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {test,expect} from '@playwright/test';
const entries = [{"lang": "assembly", "title": "Give a Spectrum Z80 turn a deadline", "files": ["sinclair-zx-spectrum/patterns/assembly/framework/turn-deadline/demo.asm", "cross-platform/patterns/framework/elapsed-deadline/z80.inc", "sinclair-zx-spectrum/patterns/assembly/framework/turn-deadline/clock.inc", "sinclair-zx-spectrum/patterns/assembly/framework/turn-deadline/input.inc", "sinclair-zx-spectrum/patterns/assembly/framework/turn-deadline/dispatch.inc", "sinclair-zx-spectrum/patterns/assembly/framework/turn-deadline/caller.inc", "sinclair-zx-spectrum/patterns/assembly/framework/turn-deadline/customise.asm", "sinclair-zx-spectrum/patterns/assembly/framework/turn-deadline/mistakes/reset-baseline.inc", "sinclair-zx-spectrum/patterns/assembly/framework/turn-deadline/no-entry.asm"]}, {"lang": "basic", "title": "Give a Spectrum BASIC turn a deadline", "files": ["sinclair-zx-spectrum/patterns/basic/framework/turn-deadline/caller.bas", "sinclair-zx-spectrum/patterns/basic/framework/turn-deadline/routines.bas", "sinclair-zx-spectrum/patterns/basic/framework/turn-deadline/clock.bas", "sinclair-zx-spectrum/patterns/basic/framework/turn-deadline/input.bas", "sinclair-zx-spectrum/patterns/basic/framework/turn-deadline/dispatch.bas", "sinclair-zx-spectrum/patterns/basic/framework/turn-deadline/presentation.bas", "sinclair-zx-spectrum/patterns/basic/framework/turn-deadline/monitor.bas", "sinclair-zx-spectrum/patterns/basic/framework/turn-deadline/customise.bas", "sinclair-zx-spectrum/patterns/basic/framework/turn-deadline/mistakes/reset-baseline.bas"]}];
for (const entry of entries) test(entry.title, async ({page}, info) => {
 const root=process.env.CODE_SAMPLES_PATH||'../code-samples';
 const route=`/patterns/sinclair-zx-spectrum/${entry.lang}/framework/turn-deadline/`;
 await page.goto(route);
 const prose=page.locator('.pattern-prose');
 await expect(prose.locator('.lesson-listing').first()).toBeVisible();
 await expect(page.locator('.code-error')).toHaveCount(0);
 const code=await prose.locator('.lesson-listing').evaluateAll(ns=>ns.map(n=>n.getAttribute('data-code')));
 for(const file of entry.files) expect(code,file).toContain(readFileSync(path.join(root,file),'utf8'));
 for(const name of ['working','wrong']) {
  const url=`/images/patterns/sinclair-zx-spectrum/${entry.lang}-deadline-${name}.png`;
  const img=prose.locator(`img[src="${url}"]`); await img.scrollIntoViewIfNeeded();
  await expect.poll(()=>img.evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth>0)).toBe(true);
  const response=await page.request.get(url); expect(response.status()).toBe(200);
  const native=`${name}.png`;
  expect(createHash('sha256').update(await response.body()).digest('hex')).toBe(createHash('sha256').update(readFileSync(path.join(root,`sinclair-zx-spectrum/patterns/${entry.lang}/framework/turn-deadline/verification`,native))).digest('hex'));
 }
 for(const href of await prose.locator('a[href^="/"]').evaluateAll(ns=>[...new Set(ns.map(n=>n.getAttribute('href')!))])) expect((await page.request.get(href)).status(),href).toBe(200);
 const sources=await prose.locator('a[href*="github.com/code198x/code-samples/"]').evaluateAll(ns=>ns.map(n=>n.getAttribute('href')!));
 expect(sources.length).toBeGreaterThanOrEqual(2); for(const href of sources) expect(href).toMatch(/\/(?:tree|blob)\/[a-f0-9]{40}\//);
 await page.evaluate(()=>scrollTo(0,0)); await page.screenshot({path:info.outputPath('opening.png')});
 await prose.locator('.lesson-listing').first().scrollIntoViewIfNeeded(); await page.screenshot({path:info.outputPath('routine.png')});
 await page.setViewportSize({width:320,height:900}); expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
 await page.goto('/patterns/platform/sinclair-zx-spectrum/'); await page.getByLabel('Search patterns',{exact:true}).fill(entry.title);
 await expect(page.locator(`[data-pattern]:visible a[href="${route}"]`)).toHaveCount(1);
});
