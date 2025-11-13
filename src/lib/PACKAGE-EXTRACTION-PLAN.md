# Package Extraction Plan: shiki-highlight-api

**Status:** Planning Phase
**Date:** November 5, 2025
**Goal:** Extract CSS Custom Highlight API implementation into standalone npm package

---

## Package Overview

**Name:** `shiki-highlight-api`
**Description:** High-performance syntax highlighting using CSS Custom Highlight API instead of DOM spans
**Tagline:** "87% fewer DOM nodes, identical visual output"

**Key Benefits:**
- 80-90% reduction in DOM nodes
- Visual parity with traditional Shiki
- Drop-in replacement for Shiki's renderer
- All Shiki languages supported (bundled + custom)
- Modern browser support (Chrome 105+, Safari 17.2+, Firefox 140+)

---

## Repository Structure

```
shiki-highlight-api/
├── packages/
│   ├── core/                    # Main package
│   │   ├── src/
│   │   │   ├── index.ts         # Main API exports
│   │   │   ├── highlighter.ts   # Highlighter creation/management
│   │   │   ├── generator.ts     # HTML/CSS/script generation
│   │   │   └── types.ts         # TypeScript definitions
│   │   ├── package.json
│   │   ├── README.md
│   │   └── tsconfig.json
│   │
│   ├── remark/                  # Remark plugin
│   │   ├── src/
│   │   │   └── index.ts         # Remark plugin
│   │   ├── package.json
│   │   └── README.md
│   │
│   ├── astro/                   # Astro integration (future)
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── README.md
│   │
│   └── react/                   # React component (future)
│       ├── src/
│       │   └── CodeBlock.tsx
│       ├── package.json
│       └── README.md
│
├── docs/                        # Documentation site (Astro)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── index.astro      # Landing page
│   │   │   ├── demo.astro       # Live demo
│   │   │   ├── api.astro        # API reference
│   │   │   └── comparison.astro # Performance comparison
│   │   └── components/
│   └── package.json
│
├── examples/                    # Integration examples
│   ├── astro-basic/
│   ├── nextjs-app/
│   └── vite-vanilla/
│
├── benchmarks/                  # Performance tests
│   ├── dom-count.ts
│   ├── render-time.ts
│   └── memory-usage.ts
│
├── .github/
│   └── workflows/
│       ├── ci.yml               # Test + build on PR
│       ├── publish.yml          # Publish to npm
│       └── docs.yml             # Deploy docs site
│
├── package.json                 # Workspace root
├── pnpm-workspace.yaml          # Monorepo config
├── turbo.json                   # Build orchestration
├── LICENSE                      # MIT
└── README.md                    # Main README
```

---

## Core API Design

### Package: `shiki-highlight-api`

```typescript
// Main export
export async function codeToHighlightHtml(
  code: string,
  options: HighlightOptions
): Promise<HighlightResult>

// Options
interface HighlightOptions {
  lang: string;              // Language ID
  theme?: string;            // Shiki theme (default: 'dark-plus')
  blockId?: string;          // Optional unique ID (auto-generated if omitted)
}

// Result
interface HighlightResult {
  html: string;              // Clean HTML with text nodes
  css: string;               // ::highlight() style rules
  script: string;            // Client-side registration script
  stats: {
    tokens: number;          // Total tokens
    lines: number;           // Total lines (= DOM nodes)
    uniqueStyles: number;    // Unique color count
  };
}

// Fallback for unsupported browsers
export async function codeToHtmlFallback(
  code: string,
  options: HighlightOptions
): Promise<string>

// Advanced: Create persistent highlighter
export async function createHighlighter(
  options: CreateHighlighterOptions
): Promise<Highlighter>
```

### Package: `remark-shiki-highlight-api`

```typescript
import { remarkHighlightApi } from 'remark-shiki-highlight-api';

// Usage in markdown pipeline
export default {
  markdown: {
    remarkPlugins: [remarkHighlightApi],
    syntaxHighlight: false,
  }
}
```

---

## Migration Path from Code198x

### Phase 1: Extract Core (Week 1)

**Files to extract:**
- `/website/src/lib/highlight-api.ts` → `packages/core/src/index.ts`
- Custom language grammars → Examples in docs

**Changes needed:**
- Remove Code198x-specific custom language loading
- Make grammar loading generic and documented
- Add comprehensive JSDoc comments
- Add unit tests

**Deliverable:** Working `shiki-highlight-api` v0.1.0 on npm

### Phase 2: Extract Remark Plugin (Week 1)

**Files to extract:**
- `/website/src/lib/remark-highlight-api.ts` → `packages/remark/src/index.ts`

