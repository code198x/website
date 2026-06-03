/**
 * Lighthouse CI — performance/accessibility/best-practices/SEO budgets.
 *
 * Runs against the *built* site via `astro preview` (production output, not
 * the dev server). One representative URL per template type. Lighthouse's
 * default mobile preset (throttled) is the stricter, more meaningful check.
 *
 * Run with: npm run test:lh   (builds, then collects + asserts)
 *
 * Thresholds: accessibility is a hard gate (error); the rest start as warnings
 * so we establish a baseline before tightening them into hard budgets.
 */
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run preview',
      url: [
        'http://localhost:4321/',
        'http://localhost:4321/sinclair-zx-spectrum',
        'http://localhost:4321/sinclair-zx-spectrum/basic/touchdown',
        'http://localhost:4321/sinclair-zx-spectrum/basic/touchdown/unit-03',
        'http://localhost:4321/sinclair-zx-spectrum/getting-started',
        'http://localhost:4321/vault',
        'http://localhost:4321/family',
        'http://localhost:4321/family/emu198x',
        'http://localhost:4321/family/asm198x',
        'http://localhost:4321/family/cat198x',
      ],
      numberOfRuns: 1,
    },
    assert: {
      assertions: {
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:performance': ['warn', { minScore: 0.85 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './lighthouse-report',
    },
  },
};
