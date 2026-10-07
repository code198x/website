import { test, expect } from '@playwright/test';

for (const route of ['about', 'standards', 'press', 'teaching']) {
  test(`${route} keeps its reading column and contents rail aligned`, async ({ page, isMobile }) => {
    await page.goto(`/${route}/`);
    const body = page.locator('.reading-body');
    const rail = page.locator('.reading-toc');
    const firstSection = body.locator(':scope > section').first();
    const bodyBox = await body.boundingBox();
    const sectionBox = await firstSection.boundingBox();
    expect(bodyBox).not.toBeNull();
    expect(sectionBox).not.toBeNull();
    expect(sectionBox!.x).toBeCloseTo(bodyBox!.x, 0);
    expect(sectionBox!.width).toBeCloseTo(bodyBox!.width, 0);
    if (isMobile) {
      await expect(rail).toBeHidden();
    } else {
      await expect(rail).toBeVisible();
      const railBox = await rail.boundingBox();
      expect(railBox!.x).toBeGreaterThan(bodyBox!.x + bodyBox!.width);
      expect(railBox!.y).toBeCloseTo(bodyBox!.y, 0);
      const link = rail.getByRole('link').first();
      await expect(link).toBeVisible();
      const target = await link.getAttribute('href');
      expect(target).toMatch(/^#.+/);
      await link.click();
      await expect(page).toHaveURL(new RegExp(`${target}$`));
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  });
}

for (const route of ['from-the-metal/unroll-your-loops', 'field-notes/the-sheep-that-slid-off-the-hay-bale', 'updates/meteor-storm']) {
  test(`${route} retains its article composition`, async ({ page }) => {
    await page.goto(`/${route}/`);
    await page.evaluate(() => document.fonts.ready);
    const article = page.locator('.editorial-article');
    await expect(article.getByRole('heading', { level: 1 })).toHaveCount(1);
    const heading = await article.locator('.page-heading').boundingBox();
    const body = await article.locator('.editorial-body').boundingBox();
    expect(body!.y).toBeGreaterThan(heading!.y + heading!.height);
    const viewport = page.viewportSize()!.width;
    expect(Math.abs(body!.x - (viewport - body!.width) / 2)).toBeLessThan(1);
    const paragraph = article.locator('.editorial-body > p').first();
    const type = await paragraph.evaluate(element => {
      const style = getComputedStyle(element);
      return { size: parseFloat(style.fontSize), leading: parseFloat(style.lineHeight) };
    });
    expect(type.size).toBeGreaterThanOrEqual(18);
    expect(type.leading / type.size).toBeGreaterThanOrEqual(1.6);
    if (route.startsWith('updates')) {
      await expect(article.locator('time[datetime]')).toBeVisible();
      await expect(article.getByRole('link', { name: '← All updates' })).toHaveAttribute('href', '/updates');
    } else if (route.startsWith('field-notes')) {
      await expect(article.locator('.colophon')).toContainText('Field Notes is written by Steve Hill');
    } else {
      await expect(article.locator('.signoff')).toContainText('Every great programmer started with one instruction.');
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  });
}
