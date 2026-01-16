#!/usr/bin/env node
/**
 * Generate units collection YAML files from existing MDX frontmatter
 * or create placeholder units for coming-soon games
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const pagesDir = join(rootDir, 'src/pages');
const gamesDir = join(rootDir, 'src/content/games');
const unitsDir = join(rootDir, 'src/content/units');

// Ensure units directory exists
if (!existsSync(unitsDir)) {
  mkdirSync(unitsDir, { recursive: true });
}

// Simple YAML parser for frontmatter
function parseYamlFrontmatter(yamlStr) {
  const lines = yamlStr.split('\n');
  const result = { phases: [], units: [] };
  let currentArray = null;
  let currentObj = null;
  let indent = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    // Match key: value pairs
    const kvMatch = trimmed.match(/^(\w+):\s*(.*)$/);
    if (kvMatch) {
      const [, key, value] = kvMatch;
      if (value === '' || value === '[]') {
        // Array start
        if (key === 'phases') currentArray = result.phases;
        else if (key === 'units') currentArray = result.units;
        else currentArray = null;
      } else if (value.startsWith('"') || value.startsWith("'")) {
        // String value
        if (currentObj) {
          currentObj[key] = value.replace(/^["']|["']$/g, '');
        } else {
          result[key] = value.replace(/^["']|["']$/g, '');
        }
      } else if (value === 'true' || value === 'false') {
        if (currentObj) currentObj[key] = value === 'true';
        else result[key] = value === 'true';
      } else if (!isNaN(Number(value))) {
        if (currentObj) currentObj[key] = Number(value);
        else result[key] = Number(value);
      } else {
        if (currentObj) currentObj[key] = value;
        else result[key] = value;
      }
    }

    // Match array item start
    if (trimmed.startsWith('- ')) {
      if (currentArray) {
        currentObj = {};
        currentArray.push(currentObj);
        // Parse inline values
        const rest = trimmed.slice(2);
        const inlineKv = rest.match(/^(\w+):\s*(.*)$/);
        if (inlineKv) {
          const [, key, value] = inlineKv;
          if (!isNaN(Number(value))) {
            currentObj[key] = Number(value);
          } else if (value === 'true' || value === 'false') {
            currentObj[key] = value === 'true';
          } else {
            currentObj[key] = value.replace(/^["']|["']$/g, '');
          }
        }
      }
    }
  }

  return result;
}

// Simple YAML generator
function generateYaml(data) {
  let yaml = '';
  yaml += `platform: ${data.platform}\n`;
  yaml += `track: ${data.track}\n`;
  yaml += `gameSlug: ${data.gameSlug}\n`;
  yaml += `phases:\n`;
  for (const phase of data.phases) {
    yaml += `  - name: "${phase.name}"\n`;
    yaml += `    description: "${phase.description}"\n`;
    yaml += `    hours: "${phase.hours}"\n`;
    yaml += `    start: ${phase.start}\n`;
    yaml += `    end: ${phase.end}\n`;
  }
  yaml += `units:\n`;
  for (const unit of data.units) {
    yaml += `  - number: ${unit.number}\n`;
    yaml += `    title: "${unit.title}"\n`;
    yaml += `    available: ${unit.available}\n`;
  }
  return yaml;
}

// Default phase structures for different unit counts
function getDefaultPhases(totalUnits) {
  if (totalUnits === 64) {
    return [
      { name: 'Foundation', description: 'Build the core game mechanics', hours: '16-24', start: 1, end: 16 },
      { name: 'Expansion', description: 'Add features and content', hours: '16-24', start: 17, end: 32 },
      { name: 'Polish', description: 'Visual effects and menus', hours: '16-24', start: 33, end: 48 },
      { name: 'Mastery', description: 'Optimisation and distribution', hours: '16-24', start: 49, end: 64 },
    ];
  } else if (totalUnits === 128) {
    return [
      { name: 'Foundation', description: 'Build the core game mechanics', hours: '16-24', start: 1, end: 32 },
      { name: 'Expansion', description: 'Add features and content', hours: '16-24', start: 33, end: 64 },
      { name: 'Polish', description: 'Visual effects and menus', hours: '16-24', start: 65, end: 96 },
      { name: 'Mastery', description: 'Optimisation and distribution', hours: '16-24', start: 97, end: 128 },
    ];
  } else if (totalUnits === 256) {
    return [
      { name: 'Foundation', description: 'Build the core game mechanics', hours: '24-32', start: 1, end: 64 },
      { name: 'Expansion', description: 'Add features and content', hours: '24-32', start: 65, end: 128 },
      { name: 'Polish', description: 'Visual effects and menus', hours: '24-32', start: 129, end: 192 },
      { name: 'Mastery', description: 'Optimisation and distribution', hours: '24-32', start: 193, end: 256 },
    ];
  } else if (totalUnits === 512) {
    return [
      { name: 'Foundation', description: 'Build the core game mechanics', hours: '32-48', start: 1, end: 128 },
      { name: 'Expansion', description: 'Add features and content', hours: '32-48', start: 129, end: 256 },
      { name: 'Polish', description: 'Visual effects and menus', hours: '32-48', start: 257, end: 384 },
      { name: 'Mastery', description: 'Optimisation and distribution', hours: '32-48', start: 385, end: 512 },
    ];
  }
  // Fallback for any other count
  const phaseSize = Math.ceil(totalUnits / 4);
  return [
    { name: 'Foundation', description: 'Build the core game mechanics', hours: '16-24', start: 1, end: phaseSize },
    { name: 'Expansion', description: 'Add features and content', hours: '16-24', start: phaseSize + 1, end: phaseSize * 2 },
    { name: 'Polish', description: 'Visual effects and menus', hours: '16-24', start: phaseSize * 2 + 1, end: phaseSize * 3 },
    { name: 'Mastery', description: 'Optimisation and distribution', hours: '16-24', start: phaseSize * 3 + 1, end: totalUnits },
  ];
}

// Generate default units for coming-soon games
function generateDefaultUnits(totalUnits) {
  const units = [];
  for (let i = 1; i <= totalUnits; i++) {
    units.push({
      number: i,
      title: `Unit ${i}`,
      available: false
    });
  }
  return units;
}

// Parse simple YAML (games collection format)
function parseGamesYaml(content) {
  const lines = content.split('\n');
  const result = { games: [] };
  let currentGame = null;
  let inSkills = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    // Top-level keys
    if (line.startsWith('platform:')) {
      result.platform = line.split(':')[1].trim();
    } else if (line.startsWith('track:')) {
      result.track = line.split(':')[1].trim();
    } else if (trimmed.startsWith('- number:')) {
      currentGame = { skills: [] };
      result.games.push(currentGame);
      currentGame.number = parseInt(trimmed.split(':')[1].trim());
      inSkills = false;
    } else if (currentGame) {
      if (trimmed.startsWith('slug:')) {
        currentGame.slug = trimmed.split(':')[1].trim();
      } else if (trimmed.startsWith('name:')) {
        currentGame.name = trimmed.split(':').slice(1).join(':').trim();
      } else if (trimmed.startsWith('units:')) {
        currentGame.units = parseInt(trimmed.split(':')[1].trim());
      } else if (trimmed.startsWith('unitsAvailable:')) {
        currentGame.unitsAvailable = parseInt(trimmed.split(':')[1].trim());
      } else if (trimmed.startsWith('status:')) {
        currentGame.status = trimmed.split(':')[1].trim();
      } else if (trimmed === 'skills:') {
        inSkills = true;
      } else if (inSkills && trimmed.startsWith('- ')) {
        currentGame.skills.push(trimmed.slice(2).trim());
      } else {
        inSkills = false;
      }
    }
  }

  return result;
}

// Read all games from games collection
function readGamesCollection() {
  const games = [];
  const files = readdirSync(gamesDir).filter(f => f.endsWith('.yaml'));

  for (const file of files) {
    const content = readFileSync(join(gamesDir, file), 'utf-8');
    const data = parseGamesYaml(content);
    for (const game of data.games) {
      games.push({
        platform: data.platform,
        track: data.track,
        ...game
      });
    }
  }
  return games;
}

// Find MDX file for a game
function findMdxFile(platform, track, gameSlug) {
  const mdxPath = join(pagesDir, platform, track, gameSlug, 'index.mdx');
  if (existsSync(mdxPath)) {
    return mdxPath;
  }
  return null;
}

// Extract frontmatter from MDX
function extractFrontmatter(mdxContent) {
  const match = mdxContent.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  return match[1];
}

// Parse phases from frontmatter
function parsePhases(frontmatter) {
  const phases = [];
  const lines = frontmatter.split('\n');
  let inPhases = false;
  let currentPhase = null;

  for (const line of lines) {
    if (line.startsWith('phases:')) {
      inPhases = true;
      continue;
    }
    if (inPhases) {
      if (line.match(/^[a-z]/)) {
        inPhases = false;
        continue;
      }
      if (line.trim().startsWith('- name:')) {
        if (currentPhase) phases.push(currentPhase);
        currentPhase = { name: line.split(':').slice(1).join(':').trim().replace(/^["']|["']$/g, '') };
      } else if (currentPhase) {
        if (line.trim().startsWith('description:')) {
          currentPhase.description = line.split(':').slice(1).join(':').trim().replace(/^["']|["']$/g, '');
        } else if (line.trim().startsWith('hours:')) {
          currentPhase.hours = line.split(':').slice(1).join(':').trim().replace(/^["']|["']$/g, '');
        } else if (line.trim().startsWith('start:')) {
          currentPhase.start = parseInt(line.split(':')[1].trim());
        } else if (line.trim().startsWith('end:')) {
          currentPhase.end = parseInt(line.split(':')[1].trim());
        }
      }
    }
  }
  if (currentPhase) phases.push(currentPhase);
  return phases;
}

// Parse units from frontmatter
function parseUnits(frontmatter) {
  const units = [];
  const lines = frontmatter.split('\n');
  let inUnits = false;
  let currentUnit = null;

  for (const line of lines) {
    if (line.startsWith('units:')) {
      inUnits = true;
      // Check for empty array
      if (line.includes('[]')) {
        return [];
      }
      continue;
    }
    if (inUnits) {
      if (line.match(/^[a-z]/) && !line.startsWith(' ')) {
        inUnits = false;
        continue;
      }
      if (line.trim().startsWith('- number:')) {
        if (currentUnit) units.push(currentUnit);
        currentUnit = { number: parseInt(line.split(':')[1].trim()) };
      } else if (currentUnit) {
        if (line.trim().startsWith('title:')) {
          currentUnit.title = line.split(':').slice(1).join(':').trim().replace(/^["']|["']$/g, '');
        } else if (line.trim().startsWith('available:')) {
          currentUnit.available = line.split(':')[1].trim() === 'true';
        }
      }
    }
  }
  if (currentUnit) units.push(currentUnit);
  return units;
}

// Main function
function main() {
  const games = readGamesCollection();
  let created = 0;
  let skipped = 0;
  let extracted = 0;

  for (const game of games) {
    // Nested structure: platform/track/game-slug.yaml
    const gameDir = join(unitsDir, game.platform, game.track);
    const filename = `${game.slug}.yaml`;
    const outputPath = join(gameDir, filename);

    // Ensure directory exists
    if (!existsSync(gameDir)) {
      mkdirSync(gameDir, { recursive: true });
    }

    // Skip if file already exists
    if (existsSync(outputPath)) {
      console.log(`Skipping ${game.platform}/${game.track}/${filename} (already exists)`);
      skipped++;
      continue;
    }

    // Check for existing MDX with unit data
    const mdxPath = findMdxFile(game.platform, game.track, game.slug);
    let phases = getDefaultPhases(game.units);
    let units = generateDefaultUnits(game.units);

    if (mdxPath) {
      const mdxContent = readFileSync(mdxPath, 'utf-8');
      const frontmatter = extractFrontmatter(mdxContent);

      if (frontmatter) {
        // Use phases from MDX if available
        const mdxPhases = parsePhases(frontmatter);
        if (mdxPhases.length > 0) {
          phases = mdxPhases;
        }

        // Use units from MDX if available
        const mdxUnits = parseUnits(frontmatter);
        if (mdxUnits.length > 0) {
          units = mdxUnits;
          console.log(`Extracting ${units.length} units from ${game.slug}`);
          extracted++;
        }
      }
    }

    // Create the YAML content
    const unitsData = {
      platform: game.platform,
      track: game.track,
      gameSlug: game.slug,
      phases,
      units
    };

    const yamlContent = generateYaml(unitsData);
    writeFileSync(outputPath, yamlContent);
    console.log(`Created ${filename}`);
    created++;
  }

  console.log(`\nDone! Created ${created} files (${extracted} with extracted data), skipped ${skipped} existing files.`);
}

main();
