import { test, expect } from '@playwright/test';

// Shared blocks (src/styles/blocks.css) give every component that wears them
// one style. A component's own rule outranks the block, so this checks that
// none has put back a size, weight or tracking of its own.
const ROUTES = [
  '/vault/',
  '/vault/people/al-alcorn/',
  '/curriculum/',
  '/crash-live/',
  '/systems/commodore-64/assembly/',
  '/family/asm198x/',
  '/field-notes/',
  '/updates/',
  '/craft/game-feel/',
];

for (const route of ROUTES) {
  test(`labels on ${route} are set at the micro step`, async ({ page }) => {
    await page.goto(route);
    const labels = await page.$$eval('.label', elements => elements
      .filter(element => element.getClientRects().length > 0)
      .map(element => {
        const style = getComputedStyle(element);
        return { text: (element.textContent ?? '').trim().slice(0, 40), size: style.fontSize, weight: style.fontWeight, tracking: style.letterSpacing };
      }));
    expect(labels.length, `${route} shows no labels`).toBeGreaterThan(0);
    for (const label of labels) {
      expect(label, `${route}: "${label.text}"`).toMatchObject({ size: '14px', weight: '600', tracking: 'normal' });
    }
  });
}
