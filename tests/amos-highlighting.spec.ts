import { expect, test } from '@playwright/test';

for (const width of [390, 1440]) {
  for (const theme of ['light', 'dark']) {
    test(`AMOS lesson preserves its source and readable roles at ${width}px in ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript((value) => localStorage.setItem('theme', value), theme);
      await page.emulateMedia({ colorScheme: theme as 'light' | 'dark' });
      await page.goto('/systems/commodore-amiga/amos/meet-amos/unit-01/');
      const listing = page.locator('.lesson-listing').filter({ hasText: 'Hello from AMOS!' }).first();
      const code = listing.locator('pre code');
      await expect(code).toHaveText('Hide\nPrint "Hello from AMOS!"\nWait Key');
      await expect(code.locator('.hl-kw')).toHaveText(['Hide', 'Print', 'Wait Key']);
      await expect(code.locator('.hl-str')).toHaveText('"Hello from AMOS!"');
      const inks = await code.locator('.hl-kw, .hl-str').evaluateAll((elements) =>
        elements.map((element) => getComputedStyle(element).color));
      expect(new Set(inks).size).toBe(2);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    });
  }
}
