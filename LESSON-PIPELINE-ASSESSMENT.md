# Lesson Pipeline Assessment for 1024-Lesson Assembly Course

**Date**: 2025-01-15
**Context**: Assessing whether current infrastructure can handle 8 Phases × 8 Tiers × 16 Lessons = 1024 total assembly lessons

---

## Current State

### What Works ✅

**Frontmatter Schema**
- Supports `phase`, `tier`, `lessonNumber`, `totalLessons`
- Phase 0 (BASIC) successfully using phase/tier structure
- Optional `objectives` array works well
- `prevLesson`/`nextLesson` navigation functional

**Directory Structure**
- Phase 0 successfully organized as `phase-0/tier-N/lesson-NNN.mdx`
- Pattern scales: `phase-N/tier-N/lesson-NNN.mdx`
- Clear, predictable paths for 1024 lessons

**Build Performance**
- Current build: 160 pages in ~12-13 seconds
- Estimated with 1024 assembly lessons: ~1200 pages = ~90-100 seconds
- Acceptable for development workflow

**Code Samples**
- Organized by course/week/lesson: `/code-samples/commodore-64/assembly/week-1/lesson-01/`
- Can scale to: `/code-samples/commodore-64/assembly/phase-N/tier-N/lesson-NNN/`

---

## Critical Gaps ❌

### 1. Assembly Course Still Uses Week Structure

**Current**: `/commodore-64/assembly/week-1/`
**Needed**: `/commodore-64/assembly/phase-1/tier-1/`

- Assembly has 8 lessons in `week-1/`
- CURRICULUM.md specifies 8 phases × 8 tiers structure
- **Mismatch must be resolved before building Phase 1**

**Impact**: HIGH - Assembly lessons use wrong frontmatter (`week: 1` instead of `phase: 1, tier: 1`)

---

### 2. Tier Index Page Generation

**Current State**:
- Phase 0 has 4 manually-created tier index pages (`tier-1/index.astro`, etc.)
- Each tier index lists 16 lessons with descriptions

**Scale Problem**:
- Assembly needs 64 tier index pages (8 phases × 8 tiers)
- Manual creation = hundreds of lines of repetitive code
- High error potential, slow to create

**Solution Needed**: Template or generator for tier index pages

---

### 3. Phase Index Page Generation

**Current State**:
- Phase 0 has 1 manually-created phase index (`phase-0/index.astro`)
- Lists 4 tiers with descriptions, stats, WOW boxes

**Scale Problem**:
- Assembly needs 8 phase index pages (phases 1-8)
- Each phase index describes 8 tiers
- Significant manual effort per phase

**Solution Needed**: Template or generator for phase index pages

---

### 4. Lesson Navigation Links

**Current Approach**:
- Manual `prevLesson`/`nextLesson` in frontmatter
- Requires updating 2 lessons when inserting new lesson
- Error-prone at scale

**Scale Problem**:
- 1024 lessons × 2 links = 2048 manual link entries
- Inserting lessons requires updating neighbors
- High maintenance burden

**Potential Solutions**:
1. Keep manual (simple, explicit, works)
2. Auto-generate from lesson number (requires script)
3. Build-time calculation (complex but flexible)

**Recommendation**: Keep manual for now (works, explicit), consider automation later if editing burden proves high

---

### 5. LessonLayout Doesn't Display Phase/Tier

**Current**:
- Breadcrumb shows: Home / Commodore 64 / BASIC / Lesson N
- Doesn't show phase or tier in UI

**Missing**:
- "Phase 0: BASIC Gateway / Tier 1: Fundamentals"
- Progress within tier (lesson X of 16)
- Progress within phase (tier X of Y)

**Impact**: MEDIUM - UI doesn't reflect organizational structure

---

### 6. No CURRICULUM.md Parser

**Current**:
- CURRICULUM.md is authoritative specification
- Contains exact lesson titles, descriptions, deliverables
- **Not connected to build process**

**Problem**:
- No validation that lessons match CURRICULUM.md
- No way to generate scaffolding from specification
- Manual transcription required (error-prone)

