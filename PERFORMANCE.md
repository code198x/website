# Performance Monitoring System

A comprehensive performance monitoring and analysis system for the Code198x website.

## 🎯 Overview

This performance monitoring system provides real-time Web Vitals tracking, bundle analysis, and automated performance budgets to ensure optimal user experience.

## 📊 Features

### 1. **Web Vitals Tracking**

- Real-time Core Web Vitals measurement (CLS, FCP, LCP, FID, TTFB)
- Custom navigation timing metrics
- Client-side performance data collection
- Browser console logging and localStorage storage

### 2. **Bundle Analysis**

- Automated bundle size analysis with detailed breakdown
- JavaScript and CSS file size reporting
- Performance recommendations
- Bundle composition insights
- Gzip size estimations

### 3. **Lighthouse CI Integration**

- Automated Lighthouse performance auditing
- Desktop-focused performance testing
- Performance, accessibility, SEO, and best practices scoring
- Configurable thresholds and assertions

### 4. **Performance Budgets**

- Resource size budgets (scripts, stylesheets, images)
- Core Web Vitals budgets with tolerance levels
- Path-specific budget configuration
- Budget violation alerts and reporting

### 5. **Performance Dashboard**

- Development-only visual dashboard overlay
- Real-time Web Vitals display
- Data export and clearing functionality
- Mobile-responsive design

## 🚀 Usage

### Running Performance Analysis

```bash
# Full performance analysis
npm run performance:full

# Individual tools
npm run analyze:bundle      # Bundle analysis only
npm run analyze:size        # Bundle size check against budgets
npm run analyze:performance # Generate comprehensive report
npm run lighthouse         # Run Lighthouse audit
```

### Available Scripts

- `analyze:bundle` - Detailed bundle composition analysis
- `analyze:size` - Bundle size budget compliance check
- `analyze:performance` - Generate comprehensive performance report
- `lighthouse` - Run Lighthouse CI with assertions
- `lighthouse:report` - Generate Lighthouse report only
- `performance:full` - Complete performance audit pipeline

### Performance Dashboard

The performance dashboard is automatically displayed in development mode at `http://localhost:4325/`. It shows:

- Real-time Core Web Vitals
- Performance metric ratings (good/needs-improvement/poor)
- Data export and clearing controls

## 📋 Performance Budgets

Current performance budgets (defined in `performance-budget.json`):

### Resource Sizes

- **JavaScript**: 150KB (tolerance: 20KB)
- **CSS**: 50KB (tolerance: 10KB)
- **Fonts**: 100KB (tolerance: 20KB)
- **Images**: 200KB (tolerance: 50KB)
- **Total**: 500KB (tolerance: 100KB)

### Core Web Vitals

- **First Contentful Paint**: 2000ms (tolerance: 500ms)
- **Largest Contentful Paint**: 3000ms (tolerance: 500ms)
- **Cumulative Layout Shift**: 0.1 (tolerance: 0.05)
- **Time to Interactive**: 4000ms (tolerance: 500ms)

### Path-Specific Budgets

- **Lesson Pages** (`/lessons/*`): Higher JavaScript budget for code highlighting
- **Vault Pages** (`/vault/*`): Higher image budget for content-heavy pages

## 📈 Current Performance Status

### Bundle Analysis Results

- **Total Bundle Size**: 407KB (uncompressed)
- **JavaScript**: 199KB (49% of total)
- **CSS**: 208KB (51% of total)
- **Estimated Gzipped**: ~285KB

### Budget Compliance

❌ **JavaScript Budget**: 199KB (over 150KB budget)
❌ **CSS Budget**: 208KB (over 50KB budget)
✅ **Individual File Sizes**: All files within gzipped limits

### Recommendations

- **High Priority**: Large JavaScript bundle optimization (183KB client bundle)
- **Medium Priority**: CSS bundle optimization (173KB main stylesheet)

## 🔧 Configuration

### Web Vitals Configuration

Edit `src/scripts/performance-monitor.ts`:

- Enable/disable specific metrics
- Adjust collection intervals
- Configure storage and export options

### Lighthouse Configuration

Edit `lighthouserc.json`:

- Modify performance thresholds
- Adjust testing conditions
- Configure assertion rules

### Performance Budgets

Edit `performance-budget.json`:

- Update resource size limits
- Modify Core Web Vitals thresholds
- Add path-specific budgets

### Bundle Size Limits

Edit `package.json` bundlesize configuration:

- Adjust gzipped size limits
- Add new file patterns
- Configure tolerance levels

## 📁 Generated Reports

Performance reports are automatically generated in `/performance-reports/`:

- **JSON Reports**: Machine-readable performance data
- **HTML Reports**: Visual performance dashboards
- **Lighthouse Reports**: Detailed audit results

## 🛠 Integration

### Development Workflow

1. Performance dashboard automatically appears in development
2. Real-time Web Vitals are collected and displayed
3. Bundle analysis runs with each build

### CI/CD Integration

Add to your CI pipeline:

```bash
npm run performance:full
```

This will:

- Build the application
- Run bundle analysis
- Execute Lighthouse audits
- Generate performance reports
- Fail if budgets are exceeded

## 🎯 Performance Goals

### Target Metrics

- **Core Web Vitals**: All "Good" ratings
- **Bundle Sizes**: Within defined budgets
- **Lighthouse Score**: >90 for all categories
- **Load Time**: <3 seconds on desktop

### Optimization Opportunities

1. **JavaScript Code Splitting**: Break large client bundle into chunks
2. **CSS Purging**: Remove unused CSS rules
3. **Image Optimization**: Implement responsive images and modern formats
4. **Resource Hints**: Add preload/prefetch for critical resources

## 📚 Resources

- [Web Vitals Documentation](https://web.dev/vitals/)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [Bundle Size Analysis Best Practices](https://web.dev/reduce-javascript-payloads-with-code-splitting/)
- [Performance Budgets Guide](https://web.dev/performance-budgets-101/)

---

**Last Updated**: September 2025
**Performance Monitoring Version**: 1.0.0
