import { afterEach, describe, expect, it, vi } from 'vitest';
import { codeToThemedHighlight } from './themed-highlight';
import { loadCode198xLanguages } from './load-custom-languages';

const listing = Array.from({ length: 40 }, (_, i) =>
  `${1000 + i * 10} PRINT AT y,2; INK 7; d$(j); "  --": IF v = ${i} THEN GO TO 1160`,
).join('\n');

describe('codeToThemedHighlight', () => {
  afterEach(() => vi.restoreAllMocks());

  // A starved build process can take longer than Shiki's per-line time limit
  // on any line. Stand in for that by making the clock jump on every reading:
  // both passes must still colour every line and agree with each other.
  it('highlights every line when the clock runs out mid-line', async () => {
    await loadCode198xLanguages();
    const calm = await codeToThemedHighlight(listing, { lang: 'sinclair-basic', blockId: 'starved' });

    const realNow = Date.now.bind(Date);
    let skew = 0;
    vi.spyOn(Date, 'now').mockImplementation(() => realNow() + (skew += 1000));
    const starved = await codeToThemedHighlight(listing, { lang: 'sinclair-basic', blockId: 'starved' });

    expect(starved.css).toBe(calm.css);
    expect(starved.script).toBe(calm.script);
  });
});
