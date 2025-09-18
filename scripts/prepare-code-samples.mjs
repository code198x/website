#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const SOURCE_DIR = path.join(dirname(__dirname), 'code-samples');
const OUTPUT_DIR = path.join(dirname(__dirname), '..', 'code-samples-repo');
const GITHUB_ORG = 'code198x'; // Update with your GitHub org
const REPO_NAME = 'code-samples';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  console.log(`Creating output directory: ${OUTPUT_DIR}`);
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Function to generate README for each lesson
function generateLessonReadme(system, phase, tier, lesson) {
  const lessonNum = (tier - 1) * 32 + lesson;

  // Try to read lesson metadata from MDX file
  const mdxPath = path.join(
    dirname(__dirname),
    'src', 'content', 'lessons',
    system, `phase-${phase}`, `tier-${tier}`,
    `${String(lesson).padStart(2, '0')}-*.mdx`
  );

  // Get actual filename (with wildcard)
  const files = fs.readdirSync(path.dirname(mdxPath.replace('*', '')))
    .filter(f => f.startsWith(String(lesson).padStart(2, '0')));

  let title = `Lesson ${lessonNum}`;
  let description = '';

  if (files.length > 0) {
    const mdxFile = path.join(path.dirname(mdxPath.replace('*', '')), files[0]);
    const content = fs.readFileSync(mdxFile, 'utf8');
    const titleMatch = content.match(/title:\s*"([^"]+)"/);
    const descMatch = content.match(/description:\s*"([^"]+)"/);

    if (titleMatch) title = titleMatch[1];
    if (descMatch) description = descMatch[1];
  }

  const systemNames = {
    'commodore-64': 'Commodore 64',
    'sinclair-zx-spectrum': 'ZX Spectrum',
    'nintendo-entertainment-system': 'NES',
    'commodore-amiga': 'Amiga'
  };

  return `# ${title}

${description}

## System Information
- **Platform**: ${systemNames[system] || system}
- **Phase**: ${phase}
- **Tier**: ${tier}
- **Lesson**: ${lesson} (Global #${lessonNum})

## Files Included
- \`main.asm\` - Complete working program
- \`Makefile\` - Build instructions
- Additional support files as needed

## Building the Code

### Using Docker Environment
\`\`\`bash
docker-compose run workspace
cd ${system}/phase-${phase}/tier-${tier}/lesson-${lesson}
make
\`\`\`

### Direct Assembly
\`\`\`bash
# For Commodore 64
acme -o program.prg main.asm

# For ZX Spectrum
sjasmplus main.asm --raw=program.bin

# For NES
ca65 main.asm -o main.o
ld65 main.o -C nes.cfg -o program.nes

# For Amiga
vasmm68k_mot -Fhunkexe -o program main.asm
\`\`\`

## Running the Program

### Commodore 64 (VICE)
\`\`\`bash
x64sc program.prg
\`\`\`

### ZX Spectrum (Fuse)
\`\`\`bash
fuse program.tap
\`\`\`

### NES (FCEUX)
\`\`\`bash
fceux program.nes
\`\`\`

### Amiga (FS-UAE)
\`\`\`bash
fs-uae --floppy-drive-0=program.adf
\`\`\`

## Download

📥 [Download ZIP](https://github.com/${GITHUB_ORG}/${REPO_NAME}/archive/refs/heads/main.zip#${system}/phase-${phase}/tier-${tier}/lesson-${lesson})

## View Online

👁️ [View on GitHub](https://github.com/${GITHUB_ORG}/${REPO_NAME}/tree/main/${system}/phase-${phase}/tier-${tier}/lesson-${lesson})

## License

Educational use encouraged! See LICENSE file for details.
`;
}

// Function to generate Makefile for each lesson
function generateMakefile(system) {
  const makefiles = {
    'commodore-64': `# Makefile for Commodore 64 Assembly
# Requires: ACME assembler

PRG = program.prg
ASM = main.asm
EMULATOR = x64sc

.PHONY: all clean run

all: $(PRG)

$(PRG): $(ASM)
	acme -o $(PRG) $(ASM)

run: $(PRG)
	$(EMULATOR) $(PRG)

clean:
	rm -f $(PRG) *.o *.lst

test: $(PRG)
	@echo "Testing $(PRG)..."
	# Add automated test commands here
`,
    'sinclair-zx-spectrum': `# Makefile for ZX Spectrum Assembly
# Requires: sjasmplus assembler

TAP = program.tap
ASM = main.asm
EMULATOR = fuse

.PHONY: all clean run

all: $(TAP)

$(TAP): $(ASM)
	sjasmplus $(ASM) --tap=$(TAP)

run: $(TAP)
	$(EMULATOR) $(TAP)

clean:
	rm -f $(TAP) *.bin *.lst
`,
    'nintendo-entertainment-system': `# Makefile for NES Assembly
# Requires: ca65/ld65 assembler

NES = program.nes
ASM = main.asm
OBJ = main.o
CFG = nes.cfg
EMULATOR = fceux

.PHONY: all clean run

all: $(NES)

$(OBJ): $(ASM)
	ca65 $(ASM) -o $(OBJ)

$(NES): $(OBJ) $(CFG)
	ld65 $(OBJ) -C $(CFG) -o $(NES)

run: $(NES)
	$(EMULATOR) $(NES)

clean:
	rm -f $(NES) $(OBJ) *.lst
`,
    'commodore-amiga': `# Makefile for Amiga Assembly
# Requires: vasm assembler

PRG = program
ASM = main.asm
ADF = program.adf
EMULATOR = fs-uae

.PHONY: all clean run

all: $(PRG)

$(PRG): $(ASM)
	vasmm68k_mot -Fhunkexe -o $(PRG) $(ASM)

$(ADF): $(PRG)
	# Add ADF creation commands here

run: $(PRG)
	$(EMULATOR) --floppy-drive-0=$(ADF)

clean:
	rm -f $(PRG) $(ADF) *.o
`
  };

  return makefiles[system] || makefiles['commodore-64'];
}

