import { describe, expect, it } from 'vitest';
import { listingHtml, tokenise } from './kit-highlight';

const roles = async (code: string, lang: string) =>
  (await tokenise(code, lang)).flat().filter((t) => t.role).map((t) => `${t.role}:${t.text.trim()}`);

describe('kit-highlight', () => {
  it('maps Z80 mnemonics, numbers and comments onto the kit roles', async () => {
    const found = await roles('        ld a, $07    ; ink seven\n', 'z80');
    expect(found).toContain('kw:ld');
    expect(found).toContain('num:$07');
    expect(found.some((r) => r.startsWith('c:') && r.includes('ink seven'))).toBe(true);
  });

  it('marks a Sinclair BASIC keyword and string, and draws the line number muted', async () => {
    const found = await roles('10 PRINT "Hello"', 'sinclair-basic');
    expect(found).toContain('ln:10');
    expect(found).toContain('kw:PRINT');
    expect(found.some((r) => r.startsWith('str:') && r.includes('Hello'))).toBe(true);
  });

  it('keeps operators in plain ink', async () => {
    const found = await roles('LET a=a+1', 'sinclair-basic');
    expect(found).not.toContain('kw:=');
    expect(found).not.toContain('kw:+');
  });

  it('falls back to plain text for an unknown language', async () => {
    expect(await tokenise('anything', 'no-such-language')).toEqual([[{ text: 'anything' }]]);
  });

  it('escapes markup and keeps one element per line', async () => {
    const html = await listingHtml('a <b>\nc', 'text');
    expect(html).toContain('&lt;b&gt;');
    expect(html.match(/class="ll-line"/g)).toHaveLength(2);
  });
});

describe('every teaching language reaches the keyword role', () => {
  it.each([
    ['6502', '  lda #$01 ; one'],
    ['ca65', '  lda #$01 ; one'],
    ['m68k', '  move.w #1,d0 ; one'],
    ['amos', 'Print "Hi"'],
    ['basic', '10 PRINT "HI"'],
  ])('%s', async (lang, code) => {
    expect((await tokenise(code, lang)).flat().some((t) => t.role === 'kw')).toBe(true);
  });
});
