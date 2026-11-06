import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const systems = ['commodore-amiga', 'commodore-64', 'sinclair-zx-spectrum', 'nintendo-entertainment-system', 'game-boy'];

test('system and Vault openings use static hardware illustrations', async ({ page }) => {
  test.setTimeout(90_000);
  const meshes: string[] = [];
  page.on('request', request => { if (/\.glb(?:\?|$)/.test(request.url())) meshes.push(request.url()); });
  for (const system of systems) {
    for (const path of [`/systems/${system}/`, `/vault/systems/${system}/`]) {
      await page.goto(path);
      const opening = page.locator(path.startsWith('/vault') ? '.vault-reading-header' : system === 'game-boy' ? '.intro' : '.machine-masthead');
      const figure = opening.locator(`[data-model-illustration="${system}"]`);
      await expect(figure).toBeVisible();
      await expect.poll(() => figure.locator('img').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
      await expect(page.getByRole('button', { name: /Explore in 3D/ })).toHaveCount(0);
      await expect(page.locator('.machine-model')).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    }
  }
  expect(meshes).toEqual([]);
});

test('image index provides all machines and alternate render links', async ({ page }) => {
  await page.goto('/systems/models/');
  await expect(page.locator('[data-model-illustration]')).toHaveCount(5);
  for (const system of systems) {
    const image = page.locator(`#${system} img`);
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  }
  const amiga = page.locator('#commodore-amiga');
  await expect(amiga.getByRole('link', { name: 'Keyboard', exact: true })).toHaveAttribute('href', /keyboard-1920.webp$/);
  await expect(page.locator('canvas')).toHaveCount(0);
  expect((await new AxeBuilder({ page }).include('.model-gallery').analyze()).violations).toEqual([]);
});

test('illustrations and alternate views work without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}/systems/models/`);
  const link = page.locator('#commodore-amiga').getByRole('link', { name: 'Keyboard', exact: true });
  await expect(link).toBeVisible();
  await link.click();
  await expect(page).toHaveURL(/amiga-keyboard-1920.webp$/);
  await context.close();
});
