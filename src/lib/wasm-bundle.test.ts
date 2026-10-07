import {afterEach, describe, expect, it, vi} from 'vitest';
import {existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {bundleKey, identify, sealBundle, sealCurrentBundle, verifyBundle} from '../../scripts/wasm-bundle.mjs';

const commands=vi.hoisted(()=>({dirty:'',revision:'commit-a',rust:'rustc fixture-a',wasmPack:'wasm-pack fixture-a'}));
vi.mock('node:child_process',()=>({execFileSync:(file: string,args: string[])=>{
  if(file==='git')return args[0]==='status'?commands.dirty:commands.revision;
  if(file==='rustc')return commands.rust;
  if(file==='wasm-pack')return commands.wasmPack;
  throw new Error(`Unexpected command: ${file}`);
}}));
const scratch: string[]=[];
const wasm=Buffer.from([0,97,115,109,1,0,0,0]);
function fixture(kind='decoder') {
  const root=mkdtempSync(path.join(tmpdir(),'198x-bundle-test-'));scratch.push(root);
  const identity={kind,source:'source-commit',firmware:null,key:bundleKey({kind,source:'source-commit',firmware:null})};
  const put=(name: string, value: string|Buffer)=>{const file=path.join(root,name);mkdirSync(path.dirname(file),{recursive:true});writeFileSync(file,value);};
  if(kind==='decoder') {put('play198x_web.js','module.exports = {};');put('play198x_web_bg.wasm',wasm);}
  else if(kind==='assembler') {
    put('asm198x_web.js','export default function() {}');put('asm198x_web_bg.wasm',wasm);put('LICENSE.txt','test licence');
    put('build.json',JSON.stringify({revision:identity.source,architecture:'mos6502'}));
  } else {
    for(const name of ['index.html','embed.js','worker.js','player.js','player.css','template.html','LICENSE.txt'])put(name,'fixture');
    put('build.json',JSON.stringify({revision:identity.source,modified:false,bundledSpectrum48kFirmware:false,families:['game-boy'],fleetFamilies:['nintendo-game-boy']}));
    put('catalog.json',JSON.stringify([{family:'nintendo-game-boy'}]));
    for(const [family,base] of [['game-boy','emu198x_game_boy_web'],['nintendo-game-boy','emu198x_fleet_web']]) {
      put(`modules/${family}/${base}.js`,'export default function() {}');put(`modules/${family}/${base}_bg.wasm`,wasm);
    }
  }
  return {root,identity,put};
}
afterEach(()=>{for(const root of scratch.splice(0))rmSync(root,{recursive:true,force:true});});

describe('bundle identity',()=>{
  it('fingerprints the checked-out revision, actual tools and build flags, not unrelated environment',async()=>{
    const first=await identify('decoder','/fixture-source',{});
    expect((await identify('decoder','/fixture-source',{UNRELATED:'value'})).key).toBe(first.key);
    for(const field of ['revision','rust','wasmPack'] as const) {
      const original=commands[field];commands[field]='changed';
      try {expect((await identify('decoder','/fixture-source',{})).key).not.toBe(first.key);}
      finally {commands[field]=original;}
    }
    expect((await identify('decoder','/fixture-source',{RUSTFLAGS:'-C opt-level=1'})).key).not.toBe(first.key);
    expect(first.builder).toMatch(/^[a-f0-9]{64}$/);
    expect(first.verifier).toMatch(/^[a-f0-9]{64}$/);
    expect(first.workflow).toMatch(/^[a-f0-9]{64}$/);
  });
  it('rejects modified source and unaccounted builder overrides',async()=>{
    commands.dirty=' M Cargo.lock';
    try {await expect(identify('decoder','/fixture-source',{})).rejects.toThrow(/source must be clean/);}
    finally {commands.dirty='';}
    await expect(identify('decoder','/fixture-source',{WASM_BINDGEN:'/custom/tool'})).rejects.toThrow(/does not support/);
  });
  it('is stable when object property order changes',()=>{
    expect(bundleKey({kind:'decoder',env:{a:1,b:2},source:'x'})).toBe(bundleKey({source:'x',env:{b:2,a:1},kind:'decoder'}));
  });
  it.each(['source','rust','wasmPack','node','platform','arch','image','imageVersion','firmware','builder','verifier','workflow','environment'])('invalidates when %s changes',field=>{
    const inputs={kind:'player',[field]:'before'};
    expect(bundleKey({...inputs,[field]:'after'})).not.toBe(bundleKey(inputs));
  });
});

describe('sealing after a build',()=>{
  it('seals unchanged inputs and verifies their output',async()=>{
    const {root}=fixture();const identity=await identify('decoder',root,{});
    const count=await sealCurrentBundle(root,identity,root,{});
    expect(verifyBundle(root,identity)).toBe(count);
  });
  it.each(['dirty','new-commit'])('does not write a receipt if source becomes %s during the build',async change=>{
    const {root}=fixture();const identity=await identify('decoder',root,{});
    const original=commands.revision;
    if(change==='dirty')commands.dirty=' M Cargo.lock';
    else commands.revision='commit-after-build';
    try {
      await expect(sealCurrentBundle(root,identity,root,{})).rejects.toThrow(change==='dirty'?/source must be clean/:/inputs changed/);
      expect(existsSync(path.join(root,'.bundle-manifest.json'))).toBe(false);
    } finally {commands.dirty='';commands.revision=original;}
  });
});

describe('bundle integrity',()=>{
  it.each(['decoder','assembler','player'])('seals and verifies a complete %s bundle',kind=>{
    const {root,identity}=fixture(kind);
    const count=sealBundle(root,identity);
    expect(count).toBeGreaterThan(1);expect(verifyBundle(root,identity)).toBe(count);
  });
  it('refuses a directory without a receipt',()=>{
    const {root,identity}=fixture();expect(()=>verifyBundle(root,identity)).toThrow();
  });
  it('refuses a receipt for different inputs',()=>{
    const {root,identity}=fixture();sealBundle(root,identity);
    expect(()=>verifyBundle(root,{...identity,key:'other-key'})).toThrow(/inputs do not match/);
  });
  it.each(['changed','extra','missing','empty-manifest','invalid-wasm','symlink','raw-rom'])('refuses %s output after sealing',change=>{
    const {root,identity,put}=fixture();sealBundle(root,identity);
    if(change==='changed')put('play198x_web.js','different bytes');
    if(change==='extra')put('unexpected.js','extra bytes');
    if(change==='missing')rmSync(path.join(root,'play198x_web.js'));
    if(change==='empty-manifest')put('.bundle-manifest.json',JSON.stringify({schema:1,key:identity.key,files:{}}));
    if(change==='invalid-wasm')put('play198x_web_bg.wasm','not wasm');
    if(change==='symlink')symlinkSync('play198x_web.js',path.join(root,'linked.js'));
    if(change==='raw-rom')put('firmware.rom','raw');
    expect(()=>verifyBundle(root,identity)).toThrow();
  });
  it('refuses an empty or incomplete build before sealing',()=>{
    const {root,identity}=fixture();rmSync(path.join(root,'play198x_web.js'));
    expect(()=>sealBundle(root,identity)).toThrow(/Missing bundle file/);
    rmSync(path.join(root,'play198x_web_bg.wasm'));
    expect(()=>sealBundle(root,identity)).toThrow(/empty/);
  });
  it.each(['assembler','player'])('refuses a %s built from another revision',kind=>{
    const {root,identity}=fixture(kind);
    expect(()=>sealBundle(root,{...identity,source:'new-source'})).toThrow(/source revision mismatch/);
  });
  it.each(['modified-source','firmware','empty-families','empty-catalogue','catalogue-mismatch','missing-module'])('refuses player %s',change=>{
    const {root,identity,put}=fixture('player');
    const build=JSON.parse(readFileSync(path.join(root,'build.json'),'utf8'));
    if(change==='modified-source')build.modified=true;
    if(change==='firmware')build.bundledSpectrum48kFirmware=true;
    if(change==='empty-families')build.fleetFamilies=[];
    if(change==='empty-catalogue')put('catalog.json','[]');
    if(change==='catalogue-mismatch')put('catalog.json','[{"family":"different"}]');
    if(change==='missing-module')rmSync(path.join(root,'modules/nintendo-game-boy/emu198x_fleet_web_bg.wasm'));
    put('build.json',JSON.stringify(build));expect(()=>sealBundle(root,identity)).toThrow();
  });
});
