# Accessibility Testing Automation

Comprehensive accessibility testing for the Code198x educational platform, ensuring WCAG 2.1 AA compliance and inclusive learning experiences for all students.

## Overview

This accessibility testing suite uses **axe-core** with **Playwright** to provide automated accessibility auditing specifically designed for educational platforms. The tests focus on ensuring that students with disabilities can fully participate in retro computing education.

## Why Accessibility Matters for Code198x

- **Inclusive Education**: Programming education should be accessible to students with visual, motor, cognitive, and hearing impairments
- **Legal Compliance**: Educational institutions require WCAG 2.1 AA compliance
- **Better Learning**: Accessibility improvements benefit all learners, not just those with disabilities
- **Retro Computing Legacy**: Classic computers had simple, keyboard-driven interfaces that can inspire modern accessibility practices

## Test Structure

```
tests/accessibility/
├── homepage.spec.ts           # Homepage accessibility audit
├── components.spec.ts         # Component-specific tests
├── educational-content.spec.ts # Educational platform requirements
├── axe.config.ts             # Custom accessibility configuration
└── README.md                 # This documentation
```

## Test Categories

### Homepage Tests (`homepage.spec.ts`)
- **Full page audit**: Complete WCAG 2.1 AA compliance check
- **Navigation accessibility**: Keyboard navigation and screen reader support
- **Performance dashboard**: Accessible metrics display
- **Dark mode compliance**: Theme accessibility validation
- **Mobile accessibility**: Touch target sizes and mobile navigation
- **Keyboard navigation**: Tab order and focus management
- **Screen reader support**: Landmark usage and ARIA compliance

### Component Tests (`components.spec.ts`)
- **Navigation component**: Desktop and mobile menu accessibility
- **Performance dashboard**: Interactive widget accessibility
- **Button accessibility**: Focus indicators and keyboard support
- **Interactive states**: Hover, focus, and active state compliance
- **Color contrast**: Light and dark mode validation
- **Semantic structure**: Proper HTML semantics and ARIA roles

### Educational Content Tests (`educational-content.spec.ts`)
- **Learning interface**: Educational-specific accessibility requirements
- **Code examples**: Syntax highlighting accessibility
- **Visual learner support**: Alternative text and descriptions
- **Motor accessibility**: Touch target sizes and timing requirements
- **Cognitive accessibility**: Consistent patterns and clear feedback
- **Keyboard-only learning**: Complete keyboard accessibility
- **Zoom support**: 200% zoom compliance (WCAG requirement)

## Available Test Commands

```bash
# Run all accessibility tests
npm run test:a11y

# Run tests in headed mode (see browser)
npm run test:a11y:headed

# Debug tests interactively
npm run test:a11y:debug

# Show accessibility test report
npm run test:a11y:report

# Run specific browser tests
npm run test:a11y:chromium
npm run test:a11y:firefox
npm run test:a11y:webkit

# Run all tests (unit + visual + accessibility)
npm run test:all
```

## WCAG 2.1 AA Compliance

### Tested Guidelines

#### Perceivable
- **1.1.1 Non-text Content**: Images have alternative text
- **1.3.1 Info and Relationships**: Semantic structure preserved
- **1.3.2 Meaningful Sequence**: Logical reading order
- **1.4.3 Contrast (Minimum)**: 4.5:1 contrast for normal text, 3:1 for large text
- **1.4.4 Resize Text**: Works at 200% zoom
- **1.4.10 Reflow**: Content reflows at 320px width
- **1.4.11 Non-text Contrast**: UI components have 3:1 contrast

#### Operable
- **2.1.1 Keyboard**: All functionality via keyboard
- **2.1.2 No Keyboard Trap**: Focus can move freely
- **2.4.1 Bypass Blocks**: Skip links for efficient navigation
- **2.4.2 Page Titled**: Pages have descriptive titles
- **2.4.3 Focus Order**: Logical tab order
- **2.4.6 Headings and Labels**: Descriptive headings and labels
- **2.4.7 Focus Visible**: Clear focus indicators
- **2.5.5 Target Size**: 44×44px minimum touch targets

#### Understandable
- **3.1.1 Language of Page**: Page language declared
- **3.2.1 On Focus**: No context changes on focus
- **3.2.2 On Input**: No unexpected context changes
- **3.3.2 Labels or Instructions**: Form guidance provided

#### Robust
- **4.1.1 Parsing**: Valid HTML structure
- **4.1.2 Name, Role, Value**: Proper ARIA implementation
- **4.1.3 Status Messages**: Status updates announced appropriately

## Educational Platform Requirements

### Code Example Accessibility
```typescript
// Code blocks should have language indicators
<pre><code class="language-assembly">
  LDA #$01
  STA $0400
</code></pre>

// Syntax highlighting must not rely on color alone
// Include semantic indicators for keywords, comments, etc.
```

### Interactive Learning Elements
- **Touch Targets**: Minimum 44×44px for mobile learners
- **Focus Management**: Clear focus indicators for keyboard navigation
- **Screen Reader Support**: Proper ARIA labels for complex widgets
- **Error Prevention**: Clear feedback for learning interactions

### Performance Dashboard
- **Non-intrusive Updates**: Metrics don't spam screen readers
- **Summary Information**: Overall performance status available
- **Exportable Data**: Performance data accessible to assistive technology
- **Keyboard Control**: Full keyboard access to all functions

## Custom Accessibility Configuration

The `axe.config.ts` file provides:

