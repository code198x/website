import { test, expect } from '@playwright/test';

for (const route of ['/patterns/', '/patterns/sinclair-zx-spectrum/basic/rendering/progress-bar/']) {
  test(`progress-bar picture agrees with the BASIC routine on ${route}`, async ({ page }) => {
    await page.goto(route);
    const example = page.locator('.pattern-example');
    await expect(example).toBeVisible();
    await expect(example).toContainText('not an emulator capture');
    const rows = await example.locator('.pattern-bar-row').evaluateAll(rows => rows.map(row => ({
      value: Number(row.querySelector('span')!.firstChild!.textContent),
      cells: [...row.querySelectorAll('rect')].map(cell => cell.getAttribute('fill')),
    })));
    // Independent expected states from the maintained routine, including a
    // nonzero low value; a colourful positional gradient must fail this check.
    expect(rows.map(row => row.value)).toEqual([0, 25, 50, 100]);
    const expected = [
      { filled: 0, colour: '#d70000' },
      { filled: 7, colour: '#d70000' },
      { filled: 14, colour: '#d7d700' },
      { filled: 28, colour: '#00d700' },
    ];
    rows.forEach((row, i) => {
      expect(row.cells).toHaveLength(28);
      expect(row.cells.slice(0, expected[i].filled)).toEqual(Array(expected[i].filled).fill(expected[i].colour));
      expect(row.cells.slice(expected[i].filled)).toEqual(Array(28 - expected[i].filled).fill('#000000'));
    });
    await expect(example.locator('[role="img"]')).toHaveAccessibleName(/25 of 100 lights 7 of 28 cells/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

for (const width of [390, 850, 1024, 1440, 1920]) {
  test(`system evidence fits its column at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    for (const system of ['commodore-amiga', 'commodore-64', 'sinclair-zx-spectrum', 'nintendo-entertainment-system']) {
      await page.goto(`/systems/${system}/`);
      await page.evaluate(() => document.fonts.ready);
      const image = page.locator('.game-evidence .capture img');
      await expect(image).toBeVisible();
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((image: HTMLImageElement) =>
        image.complete && image.naturalWidth > 0,
      ), { message: `${system}: capture must finish loading` }).toBe(true);
      const box = await image.evaluate((image: HTMLImageElement) => {
        const figure = image.closest('figure')!;
        const bounds = image.getBoundingClientRect();
        const caption = figure.querySelector('figcaption')!.getBoundingClientRect();
        const column = figure.parentElement!.getBoundingClientRect();
        return {
          loaded: image.complete && image.naturalWidth > 0,
          source: { width: image.naturalWidth, height: image.naturalHeight },
          width: bounds.width, height: bounds.height,
          left: bounds.left, right: bounds.right,
          captionLeft: caption.left, captionRight: caption.right,
          columnLeft: column.left, columnRight: column.right, columnWidth: column.width,
          overflow: document.documentElement.scrollWidth - innerWidth,
        };
      });
      expect(box.loaded, system).toBe(true);
      expect(box.overflow, system).toBeLessThanOrEqual(1);
      expect(box.left, system).toBeGreaterThanOrEqual(box.columnLeft - 1);
      expect(box.right, system).toBeLessThanOrEqual(box.columnRight + 1);
      expect(box.captionLeft, system).toBeCloseTo(box.left, 0);
      expect(box.captionRight, system).toBeCloseTo(box.right, 0);
      expect(box.width / box.height, system).toBeCloseTo(box.source.width / box.source.height, 3);
      if (system === 'commodore-amiga') {
        // The inspected 768×576 PNG stores each native pixel as 2×2 pixels.
        expect(box.source).toEqual({ width: 768, height: 576 });
        expect(box.width).toBeCloseTo(Math.min(384, box.columnWidth), 0);
      }
    }
  });
}
