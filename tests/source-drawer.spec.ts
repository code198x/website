import { test, expect } from '@playwright/test';

// Lesson source editors keep a fixed height and scroll inside it, so a long
// listing does not push the machine and its controls off the screen.
const EDITORS = [
  { route: '/systems/nintendo-entertainment-system/assembly/meet-the-machine/unit-01/', editor: 'code198x-nes-editor' },
  { route: '/systems/sinclair-zx-spectrum/assembly/meteor-storm/unit-35/', editor: '.sandbox' },
];

for (const { route, editor } of EDITORS) {
  test(`the source editor on ${route} keeps its 320px height`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(route);
    const root = page.locator(editor).first();
    await root.locator('details').first().evaluate(details => { (details as HTMLDetailsElement).open = true; });
    const source = root.locator('textarea.sandbox-source');
    await expect(source).toBeVisible();
    await expect.poll(async () => Math.round((await source.boundingBox())?.height ?? 0)).toBe(320);
  });
}
