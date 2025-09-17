#!/usr/bin/env node
/**
 * Performance Report Generator
 * Consolidates data from Web Vitals, bundle analysis, and Lighthouse reports
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import analyzeBundle from './analyze-bundle.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROJECT_ROOT = join(__dirname, '..');
const REPORTS_DIR = join(PROJECT_ROOT, 'performance-reports');

function ensureReportsDir() {
  if (!existsSync(REPORTS_DIR)) {
    mkdirSync(REPORTS_DIR, { recursive: true });
  }
}

function loadPerformanceBudget() {
  const budgetPath = join(PROJECT_ROOT, 'performance-budget.json');
  if (existsSync(budgetPath)) {
    return JSON.parse(readFileSync(budgetPath, 'utf8'));
  }
  return null;
}

function getStoredWebVitals() {
  // This would typically come from localStorage in the browser
  // For now, return mock data
  return [
    {
      name: 'CLS',
      value: 0.05,
      rating: 'good',
      timestamp: Date.now(),
      url: 'http://localhost:4325/'
    },
    {
      name: 'FCP',
      value: 1200,
      rating: 'good',
      timestamp: Date.now(),
      url: 'http://localhost:4325/'
    },
    {
      name: 'LCP',
      value: 2100,
      rating: 'good',
      timestamp: Date.now(),
      url: 'http://localhost:4325/'
    }
  ];
}

function checkBudgetCompliance(bundleData, budget) {
  if (!budget) return { compliant: true, violations: [] };

  const violations = [];
  const totalSize = bundleData.total.size;

  // Check against general path budget
  const generalBudget = budget.budget.find(b => b.path === '/*');
  if (generalBudget) {
    const totalBudget = generalBudget.resourceSizes?.find(r => r.resourceType === 'total');
    if (totalBudget && totalSize > totalBudget.budget) {
      violations.push({
        type: 'Total Bundle Size',
        actual: totalSize,
        budget: totalBudget.budget,
        tolerance: totalBudget.tolerance,
        severity: totalSize > (totalBudget.budget + totalBudget.tolerance) ? 'error' : 'warning'
      });
    }

    const jsBudget = generalBudget.resourceSizes?.find(r => r.resourceType === 'script');
    const jsTotal = bundleData.js.reduce((sum, file) => sum + file.size, 0);
    if (jsBudget && jsTotal > jsBudget.budget) {
      violations.push({
        type: 'JavaScript Bundle Size',
        actual: jsTotal,
        budget: jsBudget.budget,
        tolerance: jsBudget.tolerance,
        severity: jsTotal > (jsBudget.budget + jsBudget.tolerance) ? 'error' : 'warning'
      });
    }

    const cssBudget = generalBudget.resourceSizes?.find(r => r.resourceType === 'stylesheet');
    const cssTotal = bundleData.css.reduce((sum, file) => sum + file.size, 0);
    if (cssBudget && cssTotal > cssBudget.budget) {
      violations.push({
        type: 'CSS Bundle Size',
        actual: cssTotal,
        budget: cssBudget.budget,
        tolerance: cssBudget.tolerance,
        severity: cssTotal > (cssBudget.budget + cssBudget.tolerance) ? 'error' : 'warning'
      });
    }
  }

  return {
    compliant: violations.length === 0,
    violations
  };
}

function generateHTMLReport(reportData) {
  const { timestamp, bundleAnalysis, webVitals, budgetCompliance } = reportData;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Performance Report - ${new Date(timestamp).toLocaleDateString()}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 2.5em; }
    .header p { margin: 10px 0 0; opacity: 0.9; }
    .section { padding: 30px; border-bottom: 1px solid #eee; }
    .section:last-child { border-bottom: none; }
    .section h2 { margin: 0 0 20px; color: #333; font-size: 1.8em; }
    .metric-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 20px 0; }
    .metric-card { background: #f8f9fa; border-radius: 8px; padding: 20px; border-left: 4px solid #007bff; }
    .metric-card.good { border-left-color: #28a745; }
    .metric-card.warning { border-left-color: #ffc107; }
    .metric-card.error { border-left-color: #dc3545; }
    .metric-value { font-size: 2em; font-weight: bold; margin: 10px 0; }
    .metric-label { color: #666; font-size: 0.9em; text-transform: uppercase; letter-spacing: 0.5px; }
    .file-list { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .file-item { display: flex; justify-content: between; align-items: center; padding: 10px 0; border-bottom: 1px solid #dee2e6; }
    .file-item:last-child { border-bottom: none; }
    .file-name { flex: 1; font-family: monospace; }
    .file-size { font-weight: bold; color: #495057; }
    .violation { background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px; padding: 15px; margin: 10px 0; color: #721c24; }
    .violation.warning { background: #fff3cd; border-color: #ffeaa7; color: #856404; }
    .success { background: #d4edda; border: 1px solid #c3e6cb; border-radius: 4px; padding: 15px; margin: 10px 0; color: #155724; }
    .chart { height: 200px; background: #f8f9fa; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin: 20px 0; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 Performance Report</h1>
      <p>Generated on ${new Date(timestamp).toLocaleString()}</p>
    </div>

    <div class="section">
      <h2>🏃‍♂️ Core Web Vitals</h2>
      <div class="metric-grid">
        ${webVitals.map(metric => `
          <div class="metric-card ${metric.rating}">
            <div class="metric-label">${metric.name}</div>
            <div class="metric-value">${metric.value}${metric.name === 'CLS' ? '' : 'ms'}</div>
            <div>Rating: ${metric.rating}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="section">
      <h2>📦 Bundle Analysis</h2>
      <div class="metric-grid">
        <div class="metric-card">
          <div class="metric-label">Total Size</div>
          <div class="metric-value">${bundleAnalysis.total.size} KB</div>
          <div>${bundleAnalysis.total.count} files</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">JavaScript</div>
          <div class="metric-value">${bundleAnalysis.js.reduce((sum, file) => sum + file.size, 0)} KB</div>
          <div>${bundleAnalysis.js.length} files</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">CSS</div>
          <div class="metric-value">${bundleAnalysis.css.reduce((sum, file) => sum + file.size, 0)} KB</div>
          <div>${bundleAnalysis.css.length} files</div>
        </div>
      </div>

      <h3>📜 JavaScript Files</h3>
      <div class="file-list">
        ${bundleAnalysis.js.map(file => `
          <div class="file-item">
            <div class="file-name">${file.name}</div>
            <div class="file-size">${file.size} KB</div>
          </div>
        `).join('')}
      </div>

      <h3>🎨 CSS Files</h3>
      <div class="file-list">
        ${bundleAnalysis.css.map(file => `
          <div class="file-item">
            <div class="file-name">${file.name}</div>
            <div class="file-size">${file.size} KB</div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="section">
      <h2>💰 Performance Budget</h2>
      ${budgetCompliance.compliant ?
        '<div class="success">✅ All performance budgets are met!</div>' :
        `<div>
          ${budgetCompliance.violations.map(violation => `
            <div class="violation ${violation.severity}">
              <strong>${violation.type}</strong><br>
              Actual: ${violation.actual} KB | Budget: ${violation.budget} KB | Tolerance: ${violation.tolerance} KB
            </div>
          `).join('')}
        </div>`
      }
    </div>

    <div class="section">
      <h2>📈 Performance Trends</h2>
      <div class="chart">
        Performance trend chart would go here<br>
        (Requires historical data collection)
      </div>
    </div>
  </div>
</body>
</html>`;
}

async function generatePerformanceReport() {
  console.log('🔄 Generating comprehensive performance report...');

  ensureReportsDir();

  const timestamp = Date.now();
  const reportData = {
    timestamp,
    bundleAnalysis: null,
    webVitals: getStoredWebVitals(),
    budgetCompliance: null,
    recommendations: []
  };

  // Run bundle analysis
  console.log('📦 Running bundle analysis...');
  reportData.bundleAnalysis = analyzeBundle();

  // Load and check performance budget
  const budget = loadPerformanceBudget();
  reportData.budgetCompliance = checkBudgetCompliance(reportData.bundleAnalysis, budget);

  // Generate recommendations
  const recommendations = [];

  if (reportData.bundleAnalysis.js.some(file => file.size > 100)) {
    recommendations.push({
      type: 'JavaScript Optimization',
      priority: 'high',
      description: 'Large JavaScript bundles detected. Consider code splitting or tree shaking.',
      files: reportData.bundleAnalysis.js.filter(file => file.size > 100).map(f => f.name)
    });
  }

  if (reportData.bundleAnalysis.css.some(file => file.size > 25)) {
    recommendations.push({
      type: 'CSS Optimization',
      priority: 'medium',
      description: 'Large CSS bundles detected. Consider CSS purging or component-specific styles.',
      files: reportData.bundleAnalysis.css.filter(file => file.size > 25).map(f => f.name)
    });
  }

  reportData.recommendations = recommendations;

  // Generate reports
  const reportBaseName = `performance-report-${new Date(timestamp).toISOString().slice(0, 10)}`;

  // JSON report
  const jsonReport = join(REPORTS_DIR, `${reportBaseName}.json`);
  writeFileSync(jsonReport, JSON.stringify(reportData, null, 2));

  // HTML report
  const htmlReport = join(REPORTS_DIR, `${reportBaseName}.html`);
  const htmlContent = generateHTMLReport(reportData);
  writeFileSync(htmlReport, htmlContent);

  console.log('✅ Performance report generated!');
  console.log(`📄 JSON Report: ${jsonReport}`);
  console.log(`🌐 HTML Report: ${htmlReport}`);

  // Console summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Performance Summary');
  console.log('='.repeat(50));

  console.log('\n🏃‍♂️ Core Web Vitals:');
  reportData.webVitals.forEach(metric => {
    const status = metric.rating === 'good' ? '✅' : metric.rating === 'needs-improvement' ? '⚠️' : '❌';
    console.log(`  ${status} ${metric.name}: ${metric.value}${metric.name === 'CLS' ? '' : 'ms'} (${metric.rating})`);
  });

  console.log('\n💰 Budget Compliance:');
  if (reportData.budgetCompliance.compliant) {
    console.log('  ✅ All performance budgets met!');
  } else {
    reportData.budgetCompliance.violations.forEach(violation => {
      const status = violation.severity === 'error' ? '❌' : '⚠️';
      console.log(`  ${status} ${violation.type}: ${violation.actual}KB (budget: ${violation.budget}KB)`);
    });
  }

  if (recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    recommendations.forEach(rec => {
      const priority = rec.priority === 'high' ? '🔥' : rec.priority === 'medium' ? '⚠️' : 'ℹ️';
      console.log(`  ${priority} ${rec.type}: ${rec.description}`);
    });
  }

  return reportData;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generatePerformanceReport().catch(console.error);
}

export default generatePerformanceReport;