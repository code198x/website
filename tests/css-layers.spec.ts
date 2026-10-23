import { test, expect } from '@playwright/test';

// The site's CSS relies on one cascade layer order. A browser fixes the order
// at the first mention of each layer, so the statement has to reach the page
// before any stylesheet that uses a layer, in the build as well as in dev.
const ORDER = ['kit', 'base', 'composition', 'utilities', 'blocks', 'exceptions'];

for (const route of ['/', '/systems/sinclair-zx-spectrum/assembly/meet-assembly/unit-01/', '/vault/']) {
  test(`${route} declares the layer order before any stylesheet @built`, async ({ page }) => {
    await page.goto(route);
    const first = await page.evaluate(() => {
      const sheet = document.styleSheets[0];
      const rule = sheet?.cssRules[0];
      return rule instanceof CSSLayerStatementRule ? [...rule.nameList] : null;
    });
    expect(first).toEqual(ORDER);
    // Every layer the page uses must be one the statement named, or it would
    // be appended after exceptions and outrank it.
    const used = await page.evaluate(() => {
      const names = new Set<string>();
      const walk = (rules: CSSRuleList) => {
        for (const rule of rules) {
          if (rule instanceof CSSLayerBlockRule) names.add(rule.name);
          if ('cssRules' in rule && rule.cssRules) walk(rule.cssRules as CSSRuleList);
        }
      };
      for (const sheet of document.styleSheets) {
        try { walk(sheet.cssRules); } catch { /* cross-origin sheet */ }
      }
      return [...names];
    });
    for (const name of used) expect(ORDER).toContain(name);
    expect(used).toEqual(expect.arrayContaining(['kit', 'composition', 'blocks']));
  });
}
