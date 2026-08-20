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
/**
 * The sweep measures the built site, not the dev server.
 *
 * It enumerates routes from `dist/`, so serving those routes from `astro dev`
 * measured something else: Vite compiles on demand, and at eight concurrent
 * contexts a page could be analysed before its styles arrived. That produces
 * contrast findings which do not reproduce on a fresh page — the same class of
 * ghost the animation-freeze fixed, one layer down. `astro preview` serves the
 * built output as static files, which is what actually ships.
 *
 * Its own port, and never a reused server: on 4321 a dev server left running
 * would be silently adopted and the sweep would go straight back to measuring
 * the wrong thing, with nothing in the output to say so.
 */
const SWEEP = Boolean(process.env.A11Y_SWEEP);
const PORT = SWEEP ? 4322 : 4321;

export default defineConfig({
  testDir: './tests',
  // The full-route sweep takes ~25 minutes over 2,238 routes. It is a deliberate
  // audit, not a gate, so it is excluded unless asked for by name — testIgnore
  // is global, so the opt-in has to lift it rather than override it per run.
  testIgnore: process.env.A11Y_SWEEP ? [] : ['**/a11y-sweep.spec.ts'],
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
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
    // `ASTRO_PREVIEW_BACKGROUND=0`, not the `ASTRO_DEV_BACKGROUND` above —
    // they are separate switches, and preview daemonises under its own. Left
    // backgrounded, `astro preview` prints a pid and returns, Playwright sees
    // its web server exit immediately, and the whole sweep fails to start.
    command: SWEEP
      ? `ASTRO_PREVIEW_BACKGROUND=0 npm run preview -- --port ${PORT} --ignore-lock`
      : 'ASTRO_DEV_BACKGROUND=0 npm run dev -- --ignore-lock',
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !SWEEP && !process.env.CI,
    timeout: 120_000,
  },
});