// Main processing
console.log('🚀 Preparing code samples for distribution...\n');

// Get all systems
const systems = fs.readdirSync(SOURCE_DIR)
  .filter(f => fs.statSync(path.join(SOURCE_DIR, f)).isDirectory());

let totalLessons = 0;
const manifest = {
  generated: new Date().toISOString(),
  systems: {}
};

for (const system of systems) {
  console.log(`📂 Processing ${system}...`);
  manifest.systems[system] = { phases: {} };

  const systemPath = path.join(SOURCE_DIR, system);
  const phases = fs.readdirSync(systemPath)
    .filter(f => f.startsWith('phase-'));

  for (const phase of phases) {
    const phaseNum = phase.split('-')[1];
    manifest.systems[system].phases[phaseNum] = { tiers: {} };

    const phasePath = path.join(systemPath, phase);
    const tiers = fs.readdirSync(phasePath)
      .filter(f => f.startsWith('tier-'));

    for (const tier of tiers) {
      const tierNum = tier.split('-')[1];
      manifest.systems[system].phases[phaseNum].tiers[tierNum] = { lessons: [] };

      const tierPath = path.join(phasePath, tier);
      const lessons = fs.readdirSync(tierPath)
        .filter(f => f.startsWith('lesson-'));

      for (const lesson of lessons) {
        const lessonNum = parseInt(lesson.split('-')[1]);
        const lessonPath = path.join(tierPath, lesson);
        const outputPath = path.join(OUTPUT_DIR, system, phase, tier, lesson);

        // Create output directory
        fs.mkdirSync(outputPath, { recursive: true });

        // Copy assembly files
        const files = fs.readdirSync(lessonPath);
        for (const file of files) {
          if (file.endsWith('.asm') || file.endsWith('.s')) {
            fs.copyFileSync(
              path.join(lessonPath, file),
              path.join(outputPath, file)
            );
          }
        }

        // Generate README
        const readme = generateLessonReadme(system, phaseNum, tierNum, lessonNum);
        fs.writeFileSync(path.join(outputPath, 'README.md'), readme);

        // Generate Makefile
        const makefile = generateMakefile(system);
        fs.writeFileSync(path.join(outputPath, 'Makefile'), makefile);

        manifest.systems[system].phases[phaseNum].tiers[tierNum].lessons.push(lessonNum);
        totalLessons++;

        console.log(`  ✓ Lesson ${lessonNum} prepared`);
      }
    }
  }
}

// Write manifest
fs.writeFileSync(
  path.join(OUTPUT_DIR, 'manifest.json'),
  JSON.stringify(manifest, null, 2)
);

// Generate main README
const mainReadme = `# Code Like It's 198x - Code Samples

Complete, working code samples for every lesson in the Code Like It's 198x curriculum.

## 📊 Statistics

- **Total Lessons**: ${totalLessons}
- **Systems**: ${systems.length}
- **Last Updated**: ${new Date().toLocaleDateString()}

## 🎮 Systems Included

${systems.map(s => `- ${s}`).join('\n')}

## 📥 Download Options

### Download Everything
[Download Full Repository (ZIP)](https://github.com/${GITHUB_ORG}/${REPO_NAME}/archive/refs/heads/main.zip)

### Download by System
${systems.map(s => `- [${s}](https://github.com/${GITHUB_ORG}/${REPO_NAME}/tree/main/${s})`).join('\n')}

## 🛠️ Development Environment

See the main [Code Like It's 198x](https://code198x.com) site for complete setup instructions.

### Quick Start with Docker

\`\`\`bash
git clone https://github.com/${GITHUB_ORG}/${REPO_NAME}.git
cd ${REPO_NAME}
docker-compose up -d
docker-compose exec workspace bash
\`\`\`

## 📚 Structure

\`\`\`
system/
  phase-N/
    tier-N/
      lesson-N/
        main.asm      # Main assembly file
        README.md     # Lesson information
        Makefile      # Build instructions
        ...          # Additional files
\`\`\`

## 🤝 Contributing

Found an issue or improvement? Please submit a pull request!

## 📄 License

All code samples are provided for educational purposes. See LICENSE for details.

## 🔗 Links

- [Main Website](https://code198x.com)
- [Setup Guides](https://code198x.com/setup)
- [Community Forum](https://code198x.com/community)
`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'README.md'), mainReadme);

console.log(`
✅ Code samples prepared successfully!

📊 Summary:
- Total lessons: ${totalLessons}
- Output directory: ${OUTPUT_DIR}
- Manifest created: manifest.json

Next steps:
1. Review the generated structure
2. Initialize git repository in ${OUTPUT_DIR}
3. Push to GitHub as ${GITHUB_ORG}/${REPO_NAME}
4. Set up GitHub Actions for automated testing

To create the repository:
  cd ${OUTPUT_DIR}
  git init
  git add .
  git commit -m "Initial code samples repository"
  gh repo create ${GITHUB_ORG}/${REPO_NAME} --public --source=. --remote=origin --push
`);