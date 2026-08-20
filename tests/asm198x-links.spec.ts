import { test, expect } from '@playwright/test';
import { ASM198X_INSTRUCTION_PAGES } from '../src/lib/surfaces';

/**
 * System stub pages link out to Asm198x's instruction reference.
 *
 * The join between the two projects is a stated mapping — they name the same
 * chip differently (`6502` here, `mos6502` there) — so the risk is a link that
 * points at a page Asm198x does not publish. That fails silently: the card
 * renders, looks right, and 404s only when someone clicks it.
 *
 * These guard the two halves: the card appears with the correct target where a
 * page exists, and stays away where none does.
 */
test.describe('Asm198x instruction links', () => {
  test('a documented CPU gets a card pointing at its page', async ({ page }) => {
    await page.goto('/intellivision');
    const link = page.getByRole('link', { name: /cp1610 instructions/i });
    await expect(link).toHaveAttribute(
      'href',
      'https://asm198x.github.io/docs/instructions/cp1610.html',
    );
  });

  test('an undocumented CPU gets no card', async ({ page }) => {
    // The WonderSwan is a Sphinx/NEC V30-class part; Asm198x has no page.
    await page.goto('/bandai-wonderswan');
    await expect(
      page.locator('a[href*="asm198x.github.io/docs/instructions"]'),
    ).toHaveCount(0);
  });

  test('every mapped page is one Asm198x actually publishes', async ({ request }) => {
    for (const page of Object.values(ASM198X_INSTRUCTION_PAGES)) {
      const url = `https://asm198x.github.io/docs/instructions/${page}.html`;
      const response = await request.head(url);
      expect(response.status(), `${url} should resolve`).toBe(200);
    }
  });
});
