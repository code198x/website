import { test, expect } from '@playwright/test';

test('Craft shows legal choices and keeps the paper activity reachable', async ({ page }) => {
  await page.goto('/craft/');
  const figure = page.locator('.counter-choices');
  await expect(figure).toBeVisible();
  await expect(figure.locator('.starting .counter')).toHaveCount(7);
  for (const take of [1, 2]) {
    const move = figure.locator(`[data-take="${take}"]`);
    const remaining = await move.locator('.counter').count();
    expect(remaining + take).toBe(7);
    await expect(move).toContainText(`${remaining} left for the other player`);
  }
  await expect(figure).toContainText('taking the last counter loses instead of wins');
  await figure.getByRole('link', { name: 'Try changing one rule' }).click();
  await expect(page.locator('#try-it')).toBeInViewport();
  await expect(page.locator('#try-it')).toContainText('whoever takes the last counter loses');
});

for (const theme of ['light', 'dark']) {
  test(`opening figures fit the page and remain readable without images in ${theme}`, async ({ page }) => {
    await page.addInitScript(theme => localStorage.setItem('theme', theme), theme);
    for (const route of ['/craft/']) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      const figure = page.locator('.counter-choices');
      const bounds = await figure.boundingBox();
      expect(bounds).not.toBeNull();
      const viewport = page.viewportSize()!;
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(viewport.width + 1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.addStyleTag({ content: 'main img { visibility: hidden !important; }' });
      await expect(figure.locator('figcaption')).toBeVisible();
      await expect(figure.getByRole('link')).toBeVisible();
    }
  });
}
