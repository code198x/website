export function hex(value: number, digits = 2): string {
  return `$${value.toString(16).toUpperCase().padStart(digits, '0')}`;
}

export function byteBits(value: number): string {
  return value.toString(2).padStart(8, '0');
}

const word = 0x1234;
const firstAddress = 0x2000;
const lowByte = word & 0xff;
const highByte = word >>> 8;

export const byteOrder = {
  word,
  firstAddress,
  secondAddress: firstAddress + 1,
  lowByte,
  highByte,
};

const speakerBit = 4;
const border = 0b010; // Red on the original ZX Spectrum.
const setMask = 1 << speakerBit;
const clearMask = 0xff ^ setMask;
const before = border;
const afterSet = before | setMask;

export const ulaOutput = {
  port: 0xfe,
  speakerBit,
  border,
  fields: [
    { from: 7, to: 5, label: 'Unused on write' },
    { from: speakerBit, to: speakerBit, label: 'Speaker' },
    { from: 3, to: 3, label: 'MIC' },
    { from: 2, to: 0, label: 'Border' },
  ],
  before,
  setMask,
  afterSet,
  clearMask,
  afterClear: afterSet & clearMask,
};
