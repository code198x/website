// Compare the browser compiler with the native-built downloadable lesson.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import init,{assemble} from '../public/wasm/asm198x-mos6502/asm198x_web.js';
const root=new URL('../public/code-samples/nintendo-entertainment-system/assembly/meet-the-machine/unit-01/',import.meta.url);
await init({module_or_path:readFileSync(new URL('../public/wasm/asm198x-mos6502/asm198x_web_bg.wasm',import.meta.url))});
const source=readFileSync(new URL('screen.asm',root),'utf8');
const result=JSON.parse(assemble('ca65',source));
assert(!Array.isArray(result));assert.deepEqual(Buffer.from(result.bytes),readFileSync(new URL('screen.nes',root)));
const invalid=JSON.parse(assemble('ca65',source.replace('lda #$16','lda #300')));
assert(Array.isArray(invalid));assert(invalid[0].span.line>0);assert.match(invalid[0].message,/range/i);
console.log('NES WASM assembler matches the native lesson cartridge and reports source-line errors.');
