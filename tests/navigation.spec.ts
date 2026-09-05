import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });

test('mobile menu remains usable after client navigation and closes with Escape', async ({ page }) => {
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Toggle menu' });
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.locator('.nav-links').getByRole('link', { name: 'SYSTEMS', exact: true }).click();
  await expect(page).toHaveURL(/\/systems\/?$/);

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();

  await toggle.click();
  await page.locator('.nav-links').getByRole('link', { name: 'START HERE', exact: true }).click();
  await expect(page).toHaveURL(/\/start-here\/?$/);
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
});
