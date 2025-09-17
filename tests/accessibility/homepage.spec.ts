/**
 * Accessibility Tests - Homepage
 * Tests homepage compliance with WCAG 2.1 AA guidelines
 */

import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Homepage Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("should not have any automatically detectable accessibility issues", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should pass accessibility audit for navigation", async ({ page }) => {
    // Focus specifically on navigation area
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include("nav.nav-modern")
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should pass accessibility audit for performance dashboard", async ({ page }) => {
    // Wait for performance dashboard to load
    const dashboard = page.locator("#performance-dashboard");

    if (await dashboard.isVisible({ timeout: 10000 })) {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include("#performance-dashboard")
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    }
  });

  test("should pass accessibility audit for main content", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).include("main").analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should maintain accessibility in dark mode", async ({ page }) => {
    // Switch to dark mode
    await page.evaluate(() => {
      document.documentElement.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    });

    await page.waitForTimeout(200);

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should have proper keyboard navigation", async ({ page }) => {
    // Test keyboard navigation through interactive elements
    const interactiveElements = [".nav-logo", ".nav-item", ".nav-theme", ".nav-search"];

    for (const selector of interactiveElements) {
      const element = page.locator(selector).first();

      if (await element.isVisible()) {
        await element.focus();

        // Check that focus is visible
        const isFocused = await element.evaluate((el) => {
          return document.activeElement === el;
        });

        expect(isFocused).toBe(true);
      }
    }
  });

  test("should have proper heading hierarchy", async ({ page }) => {
    // Test heading structure compliance
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(["heading-order"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should have proper color contrast", async ({ page }) => {
    // Test color contrast compliance
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(["color-contrast"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should have proper ARIA labels", async ({ page }) => {
    // Test ARIA label compliance
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules([
        "button-name",
        "link-name",
        "aria-label",
        "aria-labelledby",
        "landmark-one-main",
        "region",
      ])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should be accessible with screen reader simulation", async ({ page }) => {
    // Test screen reader accessibility patterns
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules([
        "bypass",
        "focus-order-semantics",
        "landmark-banner-is-top-level",
        "landmark-main-is-top-level",
        "landmark-no-duplicate-banner",
        "landmark-no-duplicate-main",
      ])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should handle mobile accessibility", async ({ page }) => {
    // Test mobile viewport accessibility
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(200);

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should pass accessibility with mobile menu open", async ({ page }) => {
    // Test mobile menu accessibility
    await page.setViewportSize({ width: 375, height: 667 });

    const mobileToggle = page.locator(".nav-mobile-toggle");
    if (await mobileToggle.isVisible()) {
      await mobileToggle.click();
      await page.waitForTimeout(300);

      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    }
  });

  test("should have accessible form elements and buttons", async ({ page }) => {
    // Test form and button accessibility
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(["button-name", "input-button-name", "link-in-text-block", "target-size"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should maintain accessibility during interactions", async ({ page }) => {
    // Test accessibility during common interactions
    const dashboard = page.locator("#performance-dashboard");

    if (await dashboard.isVisible({ timeout: 10000 })) {
      // Test collapsing dashboard
      const toggleButton = dashboard.locator("#toggle-dashboard");
      await toggleButton.click();
      await page.waitForTimeout(200);

      let accessibilityScanResults = await new AxeBuilder({ page }).analyze();
      expect(accessibilityScanResults.violations).toEqual([]);

      // Test expanding dashboard
      await toggleButton.click();
      await page.waitForTimeout(200);

      accessibilityScanResults = await new AxeBuilder({ page }).analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    }
  });

  test("should provide alternative text for images", async ({ page }) => {
    // Test image accessibility
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(["image-alt"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should have proper document structure", async ({ page }) => {
    // Test document structure accessibility
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(["document-title", "html-has-lang", "html-lang-valid", "page-has-heading-one"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
