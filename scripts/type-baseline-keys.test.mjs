import assert from 'node:assert/strict';
import {test} from 'node:test';
import {normaliseTypeKey, normaliseTypeCounts} from './type-baseline-keys.mjs';

const diagnostic = prefix => `src/lib/example.ts ts(7016) Could not find a declaration file for module 'js-yaml'. '${prefix}/node_modules/js-yaml/dist/js-yaml.mjs' implicitly has an 'any' type.`;

test('the same error compares equally across macOS, Linux and Windows checkouts', () => {
  const expected = normaliseTypeKey(diagnostic('/old/checkout'));
  for (const root of ['/private/tmp/another checkout', '/home/runner/work/site/site', 'C:\\work\\site']) {
    assert.equal(normaliseTypeKey(diagnostic(root)), expected);
  }
});

test('module, diagnostic code, source file and message differences still fail equality', () => {
  const original = diagnostic('/old/checkout');
  for (const changed of [
    original.replace('js-yaml/dist', 'other-package/dist'),
    original.replace('7016', '2307'),
    original.replace('example.ts', 'different.ts'),
    original.replace('implicitly has', 'unexpectedly has'),
  ]) assert.notEqual(normaliseTypeKey(changed), normaliseTypeKey(original));
});

test('colliding normalised keys add their counts instead of hiding an error', () => {
  const one = diagnostic('/old/checkout');
  const two = diagnostic('/new/checkout');
  const actual = normaliseTypeCounts({[one]: 2, [two]: 3});
  assert.deepEqual(actual, {[normaliseTypeKey(one)]: 5});
  assert.equal(Object.values(actual).reduce((sum, n) => sum+n, 0), 5);
});

test('relative paths and non-package quoted values are unchanged', () => {
  for (const value of ["a.ts ts(1) Value '/path/to/source.ts' is invalid", "a.ts ts(1) './node_modules/package/index.js' is missing", "a.ts ts(1) Type 'string' is invalid"]) assert.equal(normaliseTypeKey(value), value);
});

test('literal union ordering does not change an existing diagnostic', () => {
  const before = `a.ts ts(2345) Argument of type 'string' is not assignable to parameter of type '\"audio\" | \"input\" | \"framework\"'.`;
  const reordered = before.replace('"audio" | "input" | "framework"', '"input" | "framework" | "audio"');
  assert.equal(normaliseTypeKey(before), normaliseTypeKey(reordered));
  assert.notEqual(normaliseTypeKey(before), normaliseTypeKey(reordered.replace('"audio"', '"physics"')));
  assert.deepEqual(normaliseTypeCounts({[before]: 2, [reordered]: 3}), {[normaliseTypeKey(before)]: 5});
});
