/**
 * Redirects from the pre-2026-09-03 system URLs, when a machine sat at the site
 * root rather than under /systems/.
 *
 * These are permanent, not transitional: rss.xml had already published absolute
 * root URLs to feed readers, and a feed item does not get a second chance to be
 * right.
 *
 * They are enumerated one by one rather than written as `/{slug}/[...rest]`
 * wildcards, because Astro validates a dynamic redirect's destination against a
 * route that literally exists. The route that serves these pages is
 * `/systems/[...slug]`, so `/systems/commodore-64/[...rest]` matches nothing and
 * fails the build. One entry per page is the only shape Astro accepts.
 *
 * The walk below mirrors the three content-collection globs in
 * content.config.ts — `**\/index.mdx`, `**\/unit-*.mdx` and
 * `**\/getting-started.mdx` under src/content/curriculum. If those globs change,
 * this must change with them, or old links start 404ing silently.
 *
 * See decisions/website-information-architecture.md
 */
import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const CURRICULUM = './src/content/curriculum';
const SYSTEMS = './src/content/systems';

/** Cross-platform sections keep their shallower URLs and do not move. */
const SECTIONS = new Set(['foundations', 'craft']);

function walk(dir, found = []) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walk(full, found);
    else if (name === 'index.mdx' || name === 'getting-started.mdx' || /^unit-\d+\.mdx$/.test(name)) {
      found.push(full);
    }
  }
  return found;
}

export function legacySystemRedirects() {
  const redirects = {};

  // Every machine's landing page, including the ~150 with no curriculum behind
  // them — those were real URLs served by the [platform] stub route.
  for (const file of readdirSync(SYSTEMS)) {
    if (!file.endsWith('.yaml')) continue;
    const slug = file.replace(/\.yaml$/, '');
    redirects[`/${slug}`] = `/systems/${slug}`;
  }

  for (const file of walk(CURRICULUM)) {
    const rel = path.relative(CURRICULUM, file).split(path.sep).join('/');
    const top = rel.split('/')[0];
    if (SECTIONS.has(top)) continue;
    const url = rel.replace(/\.mdx$/, '').replace(/\/index$/, '');
    redirects[`/${url}`] = `/systems/${url}`;
  }

  return redirects;
}
