/** Regenerate the bounded classroom pilot from its public, editable HTML sources.
 * Start the website preview, then run: node scripts/build-first-workbook.mjs --base-url http://127.0.0.1:4466
 * Uses the existing Playwright dependency. Inspect rendered PDFs before publishing.
 */
import { chromium } from '@playwright/test';
import { mkdir, mkdtemp, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import os from 'node:os';
const args = process.argv.slice(2);
if (args.length !== 2 || args[0] !== '--base-url') throw new Error('Usage: node scripts/build-first-workbook.mjs --base-url http://127.0.0.1:4466');
const base = new URL(args[1]);
if (!['http:', 'https:'].includes(base.protocol)) throw new Error('Base URL must use HTTP or HTTPS');
const relative = 'workbooks/spectrum-basic-first-session';
const output = path.resolve('public', relative);
await mkdir(output, { recursive: true });
const { version } = JSON.parse(await readFile(path.join(output, 'sources.json'), 'utf8'));
if (typeof version !== 'string' || !version.trim()) throw new Error('sources.json needs a workbook version');
const staged = await mkdtemp(path.join(os.tmpdir(), 'code198x-workbook-'));
let browser;
const files = [];
try {
  browser = await chromium.launch();
  for (const edition of ['learner', 'teacher']) {
    const page = await browser.newPage();
    const response = await page.goto(new URL(`/try/workbook/${edition}/`, base).href);
    if (!response?.ok()) throw new Error(`Could not load ${edition} source`);
    await page.evaluate(async () => { await Promise.all([document.fonts.load('11pt Nebula'), document.fonts.load('12pt JetBrains')]); await document.fonts.ready; });
    if (!(await page.evaluate(() => document.fonts.check('12px Nebula') && document.fonts.check('12px JetBrains')))) throw new Error('Workbook fonts did not load');
    await page.evaluate(() => { for (const link of document.querySelectorAll('a[href]')) { const target = new URL(link.getAttribute('href'), location.href); if (target.origin === location.origin) { target.protocol = 'https:'; target.host = 'code198x.com'; target.port = ''; link.href = target.href; } } });
    await page.emulateMedia({ media: 'print' });
    const dimensions = await page.locator('.sheet').evaluateAll(sheets => sheets.map(sheet => ({height: sheet.clientHeight, content: sheet.scrollHeight})));
    if (!dimensions.length) throw new Error(`${edition}: no authored workbook pages found`);
    if (dimensions.some(sheet => sheet.content > sheet.height + 1)) throw new Error(`${edition}: content overflows an authored A4 page`);
    const file = `${edition}.pdf`;
    await page.pdf({ path: path.join(staged, file), preferCSSPageSize: true, printBackground: true, tagged: true, outline: true });
    const data = await readFile(path.join(staged, file));
    files.push({ edition, file, bytes: data.length, sha256: createHash('sha256').update(data).digest('hex'), authoredPages: dimensions.length });
    await page.close();
  }
  await writeFile(path.join(staged, 'pdf-manifest.json'), JSON.stringify({version, files}, null, 2) + '\n');
  // Nothing replaces the last good pack until both editions have rendered.
  for (const file of [...files.map(item => item.file), 'pdf-manifest.json']) {
    await writeFile(path.join(output, `${file}.new`), await readFile(path.join(staged, file)));
  }
  for (const file of [...files.map(item => item.file), 'pdf-manifest.json']) {
    await rename(path.join(output, `${file}.new`), path.join(output, file));
  }
  console.log(files);
} finally {
  await browser?.close();
  await rm(staged, { recursive: true, force: true });
  for (const file of ['learner.pdf', 'teacher.pdf', 'pdf-manifest.json']) {
    await rm(path.join(output, `${file}.new`), { force: true });
  }
}