**Changes needed:**
- Remove dependency on core (use published package)
- Add error handling
- Add tests

**Deliverable:** `remark-shiki-highlight-api` v0.1.0 on npm

### Phase 3: Update Code198x (Week 1)

**Changes:**
```diff
- import { codeToHighlightHtml } from '../lib/highlight-api';
+ import { codeToHighlightHtml } from 'shiki-highlight-api';

- import { remarkHighlightApi } from './src/lib/remark-highlight-api.ts';
+ import { remarkHighlightApi } from 'remark-shiki-highlight-api';
```

**Delete local files:**
- `/website/src/lib/highlight-api.ts`
- `/website/src/lib/remark-highlight-api.ts`

**Test:** Verify all Code198x lesson pages still render correctly

---

## Documentation Site

### Landing Page

**Hero Section:**
```
shiki-highlight-api
87% fewer DOM nodes. Identical visual output.

High-performance syntax highlighting using CSS Custom Highlight API.
```

**Key Features:**
- Live side-by-side comparison (traditional vs Highlight API)
- DOM inspector showing node count difference
- Browser support table
- Quick start code snippet

### Live Demo Page

**Interactive demo:**
- Code editor (textarea)
- Language selector (dropdown)
- Theme selector
- Live rendering with both approaches
- Real-time DOM node count
- DevTools-style inspector

### API Reference

**Complete API documentation:**
- `codeToHighlightHtml()` with all options
- `createHighlighter()` for advanced use
- Custom language loading examples
- Framework integration guides

### Performance Comparison

**Benchmarks:**
- DOM node counts across languages
- Memory usage comparison
- Initial render time
- Scrolling performance
- Real-world examples (Code198x lesson pages)

---

## npm Publishing Strategy

### Package Naming

**Primary package:** `shiki-highlight-api`
- Clear, descriptive name
- Indicates relationship to Shiki
- Emphasizes the Highlight API approach

**Plugin package:** `remark-shiki-highlight-api`
- Follows remark plugin naming convention
- Clear dependency relationship

### Versioning

**Initial release:** `0.1.0` (beta)
- Core functionality working
- Limited testing in production
- API may change

**First stable:** `1.0.0`
- Proven in Code198x production
- Comprehensive tests
- Stable API guaranteed

**Semantic versioning:**
- MAJOR: Breaking API changes
- MINOR: New features, backward compatible
- PATCH: Bug fixes

### Package Metadata

```json
{
  "name": "shiki-highlight-api",
  "version": "0.1.0",
  "description": "High-performance syntax highlighting using CSS Custom Highlight API",
  "keywords": [
    "shiki",
    "syntax-highlighting",
    "highlight-api",
    "performance",
    "markdown",
    "code"
  ],
  "author": "Steve Hill <steve@stevehill.xyz>",
  "license": "MIT",
  "homepage": "https://shiki-highlight-api.dev",
  "repository": {
    "type": "git",
    "url": "https://github.com/stevehill77/shiki-highlight-api"
  },
  "bugs": {
    "url": "https://github.com/stevehill77/shiki-highlight-api/issues"
  },
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "test": "vitest",
    "prepublishOnly": "npm run build"
  },
  "peerDependencies": {
    "shiki": "^1.0.0"
  },
  "devDependencies": {
    "shiki": "^1.0.0",
    "tsup": "^8.0.0",
    "typescript": "^5.0.0",
    "vitest": "^1.0.0"
  }
}
```

---

## Testing Strategy

### Unit Tests

**Core functionality:**
- HTML generation produces correct structure
- CSS rules generated for all token colors
- Script generates valid Range objects
- Custom language loading works

**Coverage target:** 80%+

### Integration Tests

**Framework tests:**
- Remark plugin processes code blocks correctly
- Astro builds succeed with plugin
- MDX files render properly

### Visual Regression Tests

**Compare rendered output:**
- Traditional Shiki vs Highlight API
- Across all test languages
- Different themes
- Tool: Playwright + Percy

### Browser Compatibility Tests

**Supported browsers:**
- Chrome 105+
- Safari 17.2+
- Firefox 140+

**Unsupported fallback:**
- Graceful degradation
- Feature detection works

---

## Marketing & Launch

### Pre-Launch (Week 1-2)

- [ ] Create GitHub repository
- [ ] Build documentation site
- [ ] Record demo video (2-3 min)
- [ ] Write launch blog post
- [ ] Prepare HN submission
- [ ] Create Twitter thread

### Launch Day

