/** Check the maintained pattern's browser execution, delivered audio and downloads. */
import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const [base = 'http://127.0.0.1:1986', out = '/tmp/sound-beep-browser'] = process.argv.slice(2);
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
const errors = [];
page.on('pageerror', error => errors.push(String(error)));
const assert = (value, message) => { if (!value) throw Error(message); };
await page.addInitScript(() => {
  window.beepSamples = []; window.beepDone = false;
  const post = MessagePort.prototype.postMessage;
  MessagePort.prototype.postMessage = function (data, ...rest) {
    if (data instanceof Float32Array) window.beepSamples.push(Array.from(data).filter((_, i) => i % 2 === 0));
    return post.call(this, data, ...rest);
  };
  const Original = window.AudioContext;
  window.AudioContext = class extends Original {
    constructor(...args) { super(...args); window.beepContext = this; }
  };
  document.addEventListener('sandbox:memory', event => { window.beepDone = event.detail.named.done === 1; });
});
try {
  await page.goto(base + '/patterns/sinclair-zx-spectrum/assembly/audio/sound-beep/');
  const root = page.locator('.sandbox');
  await page.waitForFunction(() => document.querySelector('.sandbox')?.dataset.sandboxReady === 'true');
  await root.scrollIntoViewIfNeeded();
  const original = await root.locator('.sandbox-source').inputValue();
  assert(await root.locator('.sandbox-companion').count() === 2, 'Both maintained includes must be editable');
  await root.getByRole('checkbox', { name: 'Sound' }).check();
  await root.locator('.sandbox-run').click();
  await page.waitForFunction(() => window.beepDone, {}, { timeout: 30000 });
  const capture = await page.evaluate(() => ({ samples: window.beepSamples.flat(), rate: window.beepContext.sampleRate }));
  const high = capture.samples.reduce((a, b) => Math.max(a, b), -Infinity);
  const low = capture.samples.reduce((a, b) => Math.min(a, b), Infinity);
  assert(high - low > 0.5, 'Delivered audio is silent');
  const midpoint = (high + low) / 2, edges = [];
  for (let i = 1; i < capture.samples.length; i++) {
    if (capture.samples[i - 1] < midpoint && capture.samples[i] >= midpoint) edges.push(i);
  }
  const groups = [[]];
  for (const edge of edges) {
    if (groups.at(-1).length && edge - groups.at(-1).at(-1) > capture.rate * 0.02) groups.push([]);
    groups.at(-1).push(edge);
  }
  const tones = groups.filter(group => group.length > 5).map(group => ({
    cycles: group.length,
    hz: (group.length - 1) * capture.rate / (group.at(-1) - group[0]),
  }));
  assert(tones.length === 4, `Expected four separated sounds: ${JSON.stringify(tones)}`);
  assert(Math.abs(tones[0].hz - 524) < 15 && Math.abs(tones[3].hz - 1044) < 30, 'Fixed tone/click pitch differs');
  for (const [index, cycles] of [105, 128, 128, 12].entries()) assert(Math.abs(tones[index].cycles - cycles) <= 2, 'Unexpected tone cycle count');
  for (const [selector, filename, expected] of [
    ['.sandbox-download-source', 'demo.asm', original],
    ...await root.locator('.sandbox-companion').evaluateAll(editors => editors.map(editor => [
      `[data-download-companion="${editor.dataset.filename}"]`, editor.dataset.filename, editor.value,
    ])),
  ]) {
    const promise = page.waitForEvent('download'); await root.locator(selector).click();
    await (await promise).saveAs(out + '/' + filename);
    assert(await fs.readFile(out + '/' + filename, 'utf8') === expected, 'Download differs from editor');
  }
  const tapePromise = page.waitForEvent('download'); await root.locator('.sandbox-download-tape').click();
  await (await tapePromise).saveAs(out + '/demo.tap');
  await root.locator('.sandbox-source').fill(original.replace('ld hl,$ff69', 'ld hl,$7f69'));
  await page.evaluate(() => { window.beepDone = false; });
  await root.locator('.sandbox-run').click();
  await page.waitForFunction(() => window.beepDone, {}, { timeout: 30000 });
  await root.locator('.sandbox-revert').click();
  assert(await root.locator('.sandbox-source').inputValue() === original, 'Revert lost source');
  await root.getByRole('checkbox', { name: 'Sound' }).uncheck();
  await page.waitForFunction(() => window.beepContext.state === 'closed');
  await page.setViewportSize({ width: 390, height: 844 });
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Mobile page overflow');
  assert(!errors.length, errors.join('\n'));
  await fs.writeFile(out + '/results.json', JSON.stringify({ base, tones, checks: [
    'Actual completion marker; four delivered sounds', 'Editable includes and exact source downloads',
    'Tape download; changed source executes; revert restores', 'Sound closes; narrow page does not overflow',
  ], errors }, null, 2) + '\n');
  console.log(tones);
} finally { await browser.close(); }
