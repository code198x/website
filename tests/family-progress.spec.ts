import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('family progress', () => {
  test('reaches three priority projects from Family and About', async ({ page }) => {
    await page.goto('/family');
    await page.getByRole('link', { name: 'See where the projects stand and what comes next.' }).click();
    await expect(page).toHaveURL(/\/family\/progress\/?$/);
    await expect(page.getByRole('heading', { name: 'Where we stand.' })).toBeVisible();
    for (const name of ["Code Like It's 198x", 'Emu198x', 'Asm198x']) {
      await expect(page.locator('main .project-progress').getByRole('heading', { name, exact: true })).toBeVisible();
    }
    await expect(page.locator('.progress-project')).toHaveCount(3);
    await expect(page.locator('.progress-opening')).toContainText('Snapshot checked');
    await expect(page.locator('.progress-opening time')).toHaveCount(1);
    await expect(page.getByText('A recommendation for review; we can revise this as priorities change.')).toHaveCount(3);
    await page.goto('/about');
    await page.getByRole('link', { name: 'See where Code198x, Emu198x and Asm198x stand' }).click();
    await expect(page).toHaveURL(/\/family\/progress\/?$/);
  });

  test('keeps measurements one click below and downloads the same snapshot', async ({ page, request }) => {
    await page.goto('/family/progress');
    await page.getByRole('link', { name: 'Detailed evidence', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'The supporting evidence.' })).toBeVisible();
    await expect(page.locator('.progress-result')).toHaveCount(5);
    await expect(page.locator('#aabb')).toContainText('Retro CPU execution');
    const response = await request.get('/family/progress/snapshot.json');
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toContain('application/json');
    const data = await response.json();
    expect(data.briefing).toHaveLength(3);
    expect(data.capabilities).toHaveLength(5);
    expect(data.checked_on).toBe(await page.locator('.progress-opening time').getAttribute('datetime'));
    const reveal = page.locator('#spectrum > details');
    await reveal.locator('> summary').focus();
    await page.keyboard.press('Enter');
    await expect(reveal).toHaveAttribute('open', '');
    await expect(reveal.getByRole('table', { name: 'Direct tools identified in this run' })).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(reveal).not.toHaveAttribute('open');
    await page.getByRole('link', { name: 'Back to project progress', exact: true }).click();
    await expect(page).toHaveURL(/\/family\/progress\/?$/);
  });

  test('uses the site frame and remains readable under both OS colour preferences', async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    for (const colorScheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme });
      for (const route of ['progress', 'progress/evidence']) {
        await page.goto(`/family/${route}`);
        await page.evaluate(() => document.fonts.ready);
        const layout = await page.locator('main .project-progress').evaluate(el => {
          const rect = el.getBoundingClientRect();
          return { left: rect.left, width: rect.width, overflow: document.documentElement.scrollWidth > innerWidth + 1,
            font: getComputedStyle(el).fontFamily, size: parseFloat(getComputedStyle(el).fontSize),
            frame: el.getAttribute('data-page-frame') !== null, scheme: getComputedStyle(document.documentElement).colorScheme };
        });
        expect(layout.frame).toBe(true);
        expect(layout.width).toBeLessThanOrEqual(1265);
        expect(layout.left).toBeGreaterThanOrEqual(0);
        expect(layout.overflow).toBe(false);
        expect(layout.font).toContain('Nebula');
        expect(layout.size).toBeGreaterThanOrEqual(20);
        // The active House UI is paper-only, including under a dark OS preference.
        expect(layout.scheme).toBe('light');
        if (route === 'progress') {
          await page.getByRole('link', { name: 'Code198x', exact: true }).click();
        }
        await page.screenshot({ path: testInfo.outputPath(`${route.replaceAll('/','-')}-${colorScheme}.png`) });
      }
    }
    expect(errors).toEqual([]);
  });

  test('passes focused accessibility checks, including expanded source records', async ({ page }) => {
    for (const route of ['progress', 'progress/evidence']) {
      await page.goto(`/family/${route}`);
      const first = page.locator('main .project-progress details').first();
      await first.locator('> summary').click();
      const results = await new AxeBuilder({ page }).include('main .project-progress').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
      expect(results.violations).toEqual([]);
    }
  });
});
