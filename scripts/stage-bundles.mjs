#!/usr/bin/env node
// Copy the pinned browser bundles from node_modules to the site's own origin.
//
// The player and the NES assembler are built once by their producers and
// installed from npm at the exact versions in package.json (umbrella
// decisions/browser-bundles-ship-as-npm-packages.md); this site serves them
// from public/ rather than compiling sibling repositories. Runs before dev,
// build and the checks.
import {cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const packageDir = (name) => path.dirname(require.resolve(`${name}/package.json`));
const version = (name) => JSON.parse(readFileSync(path.join(packageDir(name), 'package.json'), 'utf8')).version;

// The player: every file the package ships, except npm's own metadata.
const player = packageDir('@emu198x/player');
const emulators = path.join(site, 'public/emulators');
rmSync(emulators, {recursive: true, force: true});
cpSync(player, emulators, {
  recursive: true,
  filter: (source) => !['package.json', 'README.md'].includes(path.relative(player, source)),
});
const build = JSON.parse(readFileSync(path.join(emulators, 'build.json'), 'utf8'));
// Lessons press Run on the 48K model without asking for firmware; a player
// without the bundled ROM would quietly ask readers for it instead.
if (!build.bundledSpectrum48kFirmware) {
  throw new Error(`@emu198x/player ${build.version} does not carry the Spectrum 48K ROM`);
}

// The NES assembler: its module, its wasm and its licence, which the lesson links.
const assembler = packageDir('@asm198x/mos6502');
const wasm = path.join(site, 'public/wasm/asm198x-mos6502');
rmSync(wasm, {recursive: true, force: true});
mkdirSync(wasm, {recursive: true});
for (const file of ['asm198x_web.js', 'asm198x_web_bg.wasm']) cpSync(path.join(assembler, file), path.join(wasm, file));
const licence = ['LICENSE', 'LICENSE.txt', 'LICENSE.md'].map((name) => path.join(assembler, name)).find(existsSync);
if (!licence) throw new Error('@asm198x/mos6502 ships no licence file');
cpSync(licence, path.join(wasm, 'LICENSE.txt'));
writeFileSync(path.join(wasm, 'build.json'), JSON.stringify({package: '@asm198x/mos6502', version: version('@asm198x/mos6502'), architecture: 'mos6502'}, null, 2) + '\n');

console.log(`Staged @emu198x/player ${build.version} (${build.revision.slice(0, 9)}) and @asm198x/mos6502 ${version('@asm198x/mos6502')}.`);
