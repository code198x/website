/// <reference types="vitest" />
import { defineConfig } from "vite";
import { getViteConfig } from "astro/config";

export default defineConfig(
  getViteConfig({
    test: {
      // Test environment
      environment: "happy-dom", // Faster than jsdom, good for most component tests

      // Test file patterns - exclude .spec files as they are Playwright tests
      include: ["src/**/*.test.{js,ts,tsx}", "tests/**/*.test.{js,ts,tsx}"],

      // Setup files
      setupFiles: ["./tests/setup.ts"],

      // Coverage configuration
      coverage: {
        provider: "v8",
        reporter: ["text", "html", "lcov"],
        include: ["src/**/*.{js,ts,tsx}", "src/**/*.astro"],
        exclude: [
          "src/**/*.{test,spec}.{js,ts,tsx}",
          "src/**/*.d.ts",
          "src/env.d.ts",
          "src/scripts/performance-monitor.ts", // Exclude browser-only code from coverage
        ],
        thresholds: {
          global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
          },
        },
      },

      // Global test configuration
      globals: true,

      // Reporter configuration
      reporters: ["verbose", "html"],

      // Test timeout
      testTimeout: 10000,

      // Hook timeout
      hookTimeout: 10000,

      // Retry failed tests
      retry: 1,

      // Run tests in parallel
      pool: "threads",
      poolOptions: {
        threads: {
          singleThread: false,
        },
      },
    },

    // Vite configuration for tests
    resolve: {
      alias: {
        "@": "/src",
        "@components": "/src/components",
        "@layouts": "/src/layouts",
        "@styles": "/src/styles",
        "@scripts": "/src/scripts",
        "@data": "/src/data",
      },
    },
  })
);
