import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {test, expect} from '@playwright/test';

const sourceHead = '0741a4de4b7ba8d263032a2ff98283282f4a4a63';
const entries = [
 {topic: 'object-pool', title: 'Reuse object slots in Ace FORTH', files: ['caller', 'storage', 'routines', 'settings', 'customise', 'demo', 'mistakes/omit-release'], facts: ['819 dictionary bytes', '41 bytes', '274 occupancy masks', 'stale-handle checks']},
 {topic: 'game-flow', title: 'Pause and restart an Ace FORTH session', files: ['caller', 'routines', 'reset', 'settings', 'customise', 'demo', 'mistakes/reset-on-resume'], facts: ['763 dictionary bytes', '366 input-syntax cases', 'Loss wins over Pause', 'Restart wins over Start', 'old state was Play', 'final score alone hides the fault']},
];

for (const mode of ['', ' @built']) for (const entry of entries) {
 test(`Ace ${entry.topic} publishes maintained source and native captures${mode}`, async ({page, context}, info) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const route = `/patterns/jupiter-ace/forth/framework/${entry.topic}/`;
  const root = process.env.CODE_SAMPLES_PATH || '../code-samples';
  const folder = `jupiter-ace/patterns/forth/framework/${entry.topic}`;
  await page.goto(route);
  await expect(page.locator('h1')).toHaveText(entry.title);
  await expect(page.locator('.code-error')).toHaveCount(0);
  const prose = page.locator('.pattern-prose');
  for (const fact of entry.facts) await expect(prose).toContainText(fact);
  const listings = prose.locator('.lesson-listing');
  const code = await listings.evaluateAll(nodes => nodes.map(node => node.getAttribute('data-code')));
  expect(code).toHaveLength(entry.files.length);
  for (const file of entry.files) expect(code, file).toContain(readFileSync(path.join(root, folder, `${file}.fth`), 'utf8'));
  await listings.first().locator('.ll-copy').click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(code[0]);
  for (const variant of ['working', 'wrong']) {
   const url = `/images/patterns/jupiter-ace/forth-${entry.topic}-${variant}.png`;
   const image = prose.locator(`img[src="${url}"]`);
   await image.scrollIntoViewIfNeeded();
   await expect.poll(() => image.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth === 320 && node.naturalHeight === 288)).toBe(true);
   const response = await page.request.get(url);
   expect(response.status()).toBe(200);
   expect(createHash('sha256').update(await response.body()).digest('hex')).toBe(createHash('sha256').update(readFileSync(path.join(root, folder, `verification/published-${variant}.png`))).digest('hex'));
  }
  const sourceLinks = await prose.locator('a[href*="github.com/code198x/code-samples/"]').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')!));
  expect(sourceLinks.length).toBeGreaterThan(0);
  for (const link of sourceLinks) expect(link).toContain(`/tree/${sourceHead}/`);
  for (const link of await prose.locator('a[href^="/"]').evaluateAll(nodes => [...new Set(nodes.map(node => node.getAttribute('href')!))])) expect((await page.request.get(link)).status(), link).toBe(200);
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({path: info.outputPath(`ace-${entry.topic}-opening.png`)});
  await page.setViewportSize({width: 320, height: 900});
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  const scroll = listings.first().locator('[data-ll-scroll]');
  await scroll.scrollIntoViewIfNeeded();
  await expect(scroll).toHaveAttribute('tabindex', '0');
  await scroll.focus();
  await scroll.press('Home');
  await expect.poll(() => scroll.evaluate(node => node.scrollLeft)).toBe(0);
  await scroll.press('ArrowRight');
  await expect.poll(() => scroll.evaluate(node => node.scrollLeft)).toBeGreaterThan(0);
  await scroll.press('Home');
  await expect.poll(() => scroll.evaluate(node => node.scrollLeft)).toBe(0);
  await page.screenshot({path: info.outputPath(`ace-${entry.topic}-narrow-listing.png`)});
  await page.goto('/patterns/platform/jupiter-ace/');
  await page.getByLabel('Search patterns', {exact: true}).fill(entry.title);
  await expect(page.locator(`[data-pattern]:visible a[href="${route}"]`)).toHaveCount(1);
 });
}