**Opportunity**: Script to scaffold lesson files from CURRICULUM.md

---

## Scalability Analysis

### Can We Build 1024 Lessons?

**Yes, but with current process it will be tedious:**

| Task | Effort per Lesson | × 1024 Lessons | Total Effort |
|------|------------------|---------------|--------------|
| Write lesson MDX | 30-60 min | 1024 | 512-1024 hours |
| Create code samples | 15-30 min | 1024 | 256-512 hours |
| Manual frontmatter | 2 min | 1024 | 34 hours |
| Create tier indexes | 15 min | 64 | 16 hours |
| Create phase indexes | 30 min | 8 | 4 hours |
| **Total** | | | **~822-1590 hours** |

**Content creation** (writing lessons, code) is unavoidable and correct.
**Scaffolding overhead** (frontmatter, indexes) = ~54 hours = **6-7%** of total time.

---

## Recommendations

### Priority 1: Structural Migration (REQUIRED BEFORE PHASE 1)

1. **Migrate assembly week-1 to phase-1/tier-1** structure
   - Rename directory: `assembly/week-1/` → `assembly/phase-1/tier-1/`
   - Update frontmatter in 8 lessons: `week: 1` → `phase: 1, tier: 1`
   - Update navigation paths
   - Update prevLesson link from `/phase-0/tier-4/lesson-064`

2. **Create phase-1 and tier-1 index pages**
   - Follow Phase 0 pattern
   - Use CURRICULUM.md descriptions

### Priority 2: Quality of Life Improvements (HELPFUL BUT NOT BLOCKING)

3. **Enhance LessonLayout to show phase/tier**
   - Update breadcrumb: "Phase N: Title / Tier M: Title"
   - Show tier progress (lesson X of 16)
   - Show phase progress (tier M of 8)

4. **Create tier index template**
   - Reusable Astro component
   - Takes array of lesson objects
   - Generates consistent tier index pages

5. **Create phase index template**
   - Takes array of tier objects
   - Generates consistent phase index pages

### Priority 3: Automation (NICE TO HAVE)

6. **CURRICULUM.md scaffolding script**
   - Parse CURRICULUM.md
   - Generate lesson file skeletons with correct frontmatter
   - Generate tier and phase index pages
   - Validate existing lessons match specification

7. **Navigation link generator**
   - Calculate prevLesson/nextLesson automatically
   - Reduce manual frontmatter maintenance

---

## Immediate Next Steps

To begin Phase 1 content development, we must:

1. ✅ **Migrate existing assembly content** to phase-1/tier-1 structure
2. ✅ **Create phase-1 index page** (landing page for entire Phase 1)
3. ✅ **Create tier-1 index page** (landing page for Phase 1 Tier 1)
4. ✅ **Update assembly course links** (C64 landing page, etc.)
5. ✅ **Verify build** with new structure

After migration, we can:
- Continue building Phase 1 Tier 1 lessons (lessons 9-16)
- Develop tier/phase index templates for reuse
- Build remaining 64 tiers progressively

---

## Conclusion

**Current pipeline CAN handle 1024 lessons**, but:

- **Structural migration required first** (assembly week→phase/tier)
- **Manual scaffolding overhead is ~54 hours** (~6% of total effort)
- **Templates would reduce overhead** but aren't blocking
- **Automation would be nice** but can wait until patterns are proven

**Recommendation**: Migrate assembly structure now, build Phase 1 Tier 1 completely, then reassess whether templates/automation are worth the investment based on actual pain points.

---

## Appendix: Lesson Naming Convention

**Current (Phase 0)**: 3-digit padding
`lesson-001.mdx`, `lesson-002.mdx`, ..., `lesson-064.mdx`

**Proposed (Assembly)**: 3-digit padding
`lesson-001.mdx` through `lesson-128.mdx` (per phase)

OR global numbering:
`lesson-0001.mdx` through `lesson-1024.mdx` (4 digits)

**Recommendation**: Keep 3-digit, per-phase numbering. Simpler, clearer context.
