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
/**
 * One entry per *defect*, not per element instance.
 *
 * Keying by the full selector path made one broken CSS rule look like hundreds
 * of problems: `.context:nth-child(17) > .after.line-num`,
 * `:nth-child(18)`, `:nth-child(19)` and so on, plus a fresh set under every
 * generated `#diff-xxxxxxx` id. A run reporting "3001 distinct findings" was
 * really reporting about two — diff line numbers and "coming soon" cards — and
 * a list that long reads as hopeless rather than as a morning's work.
 *
 * The signature is the failing element itself: the last step of the selector,
 * with positional pseudo-classes dropped. That is what identifies the rule you
 * have to go and change.
 */
interface Defect {
  rule: string;
  element: string;
  occurrences: number;
  routes: Set<string>;
  examples: string[];
  /** Lowest ratio seen, for contrast failures — the worst case is the one to fix against. */
  worst?: { ratio: number; required: number; fg: string; bg: string };
}

const findings = new Map<string, Defect>();

/**
 * The failing element, named so the same defect on two pages keys the same.
 *
 * Its own tag and classes, taken from the element's HTML — that is what a CSS
 * rule is written against. A selector path is not stable: it carries positions
 * and generated ids, so `div.diff-container.unified` arrived as forty-six
 * separate findings, one per `#diff-znbja6w`.
 */
function signature(node: { html?: string; target?: unknown[] }): string {
  const open = String(node.html ?? '').match(/^<([a-z][\w-]*)\b([^>]*)>/i);
  if (open) {
    const classes = (open[2].match(/\bclass="([^"]*)"/i)?.[1] ?? '')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (classes.length) return `${open[1].toLowerCase()}.${classes.join('.')}`;
  }
  // Nothing to identify it by but the selector. Drop positions, and collapse a
  // generated id suffix so those group rather than splinter.
  const path = (node.target ?? []).map(String).join(' ');
  const last = path.split(/\s*[>\s]\s*/).filter(Boolean).pop() ?? path;
  return last
    .replace(/:nth-(child|of-type|last-child)\(\d+\)/g, '')
    .replace(/^#([a-z][\w-]*?)-[a-z0-9]{6,}$/i, '#$1-*');
}

/** Fold one violating node into its defect, keeping the worst contrast seen. */
function record(
  rule: string,
  element: string,
  path: string,
  theme: string,
  node?: { any?: Array<{ id: string; data?: Record<string, unknown> }> },
): void {
  const key = `${rule} | ${element}`;
  let d = findings.get(key);
  if (!d) {
    d = { rule, element, occurrences: 0, routes: new Set(), examples: [] };
    findings.set(key, d);
  }
  d.occurrences += 1;
  d.routes.add(path);
  // Distinct routes: three copies of the same URL told you nothing about how
  // widely a defect had spread.
  if (d.examples.length < 3 && !d.examples.some((e) => e.startsWith(`${path} [`))) {
    d.examples.push(`${path} [${theme}]`);
  }

  const data = node?.any?.find((c) => c.id === 'color-contrast')?.data as
    | { contrastRatio?: number; expectedContrastRatio?: string; fgColor?: string; bgColor?: string }
    | undefined;
  if (data?.contrastRatio !== undefined) {
    const ratio = data.contrastRatio;
    if (!d.worst || ratio < d.worst.ratio) {
      d.worst = {
        ratio,
        required: parseFloat(String(data.expectedContrastRatio ?? '')) || 4.5,
        fg: data.fgColor ?? '?',
        bg: data.bgColor ?? '?',
      };
    }
  }
}

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
            record(v.id, signature(node), path, theme, node);
          }
        }
      } catch (err) {
        record('ERROR', String(err).slice(0, 120), path, theme);
      }
      if (++done % 250 === 0) console.log(`  ${done}/${jobs.length}`);
    }
    await ctx.close();
  };

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  const summary = [...findings.values()]
    .map((d) => ({
      rule: d.rule,
      element: d.element,
      occurrences: d.occurrences,
      routes: d.routes.size,
      examples: d.examples,
      ...(d.worst ? { contrast: d.worst } : {}),
    }))
    .sort((a, b) => b.occurrences - a.occurrences);
  writeFileSync('a11y-sweep-report.json', JSON.stringify({ routes: ALL.length, jobs: jobs.length, summary }, null, 2));

  console.log(`\nSWEEP: ${jobs.length} page-loads, ${summary.length} distinct defect(s)`);
  for (const d of summary) {
    // The measured ratio is the point of a contrast failure, and the old report
    // never carried it — you had to go and open the page to find out how far off
    // it was, or whether it was close enough to fix with a shade.
    const ratio = d.contrast
      ? `  ${d.contrast.ratio}:1 needs ${d.contrast.required} (${d.contrast.fg} on ${d.contrast.bg})`
      : '';
    console.log(
      `  ${String(d.occurrences).padStart(5)}x on ${String(d.routes).padStart(4)} route(s)  ` +
        `${d.rule}  ${d.element}${ratio}`,
    );
    console.log(`         e.g. ${d.examples.join(', ')}`);
  }

  expect(summary, `serious/critical a11y findings across ${ALL.length} routes`).toEqual([]);
});
