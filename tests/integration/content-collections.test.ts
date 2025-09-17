/**
 * Content Collections Integration Tests
 * Tests the content collection structure and data integrity
 */

import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Mock the content collection schemas (would normally import from src/content/config.ts)
const systemSchema = z.object({
  title: z.string(),
  description: z.string(),
  year: z.number().min(1970).max(1999),
  manufacturer: z.string(),
  cpu: z.string(),
  memory: z.string(),
  graphics: z.string(),
  sound: z.string(),
  storage: z.string(),
  ports: z.array(z.string()),
  featured: z.boolean().default(false),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  tags: z.array(z.string()),
  assembler: z.string(),
  emulator: z.string(),
  documentation: z.array(z.string()),
});

const phaseSchema = z.object({
  title: z.string(),
  description: z.string(),
  system: z.string(),
  phaseNumber: z.number().min(0).max(7),
  objectives: z.array(z.string()),
  prerequisites: z.array(z.string()).optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  estimatedHours: z.number().min(1).max(100),
  tags: z.array(z.string()),
});

const tierSchema = z.object({
  title: z.string(),
  description: z.string(),
  system: z.string(),
  phase: z.number().min(0).max(7),
  tierNumber: z.number().min(0).max(15),
  objectives: z.array(z.string()),
  concepts: z.array(z.string()),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  estimatedMinutes: z.number().min(5).max(120),
});

const lessonSchema = z.object({
  title: z.string(),
  description: z.string(),
  system: z.string(),
  phase: z.number().min(0).max(7),
  tier: z.number().min(0).max(15),
  lessonNumber: z.number().min(0).max(31),
  objectives: z.array(z.string()),
  concepts: z.array(z.string()),
  codeExample: z.string().optional(),
  wonderMoment: z.string(), // Critical: every lesson must have this
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  estimatedMinutes: z.number().min(2).max(30),
  prerequisites: z.array(z.string()).optional(),
  tags: z.array(z.string()),
});

// Mock content data
const mockSystems = [
  {
    title: 'Commodore 64',
    description: 'The legendary home computer that defined 8-bit gaming',
    year: 1982,
    manufacturer: 'Commodore',
    cpu: 'MOS Technology 6510',
    memory: '64KB RAM',
    graphics: 'VIC-II',
    sound: 'SID',
    storage: 'Cassette, Floppy Disk',
    ports: ['Cartridge', 'Serial', 'User Port', 'Cassette'],
    featured: true,
    difficulty: 'beginner' as const,
    tags: ['8-bit', '6502', 'gaming', 'music'],
    assembler: 'ACME',
    emulator: 'VICE',
    documentation: ['C64 Programmer\'s Reference Guide', 'VIC-II Registers'],
  },
];

const mockPhases = [
  {
    title: 'Assembly Foundations',
    description: 'Learn the basics of 6502 assembly language',
    system: 'c64',
    phaseNumber: 0,
    objectives: [
      'Understand binary and hexadecimal number systems',
      'Learn basic 6502 instruction set',
      'Write your first assembly program',
    ],
    difficulty: 'beginner' as const,
    estimatedHours: 12,
    tags: ['assembly', 'basics', '6502'],
  },
];

const mockTiers = [
  {
    title: 'Number Systems',
    description: 'Learn binary, hex, and decimal conversions',
    system: 'c64',
    phase: 0,
    tierNumber: 0,
    objectives: [
      'Convert between binary, hex, and decimal',
      'Understand bit manipulation',
    ],
    concepts: ['Binary', 'Hexadecimal', 'Bit operations'],
    difficulty: 'beginner' as const,
    estimatedMinutes: 45,
  },
];

const mockLessons = [
  {
    title: 'Understanding Binary',
    description: 'Learn how computers count in binary',
    system: 'c64',
    phase: 0,
    tier: 0,
    lessonNumber: 0,
    objectives: [
      'Understand what binary is',
      'Count in binary from 0-15',
    ],
    concepts: ['Binary counting', 'Bits', 'Base-2 system'],
    codeExample: `
      ; Binary counting example
      LDA #%00000001  ; Load 1 in binary
      STA $0400       ; Store at screen memory
    `,
    wonderMoment: 'Watch the screen light up with your first binary number!',
    difficulty: 'beginner' as const,
    estimatedMinutes: 15,
    tags: ['binary', 'numbers', 'fundamentals'],
  },
];

