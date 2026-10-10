import { chromium, devices } from 'playwright';
import { strict as assert } from 'node:assert';
const base = process.env.PATTERN_BASE_URL ?? 'http://localhost:4408';
const browser = await chromium.launch();
const rows = [];
try {
  for (const [name, options] of [['desktop', {viewport: {width: 1440, height: 900}}], ['mobile', devices['Pixel 7']]]) {
    const context = await browser.newContext(options);
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(`${base}/patterns/commodore-64/assembly/rendering/raster-splits/`);
    assert.equal(response.status(), 200);
    const prose = page.locator('.pattern-prose');
    const text = await prose.innerText();
    assert(text.includes('Code status: assembled and emulator-executed.'));
    assert(text.includes('81 assembled bytes') && text.includes('48 captures'));
    assert(text.includes('emit a fresh frame'));
    const blocks = await prose.locator('pre').allTextContents();
    assert(blocks.some(s => s.includes('picture_ready:') && s.includes('jsr split_init')));
    assert(blocks.some(s => s.includes('raster_irq:') && s.includes('jmp $EA81')));
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.deepEqual(errors, []);
    const screenshot = `/private/tmp/198x-raster-${name}.png`;
    await page.screenshot({path: screenshot, fullPage: true});
    rows.push({name, status: response.status(), code_blocks: blocks.length, errors, screenshot});
    await context.close();
  }
  console.log(JSON.stringify(rows, null, 2));
} finally {
  await browser.close();
}
