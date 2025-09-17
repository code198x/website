/**
 * Visual Regression Tests - Cross-Browser Compatibility
 * Tests visual consistency across different browsers and devices
 */

import { test, expect } from "@playwright/test";

test.describe("Cross-Browser Visual Consistency", () => {
  test.beforeEach(async ({ page }) => {
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

  test("homepage renders consistently across browsers", async ({ page, browserName }) => {
    // Take screenshot specific to browser
    await expect(page).toHaveScreenshot(`homepage-${browserName}.png`, {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("navigation component cross-browser", async ({ page, browserName }) => {
    const nav = page.locator("nav");

    if (await nav.isVisible()) {
      await expect(nav).toHaveScreenshot(`navigation-${browserName}.png`, {
        animations: "disabled",
      });
    }
  });

  test("performance dashboard cross-browser", async ({ page, browserName }) => {
    const dashboard = page.locator("#performance-dashboard");

    if (await dashboard.isVisible({ timeout: 10000 })) {
      await expect(dashboard).toHaveScreenshot(`dashboard-${browserName}.png`, {
        animations: "disabled",
      });
    }
  });

  test("font rendering consistency", async ({ page, browserName }) => {
    // Focus on text-heavy areas to check font rendering
    const textElements = ["h1", "h2", "h3", "p", ".nav-item__label", ".metric-label"];

    for (const selector of textElements) {
      const element = page.locator(selector).first();

      if (await element.isVisible()) {
        await expect(element).toHaveScreenshot(
          `font-${selector.replace(/[^a-z0-9]/gi, "-")}-${browserName}.png`,
          {
            animations: "disabled",
          }
        );
      }
    }
  });

  test("color scheme consistency", async ({ page, browserName }) => {
    // Test light mode
    await expect(page).toHaveScreenshot(`color-scheme-light-${browserName}.png`, {
      animations: "disabled",
    });

    // Switch to dark mode
    await page.evaluate(() => {
      document.documentElement.classList.add("dark-mode");
    });
    await page.waitForTimeout(100);

    // Test dark mode
    await expect(page).toHaveScreenshot(`color-scheme-dark-${browserName}.png`, {
      animations: "disabled",
    });
  });

  test("mobile layout consistency", async ({ page, browserName }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(200);

    await expect(page).toHaveScreenshot(`mobile-layout-${browserName}.png`, {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("form elements and buttons", async ({ page, browserName }) => {
    // Test button rendering consistency
    const buttons = page.locator("button");
    const buttonCount = await buttons.count();

    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      const buttonId = (await button.getAttribute("id")) || `button-${i}`;

      await expect(button).toHaveScreenshot(`button-${buttonId}-${browserName}.png`, {
        animations: "disabled",
      });
    }
  });

  test("svg and icon rendering", async ({ page, browserName }) => {
    // Test SVG rendering consistency
    const svgs = page.locator("svg");
    const svgCount = await svgs.count();

    for (let i = 0; i < Math.min(svgCount, 3); i++) {
      const svg = svgs.nth(i);

      await expect(svg).toHaveScreenshot(`svg-${i}-${browserName}.png`, {
        animations: "disabled",
      });
    }
  });

  test("performance metrics visual consistency", async ({ page, browserName }) => {
    const dashboard = page.locator("#performance-dashboard");

    if (await dashboard.isVisible({ timeout: 10000 })) {
      // Simulate some performance data for visual consistency
      await page.evaluate(() => {
        // Mock performance data for consistent visual testing
        const metricCards = document.querySelectorAll(".metric-card");
        metricCards.forEach((card, index) => {
          const valueElement = card.querySelector(".metric-value");
          const statusElement = card.querySelector(".metric-status");

          if (valueElement && statusElement) {
            // Set consistent test values
            const testValues = ["0.125", "1200ms", "2400ms", "180ms"];
            const testStatuses = ["good", "good", "needs-improvement", "good"];
            const testRatings = ["good", "good", "needs-improvement", "good"];

            valueElement.textContent = testValues[index] || "-";
            statusElement.textContent = testStatuses[index] || "measuring...";
            card.className = `metric-card ${testRatings[index] || ""}`;
          }
        });
      });

      await page.waitForTimeout(100);

      await expect(dashboard).toHaveScreenshot(`dashboard-with-data-${browserName}.png`, {
        animations: "disabled",
      });
    }
  });

  test("high-dpi display rendering", async ({ page, browserName }) => {
    // Test high-DPI rendering (simulated via device scale factor)
    // This test only runs on chromium as it has better DPR control
    test.skip(browserName !== "chromium", "High-DPI test only on Chromium");

    // Test 2x scale factor
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.evaluate(() => {
      // Simulate high-DPI display
      Object.defineProperty(window, "devicePixelRatio", {
        value: 2,
        writable: false,
      });
    });

    await expect(page).toHaveScreenshot(`high-dpi-${browserName}.png`, {
      animations: "disabled",
    });
  });

  test("accessibility focus indicators", async ({ page, browserName }) => {
    // Test focus ring consistency
    const focusableElements = [".nav-theme", ".nav-search", "#toggle-dashboard", ".action-button"];

    for (const selector of focusableElements) {
      const element = page.locator(selector).first();

      if (await element.isVisible()) {
        await element.focus();
        await page.waitForTimeout(100);

        await expect(element).toHaveScreenshot(
          `focus-${selector.replace(/[^a-z0-9]/gi, "-")}-${browserName}.png`,
          {
            animations: "disabled",
          }
        );
      }
    }
  });
});
