import {describe,expect,it} from 'vitest';
import {SpectrumKeyboard,spectrumKeyCodes} from './spectrum-keyboard';

function matrix() {
  const held=new Set<string>();
  const keyboard=new SpectrumKeyboard((code,down)=>{if(down)held.add(code);else held.delete(code);});
  return {held,keyboard};
}

describe('Spectrum host keyboard',()=>{
  it('preserves Symbol Shift while overlapping punctuation owners release',()=>{
    const {held,keyboard}=matrix();
    keyboard.press('AltLeft');keyboard.press('Comma');keyboard.press('Period');
    keyboard.release('Comma');
    expect(held).toEqual(new Set(['AltLeft','KeyM']));
    keyboard.release('Period');
    expect(held).toEqual(new Set(['AltLeft']));
    keyboard.release('AltLeft');expect(held.size).toBe(0);
  });
  it('treats both physical shift keys as owners of the same Spectrum contact',()=>{
    const {held,keyboard}=matrix();
    keyboard.press('ShiftLeft');keyboard.press('ShiftRight');keyboard.press('Escape');
    keyboard.release('Escape');keyboard.release('ShiftLeft');
    expect(held).toEqual(new Set(['ShiftLeft']));
    keyboard.release('ShiftRight');expect(held.size).toBe(0);
  });
  it('does not accumulate browser repeats or leave keys down after blur',()=>{
    const {held,keyboard}=matrix();
    keyboard.press('Comma');keyboard.press('Comma');keyboard.release('Comma');
    expect(held.size).toBe(0);
    keyboard.press('Escape');keyboard.press('Period');keyboard.releaseAll();
    expect(held.size).toBe(0);expect(keyboard.release('Escape')).toBe(false);
  });
  it('leaves Tab and browser shortcuts outside the machine mapping',()=>{
    expect(spectrumKeyCodes('Tab')).toBeNull();expect(spectrumKeyCodes('MetaLeft')).toBeNull();
  });
});
