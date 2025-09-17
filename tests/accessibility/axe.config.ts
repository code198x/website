/**
 * Axe Accessibility Configuration
 * Custom configuration for Code198x educational platform accessibility testing
 */

import { AxeBuilder } from '@axe-core/playwright';
import { Page } from '@playwright/test';

export interface AccessibilityTestOptions {
  includeTags?: string[];
  excludeTags?: string[];
  rules?: string[];
  excludeRules?: string[];
  disableColorContrast?: boolean;
}

/**
 * Create a configured AxeBuilder instance for Code198x testing
 */
export function createAxeBuilder(
  page: Page,
  options: AccessibilityTestOptions = {}
): AxeBuilder {
  const axeBuilder = new AxeBuilder({ page });

  // Default WCAG 2.1 AA compliance tags
  const defaultTags = ['wcag2a', 'wcag2aa', 'wcag21aa'];

  // Educational platform specific rules
  const educationalRules = [
    'bypass',              // Skip links for keyboard users
    'focus-order-semantics', // Logical focus order
    'landmark-one-main',   // Single main landmark
    'page-has-heading-one', // Page structure
    'region',             // Proper use of landmarks
    'heading-order',      // Logical heading hierarchy
    'link-name',          // Link accessibility names
    'button-name',        // Button accessibility names
    'image-alt',          // Image alternative text
    'color-contrast',     // Color contrast compliance
    'keyboard',           // Keyboard accessibility
    'aria-label',         // ARIA labels
    'aria-labelledby',    // ARIA labelledby
    'aria-describedby',   // ARIA descriptions
  ];

  // Code198x specific configuration
  if (options.includeTags) {
    axeBuilder.withTags([...defaultTags, ...options.includeTags]);
  } else {
    axeBuilder.withTags(defaultTags);
  }

  // Add educational platform rules if not excluded
  if (options.rules) {
    axeBuilder.withRules([...educationalRules, ...options.rules]);
  } else if (!options.excludeRules?.includes('*')) {
    axeBuilder.withRules(educationalRules);
  }

  // Handle rule exclusions
  if (options.excludeRules) {
    axeBuilder.disableRules(options.excludeRules);
  }

  // Disable color contrast if needed (for theme testing)
  if (options.disableColorContrast) {
    axeBuilder.disableRules(['color-contrast']);
  }

  // Exclude problematic selectors that might interfere with testing
  axeBuilder.exclude([
    '[data-testid="skip-link"]', // Skip test infrastructure
    '.playwright-test-runner',   // Test runner elements
  ]);

  return axeBuilder;
}

/**
 * Educational platform accessibility standards
 */
export const EducationalAccessibilityStandards = {
  // WCAG 2.1 AA requirements for educational content
  wcag21aa: {
    colorContrast: {
      normal: 4.5,      // Normal text contrast ratio
      large: 3.0,       // Large text contrast ratio
    },
    focusIndicator: {
      required: true,   // Focus indicators required
      minSize: '2px',   // Minimum focus indicator size
    },
    keyboard: {
      tabOrder: true,   // Logical tab order required
      skipLinks: true,  // Skip links for efficiency
      trapFocus: true,  // Focus management in modals
    },
    screenReader: {
      landmarks: true,  // Proper landmark usage
      headings: true,   // Logical heading structure
      altText: true,    // Alternative text for images
      labels: true,     // Form labels required
    },
  },

  // Code198x specific requirements
  retroComputing: {
    monospaceFonts: {
      readable: true,     // Ensure monospace fonts are readable
      scalable: true,     // Support font scaling
    },
    codeExamples: {
      syntaxHighlight: true,  // Use color + other indicators
      copyable: true,         // Keyboard accessible copy
      zoomable: true,         // Support zoom to 200%
    },
    interactiveElements: {
      largeTargets: true,     // 44x44px minimum touch targets
      clearFocus: true,       // Clear focus indicators
      loadingStates: true,    // Accessible loading indicators
    },
  },

  // Performance considerations
  performance: {
    dashboard: {
      announceUpdates: false,  // Don't announce rapid metric updates
      summaryAvailable: true,  // Provide metric summaries
      exportable: true,        // Allow data export
    },
  },
};

