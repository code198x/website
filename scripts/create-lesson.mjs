#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length < 4) {
  console.log(`
Usage: npm run create-lesson <system> <phase> <tier> <lesson-number> [title]

Examples:
  npm run create-lesson commodore-64 1 2 33 "Decision Making with Branches"
  npm run create-lesson sinclair-zx-spectrum 1 1 1 "Hello Spectrum"
  npm run create-lesson nintendo-entertainment-system 1 1 1 "NES Basics"

Systems: commodore-64, sinclair-zx-spectrum, nintendo-entertainment-system, commodore-amiga
  `);
  process.exit(1);
}

const [system, phase, tier, lessonNum, ...titleParts] = args;
const title = titleParts.join(' ') || `Lesson ${lessonNum}`;

// Validate inputs
const validSystems = ['commodore-64', 'sinclair-zx-spectrum', 'nintendo-entertainment-system', 'commodore-amiga'];
if (!validSystems.includes(system)) {
  console.error(`❌ Invalid system: ${system}`);
  console.log(`Valid systems: ${validSystems.join(', ')}`);
  process.exit(1);
}

const phaseNum = parseInt(phase);
const tierNum = parseInt(tier);
const lessonNumber = parseInt(lessonNum);

if (phaseNum < 1 || phaseNum > 8) {
  console.error('❌ Phase must be between 1 and 8');
  process.exit(1);
}

if (tierNum < 1 || tierNum > 16) {
  console.error('❌ Tier must be between 1 and 16');
  process.exit(1);
}

// Calculate which tier block this lesson belongs to
const tierBlock = Math.floor((lessonNumber - 1) / 32) + 1;
if (tierBlock !== tierNum) {
  console.warn(`⚠️  Lesson ${lessonNumber} typically belongs in Tier ${tierBlock}, not Tier ${tierNum}`);
}

// Calculate lesson number within tier (1-32)
const lessonInTier = ((lessonNumber - 1) % 32) + 1;

// Generate filename
const paddedLesson = String(lessonInTier).padStart(2, '0');
const filename = `${paddedLesson}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.mdx`;

// Create directory path
const dirPath = path.join(
  dirname(__dirname),
  'src',
  'content',
  'lessons',
  system,
  `phase-${phaseNum}`,
  `tier-${tierNum}`
);

// Ensure directory exists
fs.mkdirSync(dirPath, { recursive: true });

// Full file path
const filePath = path.join(dirPath, filename);

// Check if file already exists
if (fs.existsSync(filePath)) {
  console.error(`❌ File already exists: ${filePath}`);
  process.exit(1);
}

// Load template
const templatePath = path.join(dirname(__dirname), 'templates', 'lesson-template.mdx');
let template = fs.readFileSync(templatePath, 'utf8');

// System-specific configurations
const systemConfigs = {
  'commodore-64': {
    displayName: 'Commodore 64',
    processor: '6502',
    assembler: 'ACME',
    emulator: 'VICE',
    memoryExample: '$0400',
    registerExample: 'LDA #$00'
  },
  'sinclair-zx-spectrum': {
    displayName: 'ZX Spectrum',
    processor: 'Z80',
    assembler: 'sjasmplus',
    emulator: 'Fuse',
    memoryExample: '16384',
    registerExample: 'LD A,0'
  },
  'nintendo-entertainment-system': {
    displayName: 'NES',
    processor: '6502',
    assembler: 'ca65',
    emulator: 'FCEUX',
    memoryExample: '$2000',
    registerExample: 'LDA #$00'
  },
  'commodore-amiga': {
    displayName: 'Amiga',
    processor: '68000',
    assembler: 'vasm',
    emulator: 'FS-UAE',
    memoryExample: '$DFF000',
    registerExample: 'MOVE.W #0,D0'
  }
};

const config = systemConfigs[system];

// Determine difficulty based on tier
let difficulty = 'easy';
if (tierNum >= 5 && tierNum <= 8) difficulty = 'medium';
if (tierNum >= 9) difficulty = 'hard';

