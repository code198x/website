import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import {test, expect} from '@playwright/test';

const machines = [
  ['sinclair-zx-spectrum', '63 positive native calls'],
  ['bbc-micro', '63 positive native calls'],
  ['dragon-32', '63 positive native calls'],
  ['amstrad-cpc', '79 positive native calls'],
] as const;
const captures = {
  customise: 'customise-startup.png',
  'wrong-break': 'break-fault-break-fault.png',
  'fixed-break': 'break-fixed-break-fixed.png',
};

for (const [machine, evidence] of machines) {
  test(`@built ${machine} supplies usable bounded text layout and diagnostics`, async ({page}) => {
    await page.goto(`/patterns/${machine}/assembly/rendering/text-layout/`);
    const prose = page.locator('.pattern-prose');
    await expect(page.locator('.code-error')).toHaveCount(0);
    await expect(prose).toContainText(evidence);
    await expect(prose).toContainText('2,040');
    await expect(prose).toContainText('before drawing');
    await expect(prose).toContainText('split at the cell limit');
    await expect(prose.getByRole('heading', {name: 'Make it your own', exact: true})).toHaveCount(1);
    await expect(prose.getByRole('heading', {name: 'Common mistakes and their symptoms', exact: true})).toHaveCount(1);
    await expect(prose.locator('code').filter({hasText: 'layout_block'}).first()).toBeVisible();
    const wordComponent = prose.locator('details').filter({has: page.getByText('Read the reusable word-aware component', {exact:true})});
    await expect(wordComponent).toHaveCount(1);
    await wordComponent.locator('summary').click();
    await expect(wordComponent.locator('code')).toContainText('layout_measure');
    await expect(wordComponent.locator('code')).toContainText('layout_reject');
    await expect(wordComponent.locator('code')).toContainText('l_break_i');
    await expect(prose.getByRole('heading', {name:'Keep words together',exact:true})).toHaveCount(1);
    for (const [name, retained] of Object.entries(captures)) {
      const url = `/images/${machine}/patterns/word-wrap/${name}.png`;
      const image = prose.locator(`img[src="${url}"]`);
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
      const response = await page.request.get(url);
      expect(response.status()).toBe(200);
      const source = path.join(process.env.CODE_SAMPLES_PATH || '../code-samples', machine, 'patterns/assembly/rendering/word-wrap/verification', retained);
      expect(createHash('sha256').update(await response.body()).digest('hex')).toBe(createHash('sha256').update(readFileSync(source)).digest('hex'));
    }
    const links = await prose.locator('a[href^="/"]').evaluateAll(nodes => [...new Set(nodes.map(n => n.getAttribute('href')!))]);
    expect(links.length).toBeGreaterThan(3);
    for (const link of links) expect((await page.request.get(link)).status(), link).toBe(200);
    for (const width of [1440, 320]) {
      await page.setViewportSize({width, height: 900});
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    }
    for (const colorScheme of ['light', 'dark'] as const) {
      await page.emulateMedia({colorScheme, reducedMotion: 'reduce'});
      expect((await new AxeBuilder({page}).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
    }
    await page.goto(`/patterns/platform/${machine}/`);
    await expect(page.locator(`[data-pattern] a[href="/patterns/${machine}/assembly/rendering/text-layout/"]`)).toHaveCount(1);
    await page.getByLabel('Search patterns', {exact:true}).fill('word');
    await expect(page.locator(`[data-pattern]:visible a[href="/patterns/${machine}/assembly/rendering/text-layout/"]`)).toHaveCount(1);
  });
}

test('@built text layout comparison leads to four implementations and Maths', async ({page}) => {
  await page.goto('/patterns/cross-platform/rendering/text-layout/');
  const prose = page.locator('.pattern-prose');
  for (const [machine] of machines) await expect(prose.locator(`a[href="/patterns/${machine}/assembly/rendering/text-layout/"]`)).toHaveCount(1);
  for (const unit of ['06', '13']) {
    await prose.locator(`a[href="/craft/maths-for-games/unit-${unit}/"]`).first().click();
    await expect(page).toHaveURL(new RegExp(`/craft/maths-for-games/unit-${unit}/$`));
    const back = page.locator('main a[href="/patterns/cross-platform/rendering/text-layout/#keep-words-together"]').first();
    await expect(back).toBeVisible();
    await back.click();
    await expect(page).toHaveURL(/\/patterns\/cross-platform\/rendering\/text-layout\/#keep-words-together$/);
  }
});
