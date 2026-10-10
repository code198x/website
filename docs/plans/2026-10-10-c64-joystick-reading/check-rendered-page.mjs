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
    const response = await page.goto(`${base}/patterns/commodore-64/assembly/input/joystick-reading/`);
    assert.equal(response.status(), 200);
    const prose = page.locator('.pattern-prose');
    const text = await prose.innerText();
    assert(text.includes('Code status: assembled and emulator-executed.'));
    assert(text.includes('412 state/display checks') && text.includes('48 native captures'));
    assert(text.includes('remaining Emu198x discrepancy'));
    const blocks = await prose.locator('pre').allTextContents();
    assert(blocks.some(s => s.includes('read_inputs:') && s.includes('jsr joy_poll')));
    assert(blocks.some(s => s.includes('joy_poll:') && s.includes('and #$1f')));
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.deepEqual(errors, []);
    const screenshot = `/private/tmp/198x-joystick-${name}.png`;
    await page.screenshot({path: screenshot, fullPage: true});
    rows.push({name, status: response.status(), code_blocks: blocks.length, errors, screenshot});
    await context.close();
  }
  console.log(JSON.stringify(rows, null, 2));
} finally {
  await browser.close();
}
