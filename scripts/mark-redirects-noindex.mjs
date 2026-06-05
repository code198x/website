/**
 * Make Astro's redirect stubs invisible to Pagefind.
 *
 * The site deploys to GitHub Pages, which has no server-side redirects, so the
 * `redirects` map in astro.config.mjs is emitted as meta-refresh HTML stubs.
 * Those stubs have no <html> element, so Pagefind warns ("has no <html>
 * element") and skips each one on every build.
 *
 * This pass runs between `astro build` and `pagefind`. It wraps each stub in
 * `<html data-pagefind-ignore>`, which gives Pagefind a valid document to parse
 * and an explicit instruction to skip it — no warning, nothing indexed. The
 * meta-refresh still lives in the head, so the redirect is unaffected.
 *
 * It keys off the stub's shape, not a hardcoded URL list, so any future
 * redirect is handled automatically.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = 'dist';

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path);
    else if (entry.name.endsWith('.html')) yield path;
  }
}

let wrapped = 0;
for await (const file of htmlFiles(DIST)) {
  const html = await readFile(file, 'utf8');
  if (!html.includes('http-equiv="refresh"')) continue; // not a redirect stub
  if (/<html[\s>]/i.test(html)) continue; // real page, or already wrapped

  const match = html.match(/^(\s*<!doctype html>)/i);
  if (!match) continue; // unexpected shape — leave it alone

  const doctype = match[1];
  const rest = html.slice(doctype.length);
  await writeFile(file, `${doctype}<html data-pagefind-ignore>${rest}</html>`);
  wrapped++;
}

console.log(`mark-redirects-noindex: wrapped ${wrapped} redirect stub(s)`);
