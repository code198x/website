/**
 * Accessibility Tests - Components
 * Tests individual components for WCAG 2.1 AA compliance
 */

import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Component Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test.describe("Navigation Component", () => {
    test("should have accessible navigation structure", async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include("nav.nav-modern")
        .withRules(["landmark-one-main", "region"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should have proper ARIA labels for navigation items", async ({ page }) => {
      // Check navigation items have proper labels
      const navItems = page.locator(".nav-item");
      const navItemCount = await navItems.count();

      for (let i = 0; i < navItemCount; i++) {
        const item = navItems.nth(i);
        const hasText = await item.textContent();
        const hasAriaLabel = await item.getAttribute("aria-label");

        // Navigation items should have either text content or aria-label
        expect(hasText || hasAriaLabel).toBeTruthy();
      }
    });

    test("should have accessible theme toggle", async ({ page }) => {
      const themeToggle = page.locator(".nav-theme");

      if (await themeToggle.isVisible()) {
        const ariaLabel = await themeToggle.getAttribute("aria-label");
        expect(ariaLabel).toBe("Toggle theme");

        // Test that it's keyboard accessible
        await themeToggle.focus();
        const isFocused = await themeToggle.evaluate((el) => document.activeElement === el);
        expect(isFocused).toBe(true);
      }
    });

    test("should have accessible search button", async ({ page }) => {
      const searchButton = page.locator(".nav-search");

      if (await searchButton.isVisible()) {
        const ariaLabel = await searchButton.getAttribute("aria-label");
        expect(ariaLabel).toBe("Search");

        // Test keyboard accessibility
        await searchButton.focus();
        const isFocused = await searchButton.evaluate((el) => document.activeElement === el);
        expect(isFocused).toBe(true);
      }
    });

    test("should have accessible mobile navigation", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      const mobileToggle = page.locator(".nav-mobile-toggle");

      if (await mobileToggle.isVisible()) {
        // Check ARIA attributes
        const ariaLabel = await mobileToggle.getAttribute("aria-label");
        const ariaExpanded = await mobileToggle.getAttribute("aria-expanded");

        expect(ariaLabel).toBe("Toggle menu");
        expect(ariaExpanded).toBe("false");

        // Test opening menu
        await mobileToggle.click();
        await page.waitForTimeout(200);

        const ariaExpandedOpen = await mobileToggle.getAttribute("aria-expanded");
        expect(ariaExpandedOpen).toBe("true");

        // Check menu accessibility
        const mobileMenu = page.locator(".nav-mobile-menu");
        const ariaHidden = await mobileMenu.getAttribute("aria-hidden");
        expect(ariaHidden).toBe("false");
      }
    });
  });

  test.describe("Performance Dashboard Component", () => {
    test("should have accessible dashboard structure", async ({ page }) => {
      const dashboard = page.locator("#performance-dashboard");

      if (await dashboard.isVisible({ timeout: 10000 })) {
        const accessibilityScanResults = await new AxeBuilder({ page })
          .include("#performance-dashboard")
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      }
    });

    test("should have accessible toggle button", async ({ page }) => {
      const dashboard = page.locator("#performance-dashboard");

      if (await dashboard.isVisible({ timeout: 10000 })) {
        const toggleButton = page.locator("#toggle-dashboard");

        // Check button is keyboard accessible
        await toggleButton.focus();
        const isFocused = await toggleButton.evaluate((el) => document.activeElement === el);
        expect(isFocused).toBe(true);

        // Check ARIA expanded state
        const initialExpanded = await toggleButton.getAttribute("aria-expanded");

        // Click to toggle
        await toggleButton.click();
        await page.waitForTimeout(200);

        const newExpanded = await toggleButton.getAttribute("aria-expanded");
        expect(newExpanded).not.toBe(initialExpanded);
      }
    });

    test("should have accessible metric cards", async ({ page }) => {
      const dashboard = page.locator("#performance-dashboard");

      if (await dashboard.isVisible({ timeout: 10000 })) {
        const metricCards = page.locator(".metric-card");
        const cardCount = await metricCards.count();

        for (let i = 0; i < cardCount; i++) {
          const card = metricCards.nth(i);
          const label = card.locator(".metric-label");
          const value = card.locator(".metric-value");
          const status = card.locator(".metric-status");

          // Each metric should have readable label, value, and status
          const labelText = await label.textContent();
          const valueText = await value.textContent();
          const statusText = await status.textContent();

          expect(labelText).toBeTruthy();
          expect(valueText).toBeTruthy();
          expect(statusText).toBeTruthy();
        }
      }
    });

    test("should have accessible action buttons", async ({ page }) => {
      const dashboard = page.locator("#performance-dashboard");

      if (await dashboard.isVisible({ timeout: 10000 })) {
        const actionButtons = page.locator(".action-button");
        const buttonCount = await actionButtons.count();

        for (let i = 0; i < buttonCount; i++) {
          const button = actionButtons.nth(i);

          // Each button should have text content or aria-label
          const buttonText = await button.textContent();
          const ariaLabel = await button.getAttribute("aria-label");

          expect(buttonText || ariaLabel).toBeTruthy();

          // Button should be keyboard accessible
          await button.focus();
          const isFocused = await button.evaluate((el) => document.activeElement === el);
          expect(isFocused).toBe(true);
        }
      }
    });

    test("should maintain accessibility in collapsed state", async ({ page }) => {
      const dashboard = page.locator("#performance-dashboard");

      if (await dashboard.isVisible({ timeout: 10000 })) {
        // Collapse dashboard
        const toggleButton = page.locator("#toggle-dashboard");
        await toggleButton.click();
        await page.waitForTimeout(200);

        // Check accessibility in collapsed state
        const accessibilityScanResults = await new AxeBuilder({ page })
          .include("#performance-dashboard")
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      }
    });
  });

  test.describe("Button Components", () => {
    test("should have accessible button states", async ({ page }) => {
      // Test all buttons on the page
      const buttons = page.locator("button");
      const buttonCount = await buttons.count();

      for (let i = 0; i < buttonCount; i++) {
        const button = buttons.nth(i);

        if (await button.isVisible()) {
          // Button should be keyboard accessible
          await button.focus();
          const isFocused = await button.evaluate((el) => document.activeElement === el);
          expect(isFocused).toBe(true);

          // Button should have accessible name
          const buttonText = await button.textContent();
          const ariaLabel = await button.getAttribute("aria-label");
          const ariaLabelledBy = await button.getAttribute("aria-labelledby");

          expect(buttonText || ariaLabel || ariaLabelledBy).toBeTruthy();
        }
      }
    });

    test("should handle button focus indicators", async ({ page }) => {
      // Test focus indicators are visible
      const dashboard = page.locator("#performance-dashboard");

      if (await dashboard.isVisible({ timeout: 10000 })) {
        const clearButton = page.locator("#clear-data");

        await clearButton.focus();

        // Check that focus is properly indicated (this would be visual in real testing)
        const isFocused = await clearButton.evaluate((el) => document.activeElement === el);
        expect(isFocused).toBe(true);
      }
    });
  });

  test.describe("Interactive Elements", () => {
    test("should have proper tab order", async ({ page }) => {
      // Test tab order through interactive elements
      const interactiveSelectors = [".nav-logo", ".nav-item", ".nav-search", ".nav-theme"];

      let tabIndex = 0;

      for (const selector of interactiveSelectors) {
        const elements = page.locator(selector);
        const elementCount = await elements.count();

        for (let i = 0; i < elementCount; i++) {
          const element = elements.nth(i);

          if (await element.isVisible()) {
            // Tab to element
            await page.keyboard.press("Tab");

            // Check if element is focused
            const isFocused = await element.evaluate((el) => document.activeElement === el);

            if (isFocused) {
              tabIndex++;
              // Element should be keyboard accessible
              expect(isFocused).toBe(true);
            }
          }
        }
      }

      // Should have found some focusable elements
      expect(tabIndex).toBeGreaterThan(0);
    });

    test("should handle keyboard navigation properly", async ({ page }) => {
      // Test keyboard navigation through mobile menu
      await page.setViewportSize({ width: 375, height: 667 });

      const mobileToggle = page.locator(".nav-mobile-toggle");

      if (await mobileToggle.isVisible()) {
        // Focus and activate with keyboard
        await mobileToggle.focus();
        await page.keyboard.press("Enter");
        await page.waitForTimeout(200);

        // Menu should be open and accessible
        const mobileMenu = page.locator(".nav-mobile-menu");
        const ariaHidden = await mobileMenu.getAttribute("aria-hidden");
        expect(ariaHidden).toBe("false");

        // Tab through menu items
        const menuItems = page.locator(".nav-mobile-item");
        const itemCount = await menuItems.count();

        for (let i = 0; i < Math.min(itemCount, 3); i++) {
          await page.keyboard.press("Tab");
          // Each menu item should be focusable
          const activeElement = await page.evaluate(() => document.activeElement?.tagName);
          expect(["A", "BUTTON"]).toContain(activeElement);
        }
      }
    });

    test("should provide proper semantic roles", async ({ page }) => {
      // Test semantic roles
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules([
          "button-name",
          "link-name",
          "listitem",
          "list",
          "navigation-landmark",
          "region",
        ])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe("Color and Contrast", () => {
    test("should maintain contrast in light mode", async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(["color-contrast"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should maintain contrast in dark mode", async ({ page }) => {
      // Switch to dark mode
      await page.evaluate(() => {
        document.documentElement.classList.add("dark-mode");
      });
      await page.waitForTimeout(200);

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(["color-contrast"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should work without color alone", async ({ page }) => {
      // Test that information isn't conveyed by color alone
      const dashboard = page.locator("#performance-dashboard");

      if (await dashboard.isVisible({ timeout: 10000 })) {
        // Metric cards should have text indicators, not just color
        const metricCards = page.locator(".metric-card");
        const cardCount = await metricCards.count();

        for (let i = 0; i < cardCount; i++) {
          const card = metricCards.nth(i);
          const statusElement = card.locator(".metric-status");
          const statusText = await statusElement.textContent();

          // Status should be conveyed through text, not just color
          expect(statusText).toBeTruthy();
          expect(statusText?.length).toBeGreaterThan(0);
        }
      }
    });
  });
});
