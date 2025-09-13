# Code198x Website Migration Plan

## Current State Analysis

### What Currently Exists (Keep)

- **Docker Development Environments**: 16 working platforms - these align with your vision
- **Basic Astro Framework**: Good foundation, performant, well-structured
- **Example Programs**: Useful reference material for lesson development
- **Visual Design**: Retro-inspired styling works well
- **Build Pipeline**: Docker + npm workflow is solid

### What Currently Exists (Archive/Remove)

- **Archived Lessons Directory**: ~300+ lesson files built on academic approach
- **Complex Content Schema**: Over-engineered for people/companies/events/software
- **4-System Limitation**: Hard-coded for C64/Spectrum/NES/Amiga only
- **"Vault" Content**: Historical content not core to game development
- **Academic Lesson Structure**: Doesn't match game-first approach

## Migration Strategy

### Phase 1: Clean Slate Foundation (Week 1-2)

**Goals**: Prepare clean architecture for new content model

**Tasks**:

1. **Archive Legacy Content**

   ```bash
   mv src/content/lessons-original/ archive/
   mv archived-lessons/ archive/
   mv src/content/config.ts archive/config-old.ts
   ```

2. **Implement New Content Schema**
   - Create simplified `src/content/config-new.ts`
   - Focus on 5 core collections: platforms, phases, lessons, games, setup
   - Remove people, companies, events, software collections

3. **Update Routing Structure**
   - Change from `/lessons/system/` to `/platforms/system/phase/tier/lesson/`
   - Add `/games/` section for game showcases
   - Simplify `/setup/` to focus on development environments

4. **Platform Data Migration**
   - Convert existing system data to new platform schema
   - Add gateway language information
   - Update for 32-platform structure instead of 4-system

### Phase 2: Core Content Creation (Week 3-6)

**Goals**: Create foundation content for immediate value

**Priority Platforms (Start with familiar ones)**:

1. **Commodore 64**: BASIC Phase 0 + Assembly Phase 1 foundation
2. **Amiga**: AMOS Phase 0 + Assembly Phase 1 foundation
3. **Jupiter Ace**: Forth Phase 0 + Assembly Phase 1 foundation
4. **Vectrex**: Direct Assembly Phase 1 (no Phase 0)

**Content Creation Order**:

1. Platform overview pages
2. Phase 0 lessons (gateway languages)
3. Phase 1 Tier 1 lessons (first 32 lessons building foundation game)
4. Game showcase pages for completed games

### Phase 3: Expansion and Polish (Week 7+)

**Goals**: Scale to full vision

**Tasks**:

1. Add remaining platforms from your 16 working environments
2. Complete Phase 1 for priority platforms
3. Begin Phase 2 content development
4. Add interactive elements and lesson progression tracking

## Technical Implementation Plan

### New File Structure

```
src/
├── content/
│   ├── config.ts              # New simplified schema
│   ├── platforms/             # 32 platform families
│   ├── phases/                # Phase overviews
│   ├── lessons/               # Individual lessons
│   ├── games/                 # Game showcases
│   └── setup/                 # Dev environment setup
├── pages/
│   ├── platforms/             # New routing structure
│   ├── games/
│   └── setup/
└── components/
    ├── LessonLayout.astro     # Game-focused lesson layout
    ├── GameShowcase.astro     # Game presentation
    └── PlatformOverview.astro # Platform introduction
```

### Content Schema Implementation

**Step 1**: Create `src/content/config-new.ts` with simplified schema
**Step 2**: Migrate Docker environment data to platform collection
**Step 3**: Create template content for Phase 0 lessons
**Step 4**: Build lesson authoring workflow

## Content Development Workflow

### Phase 0 Lesson Template

```markdown
---
platform: "commodore-64"
phase: 0
lesson: 1
title: "Your First C64 Program"
game_context: "Foundation Skills"
game_feature: "Basic graphics output"
programming_concepts: ["PRINT statement", "Screen memory"]
game_concepts: ["Visual feedback", "Player communication"]
---

# Your First C64 Program

## What We're Building

Create your first graphics on the C64 screen - a colorful "HELLO WORLD" that demonstrates...

[Game-focused lesson content]
```

### Phase 1 Lesson Template

```markdown
---
platform: "commodore-64"
phase: 1
tier: 1
lesson: 1
title: "Neon Nexus: Game World Creation"
game_context: "Neon Nexus foundation game"
game_feature: "Grid-based game world"
programming_concepts: ["Memory addressing", "Screen manipulation"]
game_concepts: ["Game world design", "Visual foundations"]
---

# Neon Nexus: Game World Creation

## What We're Building

Create the striking neon grid world that will be the foundation of your Neon Nexus game...

[Assembly programming in service of game development]
```

## Migration Priorities

### Immediate (This Month)

1. **Clean Architecture**: Implement new content schema
2. **Core Platforms**: Get 4 platforms working with new structure
3. **Phase 0 Foundation**: Create gateway language lessons
4. **Development Environment**: Ensure Docker environments work with new structure

### Near Term (Next 2 Months)

1. **Phase 1 Content**: Complete first game for each core platform
2. **Additional Platforms**: Add remaining platforms from your 16 working environments
3. **Game Showcases**: Create compelling game presentation pages
4. **User Experience**: Smooth lesson progression and navigation

### Long Term (3+ Months)

1. **Scale to 32 Platforms**: Add remaining platforms per your master plan
2. **Multiple Phases**: Expand beyond Phase 1 to create complete learning arcs
3. **Interactive Elements**: Add emulators, code editing, progress tracking
4. **Community Features**: User accounts, progress sharing, community games

## Success Metrics

### Phase 1 Success

- [ ] New architecture implemented and stable
- [ ] 4 platforms with Phase 0 + Phase 1 Tier 1 content
- [ ] 4 foundation games playable and showcased
- [ ] Docker environments integrated with new structure

### Phase 2 Success

- [ ] 8+ platforms with complete Phase 0 content
- [ ] Phase 1 Tier 1 complete for priority platforms
- [ ] Compelling game-first lesson experience
- [ ] Clear progression path visible to students

### Long Term Success

- [ ] 32 platforms with Phase 0 + Phase 1 foundation
- [ ] Multiple complete games per platform
- [ ] Active community of retro game developers
- [ ] Self-sustaining through sponsorships

## Risk Mitigation

**Scope Creep Risk**: Stay focused on game development, resist adding back "vault" content
**Content Quality Risk**: Create templates and standards before scaling  
**Technical Debt Risk**: Clean architecture from start, don't patch old system
**Motivation Risk**: Start with platforms you're most passionate about

This migration plan provides a clear path from the current academic-focused 4-system website to your game-focused 32-platform vision while preserving the valuable technical infrastructure you've already built.
