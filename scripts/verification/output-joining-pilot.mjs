/** Check literal output, space repair and optional Spectrum transfer. */
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
const route = '/foundations/basics/unit-03/';
const targetRoute = '/systems/sinclair-zx-spectrum/basic/meet-basic/unit-03-ask-and-use-the-answer/';
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
    assert(!text.includes('`'), 'Literal Markdown backticks');
    assert(text.includes('teaching notation') && text.includes('semicolon')
      && text.includes('print zone') && text.includes('not our SHOW comma'), 'Local recall/transfer missing');
    const outputs = await page.locator('.program-output-text').allTextContents();
    assert.deepEqual(outputs, ['2 + 2\n4', 'Two plus two is 4'], 'Rendered output changed');
    const dimensions = await page.evaluate(() => ({viewport: innerWidth, document: document.documentElement.scrollWidth}));
    assert(dimensions.document <= dimensions.viewport, 'Document overflow');
    const record = {width, height: 900, http: response.status(), dimensions, outputs,
      responseSha256: createHash('sha256').update(await response.body()).digest('hex'), closed: await scan()};
    report.viewports.push(record);
    const questions = page.locator('main .question');
    assert.equal(await questions.count(), 2, 'Expected two independent predictions');
    for (let index = 0; index < 2; index++) {
      const question = questions.nth(index);
      const disclosure = question.locator('details');
      assert.equal(await disclosure.getAttribute('open'), null, 'Answer initially open');
      await question.locator('summary').focus();
      await page.keyboard.press('Enter');
      assert.notEqual(await disclosure.getAttribute('open'), null, 'Keyboard reveal failed');
      const answer = await question.locator('.question-answer').innerText();
      const required = index === 0 ? ['3 + 4', '7', 'quotes themselves'] : ['Score:5', 'Score: ', 'outside the quotes'];
      assert(required.every(fragment => answer.includes(fragment)), 'Answer reasoning missing');
      await question.scrollIntoViewIfNeeded();
      await page.screenshot({path: `${out}/answer-${index}-${width}.png`});
      report.checks.push({width, check: 'keyboard prediction and explanation', index, answer});
    }
    record.revealed = await scan();
    const link = page.locator(`main a[href="${targetRoute}"]`);
    assert.equal(await link.count(), 1, 'Transfer link missing or duplicated');
    await link.focus();
    await page.keyboard.press('Enter');
    await page.waitForURL(base + targetRoute);
    await settled();
    const target = await page.locator('main').innerText();
    assert(target.includes('Give the words somewhere to go') && target.includes('semicolon')
      && target.includes('spaces'), 'Target explanation missing');
    await page.goBack();
    await page.waitForURL(base + route);
    await settled();
    report.checks.push({width, check: 'optional story explanation and Back', targetRoute});
    await page.screenshot({path: `${out}/lesson-${width}.png`, fullPage: true});
  }
  assert.equal(report.viewports.length, 2, 'Missing viewport');
  assert.equal(report.checks.length, 6, 'Missing behaviour checks');
  assert.deepEqual(report.errors, [], 'Page errors');
  report.status = 'passed';
  console.log('PASS two viewports, exact output, four keyboard reveals and two link/Back routes');
} catch (error) {
  report.status = 'failed';
  report.failure = String(error);
  throw error;
} finally {
  await fs.writeFile(`${out}/browser.json`, JSON.stringify(report, null, 2) + '\n');
  await browser.close();
}
