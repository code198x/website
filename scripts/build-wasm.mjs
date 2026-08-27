#!/usr/bin/env node
/**
 * Build play198x-web's nodejs target, which NativeImage decodes with.
 *
 * One script so CI and a local `npm run dev` build it the same way. PLAY198X_PATH
 * points at a play198x checkout; deploy.yml provides one, and a developer sets it
 * to their own.
 */
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const root = process.env.PLAY198X_PATH;
if (!root) {
  console.error('PLAY198X_PATH is unset — point it at a play198x checkout.');
  process.exit(1);
}

const crate = path.join(root, 'crates', 'play198x-web');
try {
  execFileSync('wasm-pack', ['build', crate, '--target', 'nodejs', '--out-dir', 'pkg-node'], {
    stdio: 'inherit',
  });
} catch (err) {
  // This script is the first thing a contributor without Rust installed
  // runs. A bare `spawnSync ENOENT` (wasm-pack not found) or a non-zero exit
  // (the build itself failed) is a poor greeting without saying what to
  // check next.
  console.error(
    `\nFailed to run wasm-pack against ${crate}.\n` +
      `Check that wasm-pack is installed (see README.md) and that PLAY198X_PATH ` +
      `(currently ${root}) points at a play198x checkout with this crate.\n`,
  );
  console.error(err.message);
  process.exit(1);
}
console.log(path.join(crate, 'pkg-node'));
