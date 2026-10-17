import { test, expect } from '@playwright/test';

test('Vault opening leads into the documented music connection', async ({ page }) => {
  await page.goto('/vault/');
  await expect(page.locator('main h1')).toHaveCount(1);
  await expect(page.locator('main h1')).toHaveText('The Vault.');
  const opening = page.locator('.vault-atlas');
  await expect(opening.getByRole('img', { name: 'Commodore 64 computer' })).toBeVisible();
  const destinations = ['/vault/hardware/sid-chip/', '/vault/people/rob-hubbard/', '/vault/games/commando/'];
  const links = opening.getByRole('navigation').getByRole('link');
  await expect(links).toHaveCount(destinations.length);
  for (let index = 0; index < destinations.length; index++) {
    await expect(links.nth(index)).toHaveAttribute('href', destinations[index]);
  }
  await opening.getByText('Photograph credit', { exact: true }).click();
  await expect(opening.locator('details')).toContainText('Evan-Amos');
  await expect(opening.getByRole('link', { name: 'Public-domain source photograph' })).toHaveAttribute('href', 'https://commons.wikimedia.org/wiki/File:Commodore-64-Computer-FR.jpg');
  await links.nth(1).click();
  await expect(page).toHaveURL(/\/vault\/people\/rob-hubbard\/?$/);
  await expect(page.locator('main h1')).toHaveText('Rob Hubbard');
});

test('Vault title search still finds an article and recovers from no matches', async ({ page }) => {
  await page.goto('/vault/');
  const search = page.getByRole('searchbox', { name: 'Search article titles' });
  await search.fill('zzzz-no-such-title');
  await expect(page.locator('.vault-search-status')).toContainText('No matching titles');
  await search.fill('Rob Hubbard');
  await expect(page.locator('#vault-results').getByRole('link', { name: /Rob Hubbard/ })).toHaveAttribute('href', '/vault/people/rob-hubbard');
  await page.getByRole('button', { name: 'Clear', exact: true }).click();
  await expect(search).toBeFocused();
  await expect(search).toHaveValue('');
  await expect(page.locator('#vault-results')).toBeHidden();
});
