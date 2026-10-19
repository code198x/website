import { test, expect } from '@playwright/test';

test('layered Demoscene artwork fills the viewport without losing its title or reading frame', async ({ page }) => {
  await page.goto('/demoscene/');
  const banner = page.locator('.demoscene-opening');
  await expect(banner).toBeVisible();
  await expect(banner.locator('.band-caption')).toContainText('not captures of historical productions');
  await expect(banner.locator('.band-caption')).not.toContainText('AI-generated');
  const layers = banner.locator('img');
  await expect(layers).toHaveCount(3);
  for (const image of await layers.all()) {
    await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  }
  for (const width of [320, 390, 768, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    const geometry = await banner.evaluate(banner => {
      const scene = banner.querySelector('.band')!.getBoundingClientRect();
      const title = banner.querySelector('.scene-title')!.getBoundingClientRect();
      const reading = document.querySelector('.wrap')!.getBoundingClientRect();
      return { scene: { left: scene.left, right: scene.right },
        title: { left: title.left, right: title.right },
        readingWidth: reading.width, viewport: document.documentElement.clientWidth,
        documentWidth: document.documentElement.scrollWidth };
    });
    expect(geometry.scene.left).toBeCloseTo(0, 0);
    expect(geometry.scene.right).toBeCloseTo(geometry.viewport, 0);
    expect(geometry.title.left).toBeGreaterThanOrEqual(0);
    expect(geometry.title.right).toBeLessThanOrEqual(geometry.viewport);
    expect(geometry.readingWidth).toBeLessThanOrEqual(1264);
    expect(geometry.documentWidth).toBeLessThanOrEqual(geometry.viewport);
  }
  await page.addStyleTag({ content: '.demoscene-opening img { display: none !important; }' });
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Explore State of the Art' })).toBeVisible();
});

test('Craft shows legal choices and keeps the paper activity reachable', async ({ page }) => {
  await page.goto('/craft/');
  const figure = page.locator('.counter-choices');
  await expect(figure).toBeVisible();
  await expect(figure.locator('.starting .counter')).toHaveCount(7);
  for (const take of [1, 2]) {
    const move = figure.locator(`[data-take="${take}"]`);
    const remaining = await move.locator('.counter').count();
    expect(remaining + take).toBe(7);
    await expect(move).toContainText(`${remaining} left for the other player`);
  }
  await expect(figure).toContainText('taking the last counter loses instead of wins');
  await figure.getByRole('link', { name: 'Try changing one rule' }).click();
  await expect(page.locator('#try-it')).toBeInViewport();
  await expect(page.locator('#try-it')).toContainText('whoever takes the last counter loses');
});

test('Demoscene identifies a loaded production frame and explains its purpose', async ({ page }) => {
  await page.goto('/demoscene/');
  const feature = page.locator('.production-feature');
  const image = feature.getByRole('img');
  await image.scrollIntoViewIfNeeded();
  await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  for (const width of [320, 390, 900, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    const bounds = await image.evaluate((img: HTMLImageElement) => {
      const box = img.getBoundingClientRect();
      const column = img.closest('.figure')!.getBoundingClientRect();
      const feature = img.closest('.production-feature')!.getBoundingClientRect();
      return { width: box.width, height: box.height, left: box.left, right: box.right,
        columnLeft: column.left, columnRight: column.right,
        featureLeft: feature.left, featureRight: feature.right,
        sourceWidth: img.naturalWidth, sourceHeight: img.naturalHeight };
    });
    expect([bounds.sourceWidth, bounds.sourceHeight]).toEqual([752, 572]);
    expect(bounds.width / bounds.height).toBeCloseTo(752 / 572, 3);
    expect(bounds.left).toBeGreaterThanOrEqual(bounds.columnLeft - 1);
    expect(bounds.right).toBeLessThanOrEqual(bounds.columnRight + 1);
    expect(bounds.left).toBeGreaterThanOrEqual(bounds.featureLeft - 1);
    expect(bounds.right).toBeLessThanOrEqual(bounds.featureRight + 1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await expect(feature.locator('figcaption')).toContainText('Spaceballs, 1992, Commodore Amiga');
  await expect(feature.locator('figcaption')).toContainText('Captured by Code198x');
  await expect(feature).toContainText('traced from video');
  await expect(feature.getByRole('link', { name: 'Explore State of the Art' })).toHaveAttribute('href', '/vault/demos/state-of-the-art/');
  await expect(page.locator('main audio, main video')).toHaveCount(0);
});

for (const theme of ['light', 'dark']) {
  test(`opening figures fit the page and remain readable without images in ${theme}`, async ({ page }) => {
    await page.addInitScript(theme => localStorage.setItem('theme', theme), theme);
    for (const route of ['/craft/', '/demoscene/']) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      const figure = page.locator(route === '/craft/' ? '.counter-choices' : '.production-feature');
      const bounds = await figure.boundingBox();
      expect(bounds).not.toBeNull();
      const viewport = page.viewportSize()!;
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(viewport.width + 1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.addStyleTag({ content: 'main img { visibility: hidden !important; }' });
      await expect(figure.locator('figcaption')).toBeVisible();
      await expect(figure.getByRole('link')).toBeVisible();
    }
  });
}
