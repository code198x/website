# Visual Regression Testing

This directory contains comprehensive visual regression tests for the Code198x educational platform using Playwright.

## Overview

Visual regression testing ensures that UI components render consistently across different browsers, devices, and code changes. This is particularly crucial for the Code198x platform where visual accuracy in retro computing content and aesthetic consistency are essential.

## Test Structure

```
tests/visual/
├── homepage.spec.ts       # Homepage visual tests
├── components.spec.ts     # Component-specific tests
├── cross-browser.spec.ts  # Cross-browser compatibility
├── screenshots/           # Reference screenshots
├── global-setup.ts        # Test environment setup
└── README.md             # This file
```

## Test Categories

### Homepage Tests (`homepage.spec.ts`)

- **Full page screenshots**: Complete homepage visual validation
- **Above-the-fold**: Hero section and critical content
- **Navigation**: Desktop and mobile navigation states
- **Performance dashboard**: Widget rendering and interactions
- **Dark mode**: Theme switching validation
- **Responsive breakpoints**: Multiple viewport sizes
- **Loading states**: Before and after full page load

### Component Tests (`components.spec.ts`)

- **Navigation component**: Desktop and mobile states
- **Performance dashboard**: All interaction states
- **Button components**: Action buttons and controls
- **Interactive states**: Hover, focus, active states
- **Responsive behavior**: Component layouts across breakpoints

### Cross-Browser Tests (`cross-browser.spec.ts`)

- **Browser consistency**: Chrome, Firefox, Safari rendering
- **Font rendering**: Typography consistency
- **Color schemes**: Light and dark mode validation
- **Mobile layouts**: Cross-browser mobile compatibility
- **Form elements**: Button and input consistency
- **SVG rendering**: Icon and graphics consistency
- **High-DPI displays**: Retina and high-resolution screens

## Available Test Commands

```bash
# Run all visual tests
npm run test:visual

# Run tests in headed mode (see browser)
npm run test:visual:headed

# Debug tests interactively
npm run test:visual:debug

# Show test results report
npm run test:visual:report

# Update reference screenshots
npm run test:visual:update

# Run specific browser tests
npm run test:visual:chromium
npm run test:visual:firefox
npm run test:visual:webkit

# Run all tests (unit + visual)
npm run test:all
```

## Configuration

### Playwright Config (`playwright.config.ts`)

- **Test directory**: `tests/visual/`
- **Screenshot directory**: `tests/visual/screenshots/`
- **Base URL**: `http://localhost:4321`
- **Timeout**: 30 seconds per test
- **Threshold**: 0.1 pixel difference tolerance
- **Animation handling**: Disabled for consistency

### Browser Projects

- **Desktop Chrome**: 1280x720 viewport
- **Desktop Firefox**: 1280x720 viewport
- **Desktop Safari**: 1280x720 viewport
- **Mobile Chrome**: Pixel 5 simulation
- **Mobile Safari**: iPhone 12 simulation
- **Tablet**: iPad Pro simulation
- **High-DPI Chrome**: 2x device pixel ratio
- **Dark Mode**: Dark color scheme testing

## Screenshot Management

### Reference Screenshots

Screenshots are stored in `tests/visual/screenshots/` organized by:

- Test file name
- Browser/device project
- Individual test name

Example structure:

```
screenshots/
├── homepage-spec-ts/
│   ├── homepage-full-chromium-darwin.png
│   ├── homepage-hero-firefox-darwin.png
│   └── homepage-navigation-webkit-darwin.png
└── components-spec-ts/
    ├── component-nav-desktop-chromium-darwin.png
    └── component-perf-dashboard-Mobile-Chrome-darwin.png
```

### Updating Screenshots

```bash
# Update all reference screenshots
npm run test:visual:update

# Update specific test screenshots
npx playwright test homepage.spec.ts --update-snapshots

# Update only failed screenshots
npx playwright test --update-snapshots --reporter=line
```

## Best Practices

### Test Writing

1. **Disable animations**: Always disable CSS animations for consistent results
2. **Wait for stability**: Use `networkidle` and appropriate timeouts
3. **Consistent selectors**: Use stable CSS selectors and IDs
4. **Viewport control**: Set explicit viewports for responsive testing
5. **Clean state**: Ensure tests start from clean, predictable states

### Screenshot Quality

- **Threshold management**: Keep 0.1 threshold for pixel-perfect accuracy
- **Color consistency**: Test both light and dark themes
- **Font loading**: Ensure web fonts are fully loaded
- **Dynamic content**: Mock time-sensitive or random content
- **Loading states**: Test both loading and loaded states

### Performance Considerations

- **Parallel execution**: Tests run in parallel by default
- **Selective testing**: Use project filters for faster feedback
- **CI optimization**: Use single worker on CI for stability
- **Retry logic**: 2 retries on CI to handle flaky tests

## Retro Computing Specific Tests

### Visual Accuracy Requirements

- **Pixel-perfect rendering**: Critical for retro computing aesthetic
- **Typography**: Monospace fonts and retro styling consistency
- **Color palettes**: Accurate reproduction of classic system colors
- **Component scaling**: Proper scaling across different screen densities

### Educational Content Validation

- **Code examples**: Syntax highlighting consistency
- **Memory maps**: Visual layout accuracy
- **Register displays**: Precise alignment and formatting
- **Interactive elements**: Consistent visual feedback

## CI/CD Integration

### GitHub Actions Setup

```yaml
- name: Run Visual Tests
  run: npm run test:visual

- name: Upload Test Results
  uses: actions/upload-artifact@v3
  if: failure()
  with:
    name: playwright-report
    path: playwright-report/
```

### Baseline Management

- **Main branch**: Baseline screenshots stored in repository
- **PR validation**: Compare against main branch baselines
- **Update workflow**: Systematic baseline updates for approved changes

## Troubleshooting

### Common Issues

#### Screenshots Don't Match

```bash
# View diff report
npm run test:visual:report

# Update if changes are intentional
npm run test:visual:update
```

#### Tests Are Flaky

- Check for animations not properly disabled
- Verify font loading completion
- Ensure stable network conditions
- Review timing and wait conditions

#### Browser-Specific Issues

- Run single browser tests for isolation
- Check browser-specific CSS features
- Verify web font compatibility
- Test browser security settings

### Debugging Tests

```bash
# Run in headed mode to see browser
npm run test:visual:headed

# Debug interactively
npm run test:visual:debug

# Run specific test file
npx playwright test homepage.spec.ts
```

## Performance Monitoring

### Visual Performance Metrics

- **Screenshot capture time**: Monitor test execution speed
- **Diff processing**: Track comparison performance
- **Storage usage**: Manage screenshot file sizes
- **CI execution time**: Optimize for build pipeline efficiency

### Quality Metrics

- **Pixel accuracy**: Track threshold effectiveness
- **Test coverage**: Ensure comprehensive visual coverage
- **Regression detection**: Monitor catch rate for visual bugs
- **False positive rate**: Minimize unnecessary test failures

## Future Enhancements

### Planned Additions

- **Animation testing**: Controlled animation validation
- **Accessibility overlays**: Visual accessibility indicators
- **Performance visualizations**: Web Vitals visual indicators
- **Multi-theme testing**: Extended color scheme validation
- **Content variation testing**: Dynamic content scenarios

### Advanced Features

- **Visual AI**: Machine learning-based visual validation
- **Responsive matrices**: Automated breakpoint testing
- **Component isolation**: Individual component screenshot library
- **Visual regression analytics**: Trend analysis and reporting
