import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
const base=process.argv[2]||'http://127.0.0.1:1986',out=process.argv[3]||'/tmp/meteor-browser';
await fs.mkdir(out,{recursive:true});
const root=path.resolve(import.meta.dirname,'../..'),samples=process.env.CODE_SAMPLES_PATH||path.resolve(root,'../code-samples');
const route='/systems/sinclair-zx-spectrum/assembly/meteor-storm';
// The closing lesson: the last unit, which downloads the finished game's files.
const LAST=32;
// METEOR_FIRST starts at a later lesson. Anything but a lesson number would skip every lesson and still pass.
const FIRST=Number(process.env.METEOR_FIRST??1);
if(!Number.isInteger(FIRST)||FIRST<1||FIRST>LAST)throw Error(`METEOR_FIRST must be a lesson number from 1 to ${LAST}, not ${process.env.METEOR_FIRST}`);
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:1280,height:1000}});
const page=await context.newPage(),errors=[],checks=[];
page.on('pageerror',error=>errors.push(String(error)));
await page.addInitScript(()=>{window.meteorReadings=null;document.addEventListener('sandbox:memory',event=>window.meteorReadings=event.detail);});
const assert=(value,message)=>{if(!value)throw Error(message)};
// Playwright's waits here time out after 30 s, but evaluate() waits for as long
// as the page's main thread is busy. A stage that outruns its limit fails and
// names itself instead of hanging. Each stage prints its wall-clock start and
// duration: a gap far longer than the run's own work means the computer slept
// (compare `pmset -g log` on macOS), not that the lesson stuck.
async function within(name,limit,work){
 const started=new Date();let timer;
 const stuck=new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error(`${name} did not finish within ${limit/1000} s (started ${started.toISOString()}, now ${new Date().toISOString()})`)),limit)});
 try{await Promise.race([work(),stuck])}finally{clearTimeout(timer)}
 return `${started.toISOString()} ${((Date.now()-started)/1000).toFixed(1)} s`;
}
async function open(n){
 await page.goto(base+route+`/unit-${String(n).padStart(2,'0')}/`);
}
async function run(){await page.waitForFunction(()=>document.querySelector('.sandbox')?.dataset.sandboxReady==='true'&&document.querySelector('.meteor-experiment')?.dataset.ready==='true');await page.locator('.sandbox-run').click();await page.waitForFunction(()=>document.querySelector('.sandbox-status').textContent.startsWith('Running')||document.querySelector('.sandbox-status').dataset.state==='error',{},{timeout:20000});assert((await page.locator('.sandbox-status').textContent()).startsWith('Running'),await page.locator('.sandbox-status').textContent()+' '+await page.locator('.sandbox-diagnostics').textContent());}
async function key(name,ms=100){await page.locator('.sandbox-screen').focus();await page.keyboard.down(name);await page.waitForTimeout(ms);await page.keyboard.up(name);}
try{
 for(let n=FIRST;n<=LAST;n++){
  const timing=await within(`Lesson ${n}`,120000,async()=>{
  await open(n);
  const prose=await fs.readFile(path.join(root,`src/content/curriculum/sinclair-zx-spectrum/assembly/meteor-storm/unit-${String(n).padStart(2,'0')}.mdx`),'utf8');
  const checkpoint=prose.match(/<MeteorExperiment checkpoint="([^"]+)"/)[1];
  const directory=path.join(samples,`sinclair-zx-spectrum/assembly/meteor-storm/checkpoints/${checkpoint}`);
  const expected=await fs.readFile(directory+'/meteor-storm.asm','utf8');
  assert(await page.locator('.sandbox-source').inputValue()===expected,`Source ${n}`);
  if(await page.locator('.sandbox-companion').count())assert(await page.locator('.sandbox-companion').inputValue()===await fs.readFile(directory+'/assets.inc','utf8'),`Companion ${n}`);
  await run();await page.waitForFunction(()=>Boolean(window.meteorReadings));
  assert(await page.locator('h1').count()===1,`Heading ${n}`);
  if(n<LAST)assert((await page.locator('a.nav-next').getAttribute('href')).includes(`unit-${String(n+1).padStart(2,'0')}`),`Next ${n}`);
  else assert(await page.locator('a.nav-next').count()===0,'Final next');
  if(n===1){
   assert(JSON.stringify((await page.evaluate(()=>window.meteorReadings.values)).slice(0,4))==='[129,0,64,128]','Shift');
   await page.locator('.sandbox-source').fill(expected.replaceAll('%10000001','%11111111'));await run();
   await page.waitForFunction(()=>window.meteorReadings.values[0]===255&&window.meteorReadings.values[2]===127&&window.meteorReadings.values[3]===128);
   await page.locator('.sandbox-revert').click();assert(await page.locator('.sandbox-source').inputValue()===expected,'Source revert');
  }
  if(n===3)await page.waitForFunction(()=>window.meteorReadings.words.address===18433);
  if(n===5){
   await key('p',250);await page.waitForFunction(()=>window.meteorReadings.named.ship_x>116);
   const before=await page.locator('.sandbox-companion').inputValue();await page.locator('.sandbox-companions').evaluate(el=>el.open=true);
   await page.locator('.sandbox-companion').fill(before.replace(' defb $00,$00,$00,$00',' defb $FF,$FF,$FF,$00'));
   await page.waitForFunction(()=>document.querySelector('.meteor-reading').textContent.includes('Source changed'));
   await page.locator('.sandbox-revert').click();assert(await page.locator('.sandbox-companion').inputValue()===before,'Asset revert');
   await page.locator('.sandbox-source').fill(expected.replace('include "assets.inc"','include "missing.inc"'));await page.locator('.sandbox-run').click();
   await page.waitForFunction(()=>document.querySelector('.sandbox-status').dataset.state==='error');assert((await page.locator('.sandbox-status').textContent()).includes('no companion'),'Missing include message');
  }
  if(n===10){
   await page.locator('[data-break]').click();await page.waitForFunction(()=>document.querySelector('.meteor-debug-state').textContent.includes('Paused'));
   assert((await page.locator('.meteor-debug-state').textContent()).toLowerCase().includes('cp'),'Collision stop');assert(!(await page.locator('.meteor-debug-state').textContent()).includes('undefined'),'Debugger registers');
   await page.locator('[data-step]').click();assert(await page.locator('[data-resume]').isEnabled(),'Step');await page.locator('[data-resume]').click();
  }
  if(n===11){
   await key(' ');await page.waitForFunction(()=>window.meteorReadings.named.phase===1);
   await page.waitForFunction(()=>window.meteorReadings.named.phase===2,{},{timeout:10000});await page.waitForTimeout(600);
   await fs.writeFile(out+'/loss.png',Buffer.from(await page.locator('.sandbox-screen').evaluate(canvas=>canvas.toDataURL().split(',')[1]),'base64'));
   await key('r');await page.waitForFunction(()=>window.meteorReadings.named.phase===1);
   await key('q');await page.waitForFunction(()=>window.meteorReadings.named.phase===0);
  }
  if(n===24){
   // The tone plays inside the pool loop at contact; the result must still follow.
   await key(' ');await page.waitForFunction(()=>window.meteorReadings.named.phase===1);
   await page.waitForFunction(()=>window.meteorReadings.named.phase===2,{},{timeout:10000});
   assert((await page.evaluate(()=>window.meteorReadings.named.hull))===0,'Impact hull');
   // Every speaker write ORs in `border`, so a red border survives the impact.
   // Set the value directly: fill() types this 900-line source slowly enough to time out.
   await page.locator('.sandbox-source').evaluate((editor,value)=>{editor.value=value;editor.dispatchEvent(new Event('input',{bubbles:true}));},expected.replace('border: defb 0','border: defb 2'));await run();
   await page.waitForFunction(()=>window.meteorReadings.named.border===2);
   await key(' ');await page.waitForFunction(()=>window.meteorReadings.named.phase===1);
   await page.waitForFunction(()=>window.meteorReadings.named.phase===2,{},{timeout:10000});await page.waitForTimeout(400);
   const rgb=await page.locator('.sandbox-screen').evaluate(canvas=>Array.from(canvas.getContext('2d').getImageData(8,8,1,1).data));
   assert(rgb[0]>150&&rgb[1]<60&&rgb[2]<60,`Border after impact ${rgb}`);
   await page.locator('.sandbox-revert').click();
  }
  if(n===25){
   // Boost sounds on the press edge: boost_last follows the held key.
   await key(' ');await page.waitForFunction(()=>window.meteorReadings.named.phase===1);
   await page.locator('.sandbox-screen').focus();await page.keyboard.down(' ');
   await page.waitForFunction(()=>window.meteorReadings.named.boost_last===1&&window.meteorReadings.named.boost_time===1);
   await page.keyboard.up(' ');await page.waitForFunction(()=>window.meteorReadings.named.boost_last===0||window.meteorReadings.named.phase!==1);
  }
  if(n===26){
   // Star and boost play in the frame waits: a long boost owes cycles across
   // several waits (sound_left) while every update keeps its two frames.
   await page.locator('.sandbox-source').evaluate((editor,value)=>{editor.value=value;editor.dispatchEvent(new Event('input',{bubbles:true}));},expected.replace('boost_sound: defb 100,4, 70,6, 0','boost_sound: defb 100,255, 0'));await run();
   await page.evaluate(()=>{window.soundWait={owed:0,delta:0};document.addEventListener('sandbox:memory',e=>{const v=e.detail.named;if(v.phase!==1)return;window.soundWait.owed=Math.max(window.soundWait.owed,v.sound_left);window.soundWait.delta=Math.max(window.soundWait.delta,v.frame_delta);});});
   await key(' ');await page.waitForFunction(()=>window.meteorReadings.named.phase===1);
   await key(' ');await page.waitForFunction(()=>window.soundWait.owed>0);
   await page.waitForFunction(()=>window.meteorReadings.named.sound_left===0||window.meteorReadings.named.phase!==1,{},{timeout:10000});
   const wait=await page.evaluate(()=>window.soundWait);
   assert(wait.delta<=2,`Late update during a frame-wait sound: ${JSON.stringify(wait)}`);
   await page.locator('.sandbox-revert').click();
  }
  if(n===27){
   // Contact starts the destroyed phase: phase 2, a red border while the pieces fly,
   // then the result with a black border and nothing left of the pieces.
   await key(' ');await page.waitForFunction(()=>window.meteorReadings.named.phase===1);
   const pixel=(x,y)=>page.locator('.sandbox-screen').evaluate((canvas,[x,y])=>Array.from(canvas.getContext('2d').getImageData(x,y,1,1).data),[x,y]);
   await page.waitForFunction(()=>{const d=document.querySelector('.sandbox-screen').getContext('2d').getImageData(8,8,1,1).data;return d[0]>150&&d[1]<60&&d[2]<60;},{},{timeout:10000,polling:'raf'});
   // RAM readings are sampled, so they can trail the canvas by a moment.
   await page.waitForFunction(()=>window.meteorReadings.named.phase===2&&window.meteorReadings.named.hull===0,{},{timeout:2000}).catch(()=>{});
   const hit=await page.evaluate(()=>window.meteorReadings.named);
   assert(hit.phase===2&&hit.hull===0,`Destroyed phase ${JSON.stringify(hit)}`);
   await page.waitForFunction(()=>window.meteorReadings.named.debris_time===0,{},{timeout:10000});await page.waitForTimeout(400);
   const after=await page.evaluate(()=>window.meteorReadings.named);
   assert(after.phase===2&&after.border===0,`Result state ${JSON.stringify(after)}`);
   const rgb=await pixel(8,8);assert(rgb[0]<60&&rgb[1]<60&&rgb[2]<60,`Border after the phase ${rgb}`);
   // Pieces land on Y 179..183; the result draws nothing below its records.
   const lit=await page.locator('.sandbox-screen').evaluate(canvas=>{const d=canvas.getContext('2d').getImageData(48,48+160,256,32).data;let n=0;for(let i=0;i<d.length;i+=4)if(d[i]>100||d[i+1]>100||d[i+2]>100)n++;return n;});
   assert(lit===0,`Pieces left on the result: ${lit} lit pixels`);
   await fs.writeFile(out+'/debris-result.png',Buffer.from(await page.locator('.sandbox-screen').evaluate(canvas=>canvas.toDataURL().split(',')[1]),'base64'));
  }
  if(n===28){
   // Colour by place: in flight every cell of each character row holds that row's row_colours byte.
   // Capture the runner as the program restarts, then read RAM without writing to it.
   const bundle=(await fs.readdir(path.join(root,'dist/_astro'))).find(name=>/^spectrum-runner\..*\.js$/.test(name));
   await page.evaluate(async bundle=>{
    const exports=await import('/_astro/'+bundle);
    const Runner=Object.values(exports).find(value=>typeof value==='function'&&value.prototype.observeFrame&&value.prototype.readMemory);
    const observe=Runner.prototype.observeFrame;Runner.prototype.observeFrame=function(callback){window.meteorRunner=this;return observe.call(this,callback);};
   },bundle);
   await page.evaluate(()=>{window.meteorRunner=null;window.meteorReadings=null;});await run();
   await page.waitForFunction(()=>Boolean(window.meteorRunner&&window.meteorReadings));
   await key(' ');await page.waitForFunction(()=>window.meteorReadings.named.phase===1);
   for(const wait of [200,1200]){
    await page.waitForTimeout(wait);
    const map=await page.evaluate(()=>{const r=window.meteorRunner,sy=window.meteorReadings.symbols;return {phase:r.readMemory(sy.phase,1)[0],bands:Array.from(r.readMemory(sy.row_colours,24)),attributes:Array.from(r.readMemory(0x5800,768))};});
    assert(map.phase===1,`Still in flight ${map.phase}`);
    assert(map.bands.join()==='69,69,71,69,69,69,69,68,68,68,68,70,70,70,70,66,66,66,66,66,71,71,71,71',`row_colours ${map.bands}`);
    assert(map.attributes.length===768,`Attribute map read ${map.attributes.length} bytes`);
    const wrong=map.attributes.findIndex((value,cell)=>value!==map.bands[cell>>5]);
    assert(wrong<0,`Attribute $${(0x5800+wrong).toString(16)} is ${map.attributes[wrong]}, row_colours says ${map.bands[wrong>>5]}`);
   }
  }
  if(n===29){
   // The voyage: launch reads the first storm's course through the `course` pointer.
   await key(' ');await page.waitForFunction(()=>window.meteorReadings.named.phase===1);
   const voyage=await page.evaluate(()=>{const r=window.meteorReadings;return {storm:r.named.storm,course:r.words.course,course1:r.symbols.course_1,courses:r.symbols.courses};});
   assert(voyage.storm===0&&voyage.course===voyage.course1,`Voyage start ${JSON.stringify(voyage)}`);
   await key('q');await page.waitForFunction(()=>window.meteorReadings.named.phase===0);
  }
  if(n===LAST){
   for(const [selector,name] of [['.sandbox-download-tape','meteor-storm.tap'],['.sandbox-download-source','meteor-storm.asm'],['[data-download-companion]','assets.inc']]){
    const pending=page.waitForEvent('download');await page.locator(selector).click();await(await pending).saveAs(out+'/'+name);
   }
   assert((await fs.stat(out+'/meteor-storm.tap')).size>4000,'Game tape');assert(await fs.readFile(out+'/meteor-storm.asm','utf8')===expected,'Downloaded source');
  }
  });
  checks.push(`Lesson ${n}: maintained files, running browser program, actual RAM and navigation`);console.log('PASS',n,timing);
 }
 console.log('Axe, layout and debugger screenshot',await within('Axe, layout and debugger screenshot',300000,async()=>{
 for(const theme of ['light','dark'])for(const n of [1,5,10,12,22,24,25,26,27,28,29,30,31,32]){
  await open(n);await page.emulateMedia({colorScheme:theme,reducedMotion:'reduce'});await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);
  // Listing colours transition on a theme change; axe must see the settled colours, not a frame of the old ink.
  // Two frames first, so the style change has started its transitions before we wait for them.
  await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  await page.evaluate(()=>Promise.all(document.getAnimations().map(a=>a.finished)));
  const violations=(await new AxeBuilder({page}).include('main').analyze()).violations;await fs.writeFile(`${out}/axe-${n}-${theme}.json`,JSON.stringify(violations,null,2));assert(!violations.length,`Axe ${n} ${theme}: ${violations.map(v=>v.id)}`);
 }
 for(const width of [390,1280,1920]){
  await page.setViewportSize({width,height:1000});
  for(const n of [1,5,10,12,22,24,25,26,27,28,29,30,31,32]){await open(n);assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),`Overflow ${n} ${width}: ${JSON.stringify(await page.evaluate(()=>Array.from(document.querySelectorAll('main *')).filter(el=>el.getBoundingClientRect().right>innerWidth).map(el=>({tag:el.tagName,class:el.className,width:el.getBoundingClientRect().width}))))}`);}
  await open(5);await page.screenshot({path:`${out}/lesson-05-${width}.png`,fullPage:true});
 }
 await open(10);await run();await page.locator('[data-break]').click();await page.waitForFunction(()=>document.querySelector('.meteor-debug-state').textContent.includes('Paused'));await page.locator('.meteor-experiment').screenshot({path:out+'/collision-debugger.png'});
 }));
 checks.push('Source and companion edits/revert, missing includes, shift prediction, steering, collision stepping, loss/retry/title, border kept through the impact tone, boost press edge, a long boost played across frame waits without a late update, the destroyed phase (red flash at contact, then a black-bordered result with no pieces), an attribute map matching row_colours in flight, the voyage starting on the first course and file downloads pass');
 checks.push('Representative lesson types pass axe in both themes and fit mobile, desktop and wide viewports');
 assert(!errors.length,errors.join('\n'));await fs.writeFile(out+'/results.json',JSON.stringify({base,checks,errors},null,2)+'\n');
}catch(error){
 // A stuck page cannot answer these either, so they must not replace the error that says where it stuck.
 console.error(String(error));console.error('Browser errors:',errors);
 try{await page.screenshot({path:out+'/failure.png',fullPage:true,timeout:10000});console.error('Status:',await page.locator('.sandbox-status').textContent({timeout:10000}));console.error('Debug:',await page.locator('.meteor-debug-state').allTextContents());}catch(diagnostic){console.error('Page diagnostics unavailable:',diagnostic.message.split('\n')[0]);}
 throw error;}finally{await browser.close()}
