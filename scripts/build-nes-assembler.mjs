// Build the existing 6502 WASM shell without publishing an npm package.
import {execFileSync} from 'node:child_process';
import {cpSync,mkdirSync,mkdtempSync,rmSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const site=fileURLToPath(new URL('..',import.meta.url));
const source=path.resolve(process.env.ASM198X_SOURCE_ROOT || path.join(site,'../../Asm198x/asm198x'));
const crate=path.join(source,'crates/asm198x-web');
const destination=path.join(site,'public/wasm/asm198x-mos6502');
mkdirSync(path.dirname(destination),{recursive:true});
const stage=mkdtempSync(path.join(path.dirname(destination),'.asm6502-'));
try {
 if(process.env.WASM_BINDGEN) {
  execFileSync('cargo',['build','--locked','--release','--target','wasm32-unknown-unknown','--no-default-features','--features','mos6502'],{cwd:crate,stdio:'inherit'});
  execFileSync(process.env.WASM_BINDGEN,[path.join(crate,'target/wasm32-unknown-unknown/release/asm198x_web.wasm'),'--target','web','--out-dir',stage],{cwd:crate,stdio:'inherit'});
 } else execFileSync('wasm-pack',['build',crate,'--target','web','--release','--out-dir',stage,'--no-opt','--','--locked','--no-default-features','--features','mos6502'],{cwd:crate,stdio:'inherit'});
 for(const file of ['asm198x_web.d.ts','asm198x_web_bg.wasm.d.ts','package.json','.gitignore'])rmSync(path.join(stage,file),{force:true});
 cpSync(path.join(crate,'LICENSE'),path.join(stage,'LICENSE.txt'));
 const revision=execFileSync('git',['rev-parse','HEAD'],{cwd:source,encoding:'utf8'}).trim();
 writeFileSync(path.join(stage,'build.json'),JSON.stringify({revision,architecture:'mos6502',source:'https://github.com/asm198x/asm198x'},null,2)+'\n');
 rmSync(destination,{force:true,recursive:true});cpSync(stage,destination,{recursive:true});
} finally {rmSync(stage,{force:true,recursive:true});}
console.log('Built Asm198x 6502 browser assembler.');
