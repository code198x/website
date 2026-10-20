#!/usr/bin/env node
// Choose the routes css-snapshot.mjs visits: the fewest built pages that
// between them render every scoped component and use every class the global
// stylesheets name. A route set chosen by hand would miss the components that
// appear on only a few lessons.
//
// Usage: node scripts/css-routes.mjs   (after `npm run build`)
// Rewrites scripts/css-routes.json. Entries with `steps` are written by hand
// to reach states a page load does not show (an open menu, say) and are kept.
import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const dist = path.join(root, 'dist');
const routesFile = path.join(root, 'scripts/css-routes.json');

async function* walk(dir, test) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== '.prerender') yield* walk(full, test);
    } else if (test(entry.name)) yield full;
  }
}

// Classes the global stylesheets select on. Scoped component classes are
// covered by their component's cid instead.
const globalClasses = new Set();
const addClasses = css => { for (const [, name] of css.matchAll(/\.(-?[a-zA-Z_][\w-]*)/g)) globalClasses.add(name); };
for await (const file of walk(path.join(root, 'src'), name => name.endsWith('.css'))) addClasses(await fs.readFile(file, 'utf8'));
for await (const file of walk(path.join(root, 'src'), name => name.endsWith('.astro'))) {
  for (const [, css] of (await fs.readFile(file, 'utf8')).matchAll(/<style[^>]*\bis:global\b[^>]*>([\s\S]*?)<\/style>/g)) addClasses(css);
  for (const [, css] of (await fs.readFile(file, 'utf8')).matchAll(/:global\(([^)]*)\)/g)) addClasses(css);
}

const pages = [];
for await (const file of walk(dist, name => name === 'index.html' || name === '404.html')) {
  const html = await fs.readFile(file, 'utf8');
  const features = new Set();
  for (const [, cid] of html.matchAll(/data-astro-cid-([a-z0-9]+)/g)) features.add(`cid:${cid}`);
  for (const [, list] of html.matchAll(/\sclass="([^"]*)"/g)) {
    for (const name of list.split(/\s+/)) if (globalClasses.has(name)) features.add(`class:${name}`);
  }
  const route = '/' + path.relative(dist, file).replace(/(^|\/)index\.html$/, '').replace(/\.html$/, '');
  pages.push({ route: route.endsWith('/') || route === '/' ? route : `${route}/`, features });
}

// Greedy set cover; ties go to the shorter route so the set stays readable.
const uncovered = new Set(pages.flatMap(page => [...page.features]));
const featureCount = uncovered.size;
const chosen = [];
while (uncovered.size > 0) {
  let best;
  let bestGain = 0;
  for (const page of pages) {
    let gain = 0;
    for (const feature of page.features) if (uncovered.has(feature)) gain++;
    if (gain > bestGain || (gain === bestGain && gain > 0 && page.route.length < best.route.length)) {
      best = page;
      bestGain = gain;
    }
  }
  chosen.push(best.route);
  for (const feature of best.features) uncovered.delete(feature);
}

const name = route => route.replace(/^\/|\/$/g, '').replace(/[^a-z0-9]+/gi, '-') || 'home';
const existing = JSON.parse(await fs.readFile(routesFile, 'utf8').catch(() => '[]'));
const handWritten = existing.filter(entry => entry.steps);
const routes = [...chosen.sort().map(route => ({ name: name(route), path: route })), ...handWritten];
await fs.writeFile(routesFile, `${JSON.stringify(routes, null, 2)}\n`);
console.log(`${chosen.length} routes cover ${featureCount} components and global classes across ${pages.length} pages; ${handWritten.length} hand-written states kept.`);
