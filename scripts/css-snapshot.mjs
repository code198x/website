#!/usr/bin/env node
// Record the computed style of every element on a fixed set of built pages.
//
// The CSS restructure (docs/plans/2026-10-20-css-cascade-layers.md) must not
// change how any page looks. Two snapshots, taken before and after a change and
// compared with css-diff.mjs, show every property that moved.
//
// Usage: node scripts/css-snapshot.mjs <out-dir> [--only <route-name>]
// Serves dist/ with `astro preview`, so run `npm run build` first.
import fs from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import { chromium, devices } from '@playwright/test';
import { startPreview } from './css-preview.mjs';

const PORT = Number(process.env.CSS_SNAPSHOT_PORT) || 4394;
const VIEWPORTS = {
  desktop: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
  mobile: devices['Pixel 7'],
  // The narrowest width the site supports; tests check overflow here.
  narrow: { ...devices['Desktop Chrome'], viewport: { width: 320, height: 800 } },
};

const [outDir, ...rest] = process.argv.slice(2);
if (!outDir) {
  console.error('Usage: node scripts/css-snapshot.mjs <out-dir> [--only <route-name>]');
  process.exit(2);
}
const only = rest[0] === '--only' ? rest[1] : undefined;
const routes = JSON.parse(await fs.readFile(new URL('./css-routes.json', import.meta.url), 'utf8'))
  .filter(route => !only || route.name === only);
if (routes.length === 0) {
  console.error(`No route named ${only} in scripts/css-routes.json`);
  process.exit(2);
}

// Runs in the page. Records, for every element and its ::before/::after, each
// computed property whose value differs from that tag's browser default, so a
// snapshot holds what the site's CSS decided and little else.
function collect() {
  const frame = document.createElement('iframe');
  frame.style.display = 'none';
  document.body.append(frame);
  const blank = frame.contentDocument;
  const defaults = new Map();
  const defaultsFor = tag => {
    if (!defaults.has(tag)) {
      const probe = blank.createElement(tag);
      blank.body.append(probe);
      const style = frame.contentWindow.getComputedStyle(probe);
      const values = {};
      for (const name of style) values[name] = style.getPropertyValue(name);
      defaults.set(tag, values);
      probe.remove();
    }
    return defaults.get(tag);
  };
  // Some components generate a fresh id on every build (a diagram's arrowhead
  // marker, say), so record what a url(#id) points at rather than the id.
  const target = value => value.replace(/url\("#([^"]+)"\)/g, (whole, id) => {
    const element = document.getElementById(id);
    return element ? `url(${key(element)})` : whole;
  });
  const differences = (style, base) => {
    const values = {};
    for (const name of style) {
      const value = style.getPropertyValue(name);
      if (base[name] !== value) values[name] = value.includes('url("#') ? target(value) : value;
    }
    return values;
  };
  const key = element => {
    const parts = [];
    for (let node = element; node && node !== document.documentElement; node = node.parentElement) {
      let index = 1;
      for (let sibling = node.previousElementSibling; sibling; sibling = sibling.previousElementSibling) {
        if (sibling.tagName === node.tagName) index++;
      }
      parts.push(`${node.tagName.toLowerCase()}:${index}`);
    }
    return parts.reverse().join('>');
  };
  const elements = {};
  for (const element of [document.documentElement, ...document.documentElement.querySelectorAll('*')]) {
    if (element === frame) continue;
    const tag = element.tagName.toLowerCase();
    const base = defaultsFor(tag);
    const id = key(element) || 'html';
    elements[id] = differences(getComputedStyle(element), base);
    for (const pseudo of ['::before', '::after']) {
      const style = getComputedStyle(element, pseudo);
      if (style.content === 'none' || style.content === 'normal') continue;
      elements[`${id}${pseudo}`] = differences(style, base);
    }
  }
  frame.remove();
  return elements;
}

async function settle(page) {
  // Load every declared face, not just those already requested: a face first
  // needed late (a display heading's italic, say) can still be loading when
  // document.fonts.ready resolves, and `ch` and line breaks then use the
  // fallback's metrics.
  await page.evaluate(async () => {
    await Promise.all([...document.fonts].map(face => face.load().catch(() => {})));
    await document.fonts.ready;
  });
  // Jump finite animations and transitions to their end and drop endless ones.
  // This avoids injecting CSS, which would itself take part in the cascade.
  await page.evaluate(() => {
    for (const animation of document.getAnimations()) {
      const { iterations } = animation.effect.getComputedTiming();
      if (Number.isFinite(iterations)) animation.finish();
      else animation.cancel();
    }
  });
  // Wait for scripts that size things after load (an iframe that reports its
  // content height, say) until the page and its frames hold still.
  await page.evaluate(async () => {
    const measure = () => [document.documentElement.scrollHeight, ...[...document.querySelectorAll('iframe')].map(frame => frame.offsetHeight)].join();
    let last = measure();
    for (let still = 0, tries = 0; still < 3 && tries < 40; tries++) {
      await new Promise(resolve => setTimeout(resolve, 150));
      const now = measure();
      still = now === last ? still + 1 : 0;
      last = now;
    }
  });
}

const server = await startPreview(PORT);
const BASE = server.base;
const browser = await chromium.launch();
let failed = false;
try {
  await fs.mkdir(outDir, { recursive: true });
  for (const route of routes) {
    for (const [viewport, device] of Object.entries(VIEWPORTS)) {
      if (route.viewports && !route.viewports.includes(viewport)) continue;
      const context = await browser.newContext({ ...device, reducedMotion: 'reduce' });
      const page = await context.newPage();
      try {
        await page.goto(BASE + route.path, { waitUntil: 'load' });
        for (const step of route.steps ?? []) {
          if (step.click) await page.locator(step.click).first().click();
          if (step.waitFor) await page.locator(step.waitFor).first().waitFor();
        }
        await settle(page);
        const elements = await page.evaluate(collect);
        const file = path.join(outDir, `${route.name}.${viewport}.json.gz`);
        await fs.writeFile(file, gzipSync(JSON.stringify({ route: route.path, viewport, elements })));
        console.log(`${route.name} ${viewport}: ${Object.keys(elements).length} elements`);
      } catch (error) {
        failed = true;
        console.error(`${route.name} ${viewport}: ${error.message.split('\n')[0]}`);
      } finally {
        await context.close();
      }
    }
  }
} finally {
  await browser.close();
  server.stop();
}
process.exit(failed ? 1 : 0);
