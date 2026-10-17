/** Regenerate the bounded classroom pilot from its public, editable HTML sources.
 * Start the website preview, then run: node scripts/build-first-workbook.mjs --base-url http://127.0.0.1:4466
 * Uses the existing Playwright dependency. Inspect rendered PDFs before publishing.
 */
import { chromium } from '@playwright/test';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
const args = process.argv.slice(2);
if (args.length !== 2 || args[0] !== '--base-url') throw new Error('Usage: node scripts/build-first-workbook.mjs --base-url http://127.0.0.1:4466');
const base = new URL(args[1]);
if (!['http:', 'https:'].includes(base.protocol)) throw new Error('Base URL must use HTTP or HTTPS');
const relative = 'workbooks/spectrum-basic-first-session';
const output = path.resolve('public', relative);
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const files = [];
try {
  for (const edition of ['learner', 'teacher']) {
    const page = await browser.newPage();
    const response = await page.goto(new URL(`/try/workbook/${edition}/`, base).href);
    if (!response?.ok()) throw new Error(`Could not load ${edition} source`);
    await page.evaluate(async () => { await Promise.all([document.fonts.load('11pt Nebula'), document.fonts.load('12pt JetBrains')]); await document.fonts.ready; });
    if (!(await page.evaluate(() => document.fonts.check('12px Nebula') && document.fonts.check('12px JetBrains')))) throw new Error('Workbook fonts did not load');
    await page.evaluate(() => { for (const link of document.querySelectorAll('a[href]')) { const target = new URL(link.getAttribute('href'), location.href); if (target.origin === location.origin) { target.protocol = 'https:'; target.host = 'code198x.com'; target.port = ''; link.href = target.href; } } });
    await page.emulateMedia({ media: 'print' });
    const dimensions = await page.locator('.sheet').evaluateAll(sheets => sheets.map(sheet => ({height: sheet.clientHeight, content: sheet.scrollHeight})));
    if (dimensions.some(sheet => sheet.content > sheet.height + 1)) throw new Error(`${edition}: content overflows an authored A4 page`);
    const file = `${edition}.pdf`;
    await page.pdf({ path: path.join(output, file), preferCSSPageSize: true, printBackground: true, tagged: true, outline: true });
    const data = await readFile(path.join(output, file));
    files.push({ edition, file, bytes: data.length, sha256: createHash('sha256').update(data).digest('hex'), authoredPages: dimensions.length });
    await page.close();
  }
} finally { await browser.close(); }
await writeFile(path.join(output, 'pdf-manifest.json'), JSON.stringify({version: '0.1', files}, null, 2) + '\n');
console.log(files);
