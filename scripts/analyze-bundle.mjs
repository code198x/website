#!/usr/bin/env node
/**
 * Bundle Analysis Script
 * Analyzes the built assets and provides insights on bundle size and composition
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DIST_PATH = join(__dirname, "..", "dist");
const ASTRO_PATH = join(DIST_PATH, "_astro");

function getFileSizeInKB(filePath) {
  const stats = statSync(filePath);
  return Math.round((stats.size / 1024) * 100) / 100;
}

function analyzeBundle() {
  console.log("🔍 Bundle Analysis Report");
  console.log("=".repeat(50));

  if (!readdirSync(DIST_PATH).includes("_astro")) {
    console.error('❌ No build output found. Run "npm run build" first.');
    process.exit(1);
  }

  const files = readdirSync(ASTRO_PATH);
  const analysis = {
    js: [],
    css: [],
    other: [],
    total: { size: 0, count: 0 },
  };

  files.forEach((file) => {
    const filePath = join(ASTRO_PATH, file);
    const size = getFileSizeInKB(filePath);
    const ext = extname(file).toLowerCase();

    const fileInfo = {
      name: file,
      size,
      path: filePath,
    };

    if (ext === ".js") {
      analysis.js.push(fileInfo);
    } else if (ext === ".css") {
      analysis.css.push(fileInfo);
    } else {
      analysis.other.push(fileInfo);
    }

    analysis.total.size += size;
    analysis.total.count++;
  });

  // Sort by size (descending)
  analysis.js.sort((a, b) => b.size - a.size);
  analysis.css.sort((a, b) => b.size - a.size);
  analysis.other.sort((a, b) => b.size - a.size);

  // Generate report
  console.log("\n📊 File Summary:");
  console.log(`Total Files: ${analysis.total.count}`);
  console.log(`Total Size: ${analysis.total.size} KB\n`);

  // JavaScript bundles
  if (analysis.js.length > 0) {
    console.log("📜 JavaScript Bundles:");
    const jsTotal = analysis.js.reduce((sum, file) => sum + file.size, 0);
    analysis.js.forEach((file) => {
      const percentage = Math.round((file.size / jsTotal) * 100);
      const status = file.size > 100 ? "⚠️" : file.size > 200 ? "❌" : "✅";
      console.log(
        `  ${status} ${file.name.padEnd(40)} ${file.size.toString().padStart(8)} KB (${percentage}%)`
      );
    });
    console.log(`  📦 JavaScript Total: ${jsTotal} KB\n`);
  }

  // CSS bundles
  if (analysis.css.length > 0) {
    console.log("🎨 CSS Bundles:");
    const cssTotal = analysis.css.reduce((sum, file) => sum + file.size, 0);
    analysis.css.forEach((file) => {
      const percentage = Math.round((file.size / cssTotal) * 100);
      const status = file.size > 25 ? "⚠️" : file.size > 50 ? "❌" : "✅";
      console.log(
        `  ${status} ${file.name.padEnd(40)} ${file.size.toString().padStart(8)} KB (${percentage}%)`
      );
    });
    console.log(`  🎨 CSS Total: ${cssTotal} KB\n`);
  }

  // Other assets
  if (analysis.other.length > 0) {
    console.log("📁 Other Assets:");
    const otherTotal = analysis.other.reduce((sum, file) => sum + file.size, 0);
    analysis.other.forEach((file) => {
      console.log(`  📄 ${file.name.padEnd(40)} ${file.size.toString().padStart(8)} KB`);
    });
    console.log(`  📁 Other Total: ${otherTotal} KB\n`);
  }

  // Performance recommendations
  console.log("💡 Performance Recommendations:");

  const largeJsFiles = analysis.js.filter((file) => file.size > 100);
  const largeCssFiles = analysis.css.filter((file) => file.size > 25);

  if (largeJsFiles.length === 0 && largeCssFiles.length === 0) {
    console.log("  ✅ All bundles are within recommended size limits!");
  } else {
    if (largeJsFiles.length > 0) {
      console.log("  ⚠️  Large JavaScript bundles detected:");
      largeJsFiles.forEach((file) => {
        console.log(`    - ${file.name} (${file.size} KB)`);
      });
      console.log("    Consider code splitting or tree shaking.");
    }

    if (largeCssFiles.length > 0) {
      console.log("  ⚠️  Large CSS bundles detected:");
      largeCssFiles.forEach((file) => {
        console.log(`    - ${file.name} (${file.size} KB)`);
      });
      console.log("    Consider CSS purging or component-specific styles.");
    }
  }

  // Bundle composition analysis
  console.log("\n🔬 Bundle Composition:");
  const jsPercentage = Math.round(
    (analysis.js.reduce((sum, file) => sum + file.size, 0) / analysis.total.size) * 100
  );
  const cssPercentage = Math.round(
    (analysis.css.reduce((sum, file) => sum + file.size, 0) / analysis.total.size) * 100
  );
  const otherPercentage = 100 - jsPercentage - cssPercentage;

  console.log(`  JavaScript: ${jsPercentage}%`);
  console.log(`  CSS: ${cssPercentage}%`);
  console.log(`  Other: ${otherPercentage}%`);

  // Estimated gzip sizes (rough approximation: 70% of original)
  console.log("\n📦 Estimated Gzip Sizes:");
  const gzipTotal = Math.round(analysis.total.size * 0.7);
  const gzipJs = Math.round(analysis.js.reduce((sum, file) => sum + file.size, 0) * 0.7);
  const gzipCss = Math.round(analysis.css.reduce((sum, file) => sum + file.size, 0) * 0.7);

  console.log(`  Total: ~${gzipTotal} KB`);
  console.log(`  JavaScript: ~${gzipJs} KB`);
  console.log(`  CSS: ~${gzipCss} KB`);

  console.log("\n" + "=".repeat(50));
  console.log("✅ Bundle analysis complete!");

  // Return analysis data for programmatic use
  return analysis;
}

// Run analysis if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  analyzeBundle();
}

export default analyzeBundle;
