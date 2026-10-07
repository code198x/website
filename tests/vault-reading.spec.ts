import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const routes = [
  ['colour-clash', '/vault/techniques/colour-clash/'],
  ['commando', '/vault/games/commando/'],
  ['sid', '/vault/hardware/sid-chip/'],
  ['techniques', '/vault/category/techniques/'],
  ['people', '/vault/category/people/'],
];
for (const [name, route] of routes) {
  test(`Vault reading layout: ${name}`, async ({ page }, testInfo) => {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('main h1')).toBeVisible();
    const figures = page.locator('.vault-opening-image img, .native-capture img, .category-feature img');
    for (const figure of await figures.all()) {
      await figure.scrollIntoViewIfNeeded();
      await expect.poll(() => figure.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
      const geometry = await figure.evaluate((image: HTMLImageElement) => {
        const box = image.getBoundingClientRect();
        const caption = image.parentElement?.querySelector('figcaption')?.getBoundingClientRect();
        return { width: box.width, left: box.left, right: box.right, viewport: innerWidth, native: image.naturalWidth, caption: caption?.width };
      });
      expect(geometry.width).toBe(Math.min(geometry.native, geometry.viewport));
      expect(geometry.left).toBeGreaterThanOrEqual(-1);
      expect(geometry.right).toBeLessThanOrEqual(geometry.viewport + 1);
      if (geometry.caption) expect(geometry.caption).toBeLessThanOrEqual(geometry.width);
    }
    const layout = await page.evaluate(() => ({ width: innerWidth, page: document.documentElement.scrollWidth }));
    expect(layout.page).toBeLessThanOrEqual(layout.width);
    if (route.includes('/category/')) {
      await expect(page.locator('[data-entry]')).not.toHaveCount(0);
    } else {
      await expect(page.locator('.vault-contents .toc-list a')).not.toHaveCount(0);
      await expect(page.locator('#article-status')).toBeAttached();
      if (testInfo.project.name === 'desktop') {
        const contents = await page.locator('.vault-contents').boundingBox();
        const details = await page.locator('.vault-sidebar').boundingBox();
        expect(details!.y - (contents!.y + contents!.height)).toBeCloseTo(28, 0);
      }
      if (testInfo.project.name === 'mobile') {
        const toc = page.locator('.vault-contents .toc-toggle');
        await toc.click();
        await expect(toc).toHaveAttribute('aria-expanded', 'true');
        await expect(page.locator('.vault-contents .toc-list a').first()).toBeVisible();
        await toc.click();
      }
    }
    const axe = await new AxeBuilder({ page }).include('main').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(axe.violations.map(v => `${v.id}: ${v.nodes.map(n => n.target).join(', ')}`)).toEqual([]);
    if (process.env.VAULT_REVIEW_PATH) {
      await mkdir(process.env.VAULT_REVIEW_PATH, { recursive: true });
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ scale: 'css', path: path.join(process.env.VAULT_REVIEW_PATH, `${name}-${testInfo.project.name}.png`) });
      await page.screenshot({ scale: 'css', path: path.join(process.env.VAULT_REVIEW_PATH, `${name}-${testInfo.project.name}-full.png`), fullPage: true });
      if (name === 'colour-clash') {
        await page.locator('#colour-by-the-cell').scrollIntoViewIfNeeded();
        await page.screenshot({ scale: 'css', path: path.join(process.env.VAULT_REVIEW_PATH, `reading-${testInfo.project.name}.png`) });
      }
    }
  });
}

test('category search and A–Z work together, reset, and survive navigation', async ({ page }) => {
  await page.goto('/vault/');
  const subjects = page.locator('[data-vault-subjects]');
  if (!(await subjects.evaluate((element: HTMLDetailsElement) => element.open))) await subjects.locator('summary').click();
  await page.locator('.vault-subjects a[href="/vault/category/techniques"]').click();
  const directory = page.locator('[data-vault-directory]');
  await expect(directory).toHaveAttribute('data-ready', 'true');
  const input = directory.getByRole('searchbox');
  const visible = directory.locator('[data-entry]:visible');
  await expect(visible.first()).toBeVisible();
  const all = await visible.count();
  expect(all).toBeGreaterThan(20);
  await input.fill('Arpeggio');
  await expect(visible).toHaveCount(1);
  await expect(visible.getByRole('link')).toContainText('Arpeggio');
  await directory.getByRole('button', { name: 'C', exact: true }).click();
  await expect(visible).toHaveCount(0);
  await expect(directory.getByText('No matching articles', { exact: true })).toBeVisible();
  await directory.getByRole('button', { name: 'show all techniques' }).click();
  await expect(input).toBeFocused();
  await expect(visible).toHaveCount(all);
  await directory.getByRole('button', { name: 'C', exact: true }).click();
  await expect(directory.getByRole('button', { name: 'C', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await input.fill('Colour Clash');
  await visible.getByRole('link', { name: 'Colour Clash', exact: true }).click();
  await expect(page.locator('.vault-contents .toc-list a')).not.toHaveCount(0);
  await page.goBack();
  await input.fill('zzzxqnonexistentsearch198x');
  await expect(directory.getByText('No matching articles', { exact: true })).toBeVisible();
  await input.press('Escape');
  await expect(input).toHaveValue('');
  await expect(visible).toHaveCount(all);
});

for (const width of [512, 600, 900]) {
  test(`article captures retain their width at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/vault/techniques/colour-clash/');
    const captures = page.locator('.vault-opening-image img, .native-capture img');
    await expect(captures).toHaveCount(3);
    for (const capture of await captures.all()) {
      await capture.scrollIntoViewIfNeeded();
      await expect.poll(() => capture.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBe(512);
      const box = await capture.boundingBox();
      expect(box!.width).toBe(512);
      expect(box!.x).toBeGreaterThanOrEqual(-1);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  });
}

test('article type respects a reader’s larger root font size', async ({ page }) => {
  await page.goto('/vault/techniques/colour-clash/');
  const sizes = await page.evaluate(() => {
    const title = document.querySelector('.vault-reading-header h1')!;
    const body = document.querySelector('.vault-entry .content p')!;
    const read = () => [title, body].map(element => parseFloat(getComputedStyle(element).fontSize));
    const before = read();
    const root = document.documentElement;
    root.style.fontSize = `${parseFloat(getComputedStyle(root).fontSize) * 1.25}px`;
    return { before, after: read() };
  });
  for (let index = 0; index < sizes.before.length; index++) expect(sizes.after[index]).toBeCloseTo(sizes.before[index] * 1.25, 1);
});
