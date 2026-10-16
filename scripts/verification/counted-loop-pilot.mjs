/** Inspect the counted-loop lesson, keyboard predictions and optional target route. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const [base, out] = process.argv.slice(2);
assert(base && out, 'Expected base and output directory');
await fs.mkdir(out, {recursive: true});
const browser = await chromium.launch({channel: 'chrome', headless: true});
const context = await browser.newContext();
const page = await context.newPage();
page.setDefaultTimeout(20000);
const report = {status: 'running', date: new Date().toISOString(), base,
  browser: browser.version(), viewports: [], checks: [], errors: []};
page.on('pageerror', error => { report.errors.push(String(error)); });
const settled = async () => {
  await page.locator('h1').waitFor();
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.allSettled(document.getAnimations().map(animation => animation.finished));
  });
};
try {
  for (const width of [1440, 390]) {
    await page.setViewportSize({width, height: 900});
    const route = '/foundations/repeating/unit-01/';
    const response = await page.goto(base + route);
    assert(response?.ok(), 'Lesson HTTP failure');
    await settled();
    const text = await page.locator('main').innerText();
    assert(text.includes('whole numbers') && text.includes('counter increases by one'), 'Counted range contract missing');
    assert(text.includes('endpoints and counter unchanged'), 'Mutation boundary missing');
    assert(text.includes('same SHOW line'), 'Repeated line description differs');
    assert(!text.includes('`'), 'Literal Markdown backtick remains');
    const dimensions = await page.evaluate(() => ({viewport: innerWidth, document: document.documentElement.scrollWidth}));
    assert(dimensions.document <= dimensions.viewport, 'Document overflow');
    const scan = await new AxeBuilder({page}).include('main')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    assert.equal(scan.violations.length, 0, 'Scoped axe violation');
    report.viewports.push({width, height: 900, http: response.status(), dimensions,
      responseSha256: createHash('sha256').update(await response.body()).digest('hex'),
      text, violations: scan.violations.map(item => item.id), incomplete: scan.incomplete.map(item => item.id)});
    const questions = page.locator('main .question');
    assert.equal(await questions.count(), 2, 'Expected boundary and body-placement predictions');
    for (let index = 0; index < 2; index++) {
      const question = questions.nth(index);
      const details = question.locator('details');
      assert.equal(await details.getAttribute('open'), null, 'Answer initially open');
      await question.locator('summary').focus();
      await page.keyboard.press('Enter');
      assert.notEqual(await details.getAttribute('open'), null, 'Keyboard answer failed');
      const answer = await question.locator('.question-answer').innerText();
      const expected = index === 0 ? ['none', 'once', 'four visits', 'gaps'] : ['three times', 'zero times', 'once', 'Outside'];
      assert(expected.every(fragment => answer.includes(fragment)), 'Answer reasoning missing');
      await page.screenshot({path: `${out}/answer-${index}-${width}.png`});
      report.checks.push({width, check: 'prediction and keyboard answer', index, answer});
    }
    const revealed = await new AxeBuilder({page}).include('main')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    assert.equal(revealed.violations.length, 0, 'Revealed-answer violation');
    report.viewports.at(-1).revealedIncomplete = revealed.incomplete.map(item => item.id);
    const target = '/systems/sinclair-zx-spectrum/basic/meet-basic/unit-10-give-the-answer-a-rhythm/';
    const link = page.locator(`main a[href="${target}"]`);
    assert.equal(await link.count(), 1, 'Optional target link missing/duplicated');
    await link.focus();
    await page.keyboard.press('Enter');
    await page.waitForURL(base + target);
    await settled();
    const targetText = await page.locator('main').innerText();
    assert(targetText.includes('Describe the repetition once') && targetText.includes('NEXT i')
      && targetText.includes('after the loop'), 'Target local context missing');
    await page.goBack();
    await page.waitForURL(base + route);
    await settled();
    report.checks.push({width, check: 'optional BASIC loop/after-loop explanation and Back'});
  }
  assert.equal(report.viewports.length, 2, 'Missing viewport');
  assert.equal(report.checks.length, 6, 'Missing behaviour checks');
  assert.equal(report.errors.length, 0, 'Page errors');
  report.status = 'passed';
  console.log('PASS two viewports, six keyboard behaviour groups');
} catch (error) {
  report.status = 'failed';
  report.failure = String(error);
  throw error;
} finally {
  await fs.writeFile(`${out}/browser-counted.json`, JSON.stringify(report, null, 2) + '\n');
  await browser.close();
}
