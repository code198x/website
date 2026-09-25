#!/usr/bin/env node
// Capture the boot and demo posters in src/data/player-posters.yaml through the
// site's own built player worker, so a poster is exactly what the page's
// player shows. Firmware is read from POSTER_ROM_ROOT (a folder of
// <family>/<file> ROMs, e.g. ~/.emu198x/roms) and never written anywhere.
//
//   POSTER_ROM_ROOT=~/.emu198x/roms EMU198X_REPO=../../Emu198x/emu198x \
//     node scripts/capture-posters.mjs [family …]
import { Worker } from 'node:worker_threads';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import zlib from 'node:zlib';
import { load } from 'js-yaml';

if (!process.env.POSTER_ROM_ROOT || !process.env.EMU198X_REPO) { console.error('Set POSTER_ROM_ROOT and EMU198X_REPO.'); process.exit(1); }
// Resolved first, so the sanitiser below matches the absolute path that
// error messages actually carry, even when the variable was set relatively.
const romRoot = path.resolve(process.env.POSTER_ROM_ROOT);
const repo = process.env.EMU198X_REPO;

// Strip local absolute paths (the ROM root under the user's home, the cwd)
// from an error message before it is logged, so a run's output stays safe
// to paste into a PR or report.
const sanitize = message => String(message).replaceAll(romRoot, '<roms>').replaceAll(process.cwd(), '.');

const dist = path.resolve('public/emulators');
const only = process.argv.slice(2);
const entries = load(readFileSync('src/data/player-posters.yaml', 'utf8'));
const catalog = JSON.parse(readFileSync(path.join(dist, 'catalog.json'), 'utf8'));
let profiles, fixtures;
try {
  profiles = JSON.parse(execFileSync('cargo', ['run', '--quiet', '--release', '-p', 'emu198x-fleet-web', '--features', 'all-families', '--bin', 'fleet-catalogue'], { cwd: repo, encoding: 'utf8', maxBuffer: 8e6, env: { ...process.env, RUSTUP_TOOLCHAIN: undefined } }));
  ({ fixtures } = await import(pathToFileURL(path.join(repo, 'web-player/fixtures.mjs')).href));
} catch (error) {
  console.error(`Setup failed: ${sanitize(error?.message ?? error)}`);
  process.exit(1);
}

function png(w, h, rgba) {
  const crc = b => { let c = ~0; for (const x of b) { c ^= x; for (let k = 0; k < 8; k++) c = c & 1 ? (c >>> 1) ^ 0xedb88320 : c >>> 1; } return ~c >>> 0; };
  const chunk = (t, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
  const raw = Buffer.alloc((w * 3 + 1) * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = (y * w + x) * 4, o = y * (w * 3 + 1) + 1 + x * 3; raw[o] = rgba[i]; raw[o + 1] = rgba[i + 1]; raw[o + 2] = rgba[i + 2]; }
  const ih = Buffer.alloc(13); ih.writeUInt32BE(w, 0); ih.writeUInt32BE(h, 4); ih[8] = 8; ih[9] = 2;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ih), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}

const bootstrap = `const {parentPort,workerData}=require('node:worker_threads');const {readFile}=require('node:fs/promises');
global.self=global;global.postMessage=(d,t)=>parentPort.postMessage(d,t);
global.fetch=async i=>new Response(await readFile(new URL(i)),{headers:{'Content-Type':'application/wasm'}});
import(workerData).then(()=>parentPort.on('message',data=>self.onmessage({data})));`;

for (const [family, entry] of Object.entries(entries)) {
  if (entry.kind === 'game' || (only.length && !only.includes(family))) continue;
  let worker;
  try {
    const c = catalog.find(x => x.id === family);
    if (!c) { console.log(`${family}: not in the player catalogue`); continue; }
    const variantId = entry.variant ?? c.defaultVariant;
    const profile = profiles.find(p => p.family === c.family && p.id === variantId);
    if (!profile) { console.log(`${family}: no profile for variant ${variantId}`); continue; }
    const { cases, missing } = fixtures([profile], romRoot);
    if (missing.length) { console.log(`${family}: missing firmware, skipped`); continue; }
    const t = cases[0];
    worker = new Worker(bootstrap, { eval: true, workerData: pathToFileURL(path.join(dist, 'worker.js')).href });
    let serial = 0; const pending = new Map();
    worker.on('message', ({ id, result, error }) => { const p = pending.get(id); if (!p) return; pending.delete(id); error ? p.reject(new Error(error)) : p.resolve(result); });
    const rpc = (command, ...args) => new Promise((resolve, reject) => { const id = ++serial; pending.set(id, { resolve, reject }); worker.postMessage({ id, command, args }); });
    const roms = Object.fromEntries(Object.entries(t.firmware).filter(([, f]) => !f.includes('synthetic-firmware')).map(([k, f]) => [k, new Uint8Array(readFileSync(f))]));
    const media = entry.kind === 'demo'
      ? { slot: profile.slots.find(s => s.kind === 'Cartridge').id, bytes: new Uint8Array(readFileSync(path.join(dist, c.demo.url))) }
      : null;
    await rpc('boot', 'fleet', roms, media, 48000, { family: t.family, id: t.id });
    let frame; for (let n = 0; n < entry.frame; n++) frame = await rpc('step');
    const out = path.join('public/images/systems', family);
    mkdirSync(out, { recursive: true });
    writeFileSync(path.join(out, 'poster.png'), png(frame.width, frame.height, frame.pixels));
    console.log(`${family}: ${frame.width}×${frame.height} at frame ${entry.frame}`);
  } catch (error) {
    console.log(`${family}: ${sanitize(error.message)}`);
  } finally {
    if (worker) await worker.terminate();
  }
}
