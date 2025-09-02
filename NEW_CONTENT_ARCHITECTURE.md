# Code198x New Content Architecture

## Core Collections

### 1. Platforms Collection
```typescript
// 32 platform families total
platforms: {
  // Basic Information
  name: string                    // "Commodore 64"
  slug: string                    // "commodore-64" 
  family: string                  // "commodore-8bit"
  manufacturer: string            // "Commodore International"
  
  // Technical (Programming-Focused)
  cpu: string                     // "MOS 6502"
  cpu_speed: string               // "1.023 MHz"
  ram: string                     // "64 KB"
  programming_memory: string      // "38 KB available to BASIC"
  
  // Graphics/Audio (Game Development Focus)
  graphics_chip: string           // "VIC-II"
  graphics_capabilities: string[] // ["320x200", "16 colors", "8 sprites"]
  sound_chip: string             // "SID 6581"
  sound_capabilities: string[]   // ["3 voices", "analog filters", "ring modulation"]
  
  // Development Information
  gateway_language: string | null // "BASIC" | "AMOS" | "Forth" | null
  gateway_lessons: number        // 64 | 128 | 256 | 0
  assembly_start_phase: number   // Always 1
  
  // Modern Development
  emulation_quality: "excellent" | "good" | "fair"
  docker_image: string          // "code198x/c64-dev"
  assembler: string            // "ca65"
  
  // Ordering
  order: number                // Display order
  era: "early" | "golden" | "advanced" | "modern"
}
```

### 2. Phases Collection
```typescript
// 9 phases per platform (Phase 0 + Phases 1-8)
phases: {
  platform_slug: string         // "commodore-64"
  phase_number: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
  
  // Phase 0 specific
  language?: string              // "BASIC" | "AMOS" | "Forth"
  lesson_count?: 64 | 128 | 256  // Only for Phase 0
  
  // All phases
  title: string                  // "Assembly Foundations" 
  description: string            // What students will learn
  skill_level: "gateway" | "beginner" | "intermediate" | "advanced" | "expert"
  
  // Games created in this phase
  games_created: number          // Power of 2: 1, 2, 4, 8
  
  estimated_duration: string     // "4-6 weeks"
}
```

### 3. Lessons Collection  
```typescript
// 32 lessons per tier, 16 tiers per phase
lessons: {
  platform_slug: string
  phase_number: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
  tier_number: 1-16
  lesson_number: 1-32
  
  title: string
  description: string
  
  // Game Development Focus
  game_context: string           // Which game this lesson contributes to
  game_feature: string          // "Player movement" | "Sound effects" | "Collision detection"
  
  // Learning Objectives (Practical)
  programming_concepts: string[]  // ["Memory addressing", "Loops"]
  game_concepts: string[]        // ["Sprite collision", "Score tracking"] 
  
  // Content
  estimated_duration: string     // "30-45 minutes"
  difficulty: "easy" | "medium" | "hard"
  
  // Code and Assets
  source_code: boolean          // Has downloadable source
  screenshots: string[]         // Visual progression
  before_after: boolean         // Shows improvement from lesson
  
  // Prerequisites and Connections
  requires_lessons: string[]     // Previous lesson dependencies
  builds_toward: string         // Future lesson this enables
}
```

### 4. Games Collection
```typescript
// Power-of-2 games per platform
games: {
  platform_slug: string
  phase_number: 1-8             // No games in Phase 0
  game_number: number           // 1st game, 2nd game, etc.
  
  title: string                 // "Neon Nexus"
  subtitle: string              // "Electronic Combat Arena"
  description: string
  
  // Development Arc
  start_tier: number            // Usually 1, 5, 9, or 13
  end_tier: number              // Usually 4, 8, 12, or 16  
  lesson_span: string           // "Lessons 1-128"
  
  // Game Details
  genre: string                 // "Arcade Action"
  core_mechanics: string[]      // ["Grid movement", "Energy combat", "Power-ups"]
  platform_features: string[]  // ["SID music", "Sprite multiplexing", "Color cycling"]
  
  // Technical Learning
  programming_concepts: string[] // What students learn building this
  difficulty_progression: string // How complexity grows
  
  // Assets
  screenshots: string[]
  gameplay_video?: string
  source_code_url: string
  playable_online: boolean
}
```

### 5. Setup Collection (Simplified)
```typescript
// Docker environment setup per platform
setup: {
  platform_slug: string
  title: string                 // "C64 Development Environment"
  description: string
  
  // Technical Requirements
  docker_image: string          // "code198x/c64-dev"
  tools_included: string[]      // ["ca65", "VICE emulator", "VS Code integration"]
  
  // Getting Started
  quick_start_steps: string[]
  first_program: string         // "Hello World example"
  test_command: string          // "make hello && vice hello.prg"
  
  estimated_setup_time: string  // "10-15 minutes"
}
```

## Removed Collections

**What We're NOT Including:**
- People (computing pioneers)
- Companies (computing companies)  
- Events (historical timeline)
- Software (notable programs)
- Complex "vault" content

**Why:** These distract from the core game development focus and add maintenance overhead without serving the primary educational mission.

## Navigation Structure

### Primary Navigation
```
/platforms           → List of 32 platforms
/platforms/c64       → Platform overview + Phase list
/platforms/c64/0     → Phase 0 (BASIC) overview
/platforms/c64/1     → Phase 1 (Assembly) overview  
/platforms/c64/1/1   → Tier 1 overview
/platforms/c64/1/1/1 → Lesson 1
```

### Secondary Navigation
```
/games              → All games across all platforms
/games/neon-nexus   → Specific game showcase
/setup              → Development environment setup
/setup/c64          → Platform-specific setup
```

## Content Organization Principles

### 1. Game-First Structure
- Every lesson contributes to building actual games
- Technical concepts introduced when needed for game features
- "WOW LOOK AT WHAT I CAN MAKE THIS THING DO" moments prioritized

### 2. Progressive Complexity
- Phase 0: Gateway language comfort
- Phase 1: Assembly fundamentals through simple games
- Phases 2-8: Increasingly sophisticated games and techniques

### 3. Platform-Authentic Learning
- Each platform's unique strengths showcased
- Gateway languages chosen for creative empowerment
- Development environments mirror authentic retro development

### 4. Sustainable Content Model
- Focus on 32 platforms × 9 phases = manageable scope
- Power-of-2 games provide clear milestones
- Modular structure allows incremental development

## Implementation Priority

### Phase 1: Foundation (Immediate)
1. Create new simplified content schema
2. Migrate Docker development environments
3. Build platform overview pages
4. Create first Phase 0 content for 2-3 platforms

### Phase 2: Content Development
1. Complete Phase 0 for all platforms with gateway languages
2. Begin Phase 1 content creation
3. Build game showcase pages
4. Implement lesson progression tracking

### Phase 3: Scale and Polish
1. Expand to additional phases
2. Add interactive elements
3. Community features
4. Performance optimization

This architecture focuses entirely on the game development learning journey while maintaining the technical depth and authenticity that makes your vision special.