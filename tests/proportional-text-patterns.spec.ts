import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import {test, expect} from '@playwright/test';

const machines = [
  ['sinclair-zx-spectrum', '88 positive native calls'],
  ['bbc-micro', '88 positive native calls'],
  ['dragon-32', '88 positive native calls'],
  ['amstrad-cpc', '104 positive native calls'],
] as const;
const captures = {
  opening: 'positive-startup.png',
  customise: 'customise-startup.png',
  'wrong-advance': 'advance-fault-advance-fault.png',
  'fixed-advance': 'advance-fixed-advance-fixed.png',
};

for (const [machine, evidence] of machines) {
  test(`@built ${machine} supplies usable proportional text and matching diagnostics`, async ({page}) => {
    await page.goto(`/patterns/${machine}/assembly/rendering/text-layout/`);
    const prose = page.locator('.pattern-prose');
    await expect(page.locator('.code-error')).toHaveCount(0);
    await expect(prose).toContainText(evidence);
    await expect(prose).toContainText('2,040');
    await expect(prose).toContainText('before drawing');
    await expect(prose).toContainText('Measurement now reads the string, fallback and widths.');
    await expect(prose).toContainText('80 bytes for TL');
    await expect(prose).toContainText('32 pixels at spacing 1 and 39 at spacing 2');
    await expect(prose.getByRole('heading', {name: 'Make it your own', exact: true})).toHaveCount(1);
    await expect(prose.getByRole('heading', {name: 'Common mistakes and their symptoms', exact: true})).toHaveCount(1);
    await expect(prose.locator('code').filter({hasText: 'layout_block'}).first()).toBeVisible();
    await prose.locator('details summary').last().click();
    await expect(prose.locator('details code').last()).toContainText('layout_measure');
    await expect(prose.locator('details code').last()).toContainText('layout_reject');
    await expect(prose.locator('details code').last()).toContainText('layout_glyph_advance');
    await expect(prose.locator('details code').last()).toContainText('layout_validate_metric');
    await expect(prose.getByRole('heading', {name:'Give narrow letters less room',exact:true})).toHaveCount(1);
    for (const [name, retained] of Object.entries(captures)) {
      const url = `/images/${machine}/patterns/proportional-text/${name}.png`;
      const image = prose.locator(`img[src="${url}"]`);
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
      const response = await page.request.get(url);
      expect(response.status()).toBe(200);
      const source = path.join(process.env.CODE_SAMPLES_PATH || '../code-samples', machine, 'patterns/assembly/rendering/proportional-text/verification', retained);
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
    await page.getByLabel('Search patterns', {exact:true}).fill('proportional');
    await expect(page.locator(`[data-pattern]:visible a[href="/patterns/${machine}/assembly/rendering/text-layout/"]`)).toHaveCount(1);
  });
}

test('@built text layout comparison leads to four implementations and Maths', async ({page}) => {
  await page.goto('/patterns/cross-platform/rendering/text-layout/');
  const prose = page.locator('.pattern-prose');
  for (const [machine] of machines) await expect(prose.locator(`a[href="/patterns/${machine}/assembly/rendering/text-layout/"]`)).toHaveCount(1);
  for (const unit of ['06', '13']) {
    await prose.locator(`a[href="/craft/maths-for-games/unit-${unit}/"]`).last().click();
    await expect(page).toHaveURL(new RegExp(`/craft/maths-for-games/unit-${unit}/$`));
    const back = page.locator('main a[href="/patterns/cross-platform/rendering/text-layout/#give-narrow-letters-less-room"]').first();
    await expect(back).toBeVisible();
    await back.click();
    await expect(page).toHaveURL(/\/patterns\/cross-platform\/rendering\/text-layout\/#give-narrow-letters-less-room$/);
  }
});
