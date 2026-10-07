// Completed bundles are reusable only for identical inputs and verified bytes.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {appendFileSync, existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const site=fileURLToPath(new URL('..',import.meta.url));
const receipt='.bundle-manifest.json';
const bundles={
  decoder:{source:'play198x',output:'play198x/crates/play198x-web/pkg-node',builder:'scripts/build-wasm.mjs',required:['play198x_web.js','play198x_web_bg.wasm']},
  assembler:{source:'asm198x-source',output:'public/wasm/asm198x-mos6502',builder:'scripts/build-nes-assembler.mjs',required:['asm198x_web.js','asm198x_web_bg.wasm','build.json','LICENSE.txt']},
  player:{source:'emu198x-source',output:'public/emulators',builder:'scripts/build-browser-player.mjs',required:['build.json','catalog.json','index.html','embed.js','worker.js','player.js','player.css','template.html','LICENSE.txt']},
};
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const canonical=value=>Array.isArray(value)?value.map(canonical):value && typeof value==='object'?Object.fromEntries(Object.entries(value).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>[k,canonical(v)])):value;
export const bundleKey=inputs=>`wasm-bundle-v1-${inputs.kind}-${digest(JSON.stringify(canonical(inputs)))}`;
const command=(file,args,cwd)=>execFileSync(file,args,{cwd,encoding:'utf8'}).trim();

export async function identify(kind,source,env=process.env) {
  assert(bundles[kind],`Unknown bundle: ${kind}`);
  assert.equal(command('git',['status','--porcelain','--untracked-files=normal'],source),'','Bundle source must be clean');
  // These overrides alter the builder or its optional execution checks. The
  // deployment uses the standard wasm-pack path and bundled Spectrum policy.
  for(const name of ['WASM_BINDGEN','PLAYER_TEST_ROM_ROOT','SPECTRUM_ROM','AMIGA_ROM','C64_ROM_DIR'])assert(!env[name],`Bundle caching does not support ${name}`);
  let firmware=null;
  if(kind==='player') {
    const {spectrum48kRom}=await import(pathToFileURL(path.join(source,'web-player/bundled-firmware.mjs')));
    const rom=spectrum48kRom(env); // Validate before selecting a cached bundle.
    firmware=rom?digest(readFileSync(rom)):null;
  }
  const inputs={kind,source:command('git',['rev-parse','HEAD'],source),
    rust:command('rustc',['-vV'],source),wasmPack:command('wasm-pack',['--version'],source),
    node:process.version,platform:process.platform,arch:process.arch,
    image:env.ImageOS??'',imageVersion:env.ImageVersion??'',firmware,
    builder:digest(readFileSync(path.join(site,bundles[kind].builder))),
    verifier:digest(readFileSync(fileURLToPath(import.meta.url))),
    workflow:digest(readFileSync(path.join(site,'.github/workflows/deploy.yml'))),
    environment:Object.fromEntries(Object.entries(env).filter(([key])=>/^(RUSTFLAGS$|RUSTDOCFLAGS$|RUSTC_|CARGO_ENCODED_RUSTFLAGS$|CARGO_BUILD_|CARGO_PROFILE_|CARGO_TARGET_|WASM_PACK_|CC$|CFLAGS$|CXX$|CXXFLAGS$|AR$|LDFLAGS$|CMAKE_)/.test(key))),
  };
  return {...inputs,key:bundleKey(inputs)};
}

function inventory(root) {
  assert(existsSync(root),'Bundle directory is missing');
  assert(lstatSync(root).isDirectory() && !lstatSync(root).isSymbolicLink(),'Bundle root must be a directory, not a symlink');
  const files={};
  function walk(dir) {
    for(const name of readdirSync(dir).sort()) {
      const file=path.join(dir,name),relative=path.relative(root,file).split(path.sep).join('/'),stat=lstatSync(file);
      assert(!stat.isSymbolicLink(),`Bundle contains a symlink: ${relative}`);
      if(stat.isDirectory()){walk(file);continue;}
      assert(stat.isFile(),`Unexpected bundle entry: ${relative}`);
      if(relative===receipt)continue;
      assert(!/\.rom$/i.test(relative),`Raw firmware in bundle: ${relative}`);
      const bytes=readFileSync(file);
      if(relative.endsWith('.wasm'))assert(WebAssembly.validate(bytes),`Invalid WASM: ${relative}`);
      files[relative]=digest(bytes);
    }
  }
  walk(root);
  assert(Object.keys(files).length>0,'Bundle is empty');
  return files;
}

