/**
 * Visual Regression Tests - Components
 * Tests individual UI components for visual consistency
 */

import { test, expect } from "@playwright/test";

test.describe("Component Visual Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage (components are loaded there)
    await page.goto("/");
    await page.waitForLoadState("networkidle");

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
      `,
    });
  });

  test.describe("Navigation Component", () => {
    test("desktop navigation", async ({ page }) => {
      const nav = page.locator(".nav-desktop");

      if (await nav.isVisible()) {
        await expect(nav).toHaveScreenshot("component-nav-desktop.png", {
          animations: "disabled",
        });
      }
    });

    test("mobile navigation header", async ({ page }) => {
      // Switch to mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      const mobileNav = page.locator(".nav-mobile-header");

      if (await mobileNav.isVisible()) {
        await expect(mobileNav).toHaveScreenshot("component-nav-mobile-header.png", {
          animations: "disabled",
        });
      }
    });

    test("mobile navigation menu open", async ({ page }) => {
      // Switch to mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      const mobileToggle = page.locator(".nav-mobile-toggle");

      if (await mobileToggle.isVisible()) {
        await mobileToggle.click();
        await page.waitForTimeout(300);

        const mobileMenu = page.locator(".nav-mobile-menu");
        await expect(mobileMenu).toHaveScreenshot("component-nav-mobile-menu.png", {
          animations: "disabled",
        });
      }
    });

    test("navigation logo", async ({ page }) => {
      const logo = page.locator(".nav-logo").first();

      if (await logo.isVisible()) {
        await expect(logo).toHaveScreenshot("component-nav-logo.png", {
          animations: "disabled",
        });
      }
    });

    test("navigation actions", async ({ page }) => {
      const actions = page.locator(".nav-actions");

      if (await actions.isVisible()) {
        await expect(actions).toHaveScreenshot("component-nav-actions.png", {
          animations: "disabled",
        });
      }
    });
  });

  test.describe("Performance Dashboard Component", () => {
    test("performance dashboard default state", async ({ page }) => {
      const dashboard = page.locator("#performance-dashboard");

      if (await dashboard.isVisible({ timeout: 10000 })) {
        await expect(dashboard).toHaveScreenshot("component-perf-dashboard-default.png", {
          animations: "disabled",
        });
      }
    });

    test("performance dashboard collapsed", async ({ page }) => {
      const dashboard = page.locator("#performance-dashboard");

      if (await dashboard.isVisible({ timeout: 10000 })) {
        const toggleButton = dashboard.locator("#toggle-dashboard");
        await toggleButton.click();
        await page.waitForTimeout(200);

        await expect(dashboard).toHaveScreenshot("component-perf-dashboard-collapsed.png", {
          animations: "disabled",
        });
      }
    });

    test("performance dashboard header", async ({ page }) => {
      const dashboard = page.locator("#performance-dashboard");

      if (await dashboard.isVisible({ timeout: 10000 })) {
        const header = dashboard.locator(".dashboard-header");
        await expect(header).toHaveScreenshot("component-perf-dashboard-header.png", {
          animations: "disabled",
        });
      }
    });

    test("performance dashboard metrics grid", async ({ page }) => {
      const dashboard = page.locator("#performance-dashboard");

      if (await dashboard.isVisible({ timeout: 10000 })) {
        const metricsGrid = dashboard.locator(".metrics-grid");
        await expect(metricsGrid).toHaveScreenshot("component-perf-dashboard-metrics.png", {
          animations: "disabled",
        });
      }
    });

    test("performance dashboard actions", async ({ page }) => {
      const dashboard = page.locator("#performance-dashboard");

      if (await dashboard.isVisible({ timeout: 10000 })) {
        const actions = dashboard.locator(".dashboard-actions");
        await expect(actions).toHaveScreenshot("component-perf-dashboard-actions.png", {
          animations: "disabled",
        });
      }
    });

    test("performance dashboard dark mode", async ({ page }) => {
      // Switch to dark mode
      await page.evaluate(() => {
        document.documentElement.classList.add("dark-mode");
      });
      await page.waitForTimeout(100);

      const dashboard = page.locator("#performance-dashboard");

      if (await dashboard.isVisible({ timeout: 10000 })) {
        await expect(dashboard).toHaveScreenshot("component-perf-dashboard-dark.png", {
          animations: "disabled",
        });
      }
    });

    test("individual metric cards", async ({ page }) => {
      const dashboard = page.locator("#performance-dashboard");

      if (await dashboard.isVisible({ timeout: 10000 })) {
        const metricIds = ["cls-metric", "fcp-metric", "lcp-metric", "inp-metric"];

        for (const metricId of metricIds) {
          const metric = dashboard.locator(`#${metricId}`);
          if (await metric.isVisible()) {
            await expect(metric).toHaveScreenshot(`component-${metricId}.png`, {
              animations: "disabled",
            });
          }
        }
      }
    });

    test("performance dashboard mobile layout", async ({ page }) => {
      // Switch to mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      const dashboard = page.locator("#performance-dashboard");

      if (await dashboard.isVisible({ timeout: 10000 })) {
        await expect(dashboard).toHaveScreenshot("component-perf-dashboard-mobile.png", {
          animations: "disabled",
        });
      }
    });
  });

  test.describe("Button Components", () => {
    test("action buttons", async ({ page }) => {
      const dashboard = page.locator("#performance-dashboard");

      if (await dashboard.isVisible({ timeout: 10000 })) {
        const actionButtons = dashboard.locator(".action-button");
        const buttonCount = await actionButtons.count();

        for (let i = 0; i < buttonCount; i++) {
          const button = actionButtons.nth(i);
          const buttonText = await button.textContent();
          const filename = `component-action-button-${buttonText?.toLowerCase().replace(/\s+/g, "-")}.png`;

          await expect(button).toHaveScreenshot(filename, {
            animations: "disabled",
          });
        }
      }
    });

    test("navigation buttons", async ({ page }) => {
      const themeButton = page.locator(".nav-theme");
      const searchButton = page.locator(".nav-search");

      if (await themeButton.isVisible()) {
        await expect(themeButton).toHaveScreenshot("component-theme-button.png", {
          animations: "disabled",
        });
      }

      if (await searchButton.isVisible()) {
        await expect(searchButton).toHaveScreenshot("component-search-button.png", {
          animations: "disabled",
        });
      }
    });

    test("mobile toggle button", async ({ page }) => {
      // Switch to mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      const mobileToggle = page.locator(".nav-mobile-toggle");

      if (await mobileToggle.isVisible()) {
        await expect(mobileToggle).toHaveScreenshot("component-mobile-toggle.png", {
          animations: "disabled",
        });
      }
    });
  });

  test.describe("Interactive States", () => {
    test("hover states", async ({ page }) => {
      const dashboard = page.locator("#performance-dashboard");

      if (await dashboard.isVisible({ timeout: 10000 })) {
        const clearButton = dashboard.locator("#clear-data");

        // Hover state
        await clearButton.hover();
        await page.waitForTimeout(100);

        await expect(clearButton).toHaveScreenshot("component-button-hover.png", {
          animations: "disabled",
        });
      }
    });

    test("focus states", async ({ page }) => {
      const dashboard = page.locator("#performance-dashboard");

      if (await dashboard.isVisible({ timeout: 10000 })) {
        const toggleButton = dashboard.locator("#toggle-dashboard");

        // Focus state
        await toggleButton.focus();
        await page.waitForTimeout(100);

        await expect(toggleButton).toHaveScreenshot("component-button-focus.png", {
          animations: "disabled",
        });
      }
    });

    test("active navigation item", async ({ page }) => {
      const activeItem = page.locator(".nav-item--active");

      if (await activeItem.isVisible()) {
        await expect(activeItem).toHaveScreenshot("component-nav-item-active.png", {
          animations: "disabled",
        });
      }
    });
  });

  test.describe("Responsive Component Behavior", () => {
    test("components at different breakpoints", async ({ page }) => {
      const breakpoints = [
        { name: "mobile", width: 375, height: 667 },
        { name: "tablet", width: 768, height: 1024 },
        { name: "desktop", width: 1280, height: 720 },
      ];

      for (const { name, width, height } of breakpoints) {
        await page.setViewportSize({ width, height });
        await page.waitForTimeout(300);

        // Test navigation responsiveness
        const nav = page.locator("nav");
        await expect(nav).toHaveScreenshot(`component-nav-${name}.png`, {
          animations: "disabled",
        });

        // Test performance dashboard responsiveness
        const dashboard = page.locator("#performance-dashboard");
        if (await dashboard.isVisible({ timeout: 5000 })) {
          await expect(dashboard).toHaveScreenshot(`component-dashboard-${name}.png`, {
            animations: "disabled",
          });
        }
      }
    });
  });
});
