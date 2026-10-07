import { test, expect } from '@playwright/test';

for (const route of [
  '/systems/sinclair-zx-spectrum/basic/',
  '/systems/commodore-64/assembly/',
  '/systems/commodore-amiga/assembly/',
]) {
  test(`game previews remain useful and complete: ${route}`, async ({ page }) => {
    await page.goto(route);
    const figures = page.locator('.track-games .gthumb').filter({ has: page.locator('img') });
    expect(await figures.count()).toBeGreaterThan(0);
    for (const figure of (await figures.all()).slice(0, 3)) {
      await figure.scrollIntoViewIfNeeded();
      await figure.locator('img').evaluate(img => (img as HTMLImageElement).decode());
      const sizes = await figure.evaluate(el => {
        const img = el.querySelector('img')!;
        const picture = img.getBoundingClientRect();
        const frame = el.getBoundingClientRect();
        const caption = el.querySelector('figcaption')!.getBoundingClientRect();
        return {
          naturalWidth: img.naturalWidth,
          expectedHeight: picture.width * img.naturalHeight / img.naturalWidth,
          width: picture.width, height: picture.height,
          figureWidth: frame.width, captionWidth: caption.width,
          fit: getComputedStyle(img).objectFit,
          available: el.closest('.gcard')!.getBoundingClientRect().width,
          left: picture.left, right: picture.right,
        };
      });
      // A recognisable preview, rather than the old 80–100px icon-sized box.
      expect(sizes.width).toBeGreaterThanOrEqual(Math.min(250, sizes.naturalWidth, sizes.available));
      expect(Math.abs(sizes.height - sizes.expectedHeight)).toBeLessThan(1);
      expect(sizes.fit).toBe('contain');
      expect(sizes.captionWidth).toBeLessThanOrEqual(sizes.figureWidth + 1);
      expect(sizes.left).toBeGreaterThanOrEqual(0);
      expect(sizes.right).toBeLessThanOrEqual(page.viewportSize()!.width + 1);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  });
}
