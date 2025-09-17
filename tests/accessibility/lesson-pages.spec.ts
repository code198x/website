/**
 * Accessibility Tests - Lesson Pages
 * Tests the core educational experience for accessibility compliance
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createAxeBuilder, getAccessibilityConfig } from './axe.config';

test.describe('Lesson Pages Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a lesson page
    await page.goto('/lessons/commodore-64/phase-1/tier-1/lesson-001');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Educational Content Structure', () => {
    test('should have accessible lesson page structure', async ({ page }) => {
      const accessibilityScanResults = await createAxeBuilder(page,
        getAccessibilityConfig('full')
      ).analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have proper lesson navigation', async ({ page }) => {
      // Test lesson-specific navigation elements
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(['bypass', 'navigation-landmark', 'landmark-unique'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have accessible lesson content hierarchy', async ({ page }) => {
      // Test heading structure for educational content
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(['page-has-heading-one', 'heading-order'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have accessible breadcrumb navigation', async ({ page }) => {
      // Check for breadcrumbs accessibility
      const breadcrumbs = page.locator('[aria-label*="breadcrumb"], nav[role="navigation"]');

      if (await breadcrumbs.count() > 0) {
        const accessibilityScanResults = await new AxeBuilder({ page })
          .include(await breadcrumbs.first().getAttribute('data-testid') || 'nav')
          .withRules(['link-name', 'button-name'])
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      }
    });
  });

  test.describe('Code Examples and Technical Content', () => {
    test('should have accessible code blocks', async ({ page }) => {
      const codeBlocks = page.locator('pre, code, .code-example');

      if (await codeBlocks.count() > 0) {
        // Code blocks should have proper language identification
        for (let i = 0; i < await codeBlocks.count(); i++) {
          const block = codeBlocks.nth(i);

          if (await block.isVisible()) {
            // Check if language is specified for syntax highlighting
            const hasLanguage = await block.evaluate(el => {
              return el.className.includes('language-') ||
                     el.getAttribute('data-language') !== null ||
                     el.closest('[data-language]') !== null;
            });

            // For educational content, language specification helps accessibility
            // This is more of a best practice check
            if (!hasLanguage) {
              console.log('Code block without language specification found');
            }
          }
        }

        // Test color contrast in code blocks
        const accessibilityScanResults = await new AxeBuilder({ page })
          .withRules(['color-contrast'])
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      }
    });

    test('should have accessible syntax highlighting', async ({ page }) => {
      // Syntax highlighting should not rely only on color
      const codeBlocks = page.locator('pre code, .highlight');

      if (await codeBlocks.count() > 0) {
        const accessibilityScanResults = await new AxeBuilder({ page })
          .withRules(['color-contrast'])
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      }
    });

    test('should have accessible interactive code elements', async ({ page }) => {
      // Test copy buttons, run buttons, etc.
      const interactiveElements = page.locator('button, [role="button"]').filter({
        has: page.locator('code, pre')
      });

      if (await interactiveElements.count() > 0) {
        const accessibilityScanResults = await new AxeBuilder({ page })
          .withRules(['button-name', 'keyboard', 'target-size'])
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      }
    });
  });

  test.describe('Learning Progress and Navigation', () => {
    test('should have accessible lesson progress indicators', async ({ page }) => {
      const progressElements = page.locator('[role="progressbar"], .progress, .lesson-progress');

      if (await progressElements.count() > 0) {
        const accessibilityScanResults = await new AxeBuilder({ page })
          .withRules(['aria-label', 'aria-labelledby', 'aria-describedby'])
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      }
    });

    test('should have accessible next/previous navigation', async ({ page }) => {
      const navButtons = page.locator('[aria-label*="next"], [aria-label*="previous"], .lesson-nav');

      if (await navButtons.count() > 0) {
        const accessibilityScanResults = await new AxeBuilder({ page })
          .withRules(['button-name', 'link-name', 'keyboard'])
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      }
    });

    test('should have accessible lesson completion indicators', async ({ page }) => {
      const completionElements = page.locator('[aria-label*="complete"], .completed, .lesson-status');

      if (await completionElements.count() > 0) {
        // Completion status should be announced to screen readers
        for (let i = 0; i < await completionElements.count(); i++) {
          const element = completionElements.nth(i);

          if (await element.isVisible()) {
            const hasAccessibleName = await element.evaluate(el => {
              return el.getAttribute('aria-label') ||
                     el.getAttribute('aria-labelledby') ||
                     el.textContent?.trim() ||
                     el.title;
            });

            expect(hasAccessibleName).toBeTruthy();
          }
        }
      }
    });
  });

  test.describe('Educational Media and Resources', () => {
    test('should have accessible images and diagrams', async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(['image-alt', 'object-alt'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have accessible interactive elements', async ({ page }) => {
      // Test educational interactive components
      const interactiveElements = page.locator('[role="button"], [role="tab"], [role="slider"]');

      if (await interactiveElements.count() > 0) {
        const accessibilityScanResults = await new AxeBuilder({ page })
          .withRules(['keyboard', 'target-size', 'button-name'])
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      }
    });

    test('should have accessible video or audio content', async ({ page }) => {
      const mediaElements = page.locator('video, audio');

      if (await mediaElements.count() > 0) {
        const accessibilityScanResults = await new AxeBuilder({ page })
          .withRules(['video-control', 'audio-control'])
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      }
    });
  });

  test.describe('Learning Interaction Accessibility', () => {
    test('should support keyboard-only learning', async ({ page }) => {
      // Test that students can complete lessons using only keyboard
      const focusableElements = page.locator('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');

      if (await focusableElements.count() > 0) {
        // Test tab navigation through lesson content
        let tabIndex = 0;
        const maxElements = Math.min(await focusableElements.count(), 10);

        for (let i = 0; i < maxElements; i++) {
          await page.keyboard.press('Tab');
          tabIndex++;

          const activeElement = await page.evaluate(() => {
            const el = document.activeElement;
            return {
              tagName: el?.tagName.toLowerCase(),
              id: el?.id,
              className: el?.className,
            };
          });

          // Should have a focused element
          expect(activeElement.tagName).toBeTruthy();
        }

        expect(tabIndex).toBeGreaterThan(0);
      }
    });

    test('should have accessible form elements for exercises', async ({ page }) => {
      const formElements = page.locator('form, input, textarea, select');

      if (await formElements.count() > 0) {
        const accessibilityScanResults = await new AxeBuilder({ page })
          .withRules(['label', 'form-field-multiple-labels', 'required-attr'])
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      }
    });

    test('should provide clear feedback for learning activities', async ({ page }) => {
      // Test feedback elements like success/error messages
      const feedbackElements = page.locator('.feedback, .success, .error, .warning, [role="alert"]');

      if (await feedbackElements.count() > 0) {
        const accessibilityScanResults = await new AxeBuilder({ page })
          .withRules(['color-contrast'])
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      }
    });
  });

  test.describe('Mobile Learning Accessibility', () => {
    test('should be accessible on mobile devices', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(200);

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(['target-size', 'color-contrast'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have adequate touch targets for lesson navigation', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      const touchTargets = page.locator('button, a, input, [role="button"]');

      if (await touchTargets.count() > 0) {
        // Check touch target sizes (minimum 44x44px)
        for (let i = 0; i < Math.min(await touchTargets.count(), 5); i++) {
          const target = touchTargets.nth(i);

          if (await target.isVisible()) {
            const boundingBox = await target.boundingBox();

            if (boundingBox) {
              const isAdequateSize = boundingBox.width >= 44 && boundingBox.height >= 44;

              if (!isAdequateSize) {
                // Check if element has adequate padding to compensate
                const hasAdequatePadding = await target.evaluate(el => {
                  const computed = window.getComputedStyle(el);
                  const padding = parseInt(computed.padding) || 0;
                  return padding >= 12;
                });

                expect(isAdequateSize || hasAdequatePadding).toBe(true);
              }
            }
          }
        }
      }
    });
  });

  test.describe('Zoom and Visual Accessibility', () => {
    test('should work at 200% zoom', async ({ page }) => {
      // Test 200% zoom compliance (WCAG AA requirement)
      await page.setViewportSize({ width: 640, height: 360 }); // Simulate 200% zoom

      const accessibilityScanResults = await new AxeBuilder({ page })
        .analyze();

      // At 200% zoom, content should still be accessible
      expect(accessibilityScanResults.violations.filter(v =>
        v.id === 'color-contrast' || v.id === 'target-size'
      )).toEqual([]);
    });

    test('should maintain readability with high contrast', async ({ page }) => {
      // Test high contrast mode
      await page.emulateMedia({ colorScheme: 'dark' });

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(['color-contrast'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('Content Structure and Semantics', () => {
    test('should use proper semantic markup for educational content', async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(['region', 'landmark-one-main', 'list', 'listitem'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have proper document language', async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(['html-has-lang', 'html-lang-valid'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have unique and descriptive page titles', async ({ page }) => {
      const pageTitle = await page.title();

      // Educational pages should have descriptive titles
      expect(pageTitle.length).toBeGreaterThan(10);
      expect(pageTitle).toContain('Lesson');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(['document-title'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });
});