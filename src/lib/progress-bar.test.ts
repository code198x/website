import { describe, expect, it } from 'vitest';
import { progressBarCells } from './progress-bar';

describe('the maintained BASIC progress-bar illustration', () => {
  // progress-bar.bas 2210–2250: floor and clamp the count, then select one
  // PAPER colour for the whole filled portion: 2 (<10), 6 (<19), or 4.
  it.each([
    [-10, 0, '#d70000'],
    [0, 0, '#d70000'],
    [25, 7, '#d70000'],
    [35, 9, '#d70000'],
    [36, 10, '#d7d700'],
    [50, 14, '#d7d700'],
    [67, 18, '#d7d700'],
    [68, 19, '#00d700'],
    [100, 28, '#00d700'],
    [120, 28, '#00d700'],
  ])('%s/100 lights %s cells in one PAPER colour', (value, filled, colour) => {
    const cells = progressBarCells(value);
    expect(cells).toHaveLength(28);
    expect(cells.filter(cell => cell !== '#000000')).toHaveLength(filled);
    expect(cells.slice(0, filled)).toEqual(Array(filled).fill(colour));
    expect(cells.slice(filled)).toEqual(Array(28 - filled).fill('#000000'));
  });

  it('never loses a filled cell as the value rises', () => {
    const counts = Array.from({ length: 121 }, (_, value) =>
      progressBarCells(value).filter(cell => cell !== '#000000').length,
    );
    expect(counts[0]).toBe(0);
    expect(counts[100]).toBe(28);
    for (let i = 1; i < counts.length; i++) expect(counts[i]).toBeGreaterThanOrEqual(counts[i - 1]);
  });
});
