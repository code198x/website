import { describe, expect, it } from 'vitest';
import { formatAssemblyDiagnostics } from './assembly-diagnostics';
import { expandAssemblyProject } from './assembly-includes';

describe('readable assembly diagnostics', () => {
  it('turns the assembler error array into a message and the original line', () => {
    const { locations } = expandAssemblyProject('org 32768\nld a,bogus', {});
    expect(formatAssemblyDiagnostics('[{"span":{"line":2,"path":"input.asm"},"message":"undefined symbol `bogus`","severity":"Error"}]', locations))
      .toEqual([{ text: 'Line 2: undefined symbol `bogus`', location: { line: 2 } }]);
  });
  it('maps included errors to the companion and later errors back to the main editor', () => {
    const { locations } = expandAssemblyProject('org 32768\ninclude "art.inc"\nend start', { 'art.inc': 'shape: defb 1\ninvalid' });
    expect(formatAssemblyDiagnostics([{ span: { line: 4 }, message: 'unknown instruction' }, { span: { line: 6 }, message: 'missing entry' }], locations))
      .toEqual([{ text: 'art.inc, line 2: unknown instruction', location: { file: 'art.inc', line: 2 } }, { text: 'Line 3: missing entry', location: { line: 3 } }]);
  });
  it('preserves useful plain errors and gives unknown payloads a safe fallback', () => {
    expect(formatAssemblyDiagnostics('Missing companion file.')).toEqual([{ text: 'Missing companion file.' }]);
    for (const value of [null, {}, [], [{ metadata: 'internal detail' }]]) {
      expect(formatAssemblyDiagnostics(value)[0].text).toContain('The source did not assemble.');
    }
  });
});
