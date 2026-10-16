/** Check the fixed-point paper task against accepted exact model values. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const [base, out, modelsPath] = process.argv.slice(2);
assert(base && out && modelsPath, 'Expected base, output and accepted model file');
const modelsBytes = await fs.readFile(modelsPath);
const models = JSON.parse(modelsBytes);
const half = models.cases.find(item => item.label === 'half-step');
assert(half && half.rows.length === 4, 'Accepted half-step model missing');
const expectedRows = half.rows.map(row => [String(row.update), String(row.updated), String(row.updated / 256), String(row.drawn)]);
await fs.mkdir(out, {recursive: true});
const browser = await chromium.launch({channel: 'chrome', headless: true});
const context = await browser.newContext();
const page = await context.newPage();
const route = '/foundations/working-the-bits/unit-05/';
const report = {status: 'running', date: new Date().toISOString(), browser: browser.version(),
  acceptedModelsSha256: createHash('sha256').update(modelsBytes).digest('hex'), viewports: [], checks: [], errors: []};
page.on('pageerror', error => { report.errors.push(String(error)); });
async function settled() {
  await page.locator('h1').waitFor();
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.allSettled(document.getAnimations().map(animation => animation.finished));
  });
}
async function scan() {
  const result = await new AxeBuilder({page}).include('main').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  assert.equal(result.violations.length, 0, 'Scoped axe violations');
  return {violations: result.violations, incomplete: result.incomplete.map(item => ({id: item.id,
    nodes: item.nodes.map(node => ({target: node.target, summary: node.failureSummary}))}))};
}
async function reveal(locator) {
  assert.equal(await locator.getAttribute('open'), null, 'Disclosure initially open');
  await locator.locator('summary').focus();
  await page.keyboard.press('Enter');
  assert.notEqual(await locator.getAttribute('open'), null, 'Keyboard disclosure failed');
}
try {
  for (const width of [1440, 390]) {
    await page.setViewportSize({width, height: 900});
    const response = await page.goto(base + route);
    assert(response?.ok(), 'Lesson HTTP failure');
    await settled();
    const text = await page.locator('main').innerText();
    assert(!text.includes('`'), 'Literal Markdown backtick');
    assert(text.includes('Try this on paper') && text.includes('teaching notation') && text.includes('not elapsed time'), 'Task boundary missing');
    const outputs = await page.locator('.program-output-text').allTextContents();
    assert.deepEqual(outputs, ['1.5', '512'], 'Original outputs changed');
    const questions = page.locator('main .question');
    assert.equal(await questions.count(), 1, 'Expected one new prediction');
    const question = questions.first();
    const answer = question.locator('details');
    const hint = page.locator('#fixed-point-hint');
    await reveal(hint);
    assert.equal(await answer.getAttribute('open'), null, 'Hint revealed the answer');
    assert((await hint.innerText()).includes('next update read'), 'Hint reasoning missing');
    report.checks.push({width, check: 'independent keyboard hint'});
    await hint.scrollIntoViewIfNeeded();
    await page.screenshot({path: `${out}/hint-${width}.png`});
    const record = {width, height: 900, http: response.status(), outputs,
      responseSha256: createHash('sha256').update(await response.body()).digest('hex'), closed: await scan()};
    report.viewports.push(record);
    await reveal(answer);
    const table = question.locator('table');
    const rows = await table.locator('tbody tr').evaluateAll(items => items.map(row => Array.from(row.cells, cell => cell.textContent.trim())));
    assert.deepEqual(rows, expectedRows, 'Rendered state/full/drawn values differ from accepted model');
    const reasoning = await question.locator('.question-answer').innerText();
    assert(['0, 1, 1, 2', '0, 0, 0, 0', 'update 1', 'update 2', 'Remove the added assignment'].every(item => reasoning.includes(item)), 'Divergence or repair reasoning missing');
    const numericLines = await table.locator('td').evaluateAll(cells => cells.map(cell => {
      const range = document.createRange();
      range.selectNodeContents(cell);
      return {text: cell.textContent, lines: range.getClientRects().length};
    }));
    assert(numericLines.length === 16 && numericLines.every(cell => cell.lines === 1), 'Numeric table cells wrap');
    record.headerWrap = await table.locator('th').first().evaluate(element => getComputedStyle(element).overflowWrap);
    assert.equal(record.headerWrap, 'normal', 'Header words can break arbitrarily');
    record.rows = rows;
    record.numericLines = numericLines;
    report.checks.push({width, check: 'keyboard prediction, exact model table and repair'});
    await table.scrollIntoViewIfNeeded();
    await page.screenshot({path: `${out}/table-${width}.png`});
    await question.locator('.question-answer p').last().scrollIntoViewIfNeeded();
    await page.screenshot({path: `${out}/reasoning-${width}.png`});
    const quarter = page.locator('#quarter-step');
    await reveal(quarter);
    const variation = await quarter.innerText();
    assert(['64, 128, 192 and 256', '0.25, 0.5, 0.75', '0, 0, 0, 1'].every(item => variation.includes(item)), 'Quarter-step explanation missing');
    report.checks.push({width, check: 'keyboard quarter-step variation'});
    await quarter.scrollIntoViewIfNeeded();
    await page.screenshot({path: `${out}/quarter-${width}.png`});
    record.revealed = await scan();
    record.dimensions = await page.evaluate(() => ({viewport: innerWidth, document: document.documentElement.scrollWidth}));
    assert(record.dimensions.document <= width, 'Document overflow');
    for (const [targetRoute, title, fragment] of [
      ['/foundations/repeating/unit-01/', 'Doing It Again', 'whole numbers'],
      ['/systems/sinclair-zx-spectrum/basic/meet-basic/unit-07-choose-a-new-secret/', 'Choose a new secret', 'INT']
    ]) {
      const link = page.locator(`main a[href="${targetRoute}"]`);
      assert.equal(await link.count(), 1, 'Support link missing or duplicated');
      await link.focus();
      await page.keyboard.press('Enter');
      await page.waitForURL(base + targetRoute);
      await settled();
      assert((await page.locator('h1').innerText()).includes(title) && (await page.locator('main').innerText()).includes(fragment), 'Target context missing');
      await page.goBack();
      await page.waitForURL(base + route);
      await settled();
      report.checks.push({width, check: 'keyboard support link and Back', targetRoute});
    }
  }
  assert.equal(report.viewports.length, 2, 'Missing viewport');
  assert.equal(report.checks.length, 10, 'Missing behaviour groups');
  assert.deepEqual(report.errors, [], 'Page errors');
  report.status = 'passed';
  console.log('PASS two widths, accepted-model table, six keyboard reveals and four support routes');
} catch (error) {
  report.status = 'failed';
  report.failure = String(error);
  throw error;
} finally {
  await fs.writeFile(`${out}/browser.json`, JSON.stringify(report, null, 2) + '\n');
  await browser.close();
}