/**
 * Create accessibility test suite configuration
 */
export function getAccessibilityConfig(testType: 'full' | 'component' | 'performance') {
  const baseConfig: AccessibilityTestOptions = {
    includeTags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
  };

  switch (testType) {
    case 'full':
      return {
        ...baseConfig,
        rules: [
          'bypass',
          'color-contrast',
          'focus-order-semantics',
          'heading-order',
          'landmark-one-main',
          'page-has-heading-one',
          'region',
          'document-title',
          'html-has-lang',
          'html-lang-valid',
        ],
      };

    case 'component':
      return {
        ...baseConfig,
        rules: [
          'button-name',
          'link-name',
          'image-alt',
          'color-contrast',
          'keyboard',
          'aria-label',
          'aria-labelledby',
          'aria-describedby',
        ],
      };

    case 'performance':
      return {
        ...baseConfig,
        rules: [
          'button-name',
          'color-contrast',
          'keyboard',
          'aria-label',
        ],
        // Performance metrics update frequently, so disable some checks
        excludeRules: ['aria-live-region-atomic'],
      };

    default:
      return baseConfig;
  }
}

/**
 * Educational content specific accessibility helpers
 */
export const EducationalAccessibilityHelpers = {
  /**
   * Check if code examples are accessible
   */
  async checkCodeExamples(page: Page): Promise<boolean> {
    const codeBlocks = page.locator('pre, code');
    const count = await codeBlocks.count();

    for (let i = 0; i < count; i++) {
      const block = codeBlocks.nth(i);

      // Check if code block has proper language indication
      const hasLanguage = await block.evaluate((el) => {
        return el.classList.contains('language-') ||
               el.getAttribute('data-language') !== null ||
               el.closest('[data-language]') !== null;
      });

      if (!hasLanguage) {
        return false;
      }
    }

    return true;
  },

  /**
   * Check if interactive elements meet size requirements
   */
  async checkTargetSizes(page: Page): Promise<boolean> {
    const interactiveElements = page.locator('button, a, input, select, textarea');
    const count = await interactiveElements.count();

    for (let i = 0; i < count; i++) {
      const element = interactiveElements.nth(i);

      if (await element.isVisible()) {
        const boundingBox = await element.boundingBox();

        if (boundingBox) {
          // WCAG 2.1 AA requires 44x44px minimum for touch targets
          if (boundingBox.width < 44 || boundingBox.height < 44) {
            // Check if element has adequate spacing/padding
            const hasAdequatePadding = await element.evaluate((el) => {
              const computed = window.getComputedStyle(el);
              const padding = parseInt(computed.padding) || 0;
              return padding >= 12; // Compensate with padding
            });

            if (!hasAdequatePadding) {
              return false;
            }
          }
        }
      }
    }

    return true;
  },

  /**
   * Check if performance metrics are announced appropriately
   */
  async checkMetricAnnouncements(page: Page): Promise<boolean> {
    const dashboard = page.locator('#performance-dashboard');

    if (!await dashboard.isVisible()) {
      return true; // No dashboard, no problem
    }

    // Check that rapid updates aren't being announced
    const liveRegions = page.locator('[aria-live]');
    const count = await liveRegions.count();

    for (let i = 0; i < count; i++) {
      const region = liveRegions.nth(i);
      const ariaLive = await region.getAttribute('aria-live');

      // Performance metrics should use polite or off, not assertive
      if (ariaLive === 'assertive') {
        const isMetricRegion = await region.evaluate((el) => {
          return el.closest('#performance-dashboard') !== null;
        });

        if (isMetricRegion) {
          return false;
        }
      }
    }

    return true;
  },
};