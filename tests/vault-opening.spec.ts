import { test, expect } from '@playwright/test';

test('Vault opening spans connected histories and distinguishes unwritten subjects', async ({ page }) => {
  await page.goto('/vault/');
  await expect(page.locator('main h1')).toHaveCount(1);
  await expect(page.locator('main h1')).toHaveText('The Vault.');
  const opening = page.locator('.vault-atlas');
  const reading = opening.locator('.constellation-reading');
  await reading.evaluate((element: HTMLDetailsElement) => { element.open = true; });
  await expect(reading.locator('ol > li')).toHaveCount(6);
  for (const name of ['Ada Lovelace', 'Margaret Hamilton', 'Dartmouth', 'BASIC', 'Bomb the Bass']) {
    await expect(reading.locator('.future-name', { hasText: name }).first()).toContainText('Not yet covered');
    await expect(reading.getByRole('link', { name, exact: true })).toHaveCount(0);
  }
  await expect(reading.locator('#constellation-culture')).toContainText('The Assembly Line programmed it');
  await expect(reading.locator('#constellation-flight')).toContainText('under contract to NASA');
  const sources = reading.locator('.thread-source');
  await expect(sources).toHaveCount(6);
  await reading.getByRole('link', { name: 'Alexey Pajitnov', exact: true }).click();
  await expect(page).toHaveURL(/\/vault\/people\/alexey-pajitnov\/?$/);
  await expect(page.locator('main h1')).toHaveText('Alexey Pajitnov');
});

test('Vault search remains directly reachable from the constellation', async ({ page }) => {
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

test('Vault connections reflow when the reader enlarges text', async ({ page }) => {
  await page.goto('/vault/');
  const before = await page.locator('.thread-source').first().evaluate(element => parseFloat(getComputedStyle(element).fontSize));
  await page.addStyleTag({ content: 'html { font-size: 150% !important; }' });
  await expect(page.locator('.constellation-nodes')).toHaveCSS('display', 'none');
  await expect(page.locator('.constellation-reading')).toHaveAttribute('open');
  const after = await page.locator('.thread-source').first().evaluate(element => parseFloat(getComputedStyle(element).fontSize));
  expect(after).toBeGreaterThan(before * 1.4);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(await page.evaluate(() => innerWidth));
});

test('Every constellation relationship label has clear space', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Explicit diagram viewport matrix');
  for (const width of [1200, 1440]) {
    await page.setViewportSize({ width, height: 1100 });
    await page.goto('/vault/');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('.constellation-node').first()).toBeVisible();
    const labels = page.locator('.constellation-labels span');
    expect(await labels.count()).toBeGreaterThan(0);
    const overlaps = await page.evaluate(() => {
      const labels = [...document.querySelectorAll<HTMLElement>('.constellation-labels span')];
      const nodes = [...document.querySelectorAll<HTMLElement>('.constellation-node')];
      const overlaps = (a: DOMRect, b: DOMRect) => a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1;
      return labels.flatMap(label => [...nodes, ...labels.filter(other => other !== label)]
        .filter(other => overlaps(label.getBoundingClientRect(), other.getBoundingClientRect()))
        .map(other => `${label.textContent} overlaps ${other.textContent}`));
    });
    expect(overlaps, `Relationship labels must remain readable at ${width}px`).toEqual([]);
  }
});
