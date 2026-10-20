#!/usr/bin/env node
// Find CSS that no built page uses: load every page at three widths with
// Chromium's CSS coverage on and report, per stylesheet, the rules that never
// matched anything.
//
// A rule reported here matched nothing on any page as it loads. Rules for
// :hover, :focus, open disclosures or classes added by scripts are reported too,
// so treat the output as candidates: search the source before deleting one.
//
// Usage: node scripts/css-coverage.mjs <out-dir> [--sample <n>]
// Serves dist/ with `astro preview`, so run `npm run build` first.
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium, devices } from '@playwright/test';
import { startPreview } from './css-preview.mjs';

const PORT = Number(process.env.CSS_COVERAGE_PORT) || 4395;
const WORKERS = Number(process.env.CSS_COVERAGE_WORKERS) || 8;
const VIEWPORTS = {
  desktop: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
  tablet: { ...devices['Desktop Chrome'], viewport: { width: 768, height: 1024 } },
  mobile: devices['Pixel 7'],
};

const [outDir, flag, sampleArg] = process.argv.slice(2);
if (!outDir) {
  console.error('Usage: node scripts/css-coverage.mjs <out-dir> [--sample <n>]');
  process.exit(2);
}

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
async function* pagesIn(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== '.prerender') yield* pagesIn(full);
    } else if (entry.name === 'index.html') {
      yield '/' + path.relative(path.join(root, 'dist'), path.dirname(full)).split(path.sep).join('/');
    }
  }
}
let routes = [];
for await (const route of pagesIn(path.join(root, 'dist'))) routes.push(route === '/' ? '/' : `${route}/`);
routes.sort();
if (flag === '--sample') routes = routes.filter((_, index) => index % Math.ceil(routes.length / Number(sampleArg)) === 0);

// One entry per distinct stylesheet text: linked sheets by URL, inline
// <style> blocks by content, since the same block appears on many pages.
const sheets = new Map();
const record = entry => {
  const linked = entry.url.includes('.css');
  const key = linked ? new URL(entry.url).pathname : `inline:${crypto.createHash('sha1').update(entry.text).digest('hex').slice(0, 12)}`;
  if (!sheets.has(key)) sheets.set(key, { key, text: entry.text, used: new Uint8Array(entry.text.length), pages: 0 });
  const sheet = sheets.get(key);
  sheet.pages++;
  for (const { start, end } of entry.ranges) sheet.used.fill(1, start, end);
};

const server = await startPreview(PORT);
const browser = await chromium.launch();
const failures = [];
try {
  const jobs = routes.flatMap(route => Object.keys(VIEWPORTS).map(viewport => ({ route, viewport })));
  let next = 0;
  let done = 0;
  await Promise.all(Array.from({ length: WORKERS }, async () => {
    while (next < jobs.length) {
      const { route, viewport } = jobs[next++];
      const page = await browser.newPage({ ...VIEWPORTS[viewport] });
      try {
        await page.coverage.startCSSCoverage();
        await page.goto(server.base + route, { waitUntil: 'load', timeout: 30_000 });
        await page.evaluate(() => document.fonts.ready);
        for (const entry of await page.coverage.stopCSSCoverage()) record(entry);
      } catch (error) {
        failures.push(`${route} ${viewport}: ${error.message.split('\n')[0]}`);
      } finally {
        await page.close();
      }
      if (++done % 500 === 0) console.log(`${done}/${jobs.length} page loads`);
    }
  }));
} finally {
  await browser.close();
  server.stop();
}

// Split each sheet's unused bytes into rule-sized snippets for the report.
const report = [];
let totalBytes = 0;
let unusedBytes = 0;
for (const sheet of sheets.values()) {
  const unused = [];
  let start = -1;
  for (let i = 0; i <= sheet.text.length; i++) {
    const isUnused = i < sheet.text.length && sheet.used[i] === 0;
    if (isUnused && start < 0) start = i;
    if (!isUnused && start >= 0) {
      const snippet = sheet.text.slice(start, i).trim();
      if (snippet.length > 1) unused.push(snippet);
      start = -1;
    }
  }
  const unusedCount = sheet.used.length - sheet.used.reduce((sum, bit) => sum + bit, 0);
  totalBytes += sheet.text.length;
  unusedBytes += unusedCount;
  report.push({ key: sheet.key, bytes: sheet.text.length, unusedBytes: unusedCount, pages: sheet.pages, unused });
}
report.sort((a, b) => b.unusedBytes - a.unusedBytes);

await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(path.join(outDir, 'coverage.json'), JSON.stringify({ routes: routes.length, viewports: Object.keys(VIEWPORTS), failures, sheets: report }, null, 1));
console.log(`${routes.length} routes × ${Object.keys(VIEWPORTS).length} widths; ${sheets.size} distinct stylesheets.`);
console.log(`${totalBytes} bytes of distinct CSS, ${unusedBytes} never matched (${((100 * unusedBytes) / totalBytes).toFixed(1)}%).`);
for (const sheet of report.slice(0, 15)) console.log(`  ${sheet.unusedBytes.toString().padStart(7)} of ${sheet.bytes.toString().padStart(7)} unused  ${sheet.key}  (${sheet.pages} loads)`);
if (failures.length > 0) {
  console.error(`${failures.length} page loads failed:`);
  for (const failure of failures.slice(0, 10)) console.error(`  ${failure}`);
  process.exit(1);
}
