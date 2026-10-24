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
  await menu.getByRole('link', { name: 'Systems', exact: true }).click();
  await expect(page).toHaveURL(/\/systems\/?$/);
  await expect(page.locator('main')).toHaveJSProperty('inert', false);

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  // The section the reader is in is marked current, in the menu as in the bar.
  await expect(menu.getByRole('link', { name: 'Systems', exact: true })).toHaveAttribute('aria-current', 'page');
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
  await expect(menu).toBeHidden();

  await toggle.click();
  await menu.getByRole('link', { name: 'Start here', exact: true }).click();
  await expect(page).toHaveURL(/\/start-here\/?$/);
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
});

// At every width either the nav links show or the menu button opens a menu
// whose links can be reached; the two switch over at the same breakpoint.
for (const width of [1280, 1101, 1100, 1000, 900, 861, 860, 600]) {
  test(`the site can be navigated at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/about/');
    const bar = page.getByRole('banner');
    const toggle = bar.getByRole('button', { name: 'Menu', exact: true });
    if (await toggle.isVisible()) {
      await toggle.click();
      await expect(page.locator('.site-menu').getByRole('link', { name: 'Systems', exact: true })).toBeVisible();
    } else {
      await expect(bar.locator('.nav-links').getByRole('link', { name: 'Systems', exact: true })).toBeVisible();
    }
  });
}

// The open menu sits under the bar, so the bar's button can close it again.
for (const width of [390, 1000]) {
  test(`the menu button closes the open menu at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/about/');
    const toggle = page.getByRole('banner').getByRole('button', { name: 'Menu', exact: true });
    await toggle.click();
    await expect(page.locator('.site-menu').getByRole('link', { name: 'Systems', exact: true })).toBeVisible();
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('.site-menu')).toBeHidden();
  });
}
