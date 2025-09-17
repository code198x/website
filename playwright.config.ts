import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright Configuration for Visual Regression Testing
 * Designed for Code198x retro computing educational platform
 */

export default defineConfig({
  // Test directory
  testDir: "./tests",

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,

  // Reporter configuration
  reporter: [
    ["html"],
    ["json", { outputFile: "playwright-report/results.json" }],
    process.env.CI ? ["github"] : ["list"],
  ],

  // Global test timeout
  timeout: 30 * 1000,

  // Expect timeout for assertions
  expect: {
    // Screenshot comparison timeout
    timeout: 10 * 1000,
  },

  // Global setup and teardown
  use: {
    // Base URL for tests
    baseURL: process.env.CI ? "http://localhost:4321" : "http://localhost:4321",

    // Browser context options
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",

    // Viewport settings for consistent screenshots
    viewport: { width: 1280, height: 720 },

    // Ignore HTTPS errors for local development
    ignoreHTTPSErrors: true,

    // Color scheme
    colorScheme: "light",

    // Locale
    locale: "en-US",

    // Timezone
    timezoneId: "America/New_York",
  },

  // Configure projects for major browsers
  projects: [
    // Desktop Chrome
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Custom viewport for retro computing content
        viewport: { width: 1280, height: 720 },
      },
    },

    // Desktop Firefox
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        viewport: { width: 1280, height: 720 },
      },
    },

    // Desktop Safari
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        viewport: { width: 1280, height: 720 },
      },
    },

    // Mobile viewports for responsive testing
    {
      name: "Mobile Chrome",
      use: {
        ...devices["Pixel 5"],
      },
    },

    {
      name: "Mobile Safari",
      use: {
        ...devices["iPhone 12"],
      },
    },

    // Tablet viewport
    {
      name: "Tablet",
      use: {
        ...devices["iPad Pro"],
      },
    },

    // High DPI display testing
    {
      name: "Desktop Chrome HiDPI",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 720 },
        deviceScaleFactor: 2,
      },
    },

    // Dark mode testing
    {
      name: "Dark Mode",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 720 },
        colorScheme: "dark",
      },
    },
  ],

  // Web server configuration for local development
  webServer: {
    command: "npm run preview",
    url: "http://localhost:4321",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    stdout: "ignore",
    stderr: "pipe",
  },

  // Output directory for test results
  outputDir: "test-results/",

  // Directory for storing test screenshots
  snapshotDir: "tests/visual/screenshots",

  // Global setup file
  globalSetup: "./tests/visual/global-setup.ts",
});