// Generate tags based on tier
const tierTags = {
  1: ['fundamentals', 'basics', 'introduction'],
  2: ['control-flow', 'logic', 'programming'],
  3: ['data-structures', 'memory', 'organization'],
  4: ['sprites', 'graphics', 'animation'],
  5: ['sound', 'music', 'audio'],
  6: ['advanced-graphics', 'effects', 'scrolling'],
  7: ['game-mechanics', 'physics', 'collision'],
  8: ['optimization', 'performance', 'advanced']
};

const baseTags = tierTags[tierNum] || ['programming', 'assembly', system];

// Replace template variables
const replacements = {
  'LESSON_TITLE': title,
  'SYSTEM_NAME': system,
  'phase_number: 1': `phase_number: ${phaseNum}`,
  'tier_number: 1': `tier_number: ${tierNum}`,
  'lesson_number: 1': `lesson_number: ${lessonInTier}`,
  'order: 1': `order: ${lessonNumber}`,
  'difficulty: "easy|medium|hard"': `difficulty: "${difficulty}"`,
  'BRIEF_DESCRIPTION_OF_LESSON': `Master ${title.toLowerCase()} on the ${config.displayName}`,
  'tags: \\["TAG1", "TAG2", "TAG3", "TAG4"\\]': `tags: ${JSON.stringify([...baseTags, config.processor])}`,
  'COMPELLING_SUBTITLE': `${config.processor} Assembly Techniques`,
  'MOTIVATIONAL_TAGLINE_ABOUT_WHAT_YOULL_BUILD': `Build impressive effects using ${title.toLowerCase()} on real ${config.displayName} hardware`,
  'SYSTEM': config.displayName,
  'MAIN_CONCEPT': title.toLowerCase(),
  'CONCEPT_NAME': title.toLowerCase(),
  'NEXT_LESSON_TITLE': `Lesson ${lessonNumber + 1}`,
  'phase-X': `phase-${phaseNum}`,
  'tier-Y': `tier-${tierNum}`,
  'LESSON_NUMBER': String(lessonInTier + 1).padStart(2, '0'),
  '\\$XXXX': config.memoryExample,
  'INSTRUCTION_1': config.registerExample.split(' ')[0]
};

// Apply replacements
for (const [key, value] of Object.entries(replacements)) {
  template = template.replace(new RegExp(key, 'g'), value);
}

// Write file
fs.writeFileSync(filePath, template);

console.log(`
✅ Created lesson file: ${filename}

📁 Location: ${filePath}
📚 System: ${config.displayName}
📖 Phase ${phaseNum}, Tier ${tierNum}, Lesson ${lessonInTier} (Global #${lessonNumber})
🏷️  Title: ${title}

Next steps:
1. Edit the file to add your content
2. Test all code examples in ${config.emulator}
3. Update prerequisites if needed
4. Add to git and commit

To edit: code "${filePath}"
`);

// Also create the code-samples directory
const codeSamplesDir = path.join(
  dirname(__dirname),
  'code-samples',
  system,
  `phase-${phaseNum}`,
  `tier-${tierNum}`,
  `lesson-${lessonInTier}`
);

fs.mkdirSync(codeSamplesDir, { recursive: true });

// Create a basic main.asm file
const mainAsmContent = `; ${title}
; ${config.displayName} - Phase ${phaseNum}, Tier ${tierNum}, Lesson ${lessonInTier}
;
; Learning objectives:
; - Implement ${title.toLowerCase()}
; - Understand ${config.processor} techniques
; - Build working examples

; ${config.assembler} assembler syntax

        ; Program starts here
        ; Add your code below

        ${config.registerExample}  ; Example instruction

        ; More code here...

; Data section
; Add any data tables or constants here
`;

fs.writeFileSync(path.join(codeSamplesDir, 'main.asm'), mainAsmContent);

console.log(`
📂 Created code directory: ${codeSamplesDir}
📄 Created main.asm template

Happy teaching! 🎮
`);