/** Resolve the one clipped listing line's reported colour-contrast uncertainty. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium} from '@playwright/test';
const [base, out] = process.argv.slice(2);
assert(base && out, 'Expected base and evidence directory');
const observed = JSON.parse(await fs.readFile(`${out}/browser.json`, 'utf8'));
const narrow = observed.viewports.find(view => view.width === 390);
assert(narrow && narrow.closed.incomplete.length === 1 && narrow.closed.incomplete[0].id === 'color-contrast', 'Expected one declared contrast uncertainty');
const nodes = narrow.closed.incomplete[0].nodes;
assert.equal(nodes.length, 1, 'Expected one clipped listing line');
const browser = await chromium.launch({channel: 'chrome', headless: true});
const samples = [];
function luminance(colour) {
  const parts = colour.match(/[\d.]+/g).map(Number);
  assert.equal(parts.length, 3, 'Expected opaque RGB colour');
  const linear = parts.map(value => value / 255).map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}
try {
  const context = await browser.newContext({viewport: {width: 390, height: 900}});
  const page = await context.newPage();
  const response = await page.goto(base + '/foundations/working-the-bits/unit-05/');
  assert(response?.ok(), 'Lesson HTTP failure');
  await page.evaluate(async () => { await document.fonts.ready; });
  const selector = nodes[0].target;
  assert.equal(selector.length, 1, 'Expected plain selector');
  const line = page.locator(selector[0]);
  assert.equal(await line.count(), 1, 'Affected line missing or ambiguous');
  await line.scrollIntoViewIfNeeded();
  for (const endpoint of ['left', 'right']) {
    const sample = await line.evaluate((element, endpoint) => {
      const scroller = element.closest('[data-ll-scroll]');
      if (!scroller) { throw Error('Listing scroller missing'); }
      scroller.scrollLeft = endpoint === 'left' ? 0 : scroller.scrollWidth;
      let parent = element;
      let background = 'rgba(0, 0, 0, 0)';
      while (parent && background === 'rgba(0, 0, 0, 0)') { background = getComputedStyle(parent).backgroundColor; parent = parent.parentElement; }
      return {text: element.textContent, foreground: getComputedStyle(element).color, background,
        scrollLeft: scroller.scrollLeft, client: scroller.clientWidth, total: scroller.scrollWidth};
    }, endpoint);
    const foreground = luminance(sample.foreground);
    const background = luminance(sample.background);
    const ratio = (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
    assert(ratio >= 4.5, 'Rendered code text contrast below 4.5:1');
    samples.push({selector: selector[0], endpoint, ...sample, ratio});
    await page.screenshot({path: `${out}/listing-${endpoint}-390.png`});
  }
  assert(samples.length === 2 && samples[1].scrollLeft > samples[0].scrollLeft, 'Both scroll endpoints not observed');
  await fs.writeFile(`${out}/contrast.json`, JSON.stringify({status: 'passed bounded colour probe', samples,
    limits: 'One axe-incomplete listing line at both horizontal endpoints; not blanket accessibility or screen-reader validation.'}, null, 2) + '\n');
  console.log('PASS clipped listing colour at both scroll endpoints');
} finally {
  await browser.close();
}
