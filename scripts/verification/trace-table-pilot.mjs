/** Compare every authored TraceTable consumer before and after the wrapping fix. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const [base, out, phase] = process.argv.slice(2);
assert(base && out && ['before', 'after'].includes(phase), 'Expected base, output, phase');
const routes = ['structure/unit-02', 'structure/unit-04', 'from-source-to-silicon/unit-02',
  'from-source-to-silicon/unit-03', 'basics/unit-04', 'working-it-out/unit-02', 'repeating/unit-01'];
const browser = await chromium.launch({channel: 'chrome', headless: true});
const context = await browser.newContext();
const page = await context.newPage();
const report = {status: 'running', phase, browser: browser.version(), cases: [], errors: []};
page.on('pageerror', error => { report.errors.push(String(error)); });
await fs.mkdir(`${out}/tables`, {recursive: true});
try {
  for (const route of routes) {
    for (const width of [1440, 390]) {
      await page.setViewportSize({width, height: 900});
      const response = await page.goto(`${base}/foundations/${route}/`);
      assert(response?.ok(), 'Consumer HTTP failure');
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.allSettled(document.getAnimations().map(animation => animation.finished));
      });
      const tables = page.locator('main .trace');
      assert(await tables.count() > 0, 'Consumer has no trace');
      for (let index = 0; index < await tables.count(); index++) {
        const figure = tables.nth(index);
        await figure.evaluate(element => {
          for (let ancestor = element.parentElement; ancestor; ancestor = ancestor.parentElement) {
            if (ancestor instanceof HTMLDetailsElement) { ancestor.open = true; }
          }
        });
        await figure.scrollIntoViewIfNeeded();
        const geometry = await figure.evaluate(element => {
          const scroller = element.querySelector('.scroll');
          const table = element.querySelector('table');
          return {client: scroller.clientWidth, total: scroller.scrollWidth,
            tableDisplay: getComputedStyle(table).display,
            wrap: getComputedStyle(table.querySelector("td")).overflowWrap,
            cells: Array.from(table.querySelectorAll('th, td'), cell => cell.textContent)};
        });
        assert(geometry.client > 0 && geometry.total > 0, 'Trace not visible');
        const record = {route, width, index, geometry};
        if (phase === 'after') {
          assert.equal(geometry.tableDisplay, 'table', 'Trace sizing overridden');
          assert.equal(geometry.wrap, 'normal', 'Arbitrary word breaks remain');
          const scroller = figure.locator('.scroll');
          await scroller.focus();
          await expectFocus(scroller);
          await page.keyboard.press('End');
          for (let attempt = 0; attempt < 40; attempt++) { await page.keyboard.press('ArrowRight'); }
          await page.waitForTimeout(200);
          const position = await scroller.evaluate(element => ({left: element.scrollLeft,
            lastRight: element.querySelector('tr:last-child td:last-child').getBoundingClientRect().right,
            right: element.getBoundingClientRect().right}));
          if (geometry.total > geometry.client + 1) {
            assert(position.left > 0 && position.lastRight <= position.right + 2, 'Keyboard did not reach the last trace column');
            await scroller.evaluate(element => { element.scrollLeft = element.scrollWidth; });
          }
          record.keyboard = position;
        }
        if (phase === 'after' && width === 390 && route === 'from-source-to-silicon/unit-02') {
          const scroller = figure.locator('.scroll');
          const first = figure.locator('tbody td').first();
          const original = await first.textContent();
          await first.evaluate(element => { element.textContent = '1234567890'.repeat(8); });
          await scroller.focus();
          for (let attempt = 0; attempt < 40; attempt++) { await page.keyboard.press('ArrowRight'); }
          await page.waitForTimeout(200);
          const synthetic = await scroller.evaluate(element => ({client: element.clientWidth, total: element.scrollWidth,
            left: element.scrollLeft, lastRight: element.querySelector('tr:last-child td:last-child').getBoundingClientRect().right,
            right: element.getBoundingClientRect().right}));
          assert(synthetic.total > synthetic.client && synthetic.left > 0 && synthetic.lastRight <= synthetic.right + 2, 'Synthetic overflow keyboard control failed');
          report.syntheticOverflow = {scope: 'Temporary 80-digit cell, not authored content or a learner outcome', ...synthetic};
          await first.evaluate((element, value) => { element.textContent = value; }, original);
          await scroller.evaluate(element => { element.scrollLeft = 0; });
        }
        await figure.scrollIntoViewIfNeeded();
        await page.screenshot({path: `${out}/tables/${phase}-${route.replaceAll('/', '-')}-${width}-${index}.png`});
        report.cases.push(record);
      }
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Document overflow');
      if (phase === 'after') {
        const scan = await new AxeBuilder({page}).include('main .trace').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
        assert.equal(scan.violations.length, 0, 'Trace axe violation');
        report.cases.at(-1).axe = {violations: scan.violations,
          incomplete: scan.incomplete.map(item => ({id: item.id, targets: item.nodes.map(node => node.target)}))};
      }
    }
  }
  assert(report.cases.length === 14 && report.errors.length === 0, 'Missing cases or page errors');
  if (phase === 'after') { assert(report.syntheticOverflow, 'Synthetic overflow control missing'); }
  report.status = 'passed';
  console.log(`PASS ${phase}: ${report.cases.length} table/viewport cases`);
} catch (error) {
  report.status = 'failed';
  report.failure = String(error);
  throw error;
} finally {
  await fs.writeFile(`${out}/tables-${phase}.json`, JSON.stringify(report, null, 2) + '\n');
  await browser.close();
}
async function expectFocus(locator) {
  assert(await locator.evaluate(element => element === document.activeElement), 'Trace wrapper not keyboard focusable');
}
