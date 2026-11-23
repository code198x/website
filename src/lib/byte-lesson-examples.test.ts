import { describe, expect, it } from 'vitest';
import { byteBits, byteOrder, hex, ulaOutput } from './byte-lesson-examples';

describe('byte lesson examples', () => {
  it('separates the adjacent addresses from the two bytes of the word', () => {
    expect(hex(byteOrder.word, 4)).toBe('$1234');
    expect([hex(byteOrder.firstAddress), hex(byteOrder.secondAddress)]).toEqual(['$2000', '$2001']);
    expect([hex(byteOrder.lowByte), hex(byteOrder.highByte)]).toEqual(['$34', '$12']);
    expect((byteOrder.highByte << 8) | byteOrder.lowByte).toBe(byteOrder.word);
  });

  it('sets and clears only the speaker bit, leaving the border and MIC alone', () => {
    const { before, setMask, afterSet, clearMask, afterClear } = ulaOutput;
    expect([before, setMask, afterSet, clearMask, afterClear].map(byteBits)).toEqual([
      '00000010', '00010000', '00010010', '11101111', '00000010',
    ]);
    expect(before ^ afterSet).toBe(1 << ulaOutput.speakerBit);
    expect(afterSet ^ afterClear).toBe(1 << ulaOutput.speakerBit);
  });
});
