# Content Production Guide

## Quick Start: Creating a New Lesson

1. Copy `templates/lesson-template.mdx` to the appropriate directory:
   ```
   src/content/lessons/[system]/phase-[N]/tier-[N]/[NN]-lesson-name.mdx
   ```

2. Update the frontmatter with lesson specifics
3. Fill in each section following the template structure
4. Test all code examples in the emulator
5. Review against the quality checklist below

## Directory Structure

```
src/content/lessons/
├── commodore-64/
│   └── phase-1/
│       ├── tier-1/    (Lessons 01-32)
│       ├── tier-2/    (Lessons 33-64)
│       └── ...
├── sinclair-zx-spectrum/
│   └── phase-1/
│       └── tier-1/    (Lessons 01-32)
└── ...
```

## Lesson Numbering Convention

- **Lessons 01-32**: Tier 1
- **Lessons 33-64**: Tier 2
- **Lessons 65-96**: Tier 3
- Continue in blocks of 32

File naming: `[NN]-descriptive-name.mdx`
- Always use 2-digit numbers (01, 02, ... 32)
- Use lowercase with hyphens
- Keep names concise but descriptive

## Writing Guidelines

### Educational Philosophy
- **Progressive Difficulty**: Each lesson builds on previous concepts
- **Immediate Application**: Every concept has working code
- **Wonder Moments**: End with something that excites and motivates
- **Practical Focus**: Theory serves practice, not vice versa

### Technical Standards
- **Working Code**: Every example must assemble and run
- **Clear Comments**: Explain the WHY, not just the WHAT
- **Modern Tools**: Use Docker environment and cross-development
- **Authentic Experience**: Respect the original hardware while using modern workflows

### Style Guidelines
- **Active Voice**: "You'll create..." not "A sprite will be created..."
- **Encouraging Tone**: Celebrate achievements, normalize challenges
- **Clear Structure**: Consistent sections aid navigation
- **Visual Breaks**: Use headers, lists, and code blocks for scanning

## Quality Checklist

### Before Publishing Each Lesson

#### Content Quality
- [ ] Clear learning objectives stated upfront
- [ ] Builds logically on prerequisites
- [ ] Core concept explained simply before diving deep
- [ ] Practical application demonstrated

#### Code Quality
- [ ] All code examples tested and working
- [ ] Comments explain non-obvious operations
- [ ] Complete program provided at end
- [ ] Memory addresses and values accurate for system

#### Educational Value
- [ ] Challenges provided at appropriate difficulty levels
- [ ] Common mistakes addressed proactively
- [ ] Real-world applications referenced
- [ ] Wonder moment creates genuine excitement

#### Technical Accuracy
- [ ] Assembly syntax correct for target system
- [ ] Hardware behavior accurately described
- [ ] Performance implications noted where relevant
- [ ] Best practices demonstrated

#### User Experience
- [ ] Code blocks properly formatted with language tags
- [ ] Navigation to next/previous lessons works
- [ ] Tags help with discovery
- [ ] Difficulty level accurately assessed

## Content Batches

### Efficient Production Workflow

1. **Planning Phase** (Week 1)
   - Outline all 32 lessons in the tier
   - Identify code progression and dependencies
   - Create asset requirements list

2. **Content Creation** (Weeks 2-6)
   - Write 8 lessons per week
   - Test all code daily
   - Maintain consistent voice and style

3. **Review & Polish** (Week 7)
   - Technical review for accuracy
   - Educational review for clarity
   - Final testing of all code examples

4. **Publishing** (Week 8)
   - Deploy to staging for final review
   - Update navigation and indexes
   - Release announcement

## Asset Management

### Code Samples
Store in: `code-samples/[system]/phase-[N]/tier-[N]/lesson-[N]/`

Structure:
```
lesson-01/
├── main.asm           # Complete working program
├── snippets/          # Individual code examples
├── solutions/         # Challenge solutions
└── assets/           # Binary data, sprites, etc.
```

### Visual Assets
- Screenshots: PNG format, 320x200 or native resolution
- Diagrams: SVG preferred for scalability
- Sprites: Both source and assembled formats

## Metadata Management

### Required Frontmatter Fields
```yaml
title: String (required)
system: String (required) - must match system ID
phase_number: Number (required) - 1-8
tier_number: Number (required) - 1-16
lesson_number: Number (required) - 1-32 within tier
description: String (required) - 160 chars max
difficulty: String (required) - "easy" | "medium" | "hard"
order: Number (required) - global ordering
tags: Array (required) - 3-6 relevant tags
prerequisites: Array - lesson dependencies
objectives: Array (required) - 3-5 learning objectives
```

### Tag Taxonomy

**Concept Tags**: assembly, graphics, sound, input, collision, optimization
**Skill Tags**: beginner, debugging, performance, architecture
**Project Tags**: game-mechanics, visual-effects, audio-programming
**System Tags**: vic-ii, sid, memory-management, interrupts

## Testing Protocol

### Before Committing Any Lesson

1. **Assembly Test**: Code assembles without errors
2. **Execution Test**: Program runs as described
3. **Challenge Test**: All challenges are completable
4. **Link Test**: All internal links resolve
5. **Format Test**: MDX renders correctly

### Testing Commands
```bash
# Test assembly (from Docker environment)
acme main.asm

# Test in emulator
x64sc program.prg

# Test MDX rendering
npm run dev
# Navigate to lesson and verify formatting
```

## Version Control

### Commit Messages for Lessons
```
feat(c64/tier-2): Add lesson 33 - Decision Making with Branches

- Implements conditional logic introduction
- Includes three challenge exercises
- Complete working example with enhanced security patrol
```

### Branch Naming
- Feature: `feat/c64-tier-2-lessons-33-40`
- Fix: `fix/lesson-45-code-error`
- Update: `update/tier-3-prerequisites`

## Review Process

### Self-Review Checklist
1. Would a beginner understand this?
2. Is the progression logical?
3. Are examples practical and engaging?
4. Does it maintain enthusiasm?
5. Is the wonder moment genuinely impressive?

### Peer Review Focus
- Technical accuracy
- Educational effectiveness
- Code quality
- Consistent style
- Clear navigation

## Common Pitfalls to Avoid

1. **Too Much Theory**: Always balance with practical code
2. **Assumed Knowledge**: Explicitly state or link prerequisites
3. **Platform-Specific Assumptions**: Explain C64-specific concepts
4. **Outdated References**: Keep examples relevant and timeless
5. **Incomplete Code**: Every example should be runnable
6. **Missing Wonder**: Every lesson needs its "wow" moment

## Resources

### Reference Materials
- [6502 Instruction Reference](http://www.6502.org/tutorials/6502opcodes.html)
- [C64 Memory Map](https://www.c64-wiki.com/wiki/Memory_Map)
- [ACME Assembler Manual](https://sourceforge.net/p/acme-crossass/code-0/6/tree/trunk/docs/)

### Tool Documentation
- VICE Emulator: Monitor commands, debugging
- Docker Environment: Setup and troubleshooting
- VS Code: Assembly syntax highlighting setup

## Support

For questions about content production:
1. Check this guide first
2. Review existing lessons for patterns
3. Test in the development environment
4. Ask in project discussions

Remember: The goal is to create an educational experience that captures the magic of 1980s programming while using modern tools and teaching methods. Every lesson should leave students excited to continue their journey.