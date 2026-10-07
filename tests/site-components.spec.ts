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
