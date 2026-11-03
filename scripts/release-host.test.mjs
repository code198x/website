import {test} from 'node:test';
import assert from 'node:assert/strict';
import {workersFor} from './release-host.mjs';

test('an idle host keeps Playwright’s half-the-cores default', () => {
  assert.equal(workersFor({cores: 12, load: 0}), 6);
  assert.equal(workersFor({cores: 2, load: 0}), 1);
});

test('busy hosts get the capacity that is actually free', () => {
  assert.equal(workersFor({cores: 12, load: 8.4}), 3);
  assert.equal(workersFor({cores: 12, load: 160}), 1);
});

test('the count never drops below one or rises above the default, and never grows with load', () => {
  for (const cores of [1, 2, 4, 8, 12, 64]) {
    let previous = Infinity;
    for (let load = 0; load <= cores * 20; load += 0.25) {
      const workers = workersFor({cores, load});
      assert.ok(workers >= 1, `${cores} cores, load ${load}: ${workers}`);
      assert.ok(workers <= Math.max(1, Math.floor(cores / 2)), `${cores} cores, load ${load}: ${workers}`);
      assert.ok(workers <= previous, `${cores} cores: load ${load} gave more workers than a lower load`);
      previous = workers;
    }
  }
});

test('an explicit PLAYWRIGHT_WORKERS wins, and nonsense is refused', () => {
  assert.equal(workersFor({cores: 12, load: 160, override: '4'}), 4);
  assert.equal(workersFor({cores: 12, load: 0, override: ''}), 6);
  for (const bad of ['0', '-1', '2.5', 'many']) {
    assert.throws(() => workersFor({cores: 12, load: 0, override: bad}), /PLAYWRIGHT_WORKERS/);
  }
});
