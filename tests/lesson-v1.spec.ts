import { test, expect } from '@playwright/test';

const GATE = ['/systems/sinclair-zx-spectrum/assembly/meteor-storm/unit-28', '/systems/sinclair-zx-spectrum/basic/meet-basic/unit-01-make-the-spectrum-answer'];

for (const path of GATE) {
  test(`lesson v1: ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState('networkidle');

    // Reading is Nebula Sans.
    const body = await page.locator('.unit-content p').first().evaluate((el) => getComputedStyle(el).fontFamily);
    expect(body).toMatch(/^"?Nebula Sans/);

    // The masthead carries the game in the magazine face, and the face really loaded.
    const mast = page.locator('.lesson-mast-game');
    await expect(mast).toBeVisible();
    expect(await mast.evaluate((el) => getComputedStyle(el).fontFamily)).toMatch(/Fira Sans Condensed/);
    // fonts.check() is false for a subset nothing on the page has asked for yet (Cyrillic), so load first.
    expect(
      await page.evaluate(async () => {
        const face = 'italic 900 24px "Fira Sans Condensed"';
        const text = 'METEOR Электроника';
        await document.fonts.load(face, text);
        return document.fonts.check(face, text);
      }),
    ).toBe(true);

    // No horizontal scroll at any project width (Pixel 7 runs this at 412px).
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test('a Spectrum lesson takes the Spectrum spot ink at the root', async ({ page }) => {
  await page.goto(GATE[0]);
  const root = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--h-accent-ink').trim());
  expect(root).not.toBe('#a93800'); // not the Code198x project colour: the machine wins
  expect(root).toMatch(/^#[0-9a-f]{6}$/i);
});

test('prediction panel is yellow with readable ink', async ({ page }) => {
  await page.goto(GATE[0]);
  const q = page.locator('.question').first();
  expect(await q.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe('rgb(242, 210, 46)');
  expect(await q.locator('.question-prompt').evaluate((el) => getComputedStyle(el).color)).toBe('rgb(27, 26, 23)');
});
