import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {test, expect} from '@playwright/test';

for (const machine of ['acorn-atom', 'amstrad-cpc']) {
  test(`${machine} offers callable turns, customisation and a diagnosed reset fault`, async ({page}) => {
    const route = `/patterns/${machine}/basic/framework/command-loop/`;
    await page.goto(route);
    const prose = page.locator('.pattern-prose');
    await expect(page.locator('.code-error')).toHaveCount(0);
    // Reader sees exactly the maintained sources, including the separate fault.
    const source = path.join(process.env.CODE_SAMPLES_PATH || '../code-samples', machine, 'patterns/basic/framework/command-loop');
    const listings = await prose.locator('.lesson-listing').evaluateAll(ns => ns.map(n => n.getAttribute('data-code')));
    for (const file of ['caller.bas','routines.bas','customise.bas','mistakes/reset-each-turn.bas']) {
      expect(listings).toContain(readFileSync(path.join(source,file),'utf8'));
    }
    await expect(prose.getByRole('heading',{name:'The reusable routine',exact:true})).toBeVisible();
    await expect(prose).toContainText('one numbered program');
    await expect(prose).toContainText('BASIC globals');
    await expect(prose).toContainText('120 native frames');
    for (const [publicName, nativeName] of Object.entries({working:'default-action-2', 'step-two':'step-two-action-2', 'reset-mistake':'reset-mistake-action-2'})) {
      const url = `/images/${machine}/patterns/command-loop/${publicName}.png`;
      const img = prose.locator(`img[src="${url}"]`);
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
      const response = await page.request.get(url);
      expect(response.status()).toBe(200);
      expect(createHash('sha256').update(await response.body()).digest('hex')).toBe(createHash('sha256').update(readFileSync(path.join(source,'verification/reusable',nativeName+'.png'))).digest('hex'));
    }
    const links = await prose.locator('a[href^="/"]').evaluateAll(ns => [...new Set(ns.map(n => n.getAttribute('href')!))]);
    for (const url of links) expect((await page.request.get(url)).status(),url).toBe(200);
    await page.setViewportSize({width:320,height:900});
    expect(await page.evaluate(() => document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
    for (const img of await prose.locator('img').all()) {
      await img.scrollIntoViewIfNeeded(); const box=(await img.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(-1); expect(box.x+box.width).toBeLessThanOrEqual(321);
    }
    await page.goto(`/patterns/platform/${machine}/`);
    await page.getByLabel('Search patterns',{exact:true}).fill('command');
    await expect(page.locator(`[data-pattern]:visible a[href="${route}"]`)).toHaveCount(1);
    await page.goto('/patterns/cross-platform/framework/game-loop-choices/');
    await expect(page.locator(`.pattern-prose a[href="${route}"]`)).toHaveCount(1);
  });
}
