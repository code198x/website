import { expect, test } from 'vitest';
import { diagnosticKey } from '../../scripts/type-diagnostic.mjs';

test('the same missing declaration compares equally across checkouts', () => {
  const message = (root: string) => `src/a.ts ts(7016) Could not find a declaration for '${root}/node_modules/js-yaml/dist/js-yaml.mjs'.`;
  expect(diagnosticKey(message('/old/tree'))).toBe(diagnosticKey(message('/new/worktree')));
});

test('different diagnostics and package paths remain different', () => {
  const message = "a.ts ts(7016) declaration for '/tree/node_modules/js-yaml/dist/js-yaml.mjs'.";
  for (const changed of [message.replace('js-yaml/dist', 'other/dist'), message.replace('7016', '2307'), message.replace('a.ts', 'b.ts')]) {
    expect(diagnosticKey(changed)).not.toBe(diagnosticKey(message));
  }
});
