/** Observe the compound-condition lesson's boundaries, keyboard answers and support route. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const [base, out, phase = 'baseline'] = process.argv.slice(2);
assert(base && out && ['baseline', 'after'].includes(phase), 'Expected base, output, baseline/after');
await fs.mkdir(out, {recursive: true});
const browser = await chromium.launch({channel: 'chrome', headless: true});
const context = await browser.newContext();
const page = await context.newPage();
page.setDefaultTimeout(20000);
const report = {status: 'running', date: new Date().toISOString(), base, phase,
  browser: browser.version(), viewports: [], checks: [], errors: []};
page.on('pageerror', error => { report.errors.push(String(error)); });

function qualifiedCopy(text) {
  assert(text.includes('ordinary numeric value'), 'Numeric input contract missing');
  assert(text.includes('1.5') && text.includes('whole-number'), 'Interval/whole-number distinction missing');
  assert(text.includes('0.5') && text.includes('greater than zero'), 'Fractional lower-bound contrast missing');
  assert(text.includes('Boolean notation'), 'Notation/target boundary missing');
}

try {
  for (const width of [1440, 390]) {
    const route = '/foundations/decisions/unit-04/';
    await page.setViewportSize({width, height: 900});
    const response = await page.goto(base + route);
    assert(response?.ok(), 'Lesson did not return HTTP success');
    await page.locator('h1').waitFor();
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.allSettled(document.getAnimations().map(animation => animation.finished));
    });
    const body = await response.body();
    const text = await page.locator('main').innerText();
    if (phase === 'after') { assert(!text.includes('`'), 'Literal Markdown backtick in lesson'); }
    const dimensions = await page.evaluate(() => ({viewport: innerWidth,
      document: document.documentElement.scrollWidth}));
    assert(dimensions.document <= dimensions.viewport, 'Document overflow');
    const scan = await new AxeBuilder({page}).include('main')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    report.viewports.push({width, height: 900, http: response.status(), dimensions,
      responseSha256: createHash('sha256').update(body).digest('hex'),
      violations: scan.violations.map(item => ({id: item.id, impact: item.impact})),
      incomplete: scan.incomplete.map(item => ({id: item.id, nodes: item.nodes.map(node => ({target: node.target, summary: node.failureSummary}))})), text});
    assert.equal(scan.violations.length, 0, 'Scoped axe violations');
    let rejected = false;
    try { qualifiedCopy(text); } catch (error) {
      if (phase === 'after') { throw error; }
      rejected = true;
      report.checks.push({width, check: 'baseline rejected by qualified-copy checks', reason: String(error)});
    }
    if (phase === 'after' && width === 390) {
      const samples = [];
      const luminance = colour => {
        const parts = colour.match(/[\d.]+/g).map(Number);
        assert.equal(parts.length, 3, 'Expected opaque RGB');
        const linear = parts.map(value => value / 255).map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
        return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
      };
      for (const item of scan.incomplete.filter(item => item.id === 'color-contrast')) {
        for (const node of item.nodes) {
          assert.equal(node.target.length, 1, 'Expected a plain selector');
          const line = page.locator(node.target[0]);
          assert.equal(await line.count(), 1, 'Incomplete line missing');
          await line.scrollIntoViewIfNeeded();
          for (const endpoint of ['left', 'right']) {
            const sample = await line.evaluate((element, endpoint) => {
              const scroller = element.closest('[data-ll-scroll]');
              if (!scroller) { throw Error('Code scroller missing'); }
              scroller.scrollLeft = endpoint === 'left' ? 0 : scroller.scrollWidth;
              let parent = element;
              let background = 'rgba(0, 0, 0, 0)';
              while (parent && background === 'rgba(0, 0, 0, 0)') { background = getComputedStyle(parent).backgroundColor; parent = parent.parentElement; }
              return {text: element.textContent, foreground: getComputedStyle(element).color, background, scrollLeft: scroller.scrollLeft};
            }, endpoint);
            const foreground = luminance(sample.foreground);
            const background = luminance(sample.background);
            const ratio = (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
            assert(ratio >= 4.5, 'Low rendered code-text contrast');
            samples.push({selector: node.target[0], endpoint, ...sample, ratio});
          }
        }
      }
      assert(samples.length === 8 && samples.some(sample => sample.scrollLeft > 0), 'Expected four incomplete lines and actual horizontal scroll');
      report.contrastProbe = {scope: 'Four axe-incomplete listing lines at both horizontal scroll endpoints; not a general accessibility assessment.', samples};
    }
    if (phase === 'baseline') {
      assert(rejected, 'Baseline unexpectedly meets corrected contract');
    } else {
      const questions = page.locator('main .question');
      assert.equal(await questions.count(), 2, 'Expected interval and grouping predictions');
      for (let index = 0; index < 2; index++) {
        const question = questions.nth(index);
        const disclosure = question.locator('details');
        assert.equal(await disclosure.getAttribute('open'), null, 'Answer initially revealed');
        await question.locator('summary').focus();
        await page.keyboard.press('Enter');
        assert.notEqual(await disclosure.getAttribute('open'), null, 'Keyboard reveal failed');
        const answer = await question.locator('.question-answer').innerText();
        const required = index === 0 ? ['1.5', 'whole', '10'] : ['FALSE', 'TRUE', 'grenades'];
        assert(required.every(fragment => answer.includes(fragment)), 'Explanation missing expected reasoning');
        await page.screenshot({path: `${out}/answer-${index}-${width}.png`});
        report.checks.push({width, check: 'keyboard prediction/answer', index, answer});
      }
      const revealed = await new AxeBuilder({page}).include('main')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      assert.equal(revealed.violations.length, 0, 'Revealed-answer axe violations');
      report.viewports.at(-1).revealedIncomplete = revealed.incomplete.map(item => item.id);
      const support = page.locator('main a[href="/systems/sinclair-zx-spectrum/basic/meet-basic/unit-06-keep-guessing/"]');
      assert.equal(await support.count(), 1, 'Optional target link missing or duplicated');
      await support.focus();
      await page.keyboard.press('Enter');
      await page.waitForURL(base + '/systems/sinclair-zx-spectrum/basic/meet-basic/unit-06-keep-guessing/');
      const target = await page.locator('main').innerText();
      assert(target.includes('Enforce the promised range') && target.includes('INT 6.5')
        && target.includes('not a general text parser'), 'Target context missing');
      await page.goBack();
      await page.waitForURL(base + route);
      report.checks.push({width, check: 'optional whole-number target and Back by keyboard'});
    }
    await page.screenshot({path: `${out}/${phase}-${width}.png`, fullPage: true});
  }
  assert.equal(report.viewports.length, 2, 'Missing viewport');
  assert.equal(report.errors.length, 0, 'Page errors');
  report.status = 'passed';
  console.log(`PASS ${phase}: two viewports, ${report.checks.length} behaviour groups`);
} catch (error) {
  report.status = 'failed';
  report.failure = String(error);
  throw error;
} finally {
  await fs.writeFile(`${out}/browser-${phase}.json`, JSON.stringify(report, null, 2) + '\n');
  await browser.close();
}
