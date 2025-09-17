# Testing Infrastructure

This directory contains the comprehensive testing suite for the Code198x educational platform.

## Overview

Our testing infrastructure uses **Vitest** with comprehensive browser environment mocking to ensure reliable component and integration testing across the Astro-based platform.

## Test Structure

```
tests/
├── components/          # Component-specific tests
├── utils/              # Utility function tests
├── integration/        # Integration and end-to-end tests
├── setup.ts            # Global test configuration
└── README.md           # This file
```

## Test Types

### Component Tests (`tests/components/`)

- **PerformanceDashboard.test.ts**: Tests Web Vitals dashboard functionality, UI interactions, data export
- **Navigation.test.ts**: Tests mobile menu, theme toggling, accessibility, responsive behavior

### Utility Tests (`tests/utils/`)

- **performance-helpers.test.ts**: Tests performance monitoring helper functions, metric calculations, data validation

### Integration Tests (`tests/integration/`)

- **content-collections.test.ts**: Tests content schema validation, educational requirements, content architecture

## Available Test Scripts

```bash
# Run tests in watch mode (development)
npm test

# Run tests once (CI/build)
npm run test:run

# Run tests with coverage report
npm run test:coverage

# Run tests with UI interface
npm run test:ui

# Run coverage with UI
npm run test:coverage:ui
```

## Test Configuration

### Global Setup (`tests/setup.ts`)

- Browser API mocks (localStorage, matchMedia, ResizeObserver, etc.)
- Performance API mocking
- Comprehensive cleanup between tests

### Vitest Config (`vitest.config.ts`)

- **Environment**: `happy-dom` (faster than jsdom, suitable for component testing)
- **Coverage**: v8 provider with 80% thresholds
- **Setup**: Global test utilities and mocks
- **Aliases**: Path resolution matching project structure

## Writing Tests

### Component Testing Pattern

```typescript
import { describe, it, expect, beforeEach, vi } from "vitest";
import { JSDOM } from "jsdom";

describe("Component Name", () => {
  let dom: JSDOM;
  let document: Document;
  let window: Window;

  beforeEach(() => {
    // Set up clean DOM environment
    dom = new JSDOM(`<!-- Component HTML -->`);
    document = dom.window.document;
    window = dom.window as any;

    // Configure globals
    global.document = document;
    global.window = window;
  });

  // Test structure, functionality, accessibility
});
```

### Utility Testing Pattern

```typescript
// Test pure functions with comprehensive edge cases
describe("Utility Function", () => {
  it("should handle expected input", () => {
    expect(utilityFunction(input)).toBe(expectedOutput);
  });

  it("should handle edge cases", () => {
    expect(utilityFunction(edgeCase)).toBe(expectedEdgeOutput);
  });
});
```

### Integration Testing Pattern

```typescript
// Test schemas, data validation, business logic
describe("Feature Integration", () => {
  it("should validate data structure", () => {
    const result = schema.safeParse(mockData);
    expect(result.success).toBe(true);
  });
});
```

## Test Coverage

### Coverage Thresholds

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

### Coverage Exclusions

- Test files (`*.{test,spec}.*`)
- Type definitions (`*.d.ts`)
- Environment files (`env.d.ts`)
- Browser-only code (`performance-monitor.ts`)

## Educational Requirements Testing

### Content Validation

- **Wonder Moments**: Every lesson must have a "wonder moment" - validates core educational philosophy
- **No Mastery Terminology**: Enforces "learning" language over "mastery" - maintains introductory curriculum approach
- **Schema Compliance**: Validates content structure (32 systems × 8 phases × 16 tiers × 32 lessons)

### Example Educational Test

```typescript
it("should ensure every lesson has a wonder moment", () => {
  const lesson = mockLessons[0];
  expect(lesson.wonderMoment).toBeTruthy();
  expect(typeof lesson.wonderMoment).toBe("string");
  expect(lesson.wonderMoment.length).toBeGreaterThan(10);
});
```

## Performance Testing

### Web Vitals Validation

- **CLS**: Cumulative Layout Shift formatting and rating
- **FCP**: First Contentful Paint timing validation
- **LCP**: Largest Contentful Paint measurement
- **INP**: Interaction to Next Paint (replaces FID)

### Metric Rating System

```typescript
const getMetricRating = (name: string, value: number) => {
  // 'good' | 'needs-improvement' | 'poor'
  // Based on Web Vitals thresholds
};
```

## Accessibility Testing

### ARIA Compliance

- Tests proper ARIA labels and attributes
- Validates semantic HTML structure
- Checks keyboard navigation patterns

### Example Accessibility Test

```typescript
it("should have proper accessibility attributes", () => {
  const nav = document.querySelector("nav");
  expect(nav?.getAttribute("aria-label")).toBe("Main navigation");

  const toggle = document.querySelector(".mobile-toggle");
  expect(toggle?.getAttribute("aria-expanded")).toBe("false");
});
```

## Mock Strategy

### Browser APIs

- **localStorage/sessionStorage**: Full CRUD operations
- **matchMedia**: Responsive design testing
- **ResizeObserver**: Component resize handling
- **IntersectionObserver**: Scroll-based interactions
- **Performance API**: Web Vitals measurement

### Component Dependencies

- **web-vitals**: Performance monitoring library
- **DOM APIs**: Complete browser environment simulation
- **File operations**: Download/export functionality

## Best Practices

### Test Organization

1. **Group by functionality**: Use `describe` blocks for logical grouping
2. **Clear assertions**: Each test should have a clear, single purpose
3. **Comprehensive coverage**: Test happy path, edge cases, and error conditions
4. **Cleanup**: Always clean up mocks and global state

### Naming Conventions

- **Test files**: `ComponentName.test.ts`
- **Test descriptions**: `should + expected behavior`
- **Mock functions**: `mockFunctionName` or `functionNameMock`

### Performance Considerations

- **happy-dom**: Faster than jsdom for most component tests
- **Selective mocking**: Only mock what's necessary for tests
- **Parallel execution**: Tests run in parallel by default
- **Retry logic**: Failed tests retry once to handle flaky tests

## Continuous Integration

The test suite is designed to run in CI environments with:

- **No browser dependencies**: All browser APIs are mocked
- **Fast execution**: Optimized for quick feedback loops
- **Comprehensive reporting**: HTML and LCOV coverage reports
- **Failure isolation**: Tests don't affect each other

## Future Enhancements

Planned additions to the testing infrastructure:

- **Visual regression testing**: Screenshot comparisons
- **Accessibility automation**: axe-core integration
- **Performance budgets**: Automated performance monitoring
- **E2E testing**: Full user journey testing with Playwright
