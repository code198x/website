import { test, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

for (const width of [1504, 1280, 512, 390, 320]) {
  test(`Vault stays within the site frame at ${width}px`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Explicit desktop viewport matrix');
    const imageFailures: string[] = [];
    page.on('requestfailed', request => { if (request.resourceType() === 'image') imageFailures.push(`${request.url()}: ${request.failure()?.errorText}`); });
    page.on('response', response => { if (response.request().resourceType() === 'image' && !response.ok()) imageFailures.push(`${response.url()}: HTTP ${response.status()}`); });
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/vault/');
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({ content: 'astro-dev-toolbar { display: none !important; }' });
    await expect(page.locator('.vault-story-action')).toBeVisible();
    for (const capture of await page.locator('.vault-captures img').all()) {
      await capture.scrollIntoViewIfNeeded();
      await expect.poll(() => capture.evaluate((image: HTMLImageElement) => image.naturalWidth), { message: `Capture must load: ${await capture.getAttribute('src')}; ${imageFailures.join('; ')}` }).toBeGreaterThan(0);
    }
    await page.evaluate(() => scrollTo(0, 0));
    const geometry = await page.evaluate(() => {
      const frame = document.querySelector('.vault-atlas .band-below')!.getBoundingClientRect();
      const header = document.querySelector('.site-bar')!.getBoundingClientRect();
      return {
        viewport: innerWidth, document: document.documentElement.scrollWidth,
        frameLeft: frame.left, frameRight: frame.right,
        headerLeft: header.left, headerRight: header.right,
        overflow: [...document.querySelectorAll<HTMLElement>('body *')].filter(element => element.getBoundingClientRect().right > innerWidth + 1).map(element => ({ tag: element.tagName, class: element.className, right: element.getBoundingClientRect().right })),
        headerDetails: [...document.querySelectorAll<HTMLElement>('.site-bar, .site-bar > *, .wordmark img')].map(element => ({ class: element.className, width: element.getBoundingClientRect().width, flex: getComputedStyle(element).flex, min: getComputedStyle(element).minWidth, gap: getComputedStyle(element).gap })),
        captures: [...document.querySelectorAll<HTMLImageElement>('.vault-captures img')].map(image => ({
          width: image.getBoundingClientRect().width,
          native: image.naturalWidth,
          left: image.getBoundingClientRect().left,
          right: image.getBoundingClientRect().right,
          caption: image.nextElementSibling!.getBoundingClientRect().width,
        })),
      };
    });
    expect(geometry.document, JSON.stringify({overflow: geometry.overflow, header: geometry.headerDetails})).toBeLessThanOrEqual(geometry.viewport);
    expect(Math.abs(geometry.frameLeft - geometry.headerLeft)).toBeLessThanOrEqual(2);
    expect(Math.abs(geometry.frameRight - geometry.headerRight)).toBeLessThanOrEqual(2);
    expect(geometry.captures.length).toBeGreaterThan(0);
    for (const capture of geometry.captures) {
      expect(capture.native).toBeGreaterThan(0);
      if (width >= capture.native) expect(capture.width).toBe(capture.native);
      else expect(capture.width).toBeLessThanOrEqual(width);
      expect(capture.left).toBeGreaterThanOrEqual(0);
      expect(capture.right).toBeLessThanOrEqual(width);
      expect(capture.caption).toBeLessThanOrEqual(capture.width);
    }
    await expect(page.locator('.vault-connections li')).toHaveCount(4);
    if (process.env.VAULT_REVIEW_PATH) {
      await mkdir(process.env.VAULT_REVIEW_PATH, { recursive: true });
      await writeFile(path.join(process.env.VAULT_REVIEW_PATH, `${width}.json`), JSON.stringify(geometry, null, 2));
      await page.screenshot({ path: path.join(process.env.VAULT_REVIEW_PATH, `${width}.png`), fullPage: true });
      if (width === 1504) await page.screenshot({ path: path.join(process.env.VAULT_REVIEW_PATH, 'opening.png') });
    }
  });
}

