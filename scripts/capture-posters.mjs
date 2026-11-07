#!/usr/bin/env node
// Capture the boot and demo posters in src/data/player-posters.yaml through the
// site's own built player worker, so a poster is exactly what the page's
// player shows. Firmware is read from POSTER_ROM_ROOT (a folder of
// <family>/<file> ROMs, e.g. ~/.emu198x/roms) and never written anywhere.
//
//   POSTER_ROM_ROOT=~/.emu198x/roms EMU198X_REPO=../../Emu198x/emu198x \
//     node scripts/capture-posters.mjs [family …]
// Or use POSTER_FIRMWARE_JSON instead of the producer source checkout:
// {"family-id":{"firmware-id":"file-relative-to-POSTER_ROM_ROOT"}}.
// Every selected family needs a mapping ({} for firmware-free consoles).
// POSTER_RECEIPT_PATH optionally retains a local digest/model/frame receipt.
import { createHash } from 'node:crypto';
import { Worker } from 'node:worker_threads';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import zlib from 'node:zlib';
import { load } from 'js-yaml';

if (!process.env.POSTER_ROM_ROOT || (!process.env.EMU198X_REPO && !process.env.POSTER_FIRMWARE_JSON)) { console.error('Set POSTER_ROM_ROOT and either EMU198X_REPO or POSTER_FIRMWARE_JSON.'); process.exit(1); }
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
const firmwareOverrides = process.env.POSTER_FIRMWARE_JSON ? JSON.parse(readFileSync(process.env.POSTER_FIRMWARE_JSON, 'utf8')) : null;
const receipts = [];
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
let profiles, fixtures;
try {
  if (!firmwareOverrides) {
    profiles = JSON.parse(execFileSync('cargo', ['run', '--quiet', '--release', '-p', 'emu198x-fleet-web', '--features', 'all-families', '--bin', 'fleet-catalogue'], { cwd: repo, encoding: 'utf8', maxBuffer: 8e6, env: { ...process.env, RUSTUP_TOOLCHAIN: undefined } }));
    ({ fixtures } = await import(pathToFileURL(path.join(repo, 'web-player/fixtures.mjs')).href));
  }
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

let failures = 0;
for (const [family, entry] of Object.entries(entries)) {
  if (entry.kind === 'game' || (only.length && !only.includes(family))) continue;
  let worker;
  try {
    if (!Number.isInteger(entry.frame) || entry.frame < 1) throw new Error('Capture frame must be a positive integer');
    const c = catalog.find(x => x.id === family);
    if (!c) throw new Error('Not in the player catalogue');
    const variantId = entry.variant ?? c.defaultVariant;
    const profile = firmwareOverrides
      ? c.variants.find(p => p.id === variantId)
      : profiles.find(p => p.family === c.family && p.id === variantId);
    if (!profile) throw new Error(`No profile for variant ${variantId}`);
    let t;
    if (firmwareOverrides) {
      if (!(family in firmwareOverrides)) throw new Error('No explicit firmware mapping for this family');
      const firmware = Object.fromEntries(Object.entries(firmwareOverrides[family]).map(([id, file]) => [id, path.resolve(romRoot, file)]));
      for (const required of profile.firmware.filter(f => !f.optional)) {
        if (!firmware[required.id]) throw new Error(`Missing required firmware ${required.id}`);
      }
      for (const id of Object.keys(firmware)) {
        if (!profile.firmware.some(f => f.id === id)) throw new Error(`Unknown firmware ${id}`);
      }
      t = { family: c.family, id: variantId, firmware };
    } else {
      const { cases, missing } = fixtures([profile], romRoot);
      if (missing.length) throw new Error('Missing firmware');
      t = cases[0];
    }
    worker = new Worker(bootstrap, { eval: true, workerData: pathToFileURL(path.join(dist, 'worker.js')).href });
    let serial = 0; const pending = new Map();
    worker.on('message', ({ id, result, error }) => { const p = pending.get(id); if (!p) return; clearTimeout(p.timer); pending.delete(id); error ? p.reject(new Error(error)) : p.resolve(result); });
    const rpc = (command, ...args) => new Promise((resolve, reject) => { const id = ++serial; const timer = setTimeout(() => { pending.delete(id); reject(new Error(`Timed out: ${command}`)); }, 20000); pending.set(id, { resolve, reject, timer }); worker.postMessage({ id, command, args }); });
    const roms = Object.fromEntries(Object.entries(t.firmware).filter(([, f]) => !f.includes('synthetic-firmware')).map(([k, f]) => [k, new Uint8Array(readFileSync(f))]));
    const mediaFile = entry.demo ? path.join('public', entry.demo.src) : c.demo ? path.join(dist, c.demo.url) : null;
    if (entry.kind === 'demo' && !mediaFile) throw new Error('No demo media declared');
    const source = entry.demo ? { src: entry.demo.src.replace(/\.bin$/, '.asm'), sha256: digest(readFileSync(mediaFile.replace(/\.bin$/, '.asm'))), licenseSha256: digest(readFileSync(path.join(path.dirname(mediaFile), 'LICENSE'))) } : null;
    const media = entry.kind === 'demo'
      ? { slot: profile.slots.find(s => s.kind === 'Cartridge').id, bytes: new Uint8Array(readFileSync(mediaFile)) }
      : null;
    await rpc('boot', 'fleet', roms, media, 48000, { family: t.family, id: t.id });
    let frame; for (let n = 0; n < entry.frame; n++) frame = await rpc('step');
    const out = path.join('public/images/systems', family);
    mkdirSync(out, { recursive: true });
    const image = png(frame.width, frame.height, frame.pixels);
    writeFileSync(path.join(out, 'poster.png'), image);
    receipts.push({ family, variant: variantId, frame: entry.frame, width: frame.width, height: frame.height, firmware: Object.fromEntries(Object.entries(roms).map(([id, bytes]) => [id, { size: bytes.length, sha256: digest(bytes) }])), media: media ? { src: entry.demo?.src ?? c.demo.url, size: media.bytes.length, sha256: digest(media.bytes), source } : null, pngSha256: digest(image), rgbaSha256: digest(frame.pixels), player: JSON.parse(readFileSync(path.join(dist, 'build.json'), 'utf8')) });
    console.log(`${family}: ${frame.width}×${frame.height} at frame ${entry.frame}`);
  } catch (error) {
    failures++;
    console.error(`${family}: ${sanitize(error.message)}`);
  } finally {
    if (worker) await worker.terminate();
  }
}

if (only.some(family => !(family in entries))) { console.error('Unknown requested family'); failures++; }
if (process.env.POSTER_RECEIPT_PATH) writeFileSync(process.env.POSTER_RECEIPT_PATH, JSON.stringify(receipts, null, 2));
if (failures) process.exitCode = 1;
