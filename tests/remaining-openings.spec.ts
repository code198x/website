import { test, expect } from '@playwright/test';

const routes = ['from-the-metal', 'family', 'teaching', 'curriculum', 'setup', 'updates', 'family/emu198x', 'family/asm198x', 'family/build198x', 'family/cat198x'];
for (const route of routes) {
  test(`${route} keeps one live heading and a framed body beneath its opening`, async ({ page }) => {
    await page.goto(`/${route}/`);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('main h1')).toHaveCount(1);
    const art = page.locator('main .opening-band .band-art img');
    if (route !== 'updates') {
      await expect.poll(() => art.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
      await art.evaluate((image: HTMLImageElement) => image.decode());
      await expect(page.locator('.band-caption')).toBeVisible();
      await expect(page.locator('.band-caption')).not.toContainText('AI-generated');
      const geometry = await page.locator('main .opening-band .band').evaluate(scene => {
        const bounds = scene.getBoundingClientRect();
        return {left: bounds.left, right: bounds.right, viewport: document.documentElement.clientWidth};
      });
      expect(Math.abs(geometry.left)).toBeLessThanOrEqual(1);
      expect(Math.abs(geometry.right - geometry.viewport)).toBeLessThanOrEqual(1);
    }
    expect(await page.locator('main').evaluate(main => main.scrollWidth <= main.clientWidth)).toBe(true);
    const title = page.locator('main h1');
    await expect(title).toBeVisible();
    await page.setViewportSize({ width: 320, height: 1000 });
    await page.addStyleTag({content: 'html { font-size: 200% !important; }'});
    expect(await page.locator('main').evaluate(main => main.scrollWidth <= main.clientWidth)).toBe(true);
    if (route !== 'updates') {
      const geometry = await page.locator('main .opening-band').evaluate(opening => ({title: opening.querySelector('h1')!.getBoundingClientRect().bottom, picture: opening.querySelector('picture')!.getBoundingClientRect().top, caption: opening.querySelector('.band-caption')!.getBoundingClientRect().top}));
      expect(geometry.title).toBeLessThanOrEqual(geometry.picture + 1);
      expect(geometry.title).toBeLessThan(geometry.caption);
    }
  });
}

test('the setup opening stays on the overview and preserves the machine guides', async ({page}) => {
  await page.goto('/setup/');
  await expect(page.locator('.setup-content').getByRole('link', {name: 'Write your first Spectrum BASIC program', exact: true})).toBeVisible();
  await page.goto('/setup/roms/');
  await expect(page.locator('.setup-opening')).toHaveCount(0);
  await expect(page.locator('.setup-header h1')).toBeVisible();
  await expect(page.locator('.setup-content')).not.toBeEmpty();
});

test('the newest update stays close to the compact masthead', async ({page}) => {
  await page.goto('/updates/');
  const positions = await page.evaluate(() => ({title: document.querySelector('main h1')!.getBoundingClientRect().bottom, first: document.querySelector('.feed .entry')!.getBoundingClientRect().top}));
  expect(positions.first - positions.title).toBeLessThan(450);
  await expect(page.locator('.feed .entry').first()).toBeVisible();
});

test('headings and reading links survive missing header artwork', async ({page}) => {
  await page.route('**/images/*-opening/**', route => route.abort());
  for (const route of ['teaching', 'setup', 'family', 'from-the-metal', 'curriculum']) {
    await page.goto(`/${route}/`);
    await expect(page.locator('main h1')).toBeVisible();
    await expect(page.locator('main a[href]').first()).toBeVisible();
  }
});


test('the Updates title and rule retain the same gutter as its introduction', async ({page}) => {
  for (const [width, enlarged] of [[1440, false], [390, false], [320, true]] as const) {
    await page.setViewportSize({width, height: 1050});
    await page.goto('/updates/');
    if (enlarged) await page.addStyleTag({content: 'html { font-size: 200% !important; }'});
    const positions = await page.evaluate(() => ({
      title: document.querySelector('.updates-opening h1')!.getBoundingClientRect().left,
      rule: document.querySelector('.updates-title-frame')!.getBoundingClientRect().left,
      intro: document.querySelector('main .lede')!.getBoundingClientRect().left,
    }));
    expect(Math.abs(positions.title - positions.intro)).toBeLessThanOrEqual(1);
    expect(Math.abs(positions.rule - positions.intro)).toBeLessThanOrEqual(1);
  }
});
