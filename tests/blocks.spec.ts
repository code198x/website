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

const CARD_ROUTES = ['/curriculum/', '/crash-live/', '/updates/', '/demoscene/'];

for (const route of CARD_ROUTES) {
  test(`link cards on ${route} answer hover without lifting`, async ({ page }) => {
    await page.goto(route);
    const cards = page.locator('a.ink-card');
    expect(await cards.count(), `${route} shows no link cards`).toBeGreaterThan(0);
    const card = cards.first();
    await card.scrollIntoViewIfNeeded();
    const edge = () => card.evaluate(element => getComputedStyle(element).borderTopColor);
    expect(await card.evaluate(element => getComputedStyle(element).borderTopWidth)).toBe('3px');
    const rest = await edge();
    await card.hover();
    await expect.poll(edge).not.toBe(rest);
    expect(await card.evaluate(element => getComputedStyle(element).transform)).toBe('none');
    expect(await card.evaluate(element => getComputedStyle(element).boxShadow)).toBe('none');
  });
}

const PILL_ROUTES = ['/craft/', '/demoscene/', '/crash-live/', '/family/asm198x/'];

for (const route of PILL_ROUTES) {
  test(`pills on ${route} share one box and the label type`, async ({ page }) => {
    await page.goto(route);
    const pills = await page.$$eval('.pill', elements => elements
      .filter(element => element.getClientRects().length > 0)
      .map(element => {
        const style = getComputedStyle(element);
        return {
          text: (element.textContent ?? '').trim().slice(0, 40),
          label: element.classList.contains('label'),
          size: style.fontSize,
          border: style.borderTopWidth,
          padding: style.padding,
        };
      }));
    expect(pills.length, `${route} shows no pills`).toBeGreaterThan(0);
    for (const pill of pills) {
      expect(pill, `${route}: "${pill.text}"`).toMatchObject({ label: true, size: '14px', border: '2px', padding: '2px 8px' });
    }
  });
}
