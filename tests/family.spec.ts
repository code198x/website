import { test, expect } from '@playwright/test';

/**
 * The /family hub page (the 198x family cross-promotion surface).
 * Guards the two things that broke or were hard to verify manually:
 * no horizontal overflow on mobile, and the footer family strip present
 * on every page.
 */
test.describe('/family', () => {
  test('renders without horizontal overflow', async ({ page }) => {
    await page.goto('/family');
    await page.waitForLoadState('networkidle');

    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    // Allow 1px for sub-pixel rounding; anything more is a real overflow.
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
  });

  test('shows the six sibling cards with correct status badges', async ({ page }) => {
    await page.goto('/family');
    await expect(page.locator('.sibling-card')).toHaveCount(6);
    await expect(page.getByRole('heading', { name: 'Emu198x' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Forge198x' })).toBeVisible();
    // Forge198x is planned: no outbound link, just the "in design" note.
    const forgeCard = page.locator('.sibling-card').filter({ hasText: 'Forge198x' });
    await expect(forgeCard.locator('.sibling-link.disabled')).toBeVisible();
  });

  test('footer family strip links to the sibling orgs', async ({ page }) => {
    await page.goto('/family');
    const footer = page.locator('.footer-family');
    await expect(footer.getByRole('link', { name: 'Emu198x' })).toHaveAttribute(
      'href',
      'https://github.com/emu198x',
    );
    await expect(footer.getByRole('link', { name: '198x family' })).toHaveAttribute('href', '/family');
  });
});
