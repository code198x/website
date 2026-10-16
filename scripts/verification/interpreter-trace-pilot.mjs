/** Observe the interpreter lesson's source trace and evidence boundaries. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const [base, out] = process.argv.slice(2);
assert(base && out, 'Expected base and evidence directory');
await fs.mkdir(out, {recursive: true});
const browser = await chromium.launch({channel: 'chrome', headless: true});
const context = await browser.newContext();
const page = await context.newPage();
const route = '/foundations/from-source-to-silicon/unit-02/';
const targetRoute = '/foundations/repeating/unit-01/';
const report = {status: 'running', date: new Date().toISOString(), base,
  browser: browser.version(), viewports: [], checks: [], errors: []};
page.on('pageerror', error => { report.errors.push(String(error)); });
async function settled() {
  await page.locator('h1').waitFor();
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.allSettled(document.getAnimations().map(animation => animation.finished));
  });
}
async function scan() {
  const result = await new AxeBuilder({page}).include('main')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  assert.equal(result.violations.length, 0, 'Scoped axe violations');
  return {violations: result.violations, incomplete: result.incomplete.map(item => ({id: item.id,
    nodes: item.nodes.map(node => ({target: node.target, summary: node.failureSummary}))}))};
}
try {
  for (const width of [1440, 390]) {
    await page.setViewportSize({width, height: 900});
    const response = await page.goto(base + route);
    assert(response?.ok(), 'Lesson HTTP failure');
    await settled();
    const text = await page.locator('main').innerText();
    assert(!text.includes('`'), 'Literal Markdown backtick');
    assert(text.includes('teaching notation') && text.includes('gives a named value')
      && text.includes('not a count of processor instructions'), 'Local recall/evidence boundaries missing');
    assert(!text.includes('costs nothing you would notice'), 'Unmeasured cost claim remains');
    const outputs = await page.locator('.program-output-text').allTextContents();
    assert.deepEqual(outputs, ['1000'], 'Original output changed');
    const table = page.locator('main .trace');
    const cells = await table.locator('tbody tr').evaluateAll(rows => rows.map(row => Array.from(row.cells, cell => cell.textContent)));
    assert.deepEqual(cells, [
      ['1', 'LET total = total + 1', 'put total plus one in total', '0 + 1', '1'],
      ['2', 'LET total = total + 1', 'put total plus one in total', '1 + 1', '2'],
      ['3', 'LET total = total + 1', 'put total plus one in total', '2 + 1', '3'],
      ['…', '…', '…', '…', '…'],
      ['1000', 'LET total = total + 1', 'put total plus one in total', '999 + 1', '1000']
    ], 'Original selected trace changed');
    await table.scrollIntoViewIfNeeded();
    const scroll = await table.locator('.scroll').evaluate(element => {
      element.scrollLeft = element.scrollWidth;
      const numericLines = Array.from(element.querySelectorAll('td')).filter(cell => /^\d+$/.test(cell.textContent)).map(cell => {
        const range = document.createRange();
        range.selectNodeContents(cell);
        return {text: cell.textContent, lines: range.getClientRects().length};
      });
      return {client: element.clientWidth, total: element.scrollWidth, left: element.scrollLeft, numericLines};
    });
    assert(scroll.client > 0 && scroll.numericLines.length === 8 && scroll.numericLines.every(cell => cell.lines === 1), 'Trace numbers split across lines');
    if (scroll.total > scroll.client) { assert(scroll.left > 0, 'Overflowing trace cannot scroll'); }
    await page.screenshot({path: `${out}/trace-right-${width}.png`});
    await table.locator('.scroll').evaluate(element => { element.scrollLeft = 0; });
    const dimensions = await page.evaluate(() => ({viewport: innerWidth, document: document.documentElement.scrollWidth}));
    assert(dimensions.document <= dimensions.viewport, 'Document overflow');
    const record = {width, height: 900, http: response.status(), dimensions, outputs, cells, scroll,
      responseSha256: createHash('sha256').update(await response.body()).digest('hex'), closed: await scan()};
    report.viewports.push(record);
    const questions = page.locator('main .question');
    assert.equal(await questions.count(), 2, 'Expected two independent questions');
    for (let index = 0; index < 2; index++) {
      const question = questions.nth(index);
      const disclosure = question.locator('details');
      assert.equal(await disclosure.getAttribute('open'), null, 'Answer initially open');
      await question.locator('summary').focus();
      await page.keyboard.press('Enter');
      assert.notEqual(await disclosure.getAttribute('open'), null, 'Keyboard reveal failed');
      const answer = await question.locator('.question-answer').innerText();
      const required = index === 0 ? ['13', '11', '12', 'three additions', 'initialise it once'] : ['Neither', 'machine instructions', 'named workload', 'neither count nor timing'];
      assert(required.every(fragment => answer.includes(fragment)), 'Answer reasoning missing');
      await question.scrollIntoViewIfNeeded();
      await page.screenshot({path: `${out}/answer-${index}-${width}.png`});
      report.checks.push({width, check: 'keyboard prediction and explanation', index, answer});
    }
    record.revealed = await scan();
    const link = page.locator(`main a[href="${targetRoute}"]`);
    assert.equal(await link.count(), 1, 'Optional support missing or duplicated');
    await link.focus();
    await page.keyboard.press('Enter');
    await page.waitForURL(base + targetRoute);
    await settled();
    const target = await page.locator('main').innerText();
    assert(target.includes('Doing It Again') && target.includes('whole numbers'), 'Counted-loop support missing');
    await page.goBack();
    await page.waitForURL(base + route);
    await settled();
    report.checks.push({width, check: 'optional counted-loop route and Back', targetRoute});
  }
  assert.equal(report.viewports.length, 2, 'Missing viewport');
  assert.equal(report.checks.length, 6, 'Missing behaviours');
  assert.deepEqual(report.errors, [], 'Page errors');
  report.status = 'passed';
  console.log('PASS exact output/trace, two widths, four keyboard reveals and two support routes');
} catch (error) {
  report.status = 'failed';
  report.failure = String(error);
  throw error;
} finally {
  await fs.writeFile(`${out}/browser.json`, JSON.stringify(report, null, 2) + '\n');
  await browser.close();
}
