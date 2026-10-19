import { test, expect } from '@playwright/test';

test('Field Notes serves artwork appropriate to the viewport and retains one live title', async ({ page }, testInfo) => {
  await page.goto('/field-notes/');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('main h1')).toHaveCount(1);
  await expect(page.locator('main h1')).toHaveText('Field Notes.');
  const image = page.locator('.field-notes-opening .band-art img');
  await image.evaluate((element: HTMLImageElement) => element.decode());
  expect(await image.evaluate((element: HTMLImageElement) => element.currentSrc))
    .toContain(testInfo.project.name === 'mobile' ? 'portrait-' : 'landscape-');
  await expect(page.locator('.band-caption')).toContainText('An imagined investigation workbench.');
  await expect(page.locator('.band-caption')).not.toContainText('AI-generated');
  for (const width of [320, 390, 768, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    const geometry = await page.locator('.field-notes-opening .band').evaluate(element => {
      const box = element.getBoundingClientRect();
      const title = element.querySelector('h1')!.getBoundingClientRect();
      return { left: box.left, right: box.right, top: box.top, bottom: box.bottom,
        titleTop: title.top, titleBottom: title.bottom,
        viewport: document.documentElement.clientWidth, document: document.documentElement.scrollWidth };
    });
    expect(Math.abs(geometry.left)).toBeLessThanOrEqual(1);
    expect(Math.abs(geometry.right - geometry.viewport)).toBeLessThanOrEqual(1);
    expect(geometry.document).toBeLessThanOrEqual(geometry.viewport);
    expect(geometry.titleTop).toBeGreaterThanOrEqual(geometry.top);
    expect(geometry.titleBottom).toBeLessThanOrEqual(geometry.bottom + 1);
  }
});

test('Field Notes keeps its story list reachable with failed artwork and enlarged text', async ({ page }) => {
  await page.route('**/images/field-notes-opening/**', route => route.abort());
  await page.goto('/field-notes/');
  await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
  await expect(page.locator('main h1')).toBeVisible();
  const bounds = await page.locator('.field-notes-opening .band').evaluate(element => {
    const workbench = element.getBoundingClientRect(), title = element.querySelector('h1')!.getBoundingClientRect();
    return { workbenchBottom: workbench.bottom, titleBottom: title.bottom };
  });
  expect(bounds.titleBottom).toBeLessThanOrEqual(bounds.workbenchBottom + 1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  // Keep the new introduction usable at the narrowest checked width too.
  // The shared footer has separate pre-existing overflow at this text size.
  await page.setViewportSize({ width: 320, height: 1000 });
  expect(await page.locator('main').evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
  const intro = await page.locator('.opening-introduction').evaluate(element => {
    const text = element.querySelector('div')!.getBoundingClientRect();
    return { left: text.left, right: text.right, viewport: document.documentElement.clientWidth };
  });
  expect(intro.left).toBeGreaterThanOrEqual(0);
  expect(intro.right).toBeLessThanOrEqual(intro.viewport);
  await page.getByRole('link', { name: 'Read the stories' }).click();
  await expect(page.locator('#field-notes-stories')).toBeInViewport();
  const firstStory = page.locator('#field-notes-stories > a').first();
  const destination = await firstStory.getAttribute('href');
  expect(destination).toMatch(/^\/field-notes\/.+/);
  await firstStory.click();
  await expect(page).toHaveURL(new RegExp(destination!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  await expect(page.locator('main h1')).toBeVisible();
});