test('Vault subject directory remains available on a phone', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Touch-device behaviour');
  await page.goto('/vault/');
  await expect(page.locator('[data-vault-subjects]')).not.toHaveAttribute('open');
  await page.locator('.vault-subjects summary').click();
  // Every subject the Vault counts is in the directory; the count comes from the
  // page's own "N articles / N subjects" line, so a new subject doesn't break this.
  const stated = Number((await page.locator('.opening-tools p').first().innerText()).match(/(\d+) subjects/)![1]);
  expect(stated).toBeGreaterThan(0);
  await expect(page.locator('.vault-subjects li a')).toHaveCount(stated);
  await expect(page.locator('.vault-subjects li a').first()).toBeVisible();
  await page.locator('.vault-subjects summary').click();
  await page.locator('.vault-story-action').click();
  await expect(page).toHaveURL(/\/vault\/games\/commando\/?$/);
  await expect(page.locator('main h1')).toHaveText('Commando');
});

test('Vault component preview renders the shared discovery components', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Development component preview');
  await page.goto('/catalogue/vault-discovery/');
  await expect(page.locator('main h1')).toHaveText('Vault discovery components');
  await expect(page.locator('.vault-story-action')).toBeVisible();
  await expect(page.locator('.vault-connections li')).toHaveCount(4);
  await expect(page.locator('.vault-captures img')).toHaveCount(2);
});

const editorialPaths = [
  {
    id: 'records-composers-publishers',
    entrance: '/vault/games/xenon-2/',
    directArrival: '/vault/companies/bitmap-brothers/',
    hops: [
      ['/vault/games/xenon-2/', '/vault/people/david-whittaker/'],
      ['/vault/games/xenon-2/', '/vault/companies/bitmap-brothers/'],
      ['/vault/companies/bitmap-brothers/', '/vault/companies/renegade/'],
      ['/vault/companies/renegade/', '/vault/phenomena/record-companies-in-software/'],
    ],
  },
  {
    id: 'software-across-borders',
    entrance: '/vault/culture/the-c64-across-borders/',
    directArrival: '/vault/magazines/bajtek/',
    hops: [
      ['/vault/culture/the-c64-across-borders/', '/vault/magazines/bajtek/'],
      ['/vault/magazines/bajtek/', '/vault/culture/software-crossed-what-machines-could-not/'],
      ['/vault/culture/the-c64-across-borders/', '/vault/culture/brazilian-market-reserve/'],
      ['/vault/culture/brazilian-market-reserve/', '/vault/culture/brazil-gaming/'],
      ['/vault/culture/brazilian-market-reserve/', '/vault/culture/spectrum-clones/'],
      ['/vault/culture/spectrum-clones/', '/vault/culture/soviet-computing/'],
    ],
  },
];

for (const { id, entrance, directArrival, hops } of editorialPaths) {
  test(`Vault reading path: ${id}`, async ({ page }) => {
    await page.goto('/vault/');
    await expect(page.getByRole('searchbox', { name: 'Search article titles' })).toBeVisible();
    const starts = page.getByRole('region', { name: 'Reading paths.' });
    await expect(starts.getByRole('link')).toHaveCount(2);
    const start = starts.locator(`[data-reading-path="${id}"] a`);
    await expect(start).toHaveAttribute('href', entrance);
    await start.click();
    await expect.poll(() => new URL(page.url()).pathname).toBe(entrance);

    for (const [from, to] of hops) {
      // Fresh loads ensure the middle article works without arriving from the index.
      if (from === directArrival || new URL(page.url()).pathname !== from) {
        expect((await page.goto(from))?.ok()).toBe(true);
      }
      const steps = page.getByRole('region', { name: 'Follow the connections.' });
      const next = steps.locator(`a[href="${to}"]`);
      await expect(next).toBeVisible();
      await next.click();
      await expect.poll(() => new URL(page.url()).pathname).toBe(to);
      await expect(page.locator('main h1')).toBeVisible();
    }
  });
}
