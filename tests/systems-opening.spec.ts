import { test, expect } from '@playwright/test';

test('Systems introduces a wider fleet with real photographs and one readable heading', async ({ page }) => {
  await page.goto('/systems/');
  const opening = page.locator('.systems-opening');
  await expect(opening).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Choose Your Machine.');
  await expect(opening.locator('.machine')).toHaveCount(7);
  for (const image of await opening.locator('img').all()) {
    await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  }
  for (const width of [320, 390, 768, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    const bounds = await opening.evaluate(opening => {
      const art = opening.querySelector('.machine-landscape')!.getBoundingClientRect();
      const heading = opening.querySelector('h1 strong')!.getBoundingClientRect();
      const reading = opening.querySelector('.opening-reading')!.getBoundingClientRect();
      return { left: art.left, right: art.right, headingLeft: heading.left, headingRight: heading.right,
        readingWidth: reading.width, viewport: document.documentElement.clientWidth,
        documentWidth: document.documentElement.scrollWidth };
    });
    expect(bounds.left).toBeCloseTo(0, 0);
    expect(bounds.right).toBeCloseTo(bounds.viewport, 0);
    expect(bounds.headingLeft).toBeGreaterThanOrEqual(0);
    expect(bounds.headingRight).toBeLessThanOrEqual(bounds.viewport);
    expect(bounds.readingWidth).toBeLessThanOrEqual(1264);
    expect(bounds.documentWidth).toBeLessThanOrEqual(bounds.viewport);
  }
  await page.addStyleTag({ content: '.systems-opening img { display: none !important; }' });
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(opening).toContainText('A listing does not mean that a course or a working toolchain is available');
  await expect(opening.locator('.pictured')).toContainText('Atari 400');
  await expect(opening.locator('.pictured')).toContainText('Acorn Electron');
  await expect(opening.locator('.pictured')).toContainText('Sony HB-10P (MSX)');
  await opening.getByRole('link', { name: /Browse all/ }).click();
  await expect(page.locator('#catalogue')).toBeInViewport();
});

test('photograph credits retain authors, licences and the Atari family distinction', async ({ page }) => {
  await page.goto('/systems/');
  await page.getByText('Photographs and credits', { exact: true }).click();
  const credits = page.locator('.photo-credits');
  await expect(credits).toContainText('Bilby');
  await expect(credits).toContainText('Doppelgangland / Ubcule');
  await expect(credits.getByRole('link', { name: 'CC BY-SA 3.0' })).toHaveAttribute('href', 'https://creativecommons.org/licenses/by-sa/3.0/');
  await expect(credits.getByRole('link', { name: 'CC BY 3.0', exact: true })).toHaveAttribute('href', 'https://creativecommons.org/licenses/by/3.0/');
  await expect(credits).toContainText('The Atari 400 links to the Atari 8-bit family entry');
  await expect(credits.getByRole('link', { name: 'Source photograph' })).toHaveCount(6);
});

test('catalogue search, availability and other arrangements remain intact', async ({ page }) => {
  await page.goto('/systems/');
  const catalogue = page.locator('[data-catalogue]');
  await catalogue.locator('summary').click();
  const search = page.getByRole('searchbox', { name: 'Find a machine' });
  await search.fill('MSX');
  const msx = catalogue.locator('li[data-q]').filter({ has: page.locator('a[href="/systems/msx"]') });
  await expect(msx).toBeVisible();
  await expect(msx).toContainText('Next');
  await expect(msx).not.toContainText('Lessons');
  await search.fill('no-such-machine-198x');
  await expect(catalogue.locator('[data-none]')).toHaveText('No machine matches that search.');
  await search.fill('');
  await expect(msx).toBeVisible();
  await catalogue.getByRole('link', { name: 'By maker', exact: true }).click();
  await expect(page).toHaveURL(/\/systems\/by-maker\//);
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.locator('.systems-opening')).toHaveCount(0);
  await expect(page.getByRole('searchbox', { name: 'Find a machine' })).toBeVisible();
});

test('switching arrangement lands on the catalogue, open, not the top of the page', async ({ page }) => {
  await page.goto('/systems/by-maker/');
  for (const [name, url] of [['By region', /\/systems\/by-region\/#catalogue$/], ['By era', /\/systems\/#catalogue$/]] as const) {
    await page.locator('[data-catalogue] .lenses').getByRole('link', { name, exact: true }).click();
    await expect(page).toHaveURL(url);
    await expect(page.locator('[data-catalogue] details')).toHaveAttribute('open', '');
    await expect(page.getByRole('heading', { name: 'The wider catalogue.' })).toBeInViewport();
    await expect(page.getByRole('searchbox', { name: 'Find a machine' })).toBeInViewport();
  }
});
