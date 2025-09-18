#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length < 3) {
  console.log(`
Usage: npm run create-tier <system> <phase> <tier>

This will create all 32 lesson stubs for a tier with appropriate titles.

Examples:
  npm run create-tier commodore-64 1 2
  npm run create-tier sinclair-zx-spectrum 1 1

Systems: commodore-64, sinclair-zx-spectrum, nintendo-entertainment-system, commodore-amiga
  `);
  process.exit(1);
}

const [system, phase, tier] = args;

// C64 Tier 2 lesson plan (as defined in our curriculum)
const c64Tier2Lessons = [
  "Decision Making with Branches",
  "Comparing Values",
  "Multiple Choice Logic",
  "Boolean Logic Operations",
  "Range Checking",
  "State Machines",
  "Input Validation",
  "Error Handling",
  "Counting Loops",
  "Conditional Loops",
  "Nested Loops",
  "Loop Optimization",
  "Breaking Out of Loops",
  "Data Processing Loops",
  "Animation Loops",
  "Interactive Loops",
  "Your First Subroutine",
  "Parameter Passing",
  "Stack Management",
  "Return Values",
  "Modular Programming",
  "Code Libraries",
  "Recursive Subroutines",
  "Performance Profiling",
  "Interrupt Handling",
  "Coroutines",
  "Event Systems",
  "State Management",
  "Memory Allocation",
  "Code Generation",
  "Integration Testing",
  "The Complete Enhanced Game"
];

// ZX Spectrum Tier 1 lesson plan (foundation)
const spectrumTier1Lessons = [
  "Hello Spectrum",
  "Understanding the Z80",
  "Screen Memory Basics",
  "Setting Pixels",
  "Drawing Lines",
  "Character Display",
  "Color Attributes",
  "Simple Animation",
  "Keyboard Input",
  "Making Beeps",
  "Border Effects",
  "Screen Clear Routines",
  "Text Scrolling",
  "Simple Sprites",
  "Sprite Movement",
  "Collision Detection",
  "Sound Generation",
  "Music Notes",
  "Timing and Delays",
  "Memory Organization",
  "Basic Game Loop",
  "Score Display",
  "Lives System",
  "Game Over Screen",
  "High Score Table",
  "Data Tables",
  "Lookup Tables",
  "Random Numbers",
  "Simple AI",
  "Game States",
  "Optimization Basics",
  "Your First Spectrum Game"
];

// NES Tier 1 lesson plan
const nesTier1Lessons = [
  "Hello NES",
  "Understanding the PPU",
  "Pattern Tables",
  "Name Tables",
  "Attribute Tables",
  "Palette Setup",
  "Sprite Display",
  "Sprite Animation",
  "Controller Input",
  "APU Basics",
  "Square Wave Sounds",
  "Triangle Wave Music",
  "Noise Channel",
  "Background Scrolling",
  "Sprite Zero Hit",
  "Simple Collision",
  "CHR ROM Banking",
  "PRG ROM Banking",
  "NMI Handler",
  "Game Loop Timing",
  "Score Display",
  "Status Bar",
  "Screen Transitions",
  "Simple Physics",
  "Enemy Movement",
  "Power-ups",
  "Level Data",
  "Metatiles",
  "Music Engine Basics",
  "Sound Effects",
  "Polish and Juice",
  "Your First NES Game"
];

// Amiga Tier 1 lesson plan
const amigaTier1Lessons = [
  "Hello Amiga",
  "Understanding the 68000",
  "Copper Basics",
  "Bitplane Graphics",
  "Setting Pixels",
  "Drawing Primitives",
  "Color Palettes",
  "Hardware Sprites",
  "Sprite Control",
  "Mouse Input",
  "Joystick Reading",
  "Paula Sound Basics",
  "Sample Playback",
  "Module Music",
  "Blitter Introduction",
  "Blitter Copies",
  "Screen Setup",
  "Double Buffering",
  "Smooth Scrolling",
  "Collision Detection",
  "Interrupt Handling",
  "System Takeover",
  "Memory Management",
  "Disk Loading",
  "Copper Effects",
  "Audio Mixing",
  "Game Loop Design",
  "Performance Timing",
  "Input Handling",
  "Game States",
  "Optimization Techniques",
  "Your First Amiga Demo"
];

// Map of tier lessons
const lessonPlans = {
  'commodore-64': {
    1: {
      2: c64Tier2Lessons
    }
  },
  'sinclair-zx-spectrum': {
    1: {
      1: spectrumTier1Lessons
    }
  },
  'nintendo-entertainment-system': {
    1: {
      1: nesTier1Lessons
    }
  },
  'commodore-amiga': {
    1: {
      1: amigaTier1Lessons
    }
  }
};

// Get the lesson titles for this tier
const phaseNum = parseInt(phase);
const tierNum = parseInt(tier);

let lessonTitles = lessonPlans[system]?.[phaseNum]?.[tierNum];

if (!lessonTitles) {
  console.log(`
⚠️  No predefined lesson plan for ${system} Phase ${phaseNum} Tier ${tierNum}.
Generating generic lesson titles...
  `);

  // Generate generic titles
  lessonTitles = [];
  for (let i = 1; i <= 32; i++) {
    lessonTitles.push(`Lesson ${i}`);
  }
}

// Calculate starting lesson number
const startLesson = (tierNum - 1) * 32 + 1;

console.log(`
🚀 Creating ${system} Phase ${phaseNum}, Tier ${tierNum}
📚 Lessons ${startLesson} - ${startLesson + 31}
📁 Directory: src/content/lessons/${system}/phase-${phaseNum}/tier-${tierNum}/

Creating lessons...
`);

// Create each lesson
for (let i = 0; i < 32; i++) {
  const lessonNum = startLesson + i;
  const title = lessonTitles[i];

  console.log(`  📝 Lesson ${String(i + 1).padStart(2, '0')}: ${title}`);

  try {
    // Call the create-lesson script
    const command = `node scripts/create-lesson.mjs ${system} ${phase} ${tier} ${lessonNum} "${title}"`;
    const { stdout, stderr } = await execAsync(command);

    if (stderr && !stderr.includes('Warning')) {
      console.error(`     ❌ Error: ${stderr}`);
    }
  } catch (error) {
    console.error(`     ❌ Failed to create lesson: ${error.message}`);
  }
}

console.log(`
✅ Tier creation complete!

📊 Summary:
- System: ${system}
- Phase: ${phaseNum}
- Tier: ${tierNum}
- Lessons: ${startLesson} - ${startLesson + 31}

Next steps:
1. Review the generated lesson files
2. Add specific content for each lesson
3. Test code examples in the emulator
4. Commit your work

To start editing:
  cd src/content/lessons/${system}/phase-${phaseNum}/tier-${tierNum}/
  code .

Happy content creation! 🎮
`);