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
    const response = await page.goto(`${base}/patterns/commodore-64/assembly/physics/sprite-movement-bounds/`);
    assert.equal(response.status(), 200);
    const prose = page.locator('.pattern-prose');
    const text = await prose.innerText();
    assert(text.includes('Code status: assembled and emulator-executed.'));
    assert(text.includes('6,144') && text.includes('48 captures'));
    const blocks = await prose.locator('pre').allTextContents();
    assert(blocks.some(s => s.includes('read_joystick2:') && s.includes('sta $dc02')));
    assert(blocks.some(s => s.includes('move_sprite:') && s.includes('clamp_right:')));
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.deepEqual(errors, []);
    const screenshot = `/private/tmp/198x-movement-${name}.png`;
    await page.screenshot({path: screenshot, fullPage: true});
    rows.push({name, status: response.status(), code_blocks: blocks.length, errors, screenshot});
    await context.close();
  }
  console.log(JSON.stringify(rows, null, 2));
} finally {
  await browser.close();
}
