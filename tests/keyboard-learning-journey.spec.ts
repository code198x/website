import { test, expect, type Page, type Locator } from '@playwright/test';

async function tabTo(page: Page, target: Locator, backwards = false) {
  for (let i = 0; i < 150; i++) {
    await page.keyboard.press(backwards ? 'Shift+Tab' : 'Tab');
    if (await target.evaluate((element) => element === document.activeElement)) return;
  }
  throw new Error(`Keyboard could not reach ${await target.getAttribute('href')}`);
}

test('keyboard journey keeps module links visibly focused and reaches the first lesson', async ({ page }) => {
  await page.goto('/start-here/');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-to-content')).toBeFocused();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => Boolean(document.activeElement?.closest('main')))).toBe(true);

  const foundations = page.locator('main a[href="/foundations/"]').first();
  await tabTo(page, foundations);
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/foundations\/?$/);

  const module = page.locator('main a[href="/foundations/counting-in-twos"]');
  await tabTo(page, module);
  await expect(module).toHaveCSS('outline-style', 'solid');
  await expect(module).toHaveCSS('outline-width', '2px');
  await expect(module).not.toHaveCSS('outline-color', 'rgba(0, 0, 0, 0)');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/foundations\/counting-in-twos\/?$/);

  const lesson = page.locator('main a[href="/foundations/counting-in-twos/unit-01"]').first();
  await tabTo(page, lesson);
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/foundations\/counting-in-twos\/unit-01\/?$/);
  await expect(page.locator('h1')).toHaveText('Ten Fingers, Two Wires');
});

test('keyboard menu closes, releases the page and works after navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/start-here/');
  const toggle = page.getByRole('button', { name: 'Menu', exact: true });
  await tabTo(page, toggle);
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toHaveJSProperty('inert', true);
  const systems = page.locator('.site-menu a[href="/systems"]');
  await tabTo(page, systems);
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  await expect(page.locator('.site-menu')).toBeHidden();
  await expect(page.locator('main')).toHaveJSProperty('inert', false);
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => Boolean(document.activeElement?.closest('.site-menu')))).toBe(false);
  await tabTo(page, toggle, true);
  await page.keyboard.press('Space');
  await tabTo(page, systems);
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/systems\/?$/);
  await expect(page.locator('main')).toHaveJSProperty('inert', false);
  await tabTo(page, toggle);
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
});
