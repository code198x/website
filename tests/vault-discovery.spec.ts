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
      const frame = document.querySelector('.vault-mast')!.getBoundingClientRect();
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
  await expect(page.locator('.vault-subjects a')).toHaveCount(23);
  await expect(page.locator('.vault-subjects a').first()).toBeVisible();
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
