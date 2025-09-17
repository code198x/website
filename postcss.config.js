import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import { purgeCSSPlugin } from "@fullhuman/postcss-purgecss";

const config = {
  plugins: [
    // Always run autoprefixer for browser compatibility
    autoprefixer(),

    // Only run optimization in production
    ...(process.env.NODE_ENV === "production"
      ? [
          // PurgeCSS - Remove unused CSS (run before cssnano)
          purgeCSSPlugin({
            content: [
              "./src/**/*.{astro,html,js,jsx,ts,tsx,vue}",
              "./src/**/*.md",
              "./src/**/*.mdx",
            ],
            // Safelist important classes that might be added dynamically
            safelist: [
              // Performance Dashboard classes
              /^performance-/,
              /^dashboard-/,
              /^metric-/,
              /^action-/,
              // Navigation classes
              /^nav-/,
              /^mobile-/,
              // Layout classes
              /^layout-/,
              /^content-/,
              /^footer-/,
              /^sidebar-/,
              // Component state classes
              /^is-/,
              /^has-/,
              /^--/,
              /-active$/,
              /-current$/,
              // Dark mode classes
              /^dark/,
              /dark$/,
              // Prism syntax highlighting classes
              /^token/,
              /^language-/,
              /^code/,
              /^pre/,
              // Common utility classes that might be used dynamically
              "hidden",
              "visible",
              "sr-only",
              "skip-to-content",
              // CSS custom properties (design tokens)
              /^--/,
              // System-specific gradients that might be applied dynamically
              /gradient-/,
              // Astro scoped styles
              /astro-[a-zA-Z0-9-]+/,
            ],
            // Custom extractor for better class name extraction
            defaultExtractor: (content) => {
              // Extract class names from various contexts
              const classes = content.match(/class(?:Name)?=["']([^"']+)["']/g) || [];
              const extractedClasses = classes
                .map((cls) => cls.match(/class(?:Name)?=["']([^"']+)["']/)[1])
                .join(" ")
                .split(/\s+/);

              // Also extract classes from template literals and dynamic class construction
              const templateClasses = content.match(/`[^`]*class[^`]*`/g) || [];
              const moreClasses = templateClasses.join(" ").match(/[\w-]+/g) || [];

              // Extract words that could be class names
              const words = content.match(/[\w-/:]+(?<!:)/g) || [];

              return [...extractedClasses, ...moreClasses, ...words].filter(Boolean);
            },
          }),

          // CSS Nano - Minify and optimize CSS
          cssnano({
            preset: [
              "default",
              {
                // Preserve CSS custom properties (design tokens)
                customProperties: false,

                // Don't merge rules that might break specificity
                mergeRules: false,

                // Remove all comments
                discardComments: {
                  removeAll: true,
                },

                // Normalize whitespace
                normalizeWhitespace: true,

                // Minify selectors
                minifySelectors: true,

                // Optimize font weights
                minifyFontValues: true,

                // Convert colors to shorter formats
                colormin: true,

                // Remove duplicate rules
                discardDuplicates: true,

                // Merge media queries
                mergeMediaQueries: true,

                // Remove unused @keyframes but be careful with dynamic content
                discardUnused: {
                  keyframes: false, // Keep keyframes - might be used dynamically
                  fontFace: false, // Keep @font-face declarations
                },

                // Optimize calc() expressions
                calc: true,

                // Remove empty rules
                discardEmpty: true,
              },
            ],
          }),
        ]
      : []),
  ],
};

export default config;
