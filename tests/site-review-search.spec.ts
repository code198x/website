import { test, expect } from '@playwright/test';

test('global search can find Asm198x, follow a result and reopen after navigation', async ({ page }, testInfo) => {
  const warnings: string[] = [];
  page.on('console', message => { if (['warning', 'error'].includes(message.type())) warnings.push(message.text()); });
  await page.goto('/');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  const modal = page.locator('.search-modal');
  await expect(modal).toBeVisible();
  try {
    const input = modal.getByRole('textbox', { name: 'Search', exact: true });
    await expect(input).toBeVisible();
    await expect(input).toBeFocused();
    await input.fill('Asm198x');
    const result = modal.locator('.pagefind-ui__result-link').first();
    await expect(result).toBeVisible({ timeout: 15000 });
    const target = await result.getAttribute('href');
    expect(target).toBeTruthy();
    await result.click();
    await expect(page).toHaveURL(new RegExp(new URL(target!, page.url()).pathname.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    await expect(page.locator('main h1')).toBeVisible();
    await page.keyboard.press('ControlOrMeta+k');
    await expect(modal).toBeVisible();
    await expect(input).toBeVisible();
    // Quotes request an exact phrase; Pagefind otherwise falls back to short prefixes (for example ZZ in ZZT).
    await input.fill('"zzzxqnonexistentsearch198x"');
    await expect(modal.locator('.pagefind-ui__message')).toContainText(/no results/i);
    await input.fill('');
    await expect(modal.locator('.pagefind-ui__result-link')).toHaveCount(0);
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Search', exact: true })).toBeFocused();
  } finally {
    await testInfo.attach('search-state', { body: JSON.stringify({ warnings, url: page.url(), modalText: await modal.textContent() }), contentType: 'application/json' });
    await testInfo.attach('search-screenshot', { body: await page.screenshot(), contentType: 'image/png' });
  }
});

test('Vault title search handles punctuation, no matches, clearing and navigation', async ({ page }) => {
  await page.goto('/vault/');
  const input = page.getByLabel('Search article titles');
  const results = page.locator('#vault-results');
  await expect(results).toBeHidden();
  await input.fill('SID');
  await expect(results.getByRole('link', { name: /SID: The Sound of the C64/ })).toBeVisible();
  await input.fill('SID: The Sound');
  await expect(results.getByRole('link', { name: /SID: The Sound of the C64/ })).toBeVisible();
  await input.fill('zzzxqnonexistentsearch198x');
  await expect(results).toContainText('No matching titles');
  await page.getByRole('button', { name: 'Clear', exact: true }).click();
  await expect(input).toHaveValue('');
  await expect(input).toBeFocused();
  await expect(results).toBeHidden();
  await input.fill('Commando');
  await input.press('Escape');
  await expect(input).toHaveValue('');
  await expect(results).toBeHidden();
  await input.fill('Colour Clash');
  await results.getByRole('link', { name: /Colour Clash/ }).click();
  await expect(page.locator('main h1')).toHaveText('Colour Clash');
  await page.goBack();
  await input.fill('Rob Hubbard');
  await expect(results.getByRole('link', { name: /Rob Hubbard/ })).toBeVisible();
});
