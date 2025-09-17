/**
 * Accessibility Tests - Educational Content
 * Tests educational platform specific accessibility requirements
 * Focus on learning accessibility and student needs
 */

import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {
  createAxeBuilder,
  getAccessibilityConfig,
  EducationalAccessibilityHelpers,
} from "./axe.config";

test.describe("Educational Content Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test.describe("Learning Interface Accessibility", () => {
    test("should provide accessible learning navigation", async ({ page }) => {
      // Test that students can navigate learning content accessibly
      const accessibilityScanResults = await createAxeBuilder(
        page,
        getAccessibilityConfig("full")
      ).analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should have accessible skip links for efficiency", async ({ page }) => {
      // Educational platforms should allow efficient navigation
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(["bypass"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should provide proper page structure for screen readers", async ({ page }) => {
      // Test educational content structure
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules([
          "page-has-heading-one",
          "heading-order",
          "landmark-one-main",
          "landmark-banner-is-top-level",
          "landmark-main-is-top-level",
        ])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should support keyboard-only learning", async ({ page }) => {
      // Test that students can learn using only keyboard
      const keyboardElements = [".nav-logo", ".nav-item", ".nav-theme", ".nav-search"];

      for (const selector of keyboardElements) {
        const element = page.locator(selector).first();

        if (await element.isVisible()) {
          // Should be focusable
          await element.focus();
          const isFocused = await element.evaluate((el) => document.activeElement === el);
          expect(isFocused).toBe(true);

          // Should have visible focus indicator
          const focusStyles = await element.evaluate((el) => {
            const computed = window.getComputedStyle(el, ":focus");
            return {
              outline: computed.outline,
              outlineWidth: computed.outlineWidth,
              boxShadow: computed.boxShadow,
            };
          });

          // Should have some form of focus indication
          const hasFocusIndicator =
            focusStyles.outline !== "none" ||
            focusStyles.outlineWidth !== "0px" ||
            focusStyles.boxShadow !== "none";

          expect(hasFocusIndicator).toBe(true);
        }
      }
    });
  });

  test.describe("Code Examples and Technical Content", () => {
    test("should have accessible code examples", async ({ page }) => {
      // Navigate to a lesson page with code examples
      const lessonLinks = page.locator('a[href*="/lessons/"]');

      if ((await lessonLinks.count()) > 0) {
        await lessonLinks.first().click();
        await page.waitForLoadState("networkidle");

        // Check code examples accessibility
        const isAccessible = await EducationalAccessibilityHelpers.checkCodeExamples(page);
        expect(isAccessible).toBe(true);

        // Test syntax highlighting doesn't rely on color alone
        const codeBlocks = page.locator("pre code, .code-block");

        if ((await codeBlocks.count()) > 0) {
          const accessibilityScanResults = await new AxeBuilder({ page })
            .include("pre, .code-block")
            .withRules(["color-contrast"])
            .analyze();

          expect(accessibilityScanResults.violations).toEqual([]);
        }
      }
    });

    test("should provide alternative formats for visual learners", async ({ page }) => {
      // Test that visual content has text alternatives
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(["image-alt", "object-alt"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should support high contrast for visual impairments", async ({ page }) => {
      // Test high contrast mode compatibility
      await page.emulateMedia({ colorScheme: "dark" });
      await page.evaluate(() => {
        document.documentElement.classList.add("dark-mode");
      });
      await page.waitForTimeout(200);

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(["color-contrast"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should work with browser zoom up to 200%", async ({ page }) => {
      // Test zoom accessibility (WCAG 2.1 AA requirement)
      await page.setViewportSize({ width: 1280, height: 720 });

      // Simulate 200% zoom by scaling viewport
      await page.setViewportSize({ width: 640, height: 360 });
      await page.waitForTimeout(300);

      // Content should still be accessible
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(["color-contrast", "target-size"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);

      // Interactive elements should still be usable
      const hasAdequateTargets = await EducationalAccessibilityHelpers.checkTargetSizes(page);
      expect(hasAdequateTargets).toBe(true);
    });
  });

  test.describe("Performance Monitoring Accessibility", () => {
    test("should have accessible performance dashboard", async ({ page }) => {
      const dashboard = page.locator("#performance-dashboard");

      if (await dashboard.isVisible({ timeout: 10000 })) {
        const accessibilityScanResults = await createAxeBuilder(
          page,
          getAccessibilityConfig("performance")
        )
          .include("#performance-dashboard")
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      }
    });

    test("should not overwhelm screen readers with rapid updates", async ({ page }) => {
      const dashboard = page.locator("#performance-dashboard");

      if (await dashboard.isVisible({ timeout: 10000 })) {
        // Check that performance metrics don't spam screen readers
        const appropriateAnnouncements =
          await EducationalAccessibilityHelpers.checkMetricAnnouncements(page);
        expect(appropriateAnnouncements).toBe(true);
      }
    });

    test("should provide summary information for metrics", async ({ page }) => {
      const dashboard = page.locator("#performance-dashboard");

      if (await dashboard.isVisible({ timeout: 10000 })) {
        // Each metric should have descriptive label and status
        const metricCards = page.locator(".metric-card");
        const cardCount = await metricCards.count();

        for (let i = 0; i < cardCount; i++) {
          const card = metricCards.nth(i);
          const label = await card.locator(".metric-label").textContent();
          const status = await card.locator(".metric-status").textContent();

          // Should have meaningful labels and status
          expect(label).toBeTruthy();
          expect(status).toBeTruthy();
          expect(label?.length).toBeGreaterThan(1);
          expect(status?.length).toBeGreaterThan(1);
        }
      }
    });

    test("should allow performance data export for accessibility tools", async ({ page }) => {
      const dashboard = page.locator("#performance-dashboard");

      if (await dashboard.isVisible({ timeout: 10000 })) {
        const exportButton = page.locator("#export-data");

        if (await exportButton.isVisible()) {
          // Export button should be keyboard accessible
          await exportButton.focus();
          const isFocused = await exportButton.evaluate((el) => document.activeElement === el);
          expect(isFocused).toBe(true);

          // Should have accessible name
          const buttonText = await exportButton.textContent();
          expect(buttonText).toContain("Export");
        }
      }
    });
  });

  test.describe("Motor Accessibility", () => {
    test("should have adequate touch target sizes", async ({ page }) => {
      // Test for users with motor impairments
      const hasAdequateTargets = await EducationalAccessibilityHelpers.checkTargetSizes(page);
      expect(hasAdequateTargets).toBe(true);
    });

    test("should not require precise timing", async ({ page }) => {
      // Test that interactions don't require precise timing
      const dashboard = page.locator("#performance-dashboard");

      if (await dashboard.isVisible({ timeout: 10000 })) {
        const toggleButton = page.locator("#toggle-dashboard");

        // Click should work with deliberate timing
        await toggleButton.focus();
        await page.waitForTimeout(500); // Deliberate pause
        await toggleButton.click();
        await page.waitForTimeout(300);

        const ariaExpanded = await toggleButton.getAttribute("aria-expanded");
        expect(["true", "false"]).toContain(ariaExpanded);
      }
    });

    test("should work with alternative input devices", async ({ page }) => {
      // Test keyboard navigation as proxy for alternative input devices
      const navItems = page.locator(".nav-item");

      if ((await navItems.count()) > 0) {
        // Should be able to navigate with Tab key
        await page.keyboard.press("Tab");

        const activeElement = await page.evaluate(() => {
          return document.activeElement?.tagName.toLowerCase();
        });

        expect(["a", "button", "input"]).toContain(activeElement);
      }
    });
  });

  test.describe("Cognitive Accessibility", () => {
    test("should have consistent navigation patterns", async ({ page }) => {
      // Test navigation consistency for cognitive accessibility
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules([
          "landmark-no-duplicate-banner",
          "landmark-no-duplicate-main",
          "navigation-landmark",
        ])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should provide clear feedback for interactions", async ({ page }) => {
      const dashboard = page.locator("#performance-dashboard");

      if (await dashboard.isVisible({ timeout: 10000 })) {
        const toggleButton = page.locator("#toggle-dashboard");

        // Initial state should be clear
        const initialExpanded = await toggleButton.getAttribute("aria-expanded");
        expect(["true", "false"]).toContain(initialExpanded);

        // After interaction, state should change clearly
        await toggleButton.click();
        await page.waitForTimeout(200);

        const newExpanded = await toggleButton.getAttribute("aria-expanded");
        expect(newExpanded).not.toBe(initialExpanded);
      }
    });

    test("should support learning at different paces", async ({ page }) => {
      // No time-based content should auto-advance
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(["audio-control", "video-control"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should provide help and documentation access", async ({ page }) => {
      // Look for help or documentation links
      const helpLinks = page.locator('a[href*="help"], a[href*="docs"], a[href*="about"]');

      if ((await helpLinks.count()) > 0) {
        const firstHelp = helpLinks.first();

        // Should be keyboard accessible
        await firstHelp.focus();
        const isFocused = await firstHelp.evaluate((el) => document.activeElement === el);
        expect(isFocused).toBe(true);
      }
    });
  });

  test.describe("Multi-language and Internationalization", () => {
    test("should have proper language declarations", async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(["html-has-lang", "html-lang-valid"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should handle direction changes appropriately", async ({ page }) => {
      // Test RTL support if applicable
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(["valid-lang"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe("Error Prevention and Recovery", () => {
    test("should provide clear error messages", async ({ page }) => {
      // Test error handling accessibility
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(["aria-describedby", "form-field-multiple-labels", "label"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should allow error recovery", async ({ page }) => {
      // Test that users can recover from errors
      // This would be more relevant with forms, but test current interactive elements
      const buttons = page.locator("button");

      if ((await buttons.count()) > 0) {
        const firstButton = buttons.first();

        // Should be able to focus and unfocus
        await firstButton.focus();
        await page.keyboard.press("Tab");

        // Should be able to return focus
        await firstButton.focus();
        const isFocused = await firstButton.evaluate((el) => document.activeElement === el);
        expect(isFocused).toBe(true);
      }
    });
  });
});
