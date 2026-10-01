import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });

test('mobile menu remains usable after client navigation and closes with Escape', async ({ page }) => {
  await page.goto('/');
  const toggle = page.getByRole('banner').getByRole('button', { name: 'Menu', exact: true });
  const menu = page.locator('.site-menu');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  // The page behind the open menu is out of reach.
  await expect(page.locator('main')).toHaveJSProperty('inert', true);
  await menu.getByRole('link', { name: 'SYSTEMS', exact: true }).click();
  await expect(page).toHaveURL(/\/systems\/?$/);
  await expect(page.locator('main')).toHaveJSProperty('inert', false);

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  // The section the reader is in is marked current, in the menu as in the bar.
  await expect(menu.getByRole('link', { name: 'SYSTEMS', exact: true })).toHaveAttribute('aria-current', 'page');
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
  await expect(menu).toBeHidden();

  await toggle.click();
  await menu.getByRole('link', { name: 'START HERE', exact: true }).click();
  await expect(page).toHaveURL(/\/start-here\/?$/);
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
});