function validateDistribution(root,identity,files) {
  const spec=bundles[identity.kind];assert(spec,'Unknown bundle kind');
  for(const file of spec.required)assert(files[file],`Missing bundle file: ${file}`);
  if(identity.kind==='decoder')return;
  const build=JSON.parse(readFileSync(path.join(root,'build.json'),'utf8'));
  assert.equal(build.revision,identity.source,'Bundle source revision mismatch');
  if(identity.kind==='assembler'){assert.equal(build.architecture,'mos6502');return;}
  assert.equal(build.modified,false,'Player was built from modified source');
  assert.equal(build.bundledSpectrum48kFirmware,Boolean(identity.firmware),'Player firmware configuration mismatch');
  for(const list of [build.families,build.fleetFamilies]) {
    assert(Array.isArray(list) && list.length>0,'Player family list is empty');
    assert.equal(new Set(list).size,list.length,'Duplicate player family');
    assert(list.every(f=>/^[a-z0-9-]+$/.test(f)),'Invalid player family');
  }
  for(const family of build.families)for(const suffix of ['.js','_bg.wasm'])assert(files[`modules/${family}/emu198x_${family.replaceAll('-','_')}_web${suffix}`],`Missing legacy module: ${family}`);
  for(const family of build.fleetFamilies)for(const suffix of ['.js','_bg.wasm'])assert(files[`modules/${family}/emu198x_fleet_web${suffix}`],`Missing fleet module: ${family}`);
  const catalogue=JSON.parse(readFileSync(path.join(root,'catalog.json'),'utf8'));
  assert(Array.isArray(catalogue) && catalogue.length>0,'Player catalogue is empty');
  assert.deepEqual(catalogue.map(e=>e.family).sort(),[...build.fleetFamilies].sort(),'Catalogue and modules disagree');
}

export function sealBundle(root,identity) {
  const files=inventory(root);validateDistribution(root,identity,files);
  writeFileSync(path.join(root,receipt),JSON.stringify({schema:1,key:identity.key,files},null,2)+'\n');
  return Object.keys(files).length;
}
export function verifyBundle(root,identity) {
  const manifest=JSON.parse(readFileSync(path.join(root,receipt),'utf8'));
  assert.equal(manifest.schema,1,'Unsupported bundle manifest');
  assert.equal(manifest.key,identity.key,'Bundle inputs do not match');
  const files=inventory(root);validateDistribution(root,identity,files);
  assert.deepEqual(files,manifest.files,'Bundle files do not match the validated build');
  return Object.keys(files).length;
}

if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const [operation,kind]=process.argv.slice(2);assert(bundles[kind],`Unknown bundle: ${kind}`);
  const directory=path.join(site,'.ci-bundles'),inputFile=path.join(directory,`${kind}.json`),output=path.join(site,bundles[kind].output);
  if(operation==='identity') {
    const identity=await identify(kind,path.join(site,bundles[kind].source));
    mkdirSync(directory,{recursive:true});writeFileSync(inputFile,JSON.stringify(identity,null,2)+'\n');
    if(process.env.GITHUB_OUTPUT)appendFileSync(process.env.GITHUB_OUTPUT,`key=${identity.key}\n`);
    console.log(`${kind}: ${identity.source} → ${identity.key}`);
  } else if(operation==='clean') {
    // Fixed generated-output paths only; never a caller-provided directory.
    rmSync(output,{recursive:true,force:true});
  } else {
    assert(['seal','verify'].includes(operation),'Use identity, clean, seal or verify');
    const identity=JSON.parse(readFileSync(inputFile,'utf8'));
    if(operation==='seal') {
      // A builder must not silently update a tracked lockfile, or otherwise
      // produce bytes from inputs different from those used for the key.
      const afterBuild=await identify(kind,path.join(site,bundles[kind].source));
      assert.equal(afterBuild.key,identity.key,'Bundle inputs changed during the build');
    }
    const count=(operation==='seal'?sealBundle:verifyBundle)(output,identity);
    console.log(`${kind}: ${operation} checked ${count} files`);
  }
}
