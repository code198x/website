import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const systems = ['commodore-amiga', 'commodore-64', 'sinclair-zx-spectrum', 'nintendo-entertainment-system', 'game-boy'];

test('gallery starts with real renders and does not request 3D assets', async ({ page }) => {
  const models: string[] = [];
  page.on('request', request => { if (/\.glb(?:\?|$)/.test(request.url())) models.push(request.url()); });
  await page.goto('/systems/models/');
  await expect(page.getByRole('heading', { name: 'Meet the machines.' })).toBeVisible();
  await expect(page.locator('[data-model-illustration]')).toHaveCount(5);
  for (const system of systems) {
    const image = page.locator(`#${system} [data-model-image]`);
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  }
  expect(models).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  const figure = page.locator('#commodore-amiga [data-model-illustration]');
  await figure.getByRole('button', { name: 'Keyboard', exact: true }).click();
  await expect(figure.locator('[data-model-image]')).toHaveAttribute('src', /amiga-keyboard/);
  await expect(figure.getByRole('button', { name: 'Keyboard', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(figure.locator('[data-model-open]')).toHaveAttribute('href', /keyboard-1920.webp$/);
});

test('all models open, turn, zoom, reset and return to their images', async ({ page }) => {
  test.setTimeout(120_000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/systems/models/');
  for (const system of systems) {
    const figure = page.locator(`#${system} [data-model-illustration]`);
    await figure.locator('[data-model-3d]').click();
    await expect(figure.locator('canvas[data-rendered="true"]')).toBeVisible({ timeout: 40_000 });
    await expect(page.locator('canvas')).toHaveCount(1);
    const canvas = figure.locator('canvas');
    await canvas.focus();
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('+');
    await page.keyboard.press('Home');
    await figure.getByRole('button', { name: 'Turn right', exact: true }).click();
    await figure.getByRole('button', { name: 'Zoom out', exact: true }).click();
    await figure.getByRole('button', { name: 'Reset view', exact: true }).click();
    await figure.getByRole('button', { name: 'Back to images', exact: true }).click();
    await expect(figure.locator('canvas')).toHaveCount(0);
    await expect(figure.locator('[data-model-image]')).toBeVisible();
    await expect(figure.locator('[data-model-feedback]')).toBeHidden();
  }
  expect(errors).toEqual([]);
});

test('opening another model releases the previous 3D view', async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto('/systems/models/');
  const first = page.locator('#nintendo-entertainment-system [data-model-illustration]');
  const second = page.locator('#game-boy [data-model-illustration]');
  await first.locator('[data-model-3d]').click();
  await expect(first.locator('canvas[data-rendered=true]')).toBeVisible({ timeout: 40_000 });
  await second.locator('[data-model-3d]').click();
  await expect(second.locator('canvas[data-rendered=true]')).toBeVisible({ timeout: 40_000 });
  await expect(first.locator('canvas')).toHaveCount(0);
  await expect(first.locator('[data-model-image]')).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(1);
});

test('failed model download keeps the image and offers a retry', async ({ page }) => {
  await page.route('**/models/commodore-amiga.glb', route => route.fulfill({ status: 503, body: 'Unavailable' }));
  await page.goto('/systems/models/');
  const figure = page.locator('#commodore-amiga [data-model-illustration]');
  await figure.locator('[data-model-3d]').click();
  await expect(figure.locator('[data-model-feedback]')).toContainText('could not load');
  await expect(figure.locator('[data-model-image]')).toBeVisible();
  await expect(figure.getByRole('button', { name: 'Try 3D again' })).toBeEnabled();
  await expect(figure.locator('canvas')).toHaveCount(0);
});

test('system pages expose their model and the shared gallery', async ({ page }) => {
  test.setTimeout(90_000);
  for (const system of systems) {
    await page.goto(`/systems/${system}/`);
    const section = page.locator('.machine-model');
    await expect(section.getByRole('heading', { name: 'Look around the machine' })).toBeAttached();
    await expect(section.locator('[data-model-illustration]')).toHaveAttribute('data-model-url', `/models/${system}.glb`);
    await expect(section.getByRole('link', { name: 'Explore the model gallery' })).toHaveAttribute('href', `/systems/models/#${system}`);
  }
});

test('images and alternate views remain usable without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}/systems/models/`);
  await expect(page.locator('[data-model-illustration]')).toHaveCount(5);
  for (const button of await page.locator('[data-model-3d]').all()) await expect(button).toBeHidden();
  await expect(page.locator('#commodore-amiga noscript').getByRole('link', { name: 'Keyboard' })).toBeVisible();
  await context.close();
});

test('gallery controls pass accessibility checks before and during 3D', async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto('/systems/models/');
  expect((await new AxeBuilder({ page }).include('.model-gallery').analyze()).violations).toEqual([]);
  const figure = page.locator('#nintendo-entertainment-system [data-model-illustration]');
  await figure.locator('[data-model-3d]').click();
  await expect(figure.locator('canvas[data-rendered=true]')).toBeVisible({ timeout: 40_000 });
  expect((await new AxeBuilder({ page }).include('.model-gallery').analyze()).violations).toEqual([]);
});
