import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for Code198x website checks.
 *
 * Runs the Astro dev server automatically and exercises pages on a real
 * desktop viewport and a true mobile device profile (Pixel 7). Mobile here
 * means genuine device emulation — layout viewport, DPR, and touch — not a
 * resized desktop window, which is what plain headless Chrome `--window-size`
 * gives (and why it mis-reported overflow during earlier manual screenshots).
 */
export default defineConfig({
  testDir: './tests',
  // The full-route sweep takes ~25 minutes over 2,238 routes. It is a deliberate
  // audit, not a gate, so it is excluded unless asked for by name — testIgnore
  // is global, so the opt-in has to lift it rather than override it per run.
  testIgnore: process.env.A11Y_SWEEP ? [] : ['**/a11y-sweep.spec.ts'],
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'] },
    },
  ],
  webServer: {
    // Astro 7.2 backgrounds `astro dev` automatically in detected agent
    // environments. Playwright must own a foreground process so it can wait for
    // readiness and stop the server after the suite.
    command: 'ASTRO_DEV_BACKGROUND=0 npm run dev -- --ignore-lock',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
