#!/usr/bin/env node
// Full-page screenshots of a set of built routes at the widths the CSS
// restructure is reviewed at (docs/plans/2026-10-20-css-cascade-layers.md,
// step 6), and a page that shows two sets side by side.
//
// Usage: node scripts/css-screens.mjs <out-dir> <route>...     (after a build)
//        node scripts/css-screens.mjs --compare <before-dir> <after-dir> <out.html>
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';
import { startPreview } from './css-preview.mjs';

const WIDTHS = [320, 768, 1440];
const name = route => route.replace(/^\/|\/$/g, '').replace(/[^a-z0-9]+/gi, '-') || 'home';

if (process.argv[2] === '--compare') {
  const [, , , before, after, out] = process.argv;
  const shots = (await fs.readdir(after)).filter(file => file.endsWith('.png')).sort();
  const rel = dir => path.relative(path.dirname(out), dir);
  const rows = shots.map(file => `<section><h2>${file.replace('.png', '')}</h2><div class="pair"><figure><figcaption>Before</figcaption><img src="${rel(before)}/${file}" loading="lazy"></figure><figure><figcaption>After</figcaption><img src="${rel(after)}/${file}" loading="lazy"></figure></div></section>`);
  await fs.writeFile(out, `<!doctype html><meta charset="utf-8"><title>Before and after</title><style>body{font:16px system-ui;margin:16px}.pair{display:flex;gap:16px;align-items:flex-start}figure{margin:0;flex:1}img{max-width:100%;border:1px solid #ccc}</style>${rows.join('\n')}`);
  console.log(`${shots.length} pairs → ${out}`);
  process.exit(0);
}

const [out, ...routes] = process.argv.slice(2);
if (!out || routes.length === 0) {
  console.error('Usage: node scripts/css-screens.mjs <out-dir> <route>...');
  process.exit(2);
}
await fs.mkdir(out, { recursive: true });
const { base, stop } = await startPreview(4398);
const browser = await chromium.launch();
try {
  for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    for (const route of routes) {
      const response = await page.goto(base + route, { waitUntil: 'networkidle' });
      // A missing page would be photographed as the 404 page and pass for a screenshot.
      if (!response?.ok()) throw new Error(`${route} answered ${response?.status()}; build the site first`);
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: path.join(out, `${name(route)}.${width}.png`), fullPage: true, animations: 'disabled' });
    }
    await page.close();
  }
} finally {
  await browser.close();
  stop();
}
console.log(`${routes.length * WIDTHS.length} screenshots → ${out}`);
