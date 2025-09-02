# Code198x Website
## The Interactive Learning Platform for Retro Computing

Built with **Astro 5.9.2** to deliver 1,400+ retro programming lessons with modern performance and educational tools.

## 🎯 Overview

The Code198x website provides:
- **📚 1,400+ Interactive Lessons** across 16 retro platforms
- **🎮 Embedded Emulators** for hands-on programming
- **📊 Progress Tracking** through phases and tiers
- **🛠️ Development Tools** integrated with Docker environments
- **📱 Responsive Design** for all devices

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Open http://localhost:4321

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

The website is organized around educational content and interactive tools:

```text
website/
├── public/                 # Static assets
│   ├── images/            # Platform screenshots, diagrams
│   ├── js/                # Client-side utilities
│   └── favicon.svg        # Site branding
├── src/
│   ├── components/        # Interactive learning components
│   │   ├── MemoryMap*.astro      # Hardware visualization
│   │   ├── RegisterView*.astro   # CPU register displays
│   │   ├── Phase0Progress.astro  # Learning progress
│   │   ├── AssemblyStepThrough.tsx # Code debugging
│   │   └── Emulator.astro        # Embedded emulators
│   ├── content/           # Lesson content and schemas
│   │   └── config.ts      # Content validation rules
│   ├── layouts/           # Page templates
│   │   ├── Layout.astro   # Base site layout
│   │   └── LessonLayout.astro # Individual lesson pages
│   ├── pages/             # Site routes
│   │   ├── index.astro    # Homepage with platform grid
│   │   ├── lessons/       # Auto-generated lesson pages
│   │   └── [...platform]/ # Dynamic platform routes
│   ├── scripts/           # Syntax highlighting
│   │   ├── prism-z80.js   # Z80 assembly highlighting
│   │   └── prism-m68k.js  # 68000 assembly highlighting
│   ├── styles/            # CSS and themes
│   │   ├── global.css     # Base styles
│   │   └── prism-retro.css # Code syntax theme
│   └── utils/             # Helper functions
└── package.json           # Dependencies and scripts
```

## 🛠️ Development Commands

| Command | Purpose | Details |
|---------|---------|----------|
| `npm install` | Install dependencies | Required before first run |
| `npm run dev` | Development server | Hot reload at `localhost:4321` |
| `npm run build` | Production build | Generates static site to `./dist/` |
| `npm run preview` | Test production build | Preview optimized version locally |
| `npm run validate-content` | Check lesson format | Validates MDX frontmatter |
| `npm run check-links` | Verify internal links | Ensures navigation works |
| `npm run lint` | Code quality check | ESLint and Prettier |
| `npm run astro add <integration>` | Add features | Install Astro integrations |

### Educational Content Commands

| Command | Purpose |
|---------|----------|
| `npm run generate-lesson-index` | Update lesson navigation |
| `npm run optimize-images` | Compress screenshots |
| `npm run test-emulator-integration` | Verify embedded emulators |
| `npm run export-progress-data` | Generate learning analytics |

## 🎮 Educational Features

### Interactive Learning Components

**Memory Visualizations:**
- Platform-specific memory maps with live highlighting
- Register viewers showing CPU state changes
- Step-through debugging for assembly code

**Embedded Development:**
- Docker container integration for building programs
- Automatic emulator launching with built programs
- Screenshot capture for lesson documentation

**Progress Tracking:**
- Phase and tier completion tracking
- Platform mastery indicators
- Achievement system for major milestones

### Content Management

**Lesson Schema Validation:**
```typescript
// src/content/config.ts
const lessonSchema = z.object({
  title: z.string(),
  phase: z.number().min(0).max(8),
  tier: z.number().min(1).max(8),
  lesson: z.number().min(1).max(16),
  concept: z.string(),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  wow_factor: z.string(),
  // ... additional validation
});
```

**Content Collections:**
- Lessons organized by platform → phase → tier → lesson
- Automatic navigation generation
- Cross-platform concept linking
- Historical context integration

## 🌐 Production Deployment

### Build Process

```bash
# Complete production build
npm run build:production

# Includes:
# - Content validation
# - Image optimization  
# - Bundle optimization
# - Performance verification
```

### Performance Targets

- **Lighthouse Score**: >90 (Performance, Accessibility, SEO)
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <3s
- **Bundle Size**: <100KB initial JS

### Hosting Configuration

**Static Site Deployment:**
- All content pre-rendered to static HTML
- CDN-friendly with aggressive caching
- Progressive enhancement for interactive features
- Works with any static hosting provider

**Recommended Hosts:**
- **Netlify**: Automatic GitHub integration
- **Vercel**: Zero-config deployment
- **Cloudflare Pages**: Global CDN performance
- **GitHub Pages**: Free for public repositories

