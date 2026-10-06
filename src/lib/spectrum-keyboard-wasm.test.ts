import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {expect,it} from 'vitest';
import init,{Spectrum} from '@emu198x/zx-spectrum';
import {SpectrumKeyboard} from './spectrum-keyboard';

it('enters punctuation through the ROM and BREAK interrupts a real BASIC loop',async()=>{
  const require=createRequire(import.meta.url);
  await init({module_or_path:await readFile(require.resolve('@emu198x/zx-spectrum/emu198x_spectrum_web_bg.wasm'))});
  let machine=Spectrum.createHeadlessBundled();
  const keyboard=new SpectrumKeyboard((code,down)=>{expect(down?machine.keyDown(code):machine.keyUp(code)).toBe(true);});
  const tap=(code:string)=>{keyboard.press(code);machine.tick(100);keyboard.release(code);machine.tick(100);};
  const quote=()=>{keyboard.press('AltLeft');tap('KeyP');keyboard.release('AltLeft');machine.tick(100);};
  const text=()=>JSON.parse(machine.query('screen.text.lines')).join('\n') as string;
  try{
    machine.runBasic('10 REM keyboard probe');
    tap('KeyP');quote();
    for(const code of ['Comma','Period','Semicolon','Slash','Equal','Minus','Quote'])tap(code);
    quote();tap('Enter');
    expect(text()).toContain(",.;/=-'");
    machine.free();machine=Spectrum.createHeadlessBundled();
    machine.runBasic('10 GO TO 10');
    expect(text()).not.toContain('BREAK');
    tap('Escape');
    expect(text()).toContain('BREAK');
    keyboard.releaseAll();
  }finally{machine.free();}
},120000);
