import { test, expect } from '@playwright/test';

test('Vault opens with full-bleed illustrative collage and live title', async ({ page }, testInfo) => {
  await page.goto('/vault/');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('main h1')).toHaveCount(1);
  await expect(page.locator('main h1')).toHaveText('The Vault.');
  const image = page.locator('.collage-stage img');
  await image.evaluate((element: HTMLImageElement) => element.decode());
  const source = await image.evaluate((element: HTMLImageElement) => element.currentSrc);
  expect(source).toContain(testInfo.project.name === 'mobile' ? 'portrait-' : 'landscape-');
  const geometry = await page.locator('.collage-stage').evaluate(element => {
    const box = element.getBoundingClientRect();
    return { left: box.left, right: box.right, viewport: innerWidth };
  });
  expect(Math.abs(geometry.left)).toBeLessThanOrEqual(1);
  expect(Math.abs(geometry.right - geometry.viewport)).toBeLessThanOrEqual(1);
  await expect(page.locator('.collage-caption')).toContainText('Original AI-generated illustration');
  await expect(page.locator('.constellation-node, .constellation-lines, .constellation-reading')).toHaveCount(0);
});

test('Vault search remains directly reachable after the collage', async ({ page }) => {
  await page.goto('/vault/');
  await page.getByRole('link', { name: 'Search the Vault', exact: true }).click();
  const search = page.getByRole('searchbox', { name: 'Search article titles' });
  await expect(search).toBeInViewport();
  await search.fill('zzzz-no-such-title');
  await expect(page.locator('.vault-search-status')).toContainText('No matching titles');
  await search.fill('Rob Hubbard');
  await expect(page.locator('#vault-results').getByRole('link', { name: /Rob Hubbard/ })).toHaveAttribute('href', '/vault/people/rob-hubbard');
  await page.getByRole('button', { name: 'Clear', exact: true }).click();
  await expect(search).toBeFocused();
  await expect(search).toHaveValue('');
  await expect(page.locator('#vault-results')).toBeHidden();
});

test('Collage title and search remain usable without artwork and with enlarged text', async ({ page }) => {
  await page.route('**/images/vault-opening/**', route => route.abort());
  await page.goto('/vault/');
  const before = await page.locator('.collage-caption').evaluate(element => parseFloat(getComputedStyle(element).fontSize));
  await page.addStyleTag({ content: 'html { font-size: 150% !important; }' });
  await expect(page.locator('main h1')).toBeVisible();
  const after = await page.locator('.collage-caption').evaluate(element => parseFloat(getComputedStyle(element).fontSize));
  expect(after).toBeGreaterThan(before * 1.4);
  await page.getByRole('link', { name: 'Search the Vault', exact: true }).click();
  await expect(page.getByRole('searchbox', { name: 'Search article titles' })).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(await page.evaluate(() => innerWidth));
});
