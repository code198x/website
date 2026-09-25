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
 * A planned game — a catalogue entry in src/content/modules with no lesson
 * pages — has no page (see src/pages/[...slug].astro). Its old root URL and its
 * /systems/ URL both redirect to the track page instead, so links to it land
 * somewhere useful rather than on a 404. The catalogue, not a placeholder
 * index.mdx, is what lists planned games.
 *
 * See decisions/website-information-architecture.md
 */
import { existsSync, globSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { load } from 'js-yaml';

const CURRICULUM = './src/content/curriculum';
const SYSTEMS = './src/content/systems';
const MODULES = './src/content/modules';

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
    const dir = path.dirname(file);
    // Match the unit-pages collection's own glob (unit-*.mdx): BASIC lessons
    // carry descriptive suffixes such as unit-01-make-the-spectrum-answer.mdx.
    const hasUnits = readdirSync(dir).some((name) => /^unit-.+\.mdx$/.test(name));
    if (rel.endsWith('/index.mdx') && !hasUnits) {
      const track = url.split('/').slice(0, 2).join('/');
      redirects[`/${url}`] = `/systems/${track}`;
      redirects[`/systems/${url}`] = `/systems/${track}`;
      continue;
    }
    redirects[`/${url}`] = `/systems/${url}`;
  }

  for (const rel of globSync('**/*.yaml', { cwd: MODULES })) {
    const data = load(readFileSync(path.join(MODULES, rel), 'utf8'));
    if (!data?.platform || !data.track) continue;
    const track = `${data.platform}/${data.track}`;
    for (const { slug } of data.modules ?? []) {
      const dir = path.join(CURRICULUM, track, slug);
      const hasUnits = existsSync(dir) && readdirSync(dir).some((name) => /^unit-.+\.mdx$/.test(name));
      if (hasUnits) continue;
      redirects[`/${track}/${slug}`] = `/systems/${track}`;
      redirects[`/systems/${track}/${slug}`] = `/systems/${track}`;
    }
  }

  return redirects;
}