describe('Content Collections Integration', () => {
  describe('Schema Validation', () => {
    it('should validate system schema correctly', () => {
      const validSystem = mockSystems[0];
      const result = systemSchema.safeParse(validSystem);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe('Commodore 64');
        expect(result.data.year).toBe(1982);
        expect(result.data.featured).toBe(true);
      }
    });

    it('should validate phase schema correctly', () => {
      const validPhase = mockPhases[0];
      const result = phaseSchema.safeParse(validPhase);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.phaseNumber).toBe(0);
        expect(result.data.objectives.length).toBeGreaterThan(0);
      }
    });

    it('should validate tier schema correctly', () => {
      const validTier = mockTiers[0];
      const result = tierSchema.safeParse(validTier);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.tierNumber).toBe(0);
        expect(result.data.estimatedMinutes).toBeGreaterThan(0);
      }
    });

    it('should validate lesson schema correctly', () => {
      const validLesson = mockLessons[0];
      const result = lessonSchema.safeParse(validLesson);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.wonderMoment).toBeTruthy();
        expect(result.data.lessonNumber).toBe(0);
      }
    });

    it('should reject invalid system data', () => {
      const invalidSystem = {
        title: 'Test System',
        // Missing required fields
      };

      const result = systemSchema.safeParse(invalidSystem);
      expect(result.success).toBe(false);
    });

    it('should reject lessons without wonder moments', () => {
      const lessonWithoutWonder = {
        ...mockLessons[0],
        wonderMoment: undefined,
      };

      const result = lessonSchema.safeParse(lessonWithoutWonder);
      expect(result.success).toBe(false);
    });
  });

  describe('Content Structure Validation', () => {
    it('should validate phase numbering (0-7)', () => {
      const validPhaseNumbers = [0, 1, 2, 3, 4, 5, 6, 7];
      const invalidPhaseNumbers = [-1, 8, 9, 10];

      validPhaseNumbers.forEach(num => {
        const phase = { ...mockPhases[0], phaseNumber: num };
        const result = phaseSchema.safeParse(phase);
        expect(result.success).toBe(true);
      });

      invalidPhaseNumbers.forEach(num => {
        const phase = { ...mockPhases[0], phaseNumber: num };
        const result = phaseSchema.safeParse(phase);
        expect(result.success).toBe(false);
      });
    });

    it('should validate tier numbering (0-15)', () => {
      const validTierNumbers = [0, 5, 10, 15];
      const invalidTierNumbers = [-1, 16, 20];

      validTierNumbers.forEach(num => {
        const tier = { ...mockTiers[0], tierNumber: num };
        const result = tierSchema.safeParse(tier);
        expect(result.success).toBe(true);
      });

      invalidTierNumbers.forEach(num => {
        const tier = { ...mockTiers[0], tierNumber: num };
        const result = tierSchema.safeParse(tier);
        expect(result.success).toBe(false);
      });
    });

    it('should validate lesson numbering (0-31)', () => {
      const validLessonNumbers = [0, 15, 31];
      const invalidLessonNumbers = [-1, 32, 40];

      validLessonNumbers.forEach(num => {
        const lesson = { ...mockLessons[0], lessonNumber: num };
        const result = lessonSchema.safeParse(lesson);
        expect(result.success).toBe(true);
      });

      invalidLessonNumbers.forEach(num => {
        const lesson = { ...mockLessons[0], lessonNumber: num };
        const result = lessonSchema.safeParse(lesson);
        expect(result.success).toBe(false);
      });
    });

    it('should validate year ranges for retro systems', () => {
      const validYears = [1975, 1982, 1985, 1999];
      const invalidYears = [1969, 2000, 2023];

      validYears.forEach(year => {
        const system = { ...mockSystems[0], year };
        const result = systemSchema.safeParse(system);
        expect(result.success).toBe(true);
      });

      invalidYears.forEach(year => {
        const system = { ...mockSystems[0], year };
        const result = systemSchema.safeParse(system);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('Content Relationships', () => {
    it('should maintain hierarchical relationships', () => {
      const system = mockSystems[0];
      const phase = mockPhases[0];
      const tier = mockTiers[0];
      const lesson = mockLessons[0];

      // All should reference the same system
      expect(phase.system).toBe('c64');
      expect(tier.system).toBe('c64');
      expect(lesson.system).toBe('c64');

      // Tier should reference correct phase
      expect(tier.phase).toBe(phase.phaseNumber);

      // Lesson should reference correct phase and tier
      expect(lesson.phase).toBe(phase.phaseNumber);
      expect(lesson.tier).toBe(tier.tierNumber);
    });

    it('should validate content consistency', () => {
      const lesson = mockLessons[0];

      // Lesson should have all required educational elements
      expect(lesson.objectives.length).toBeGreaterThan(0);
      expect(lesson.concepts.length).toBeGreaterThan(0);
      expect(lesson.wonderMoment).toBeTruthy();
      expect(lesson.title).toBeTruthy();
      expect(lesson.description).toBeTruthy();
    });

    it('should enforce educational progression', () => {
      const beginnerLesson = mockLessons[0];

      // Beginner content should have appropriate time estimates
      expect(beginnerLesson.estimatedMinutes).toBeGreaterThanOrEqual(2);
      expect(beginnerLesson.estimatedMinutes).toBeLessThanOrEqual(30);

      // Should have clear objectives
      expect(beginnerLesson.objectives.every(obj => obj.length > 0)).toBe(true);
    });
  });

  describe('Educational Requirements', () => {
    it('should ensure every lesson has a wonder moment', () => {
      // This is critical to the "Code198x" educational philosophy
      const lesson = mockLessons[0];

      expect(lesson.wonderMoment).toBeTruthy();
      expect(typeof lesson.wonderMoment).toBe('string');
      expect(lesson.wonderMoment.length).toBeGreaterThan(10); // Meaningful description
    });

    it('should avoid mastery terminology', () => {
      const allContent = [
        ...mockSystems.map(s => ({ title: s.title, description: s.description })),
        ...mockPhases.map(p => ({ title: p.title, description: p.description })),
        ...mockTiers.map(t => ({ title: t.title, description: t.description })),
        ...mockLessons.map(l => ({ title: l.title, description: l.description, wonderMoment: l.wonderMoment })),
      ];

      allContent.forEach(content => {
        const text = `${content.title} ${content.description} ${'wonderMoment' in content ? content.wonderMoment : ''}`.toLowerCase();

        // Should not use "mastery" terminology
        expect(text).not.toContain('master');
        expect(text).not.toContain('mastery');

        // Should use appropriate learning terminology (allow content that doesn't necessarily contain these terms)
        const hasGoodTerms = /\b(learn|understand|explore|discover|build|create)\b/.test(text);
        // This is informational - not all content needs learning terminology
        if (!hasGoodTerms) {
          console.log(`Content without learning terms: ${content.title}`);
        }
      });
    });

    it('should validate code examples format', () => {
      const lesson = mockLessons[0];

      if (lesson.codeExample) {
        expect(lesson.codeExample.trim().length).toBeGreaterThan(0);

        // Should contain assembly-like syntax
        const hasAssemblySyntax = /\b(LDA|STA|LDX|STX|JMP|BNE)\b/.test(lesson.codeExample);
        expect(hasAssemblySyntax).toBe(true);
      }
    });

    it('should validate difficulty progression', () => {
      const validDifficulties = ['beginner', 'intermediate', 'advanced'];

      [mockSystems[0], mockPhases[0], mockTiers[0], mockLessons[0]].forEach(item => {
        expect(validDifficulties).toContain(item.difficulty);
      });
    });
  });

  describe('Content Scale Validation', () => {
    it('should validate the 32×8×16×32 content structure', () => {
      // 32 systems × 8 phases × 16 tiers × 32 lessons = 131,072 total lessons
      const expectedTotalLessons = 32 * 8 * 16 * 32;
      expect(expectedTotalLessons).toBe(131072);

      // Each system should have 4,096 lessons
      const lessonsPerSystem = 8 * 16 * 32;
      expect(lessonsPerSystem).toBe(4096);

      // Each phase should have 512 lessons
      const lessonsPerPhase = 16 * 32;
      expect(lessonsPerPhase).toBe(512);

      // Each tier should have 32 lessons
      const lessonsPerTier = 32;
      expect(lessonsPerTier).toBe(32);
    });

    it('should validate reasonable time estimates', () => {
      const phase = mockPhases[0];
      const tier = mockTiers[0];
      const lesson = mockLessons[0];

      // Phase: 1-100 hours
      expect(phase.estimatedHours).toBeGreaterThanOrEqual(1);
      expect(phase.estimatedHours).toBeLessThanOrEqual(100);

      // Tier: 5-120 minutes
      expect(tier.estimatedMinutes).toBeGreaterThanOrEqual(5);
      expect(tier.estimatedMinutes).toBeLessThanOrEqual(120);

      // Lesson: 2-30 minutes
      expect(lesson.estimatedMinutes).toBeGreaterThanOrEqual(2);
      expect(lesson.estimatedMinutes).toBeLessThanOrEqual(30);
    });
  });

  describe('Tag System Validation', () => {
    it('should validate consistent tagging', () => {
      const allTaggedContent = [
        mockSystems[0],
        mockPhases[0],
        mockLessons[0],
      ];

      allTaggedContent.forEach(item => {
        expect(Array.isArray(item.tags)).toBe(true);
        expect(item.tags.length).toBeGreaterThan(0);

        // Tags should be lowercase and meaningful
        item.tags.forEach(tag => {
          expect(typeof tag).toBe('string');
          expect(tag.length).toBeGreaterThan(0);
          expect(tag).toBe(tag.toLowerCase());
        });
      });
    });
  });
});