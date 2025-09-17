/**
 * Accessibility Tests - Vault Pages
 * Tests the retro computing knowledge vault for accessibility compliance
 */

import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { createAxeBuilder, getAccessibilityConfig } from "./axe.config";

test.describe("Vault Pages Accessibility", () => {
  test.describe("Vault Homepage", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/vault");
      await page.waitForLoadState("networkidle");
    });

    test("should have accessible vault main page", async ({ page }) => {
      const accessibilityScanResults = await createAxeBuilder(
        page,
        getAccessibilityConfig("full")
      ).analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should have accessible category navigation", async ({ page }) => {
      // Test vault category links/cards
      const categoryElements = page.locator('[href*="/vault/"]').filter({ hasNotText: "Vault" });

      if ((await categoryElements.count()) > 0) {
        const accessibilityScanResults = await new AxeBuilder({ page })
          .withRules(["link-name", "target-size", "color-contrast"])
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      }
    });

    test("should have accessible vault search functionality", async ({ page }) => {
      const searchElements = page.locator('input[type="search"], [role="searchbox"], .search');

      if ((await searchElements.count()) > 0) {
        const accessibilityScanResults = await new AxeBuilder({ page })
          .withRules(["label", "button-name", "keyboard"])
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      }
    });
  });

  test.describe("Vault Category Pages", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/vault/hardware");
      await page.waitForLoadState("networkidle");
    });

    test("should have accessible category listing", async ({ page }) => {
      const accessibilityScanResults = await createAxeBuilder(
        page,
        getAccessibilityConfig("full")
      ).analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should have accessible item cards/listings", async ({ page }) => {
      const itemElements = page.locator('.vault-item, .card, [href*="/vault/hardware/"]');

      if ((await itemElements.count()) > 0) {
        const accessibilityScanResults = await new AxeBuilder({ page })
          .withRules(["link-name", "image-alt", "heading-order"])
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      }
    });

    test("should have accessible filtering and sorting", async ({ page }) => {
      const filterElements = page.locator('select, .filter, .sort, [role="combobox"]');

      if ((await filterElements.count()) > 0) {
        const accessibilityScanResults = await new AxeBuilder({ page })
          .withRules(["label", "button-name", "keyboard"])
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      }
    });
  });

  test.describe("Vault Item Detail Pages", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/vault/hardware/commodore-64");
      await page.waitForLoadState("networkidle");
    });

    test("should have accessible item detail page", async ({ page }) => {
      const accessibilityScanResults = await createAxeBuilder(
        page,
        getAccessibilityConfig("full")
      ).analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should have accessible historical information", async ({ page }) => {
      // Test historical content structure
      const contentElements = page.locator("main, .content, .description");

      if ((await contentElements.count()) > 0) {
        const accessibilityScanResults = await new AxeBuilder({ page })
          .withRules(["heading-order", "region", "color-contrast"])
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      }
    });

    test("should have accessible technical specifications", async ({ page }) => {
      // Test tables, lists, or structured technical data
      const specElements = page.locator("table, .specifications, .tech-specs, dl");

      if ((await specElements.count()) > 0) {
        const accessibilityScanResults = await new AxeBuilder({ page })
          .withRules(["table", "th-has-data-cells", "td-headers-attr", "list", "listitem"])
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      }
    });

    test("should have accessible image galleries", async ({ page }) => {
      const imageElements = page.locator("img, .gallery, .images");

      if ((await imageElements.count()) > 0) {
        const accessibilityScanResults = await new AxeBuilder({ page })
          .withRules(["image-alt", "object-alt"])
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      }
    });

    test("should have accessible related items", async ({ page }) => {
      const relatedElements = page.locator('.related, .see-also, [aria-label*="related"]');

      if ((await relatedElements.count()) > 0) {
        const accessibilityScanResults = await new AxeBuilder({ page })
          .withRules(["link-name", "region"])
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      }
    });
  });

  test.describe("Interactive Vault Features", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/vault/timeline");
      await page.waitForLoadState("networkidle");
    });

    test("should have accessible timeline interface", async ({ page }) => {
      const timelineElements = page.locator('.timeline, [role="timeline"]');

      if ((await timelineElements.count()) > 0) {
        const accessibilityScanResults = await new AxeBuilder({ page })
          .withRules(["button-name", "keyboard", "aria-label"])
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      }
    });

    test("should have accessible timeline navigation", async ({ page }) => {
      // Timeline controls should be keyboard accessible
      const timelineControls = page.locator('button, [role="button"]').filter({
        has: page.locator(".timeline"),
      });

      if ((await timelineControls.count()) > 0) {
        for (let i = 0; i < Math.min(await timelineControls.count(), 3); i++) {
          const control = timelineControls.nth(i);

          if (await control.isVisible()) {
            // Should be keyboard focusable
            await control.focus();
            const isFocused = await control.evaluate((el) => document.activeElement === el);
            expect(isFocused).toBe(true);

            // Should have accessible name
            const accessibleName = await control.evaluate((el) => {
              return (
                el.getAttribute("aria-label") || el.textContent?.trim() || el.getAttribute("title")
              );
            });
            expect(accessibleName).toBeTruthy();
          }
        }
      }
    });

    test("should have accessible search interface", async ({ page }) => {
      await page.goto("/vault/search");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(["label", "button-name", "keyboard"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe("Vault Content Accessibility", () => {
    test("should provide alternative text for retro computing images", async ({ page }) => {
      await page.goto("/vault/hardware/commodore-64");
      await page.waitForLoadState("networkidle");

      const images = page.locator("img");

      if ((await images.count()) > 0) {
        for (let i = 0; i < Math.min(await images.count(), 5); i++) {
          const img = images.nth(i);

          if (await img.isVisible()) {
            const alt = await img.getAttribute("alt");
            const ariaLabel = await img.getAttribute("aria-label");

            // Retro computing images should have descriptive alt text
            expect(alt || ariaLabel).toBeTruthy();

            if (alt) {
              expect(alt.length).toBeGreaterThan(2); // More than just "image"
            }
          }
        }
      }
    });

    test("should have accessible historical data presentation", async ({ page }) => {
      // Test various vault pages for consistent accessibility
      const vaultPages = [
        "/vault/people/jack-tramiel",
        "/vault/companies/commodore",
        "/vault/games/elite",
      ];

      for (const pagePath of vaultPages) {
        await page.goto(pagePath);
        await page.waitForLoadState("networkidle");

        const accessibilityScanResults = await new AxeBuilder({ page })
          .withRules(["heading-order", "color-contrast", "region"])
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      }
    });

    test("should have accessible cross-references and links", async ({ page }) => {
      await page.goto("/vault/hardware/commodore-64");
      await page.waitForLoadState("networkidle");

      // Internal vault links should be accessible
      const vaultLinks = page.locator('a[href*="/vault/"]');

      if ((await vaultLinks.count()) > 0) {
        for (let i = 0; i < Math.min(await vaultLinks.count(), 5); i++) {
          const link = vaultLinks.nth(i);

          if (await link.isVisible()) {
            const linkText = await link.textContent();
            const ariaLabel = await link.getAttribute("aria-label");

            // Links should have meaningful text
            expect((linkText?.trim() || ariaLabel)?.length).toBeGreaterThan(2);
          }
        }
      }
    });
  });

  test.describe("Mobile Vault Experience", () => {
    test("should be accessible on mobile devices", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/vault");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(["target-size", "color-contrast"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should have adequate touch targets in vault navigation", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/vault/hardware");
      await page.waitForLoadState("networkidle");

      const touchTargets = page.locator('a, button, [role="button"]');

      if ((await touchTargets.count()) > 0) {
        // Check first few touch targets
        for (let i = 0; i < Math.min(await touchTargets.count(), 5); i++) {
          const target = touchTargets.nth(i);

          if (await target.isVisible()) {
            const boundingBox = await target.boundingBox();

            if (boundingBox && (boundingBox.width < 44 || boundingBox.height < 44)) {
              // Check for compensating padding
              const hasAdequatePadding = await target.evaluate((el) => {
                const computed = window.getComputedStyle(el);
                const totalPadding =
                  (parseInt(computed.paddingTop) || 0) + (parseInt(computed.paddingBottom) || 0);
                return totalPadding >= 12;
              });

              expect(hasAdequatePadding).toBe(true);
            }
          }
        }
      }
    });
  });

  test.describe("Vault Search and Discovery", () => {
    test("should have accessible search results", async ({ page }) => {
      await page.goto("/vault/search");
      await page.waitForLoadState("networkidle");

      // Test search form accessibility
      const searchForm = page.locator('form, [role="search"]');

      if ((await searchForm.count()) > 0) {
        const accessibilityScanResults = await new AxeBuilder({ page })
          .include('form, [role="search"]')
          .withRules(["label", "button-name"])
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      }
    });

    test("should announce search results to screen readers", async ({ page }) => {
      await page.goto("/vault/search");
      await page.waitForLoadState("networkidle");

      // Look for ARIA live regions for search results
      const liveRegions = page.locator('[aria-live], [role="status"], [role="alert"]');

      if ((await liveRegions.count()) > 0) {
        // Live regions should not be too assertive for search
        for (let i = 0; i < (await liveRegions.count()); i++) {
          const region = liveRegions.nth(i);
          const ariaLive = await region.getAttribute("aria-live");

          if (ariaLive === "assertive") {
            // Search results shouldn't be assertive unless it's an error
            const isErrorRegion = await region.evaluate((el) => {
              return (
                el.textContent?.toLowerCase().includes("error") ||
                el.classList.contains("error") ||
                el.getAttribute("role") === "alert"
              );
            });

            if (!isErrorRegion) {
              expect(ariaLive).toBe("polite");
            }
          }
        }
      }
    });

    test("should have accessible category filtering", async ({ page }) => {
      await page.goto("/vault");
      await page.waitForLoadState("networkidle");

      const filterElements = page.locator('select, .filter, [role="combobox"]');

      if ((await filterElements.count()) > 0) {
        const accessibilityScanResults = await new AxeBuilder({ page })
          .withRules(["label", "keyboard"])
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      }
    });
  });

  test.describe("Vault Content Structure", () => {
    test("should have consistent heading hierarchy across vault pages", async ({ page }) => {
      const vaultPages = ["/vault", "/vault/hardware", "/vault/people", "/vault/companies"];

      for (const pagePath of vaultPages) {
        await page.goto(pagePath);
        await page.waitForLoadState("networkidle");

        const accessibilityScanResults = await new AxeBuilder({ page })
          .withRules(["page-has-heading-one", "heading-order"])
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      }
    });

    test("should have proper landmarks throughout vault", async ({ page }) => {
      await page.goto("/vault/hardware/commodore-64");
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(["region", "landmark-one-main", "landmark-unique"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("should have accessible breadcrumb navigation", async ({ page }) => {
      await page.goto("/vault/hardware/commodore-64");
      await page.waitForLoadState("networkidle");

      const breadcrumbs = page.locator('[aria-label*="breadcrumb"], .breadcrumb');

      if ((await breadcrumbs.count()) > 0) {
        const accessibilityScanResults = await new AxeBuilder({ page })
          .withRules(["link-name", "list"])
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      }
    });
  });
});
