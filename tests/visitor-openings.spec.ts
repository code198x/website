import { test, expect } from '@playwright/test';

for (const route of ['start-here', 'about']) {
  test(`${route} opens full bleed with live text and the correct art direction`, async ({ page }, testInfo) => {
    await page.goto(`/${route}/`);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('main h1')).toHaveCount(1);
    const image = page.locator(`.${route}-opening img`);
    await image.evaluate((element: HTMLImageElement) => element.decode());
    expect(await image.evaluate((element: HTMLImageElement) => element.currentSrc))
      .toContain(testInfo.project.name === 'mobile' ? 'phone-' : 'landscape-');
    await expect(page.locator('.artwork-caption')).toContainText('Original AI-generated illustration');
    for (const width of [320, 390, 700, 701, 768, 1440, 1920]) {
      await page.setViewportSize({ width, height: 1000 });
      const geometry = await page.locator(route === 'about' ? '.opened-machine' : '.making-kit').evaluate(element => {
        const box = element.getBoundingClientRect(), title = element.querySelector('h1')!.getBoundingClientRect();
        return { left: box.left, right: box.right, top: box.top, bottom: box.bottom, titleLeft: title.left, titleRight: title.right, titleTop: title.top, titleBottom: title.bottom, viewport: document.documentElement.clientWidth, document: document.documentElement.scrollWidth };
      });
      expect(Math.abs(geometry.left)).toBeLessThanOrEqual(1);
      expect(Math.abs(geometry.right - geometry.viewport)).toBeLessThanOrEqual(1);
      expect(geometry.titleLeft).toBeGreaterThanOrEqual(0);
      expect(geometry.titleRight).toBeLessThanOrEqual(geometry.viewport);
      expect(geometry.titleTop).toBeGreaterThanOrEqual(geometry.top);
      expect(geometry.titleBottom).toBeLessThanOrEqual(geometry.bottom + 1);
      expect(geometry.document).toBeLessThanOrEqual(geometry.viewport);
    }
  });
}

test('Start Here keeps the first session and all six independent routes reachable', async ({ page }) => {
  await page.goto('/start-here/');
  await expect(page.getByRole('link', { name: 'Try a first session', exact: true })).toBeInViewport();
  const links = page.locator('.start-route-index a');
  await expect(links).toHaveCount(6);
  for (const link of await links.all()) {
    const href = await link.getAttribute('href');
    expect(href).toMatch(/^#/);
    await link.click();
    await expect(page.locator(href!)).toBeInViewport();
  }
  for (const image of await page.locator('.start-evidence img').all()) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate((element: HTMLImageElement) => element.decode());
  }
  await expect(page.locator('.start-evidence img')).toHaveCount(2);
});

test('About keeps the existing purpose, first-person account and bit-picture explanation', async ({ page }) => {
  await page.goto('/about/');
  await expect(page.locator('#purpose')).toHaveText('Why we’re building this');
  await expect(page.locator('#about-reading')).toContainText('I’m Steve Hill.');
  await expect(page.locator('.bit-picture .rows > span')).toHaveCount(8);
  await expect(page.locator('.bit-picture .pixels > span')).toHaveCount(64);
  await expect(page.locator('.bit-picture figcaption')).toContainText('each 1 fills a square and each 0 leaves it empty');
  await expect(page.locator('#about-reading a[href="/start-here"]')).toBeVisible();
});

test('both openings remain usable without artwork and with enlarged narrow text', async ({ page }) => {
  await page.route('**/images/*-opening/**', route => route.abort());
  for (const route of ['start-here', 'about']) {
    await page.goto(`/${route}/`);
    await page.setViewportSize({ width: 320, height: 1000 });
    await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
    await expect(page.locator('main h1')).toBeVisible();
    await expect(page.locator('.artwork-caption')).toBeVisible();
    expect(await page.locator('main').evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
    if (route === 'start-here') {
      await page.getByRole('link', { name: 'Try a first session', exact: true }).click();
      await expect(page).toHaveURL(/\/try\/?$/);
    } else {
      await expect(page.locator('#purpose')).toBeVisible();
    }
  }
});

for (const route of ['start-here', 'about']) {
  test(`${route} gives enlarged phone typography space before the illustrated subject and caption`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 1000 });
    await page.goto(`/${route}/`);
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
    const geometry = await page.locator(`.${route}-opening`).evaluate(element => {
      const title = element.querySelector('h1')!.getBoundingClientRect();
      const picture = element.querySelector('picture')!.getBoundingClientRect();
      const caption = element.querySelector('.artwork-caption')!.getBoundingClientRect();
      // Art-directed phone images reserve their upper area for live lettering.
      const quietFraction = element.classList.contains('about-opening') ? .45 : .5;
      return { titleBottom: title.bottom, subjectTop: picture.top + picture.height * quietFraction, captionTop: caption.top };
    });
    expect(geometry.titleBottom).toBeLessThanOrEqual(geometry.subjectTop + 1);
    expect(geometry.titleBottom).toBeLessThan(geometry.captionTop);
  });
}
