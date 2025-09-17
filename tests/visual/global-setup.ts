/**
 * Global Setup for Visual Regression Tests
 * Prepares the testing environment for consistent visual testing
 */

import type { FullConfig } from "@playwright/test";

async function globalSetup(config: FullConfig) {
  console.log("🎮 Setting up Code198x Visual Regression Testing...");

  // Ensure we're testing against the production build
  if (process.env.NODE_ENV !== "production") {
    console.log("📦 Building production version for visual testing...");

    // Note: The web server will handle building if needed
    // This is just informational for debugging
  }

  // Set up any global test data or configurations
  console.log("🖼️ Configuring visual testing environment...");

  // Global configuration for retro computing theme
  process.env.PLAYWRIGHT_VISUAL_THEME = "retro";
  process.env.PLAYWRIGHT_ANIMATION_DURATION = "0"; // Disable animations

  console.log("✅ Visual regression testing setup complete");

  return async () => {
    // Global teardown if needed
    console.log("🧹 Cleaning up visual testing environment...");
  };
}

export default globalSetup;
