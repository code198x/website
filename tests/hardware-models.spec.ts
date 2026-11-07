import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const systems = ['commodore-amiga', 'commodore-64', 'sinclair-zx-spectrum', 'nintendo-entertainment-system', 'game-boy', 'bbc-micro', 'sinclair-zx81', 'sega-master-system', 'commodore-vic-20', 'acorn-electron', 'atari-800', 'amstrad-cpc', 'atari-st', 'sega-mega-drive', 'super-nintendo', 'atari-2600', 'sega-game-gear', 'neo-geo', 'vectrex', 'commodore-128', 'oric-atmos', 'msx', 'thomson-mo5', 'robotron-kc85', 'sharp-x68000', 'apple-ii', 'macintosh', 'atari-400', 'acorn-archimedes', 'trs-80', 'amstrad-pcw', 'kim-1', 'game-boy-color'];
const withoutVaultArticle = new Set(['oric-atmos', 'thomson-mo5', 'robotron-kc85', 'sharp-x68000', 'macintosh', 'amstrad-pcw', 'kim-1', 'game-boy-color']);

test('system and Vault openings use static hardware illustrations', async ({ page }) => {
  test.setTimeout(240_000);
  const meshes: string[] = [];
  page.on('request', request => { if (/\.glb(?:\?|$)/.test(request.url())) meshes.push(request.url()); });
  for (const system of systems) {
    const paths = [`/systems/${system === 'atari-400' ? 'atari-800' : system}/`];
    if (!withoutVaultArticle.has(system)) paths.push(`/vault/systems/${['atari-800', 'atari-400'].includes(system) ? 'atari-8-bit' : system}/`);
    for (const path of paths) {
      await page.goto(path);
      const opening = page.locator(system === 'atari-400' ? 'article' : path.startsWith('/vault') ? '.vault-reading-header' : ['commodore-amiga', 'commodore-64', 'sinclair-zx-spectrum', 'nintendo-entertainment-system'].includes(system) ? '.machine-masthead' : '.intro');
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
  await expect(page.locator('[data-model-illustration]')).toHaveCount(systems.length);
  for (const system of systems) {
    const image = page.locator(`#${system} img`);
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  }
  for (const system of ['amstrad-cpc', 'atari-st', 'super-nintendo']) {
    const item = page.locator(`#${system}`);
    await expect(item.getByRole('link', { name: 'Low angle', exact: true })).toHaveAttribute('href', new RegExp(`${system}-low-angle-1920.webp$`));
  }
  for (const system of ['sega-mega-drive', 'super-nintendo', 'atari-2600']) {
    for (const [name, view] of [['Above', 'top'], ['Controls', 'controls'], ['Rear', 'rear']]) {
      await expect(page.locator(`#${system}`).getByRole('link', { name, exact: true })).toHaveAttribute('href', new RegExp(`${system}-${view}-1920.webp$`));
    }
  }
  const additionalViews: Record<string, [string, string][]> = {
    'apple-ii': [['Above', 'top'], ['Keyboard', 'keyboard'], ['Low angle', 'low-angle']],
    'macintosh': [['Straight on', 'straight-on'], ['Rear', 'rear']],
    'atari-400': [['Above', 'top'], ['Keyboard', 'keyboard']],
    'acorn-archimedes': [['Above', 'top'], ['Keyboard', 'keyboard'], ['Low angle', 'low-angle']],
    'trs-80': [['Straight on', 'straight-on'], ['Keyboard', 'keyboard'], ['Low angle', 'low-angle']],
    'amstrad-pcw': [['Straight on', 'straight-on'], ['Side', 'side']],
    'kim-1': [['Above', 'top'], ['Keypad', 'keypad'], ['Low angle', 'low-angle']],
    'game-boy-color': [['Above', 'top'], ['Controls', 'controls']],
    'sega-game-gear': [['Above', 'top'], ['Controls', 'controls']],
    'neo-geo': [['Above', 'top'], ['Controls', 'controls']],
    'vectrex': [['Straight on', 'straight-on'], ['Rear', 'rear']],
    'commodore-128': [['Above', 'top'], ['Keyboard', 'keyboard']],
    'oric-atmos': [['Above', 'top'], ['Keyboard', 'keyboard']],
    'msx': [['Above', 'top'], ['Keyboard', 'keyboard']],
    'thomson-mo5': [['Above', 'top'], ['Keyboard', 'keyboard']],
    'robotron-kc85': [['Straight on', 'straight-on'], ['Above', 'top']],
    'sharp-x68000': [['Straight on', 'straight-on'], ['Side', 'side']],
  };
  for (const [system, views] of Object.entries(additionalViews)) {
    for (const [name, view] of views) {
      await expect(page.locator(`#${system}`).getByRole('link', { name, exact: true })).toHaveAttribute('href', new RegExp(`${system}-${view}-1920.webp$`));
    }
  }
  await expect(page.locator('#atari-400').getByRole('link', { name: 'Atari 400', exact: true })).toHaveAttribute('href', '/systems/atari-800/');
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