See [Deployment Guide](../docs/DEPLOYMENT.md) for complete instructions.

## 🔧 Development Workflow

### Adding New Lessons

1. **Create lesson content:**
   ```bash
   # Use lesson template
   cp src/templates/lesson-template.md \
      src/content/lessons/c64/tier1/lesson017-final.md
   ```

2. **Add working code:**
   ```bash
   # Create accompanying program
   echo '10 PRINT "HELLO, WORLD!"' > public/code/c64/lesson017.bas
   ```

3. **Capture screenshot:**
   ```bash
   # Use emulator integration
   npm run capture-lesson-screenshot c64 tier1 lesson017
   ```

4. **Validate and test:**
   ```bash
   npm run validate-content
   npm run dev  # Test in browser
   ```

### Platform Integration

**Docker Environment Connection:**
```javascript
// Launch emulator with lesson code
const launchEmulator = async (platform, lesson) => {
  await docker.exec(`${platform}-container`, [
    'build-lesson', lesson.codeFile
  ]);
  
  await emulator.launch(platform, {
    program: lesson.outputFile,
    autorun: lesson.autorun
  });
};
```

**Emulator Integration:**
- VICE (C64), Fuse (Spectrum), FS-UAE (Amiga)
- Automatic program loading and execution
- Screenshot and video capture capabilities
- WebAssembly versions for in-browser emulation (planned)

## 📚 Content Architecture

### Lesson Organization

```
content/lessons/
├── c64/
│   ├── phase0/
│   │   ├── tier1/
│   │   │   ├── lesson001.md  # Colors and borders
│   │   │   ├── lesson002.md  # Text and characters
│   │   │   └── ...
│   │   ├── tier2/  # Graphics and sprites
│   │   └── ...
│   └── phase1/  # Assembly foundations (planned)
├── spectrum/
│   └── [similar structure]
└── shared/
    ├── concepts/      # Cross-platform programming concepts
    ├── history/       # Computing history context
    └── templates/     # Reusable lesson templates
```

### Content Types

**Primary Content:**
- **Lessons**: Step-by-step programming tutorials
- **Games**: Complete projects showcasing concepts
- **Concepts**: Cross-platform programming principles
- **History**: Historical context and significance

**Supporting Content:**
- **Code Examples**: Working programs for every lesson
- **Screenshots**: Visual proof of working programs
- **Videos**: Demonstrations of complex concepts
- **Reference**: Platform specifications and memory maps

## 🎯 Educational Philosophy Integration

The website embodies Code198x's **"Magic-First Approach"**:

### Lesson Presentation

1. **Visual Impact First**: Every lesson opens with a compelling screenshot
2. **Wonder and Context**: Historical significance and "wow factor" prominently featured  
3. **Hands-On Learning**: Working code examples with run buttons
4. **Progressive Discovery**: Concepts build systematically across lessons
5. **Extension Challenges**: Opportunities for experimentation and personalization

### Navigation Philosophy

- **Multiple Entry Points**: Homepage, platform pages, lesson pages
- **Clear Progression**: Visual indicators of learning path
- **Cross-References**: Connections between related concepts
- **Search and Discovery**: Find lessons by concept, platform, or difficulty

## 🤝 Contributing to the Website

### Areas for Contribution

**Content Enhancement:**
- Add missing lesson screenshots
- Improve lesson explanations and context
- Create cross-platform concept connections
- Develop interactive coding exercises

**Technical Improvement:**
- Enhance emulator integration
- Improve performance and accessibility
- Add new interactive learning components
- Optimize mobile experience

**Educational Tools:**
- Memory map visualizers
- Assembly code step-through debuggers
- Progress tracking and achievement systems
- Community features for sharing creations

See [Contributing Guide](../CONTRIBUTING.md) for detailed contribution instructions.

## 📞 Support and Documentation

### Technical Documentation
- **[Platform Guide](../docs/PLATFORM_GUIDE.md)**: Detailed platform information
- **[Development Setup](../docs/DEVELOPMENT_SETUP.md)**: Complete development environment
- **[Lesson Structure](../docs/LESSON_STRUCTURE.md)**: Content creation guidelines
- **[Deployment Guide](../docs/DEPLOYMENT.md)**: Production deployment instructions

### Community Resources
- **Issues**: Bug reports and feature requests
- **Discussions**: Questions and community showcase
- **Wiki**: Community-contributed tips and extensions

---

**The Code198x website brings the magic of retro programming to modern learners.**

Ready to enhance the platform? Check out the [Contributing Guide](../CONTRIBUTING.md) and help make retro programming education even more amazing!

**Build like it's 202x. Inspire like it's 198x.**