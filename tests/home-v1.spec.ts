import { test, expect } from '@playwright/test';

test('home page retains magazine headings, reading type and Code198x spot ink', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe('rgb(246, 244, 238)');
  expect(await page.locator('h1').first().evaluate((el) => getComputedStyle(el).fontFamily)).toMatch(/^"?Fira Sans Condensed/);
  expect(await page.locator('.feature-intro p').evaluate((el) => getComputedStyle(el).fontFamily)).toMatch(/^"?Nebula Sans/);
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--h-spot-ink').trim())).toBe('#a93800');
  const literata = await page.evaluate(() => [...document.querySelectorAll('*')].some((el) => getComputedStyle(el).fontFamily.includes('Literata')));
  expect(literata).toBe(false);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
});
