/**
 * Full-route accessibility sweep — every built route, both themes.
 *
 * NOT part of the normal suite (a11y.spec.ts gates one page per template and
 * runs in seconds). This one enumerates dist/ and checks all of it, for when
 * "we fixed the templates we looked at" needs to become "we checked all of it".
 *
 * Run:  npx playwright test tests/a11y-sweep.spec.ts --project=desktop
 * It writes every serious/critical finding to a11y-sweep-report.json.
 */
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readdirSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

function routes(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) routes(p, out);
    else if (name === 'index.html') {
      const rel = relative('dist', dir).split(sep).join('/');
      out.push(rel === '' ? '/' : `/${rel}`);
    }
  }
  return out;
}

// No `dist`, no sweep. This used to fall back to an empty route list, which
// meant the audit reported success having measured nothing at all — the worst
// kind of green. The routes and the pages both come from the build now, so its
// absence is a hard stop.
if (!existsSync('dist')) {
  throw new Error(
    'a11y sweep: no dist/ — run `npm run build` first. The sweep enumerates ' +
      'and serves the built site, so without it there is nothing to measure.',
  );
}
const ALL = routes('dist').sort();
const THEMES = ['light', 'dark'] as const;
const findings: Record<string, string[]> = {};

test.describe.configure({ mode: 'parallel' });

test(`sweep: ${ALL.length} routes x ${THEMES.length} themes`, async ({ browser }) => {
  test.setTimeout(0);
  const CONCURRENCY = 8;
  const jobs: Array<{ path: string; theme: string }> = [];
  for (const path of ALL) for (const theme of THEMES) jobs.push({ path, theme });

  let next = 0;
  let done = 0;
  const worker = async () => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    while (true) {
      const i = next++;
      if (i >= jobs.length) break;
      const { path, theme } = jobs[i];
      try {
        await page.addInitScript((t) => localStorage.setItem('theme', t), theme);
        await page.goto(path, { waitUntil: 'networkidle' });
        await page.emulateMedia({ colorScheme: theme as 'light' | 'dark' });
        // Kill animations before measuring. A panel caught mid-fadeIn reports
        // blended colours, which axe scores as a contrast failure that does not
        // exist once the animation settles — three such ghosts in the first run.
        await page.addStyleTag({
          content: `*, *::before, *::after { animation: none !important;
                    transition: none !important; }`,
        });
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();
        for (const v of results.violations) {
          if (v.impact !== 'serious' && v.impact !== 'critical') continue;
          for (const node of v.nodes) {
            const key = `${v.id} | ${node.target.join(' ')}`;
            (findings[key] ??= []).push(`${path} [${theme}]`);
          }
        }
      } catch (err) {
        (findings[`ERROR | ${String(err).slice(0, 120)}`] ??= []).push(`${path} [${theme}]`);
      }
      if (++done % 250 === 0) console.log(`  ${done}/${jobs.length}`);
    }
    await ctx.close();
  };

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  // Collapse to one line per distinct violation, with an example and a count.
  const summary = Object.entries(findings)
    .map(([k, where]) => ({ violation: k, occurrences: where.length, example: where[0] }))
    .sort((a, b) => b.occurrences - a.occurrences);
  writeFileSync('a11y-sweep-report.json', JSON.stringify({ routes: ALL.length, jobs: jobs.length, summary }, null, 2));
  console.log(`\nSWEEP: ${jobs.length} page-loads, ${summary.length} distinct serious/critical finding(s)`);
  for (const s of summary.slice(0, 40)) console.log(`  ${s.occurrences}x  ${s.violation}   e.g. ${s.example}`);

  expect(summary, `serious/critical a11y findings across ${ALL.length} routes`).toEqual([]);
});
