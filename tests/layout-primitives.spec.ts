import { test, expect, type Page } from '@playwright/test';

// The kit's layout primitives on its catalogue entry (_198x-ui/catalogue/
// entries/Layout.astro), at the three widths the restructure is reviewed at.
// Each check is what the primitive promises, measured in the browser.

const WIDTHS = [320, 768, 1440];

const boxes = (page: Page, specimen: string) =>
  page.locator(`[data-specimen="${specimen}"]`).evaluate(element => {
    const own = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return {
      own: { x: own.x, y: own.y, width: own.width, height: own.height },
      padding: parseFloat(style.paddingLeft),
      border: parseFloat(style.borderTopWidth),
      parentWidth: element.parentElement!.getBoundingClientRect().width,
      parentX: element.parentElement!.getBoundingClientRect().x,
      scroll: { width: element.scrollWidth, client: element.clientWidth },
      rem: parseFloat(getComputedStyle(document.documentElement).fontSize),
      children: [...element.children].map(child => {
        const box = child.getBoundingClientRect();
        return { x: box.x, y: box.y, width: box.width, height: box.height, marginTop: parseFloat(getComputedStyle(child).marginTop), centre: child.hasAttribute('data-cover-centre') };
      }),
    };
  });

test.describe('layout primitives', () => {
  test.skip(({ isMobile }) => isMobile, 'The widths are set per test; one project is enough.');

  for (const width of WIDTHS) {
    test(`hold their promises at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/catalogue/layout/');

      const stack = await boxes(page, 'stack');
      for (const child of stack.children) expect(child.marginTop).toBe(0);
      for (let i = 1; i < stack.children.length; i++) {
        const previous = stack.children[i - 1];
        expect(stack.children[i].y - (previous.y + previous.height)).toBeCloseTo(1.5 * stack.rem, 0);
      }

      const box = await boxes(page, 'box');
      expect(box.padding).toBeCloseTo(1.5 * box.rem, 0);
      expect(box.border).toBe(1);

      const center = await boxes(page, 'center');
      expect(center.own.width).toBeLessThanOrEqual(40 * center.rem + 0.5);
      const left = center.own.x - center.parentX;
      const right = center.parentX + center.parentWidth - (center.own.x + center.own.width);
      expect(left).toBeCloseTo(right, 0);
      expect(center.padding).toBeCloseTo(center.rem, 0);

      const cluster = await boxes(page, 'cluster');
      // Items are centred in their row, so a row is the items sharing a centre line.
      const rows = new Set(cluster.children.map(child => Math.round(child.y + child.height / 2)));
      const rowWidth = cluster.children.reduce((sum, child) => sum + child.width, 0) + (cluster.children.length - 1) * 0.5 * cluster.rem;
      expect(rows.size > 1).toBe(rowWidth > cluster.own.width);
      expect(cluster.children[1].x - (cluster.children[0].x + cluster.children[0].width)).toBeCloseTo(0.5 * cluster.rem, 0);

      // Sidebar: side by side while the main pane gets at least half, then stacked.
      const sidebar = await boxes(page, 'sidebar');
      const [side, main] = sidebar.children;
      const sideBySide = sidebar.own.width - 15 * sidebar.rem - 1.5 * sidebar.rem >= sidebar.own.width / 2;
      if (sideBySide) {
        expect(main.y).toBeCloseTo(side.y, 0);
        // The sidebar takes 1/1000 of the free space (flex-grow 1 against 999).
        expect(side.width).toBeGreaterThanOrEqual(15 * sidebar.rem - 0.5);
        expect(side.width).toBeLessThan(15 * sidebar.rem + sidebar.own.width / 500);
        expect(main.x).toBeGreaterThan(side.x + side.width);
      } else {
        expect(main.y).toBeGreaterThan(side.y + side.height);
        expect(main.width).toBeCloseTo(sidebar.own.width, 0);
      }

      // Switcher: all in one row or all in one column, never a mixture.
      const switcher = await boxes(page, 'switcher');
      const tops = new Set(switcher.children.map(child => Math.round(child.y)));
      expect(tops.size === 1 || tops.size === switcher.children.length).toBe(true);
      expect(tops.size === 1).toBe(switcher.own.width >= 40 * switcher.rem);

      // Grid: as many columns of at least 12rem as fit.
      const grid = await boxes(page, 'grid');
      const columns = new Set(grid.children.map(child => Math.round(child.x))).size;
      const fit = Math.max(1, Math.floor((grid.own.width + grid.rem) / (12 * grid.rem + grid.rem)));
      expect(columns).toBe(Math.min(fit, grid.children.length));
      for (const cell of grid.children) expect(cell.width).toBeGreaterThanOrEqual(Math.min(12 * grid.rem, grid.own.width) - 0.5);

      // A capped Grid: as many 6rem columns as fit, but never more than three.
      const capped = await boxes(page, 'grid-capped');
      const cappedColumns = new Set(capped.children.map(child => Math.round(child.x))).size;
      const cappedFit = Math.max(1, Math.floor((capped.own.width + capped.rem) / (6 * capped.rem + capped.rem)));
      expect(cappedColumns).toBe(Math.min(cappedFit, 3));
      // Its rows are 2rem apart (rowSpace 8) while its columns keep 1rem.
      const cappedRows = [...new Set(capped.children.map(child => Math.round(child.y)))].sort((a, b) => a - b);
      const firstRow = capped.children.filter(child => Math.round(child.y) === cappedRows[0]);
      const secondRow = capped.children.filter(child => Math.round(child.y) === cappedRows[1]);
      expect(secondRow[0].y - Math.max(...firstRow.map(child => child.y + child.height))).toBeCloseTo(2 * capped.rem, 0);
      if (firstRow.length > 1) expect(firstRow[1].x - (firstRow[0].x + firstRow[0].width)).toBeCloseTo(capped.rem, 0);

      // Cover: at least 20rem tall, the marked child in the middle.
      const cover = await boxes(page, 'cover');
      expect(cover.own.height).toBeGreaterThanOrEqual(20 * cover.rem - 0.5);
      const centred = cover.children.find(child => child.centre)!;
      expect(centred.y + centred.height / 2).toBeCloseTo(cover.own.y + cover.own.height / 2, 0);

      // Reel: one row of 12rem items that scrolls rather than wraps.
      const reel = await boxes(page, 'reel');
      expect(new Set(reel.children.map(child => Math.round(child.y))).size).toBe(1);
      for (const item of reel.children) expect(item.width).toBeCloseTo(12 * reel.rem, 0);
      expect(reel.scroll.width).toBeGreaterThan(reel.scroll.client);

      // Frame: 4:3, with the illustration filling it.
      const frame = await boxes(page, 'frame');
      expect(frame.own.width / frame.own.height).toBeCloseTo(4 / 3, 2);
      expect(frame.children[0].width).toBeCloseTo(frame.own.width, 0);
      expect(frame.children[0].height).toBeCloseTo(frame.own.height, 0);

      // Nothing on the page scrolls sideways except the Reel.
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    });
  }

  test('sit in the composition layer, after base and before blocks', async ({ page }) => {
    await page.goto('/catalogue/layout/');
    const order = await page.evaluate(() => {
      const rule = document.styleSheets[0]?.cssRules[0];
      return rule instanceof CSSLayerStatementRule ? [...rule.nameList] : null;
    });
    expect(order).toEqual(['kit', 'base', 'composition', 'utilities', 'blocks', 'exceptions']);
  });
});