**Channels:**
1. **Hacker News** - "Show HN: shiki-highlight-api – 87% fewer DOM nodes for syntax highlighting"
2. **Reddit** - r/webdev, r/javascript, r/reactjs
3. **Twitter/X** - Developer community
4. **Dev.to** - Technical blog post
5. **GitHub** - Tag as "good first issue" for contributors

**Key messaging:**
- Performance gain (87% fewer DOM nodes)
- Visual parity (identical to Shiki)
- Easy migration (drop-in replacement)
- Modern web platform API (CSS Custom Highlight)

### Post-Launch (Week 3-4)

- [ ] Respond to feedback/issues
- [ ] Write follow-up blog posts
- [ ] Create tutorial videos
- [ ] Reach out to framework maintainers (Astro, Next.js)
- [ ] Submit to Awesome lists

---

## Success Metrics

### Week 1
- [ ] npm downloads: 100+
- [ ] GitHub stars: 50+
- [ ] Issues/PRs: 5+

### Month 1
- [ ] npm downloads: 1,000+
- [ ] GitHub stars: 200+
- [ ] Production users: 10+

### Month 3
- [ ] npm downloads: 10,000+
- [ ] GitHub stars: 500+
- [ ] Framework integrations: 2+ (Astro, Next.js, etc.)

---

## Maintenance Plan

### Support Commitment

**Active development:** 6 months minimum
- Bug fixes within 48 hours
- Feature requests evaluated monthly
- Security patches immediate

**Long-term:** Community-driven
- Accept quality PRs
- Transfer to organization if interest grows
- Archive if no longer needed (with notice)

### Breaking Changes

**Avoid unless necessary:**
- Major version bumps rare
- Migration guides provided
- Deprecation warnings 3 months before removal

---

## Open Source Strategy

### License

**MIT License** - Maximum adoption potential
- Commercial use allowed
- Modification allowed
- Distribution allowed
- Private use allowed

### Contribution Guidelines

**Welcome contributions:**
- Bug reports
- Feature requests
- Documentation improvements
- Framework integrations
- Language-specific optimizations

**Code review required:**
- All PRs reviewed before merge
- Tests must pass
- Documentation updated
- Breaking changes discussed

### Community

**Communication channels:**
- GitHub Issues - Bug reports, feature requests
- GitHub Discussions - Q&A, ideas
- Discord (if demand) - Real-time support

---

## Risks & Mitigation

### Risk 1: Low Adoption

**Mitigation:**
- Strong documentation
- Live demos
- Performance benchmarks
- Framework integrations

### Risk 2: Browser Compatibility

**Mitigation:**
- Clear browser support documentation
- Fallback implementation
- Feature detection

### Risk 3: Shiki API Changes

**Mitigation:**
- Pin Shiki peer dependency
- Monitor Shiki releases
- Update quickly for breaking changes

### Risk 4: Maintenance Burden

**Mitigation:**
- Code quality from start
- Comprehensive tests
- Clear documentation
- Community involvement

---

## Timeline

### Week 1: Core Package
- [x] Validate proof of concept
- [ ] Extract core to package
- [ ] Add unit tests
- [ ] Write documentation
- [ ] Publish v0.1.0

### Week 2: Remark Plugin
- [ ] Extract remark plugin
- [ ] Add integration tests
- [ ] Create examples
- [ ] Publish v0.1.0

### Week 3: Documentation Site
- [ ] Build Astro docs site
- [ ] Add live demos
- [ ] Record video
- [ ] Deploy to production

### Week 4: Launch
- [ ] Write blog post
- [ ] Prepare launch materials
- [ ] Submit to HN/Reddit
- [ ] Monitor feedback
- [ ] Iterate on issues

---

## Next Steps

**Immediate (Today):**
1. Create GitHub repository
2. Set up package structure
3. Extract core functionality
4. Add basic README

**This Week:**
1. Publish core package to npm
2. Update Code198x to use published package
3. Verify nothing breaks
4. Start documentation site

**Next Week:**
1. Extract remark plugin
2. Create demo examples
3. Write blog post
4. Plan launch

---

**Questions to Decide:**

1. **Package scope:** Publish as `@stevehill/shiki-highlight-api` or unscoped `shiki-highlight-api`?
2. **Monorepo tool:** pnpm workspaces, npm workspaces, or Turborepo?
3. **Documentation hosting:** Cloudflare Pages, Vercel, Netlify, or GitHub Pages?
4. **Organization:** Personal GitHub or create organization?
5. **Name alternatives:** `shiki-highlights`, `shiki-css-highlighter`, keep `shiki-highlight-api`?

---

**Ready to proceed?** Let me know which approach you prefer and we can start creating the repository structure.
