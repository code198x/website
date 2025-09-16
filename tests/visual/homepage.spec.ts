/**
 * Visual Regression Tests - Homepage
 * Tests the main landing page visual consistency
 */

import { test, expect } from '@playwright/test';

test.describe('Homepage Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Disable animations for consistent screenshots
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-delay: -1ms !important;
          animation-duration: 1ms !important;
          animation-fill-mode: both !important;
          transition-delay: 0s !important;
          transition-duration: 0s !important;
        }
      `
    });
  });

  test('homepage full page screenshot', async ({ page }) => {
    // Take full page screenshot
    await expect(page).toHaveScreenshot('homepage-full.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('homepage above-the-fold', async ({ page }) => {
    // Screenshot of viewport area only
    await expect(page).toHaveScreenshot('homepage-hero.png', {
      animations: 'disabled',
    });
  });

  test('homepage navigation', async ({ page }) => {
    // Focus on main navigation area
    const nav = page.locator('nav.nav-modern');
    await expect(nav).toHaveScreenshot('homepage-navigation.png', {
      animations: 'disabled',
    });
  });

  test('homepage with mobile navigation open', async ({ page }) => {
    // Test mobile menu on smaller viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    // Open mobile menu
    const mobileToggle = page.locator('.nav-mobile-toggle');
    if (await mobileToggle.isVisible()) {
      await mobileToggle.click();

      // Wait for animation to complete
      await page.waitForTimeout(300);

      // Screenshot with mobile menu open
      await expect(page).toHaveScreenshot('homepage-mobile-menu-open.png', {
        animations: 'disabled',
      });
    }
  });

  test('homepage performance dashboard', async ({ page }) => {
    // Wait for performance dashboard to appear (if enabled)
    const dashboard = page.locator('#performance-dashboard');

    if (await dashboard.isVisible({ timeout: 5000 })) {
      await expect(dashboard).toHaveScreenshot('homepage-performance-dashboard.png', {
        animations: 'disabled',
      });

      // Test dashboard collapsed state
      const toggleButton = dashboard.locator('#toggle-dashboard');
      await toggleButton.click();
      await page.waitForTimeout(200);

      await expect(dashboard).toHaveScreenshot('homepage-performance-dashboard-collapsed.png', {
        animations: 'disabled',
      });
    }
  });

  test('homepage dark mode', async ({ page, context }) => {
    // Switch to dark mode
    await page.evaluate(() => {
      document.documentElement.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    });

    // Wait for theme change to apply
    await page.waitForTimeout(100);

    // Take screenshot in dark mode
    await expect(page).toHaveScreenshot('homepage-dark-mode.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('homepage responsive breakpoints', async ({ page }) => {
    // Test different viewport sizes
    const breakpoints = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1024, height: 768 },
      { name: 'large-desktop', width: 1440, height: 900 },
    ];

    for (const { name, width, height } of breakpoints) {
      await page.setViewportSize({ width, height });
      await page.waitForTimeout(200); // Allow layout to settle

      await expect(page).toHaveScreenshot(`homepage-${name}.png`, {
        animations: 'disabled',
      });
    }
  });

  test('homepage with theme toggle interaction', async ({ page }) => {
    // Focus on theme toggle button
    const themeToggle = page.locator('.nav-theme');

    if (await themeToggle.isVisible()) {
      // Screenshot before toggle
      await expect(page.locator('nav.nav-modern')).toHaveScreenshot('homepage-theme-light.png', {
        animations: 'disabled',
      });

      // Click theme toggle
      await themeToggle.click();
      await page.waitForTimeout(100);

      // Screenshot after toggle
      await expect(page.locator('nav.nav-modern')).toHaveScreenshot('homepage-theme-dark.png', {
        animations: 'disabled',
      });
    }
  });

  test('homepage content sections', async ({ page }) => {
    // Test individual content sections
    const sections = [
      'header',
      'main',
      'footer',
    ];

    for (const section of sections) {
      const element = page.locator(section).first();

      if (await element.isVisible()) {
        await expect(element).toHaveScreenshot(`homepage-${section}.png`, {
          animations: 'disabled',
        });
      }
    }
  });

  test('homepage loading states', async ({ page }) => {
    // Test page before full load
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Screenshot of initial load state
    await expect(page).toHaveScreenshot('homepage-loading.png', {
      animations: 'disabled',
    });

    // Wait for full load and compare
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('homepage-loaded.png', {
      animations: 'disabled',
    });
  });
});