### Educational Standards
```typescript
const EducationalAccessibilityStandards = {
  wcag21aa: {
    colorContrast: { normal: 4.5, large: 3.0 },
    focusIndicator: { required: true, minSize: '2px' },
    keyboard: { tabOrder: true, skipLinks: true },
  },
  retroComputing: {
    monospaceFonts: { readable: true, scalable: true },
    codeExamples: { syntaxHighlight: true, copyable: true },
    interactiveElements: { largeTargets: true, clearFocus: true },
  }
};
```

### Custom Helper Functions
- `checkCodeExamples()`: Validates programming example accessibility
- `checkTargetSizes()`: Ensures adequate touch target sizes
- `checkMetricAnnouncements()`: Prevents screen reader spam

## Educational Specific Tests

### Learning Accessibility
- **Skip Links**: Efficient navigation through content
- **Heading Structure**: Logical content hierarchy
- **Keyboard Learning**: Complete keyboard-only interaction
- **Focus Management**: Visible focus indicators
- **Screen Reader**: Proper landmark and role usage

### Content Accessibility
- **Code Syntax**: Accessible syntax highlighting
- **High Contrast**: Support for visual impairments
- **Zoom Support**: 200% zoom without horizontal scroll
- **Alternative Formats**: Text alternatives for visual content

### Motor Accessibility
- **Large Targets**: 44×44px minimum interactive elements
- **No Timing**: No time-pressured interactions
- **Alternative Input**: Support for assistive input devices

### Cognitive Accessibility
- **Consistent Patterns**: Predictable navigation and interaction
- **Clear Feedback**: Immediate response to user actions
- **Help Access**: Available documentation and assistance
- **No Auto-advance**: User-controlled pacing

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run Accessibility Tests
  run: npm run test:a11y

- name: Generate Accessibility Report
  run: npm run test:a11y:report

- name: Upload Accessibility Results
  uses: actions/upload-artifact@v3
  if: failure()
  with:
    name: accessibility-violations
    path: playwright-report/
```

### Accessibility Gates
- **Zero Violations**: All tests must pass with no accessibility violations
- **Performance Impact**: Tests run efficiently in CI pipeline
- **Comprehensive Coverage**: Tests cover all user interaction paths

## Troubleshooting

### Common Accessibility Issues

#### Color Contrast Failures
```bash
# Check specific elements
npm run test:a11y:debug
# Focus on color-contrast rule in browser
```

#### Missing ARIA Labels
- Ensure interactive elements have accessible names
- Use `aria-label`, `aria-labelledby`, or visible text
- Test with screen reader simulation

#### Keyboard Navigation Issues
- Check tab order with `Tab` key
- Ensure all interactive elements are focusable
- Verify focus indicators are visible

#### Mobile Accessibility
- Test touch target sizes (44×44px minimum)
- Verify mobile navigation accessibility
- Check viewport scaling compliance

### Debugging Tests
```bash
# Run specific test file
npx playwright test tests/accessibility/homepage.spec.ts

# Debug interactively
npm run test:a11y:debug

# Run with headed browser
npm run test:a11y:headed
```

### Screen Reader Testing
While automated tests catch many issues, manual testing with actual screen readers provides the complete picture:

- **NVDA** (Windows, free)
- **JAWS** (Windows, commercial)
- **VoiceOver** (macOS, built-in)
- **Orca** (Linux, free)
- **TalkBack** (Android, built-in)
- **VoiceOver** (iOS, built-in)

## Educational Impact

### Benefits for Students
- **Visual Impairments**: Screen reader compatibility and high contrast support
- **Motor Impairments**: Keyboard navigation and adequate touch targets
- **Cognitive Disabilities**: Consistent patterns and clear feedback
- **Hearing Impairments**: Visual indicators for audio content
- **Learning Differences**: Multiple ways to access and interact with content

### Benefits for Educators
- **Legal Compliance**: Meet institutional accessibility requirements
- **Inclusive Teaching**: Reach all students regardless of ability
- **Better UX**: Accessibility improvements benefit all users
- **Future-Proof**: Accessible design adapts to new assistive technologies

## Accessibility Metrics

### Key Performance Indicators
- **Violation Count**: Zero accessibility violations
- **Test Coverage**: All interactive elements tested
- **Response Time**: Tests complete within CI/CD timeouts
- **Cross-Browser**: Consistent accessibility across browsers

### Reporting
- **HTML Reports**: Visual accessibility violation reports
- **JSON Data**: Machine-readable results for integration
- **GitHub Actions**: Automated PR checks and status updates
- **Trend Analysis**: Track accessibility improvements over time

## Future Enhancements

### Advanced Testing
- **Cognitive Load Testing**: Measure complexity and user burden
- **Voice Control**: Test voice navigation compatibility
- **Eye Tracking**: Analyze visual attention patterns
- **Custom Assertions**: Educational platform specific rules

### Integration Opportunities
- **Design System**: Accessibility-first component library
- **Content Authoring**: Accessibility guides for content creators
- **User Testing**: Regular testing with disabled users
- **Compliance Monitoring**: Ongoing accessibility health checks

## Resources

### WCAG Guidelines
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Understanding WCAG 2.1](https://www.w3.org/WAI/WCAG21/Understanding/)
- [How to Meet WCAG](https://www.w3.org/WAI/WCAG21/quickref/)

### Tools and Testing
- [axe-core Documentation](https://github.com/dequelabs/axe-core)
- [Playwright Accessibility](https://playwright.dev/docs/accessibility-testing)
- [WebAIM Screen Reader Survey](https://webaim.org/projects/screenreadersurvey9/)

### Educational Accessibility
- [Section 508 Standards](https://www.section508.gov/manage/laws-and-policies)
- [ADA Compliance for Education](https://www.ada.gov/resources/web-guidance/)
- [Universal Design for Learning](http://udlguidelines.cast.org/)