import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
const base=process.argv[2]||'http://127.0.0.1:1986',out=process.argv[3]||'/tmp/meteor-browser';
await fs.mkdir(out,{recursive:true});
const root=path.resolve(import.meta.dirname,'../..'),samples=process.env.CODE_SAMPLES_PATH||path.resolve(root,'../code-samples');
const route='/systems/sinclair-zx-spectrum/assembly/meteor-storm';
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:1280,height:1000}});
const page=await context.newPage(),errors=[],checks=[];
page.on('pageerror',error=>errors.push(String(error)));
await page.addInitScript(()=>{window.meteorReadings=null;document.addEventListener('sandbox:memory',event=>window.meteorReadings=event.detail);});
const assert=(value,message)=>{if(!value)throw Error(message)};
async function open(n){
 await page.goto(base+route+`/unit-${String(n).padStart(2,'0')}/`);
}
async function run(){await page.waitForFunction(()=>document.querySelector('.sandbox')?.dataset.sandboxReady==='true'&&document.querySelector('.meteor-experiment')?.dataset.ready==='true');await page.locator('.sandbox-run').click();await page.waitForFunction(()=>document.querySelector('.sandbox-status').textContent.startsWith('Running')||document.querySelector('.sandbox-status').dataset.state==='error',{},{timeout:20000});assert((await page.locator('.sandbox-status').textContent()).startsWith('Running'),await page.locator('.sandbox-status').textContent()+' '+await page.locator('.sandbox-diagnostics').textContent());}
async function key(name,ms=100){await page.locator('.sandbox-screen').focus();await page.keyboard.down(name);await page.waitForTimeout(ms);await page.keyboard.up(name);}
try{
 for(let n=Number(process.env.METEOR_FIRST??1);n<=24;n++){
  await open(n);
  const prose=await fs.readFile(path.join(root,`src/content/curriculum/sinclair-zx-spectrum/assembly/meteor-storm/unit-${String(n).padStart(2,'0')}.mdx`),'utf8');
  const checkpoint=prose.match(/<MeteorExperiment checkpoint="([^"]+)"/)[1];
  const directory=path.join(samples,`sinclair-zx-spectrum/assembly/meteor-storm/checkpoints/${checkpoint}`);
  const expected=await fs.readFile(directory+'/meteor-storm.asm','utf8');
  assert(await page.locator('.sandbox-source').inputValue()===expected,`Source ${n}`);
  if(await page.locator('.sandbox-companion').count())assert(await page.locator('.sandbox-companion').inputValue()===await fs.readFile(directory+'/assets.inc','utf8'),`Companion ${n}`);
  await run();await page.waitForFunction(()=>Boolean(window.meteorReadings));
  assert(await page.locator('h1').count()===1,`Heading ${n}`);
  if(n<24)assert((await page.locator('a.nav-next').getAttribute('href')).includes(`unit-${String(n+1).padStart(2,'0')}`),`Next ${n}`);
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
  if(n===22){
   await key(' ');await page.waitForFunction(()=>window.meteorReadings.named.phase===1);
   await page.waitForFunction(()=>window.meteorReadings.named.phase===2,{},{timeout:10000});await page.waitForTimeout(600);
   await fs.writeFile(out+'/loss.png',Buffer.from(await page.locator('.sandbox-screen').evaluate(canvas=>canvas.toDataURL().split(',')[1]),'base64'));
   await key('r');await page.waitForFunction(()=>window.meteorReadings.named.phase===1);
   await key('q');await page.waitForFunction(()=>window.meteorReadings.named.phase===0);
  }
  if(n===24){
   for(const [selector,name] of [['.sandbox-download-tape','meteor-storm.tap'],['.sandbox-download-source','meteor-storm.asm'],['[data-download-companion]','assets.inc']]){
    const pending=page.waitForEvent('download');await page.locator(selector).click();await(await pending).saveAs(out+'/'+name);
   }
   assert((await fs.stat(out+'/meteor-storm.tap')).size>4000,'Game tape');assert(await fs.readFile(out+'/meteor-storm.asm','utf8')===expected,'Downloaded source');
  }
  checks.push(`Lesson ${n}: maintained files, running browser program, actual RAM and navigation`);console.log('PASS',n);
 }
 for(const theme of ['light','dark'])for(const n of [1,5,10,12,22,24]){
  await open(n);await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);await page.emulateMedia({colorScheme:theme,reducedMotion:'reduce'});
  const violations=(await new AxeBuilder({page}).include('main').analyze()).violations;await fs.writeFile(`${out}/axe-${n}-${theme}.json`,JSON.stringify(violations,null,2));assert(!violations.length,`Axe ${n} ${theme}: ${violations.map(v=>v.id)}`);
 }
 for(const width of [390,1280,1920]){
  await page.setViewportSize({width,height:1000});
  for(const n of [1,5,10,12,22,24]){await open(n);assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),`Overflow ${n} ${width}: ${JSON.stringify(await page.evaluate(()=>Array.from(document.querySelectorAll('main *')).filter(el=>el.getBoundingClientRect().right>innerWidth).map(el=>({tag:el.tagName,class:el.className,width:el.getBoundingClientRect().width}))))}`);}
  await open(5);await page.screenshot({path:`${out}/lesson-05-${width}.png`,fullPage:true});
 }
 await open(10);await run();await page.locator('[data-break]').click();await page.waitForFunction(()=>document.querySelector('.meteor-debug-state').textContent.includes('Paused'));await page.locator('.meteor-experiment').screenshot({path:out+'/collision-debugger.png'});
 checks.push('Source and companion edits/revert, missing includes, shift prediction, steering, collision stepping, loss/retry/title and file downloads pass');
 checks.push('Representative lesson types pass axe in both themes and fit mobile, desktop and wide viewports');
 assert(!errors.length,errors.join('\n'));await fs.writeFile(out+'/results.json',JSON.stringify({base,checks,errors},null,2)+'\n');
}catch(error){await page.screenshot({path:out+'/failure.png',fullPage:true});console.error('Browser errors:',errors);console.error('Status:',await page.locator('.sandbox-status').textContent());console.error('Debug:',await page.locator('.meteor-debug-state').allTextContents());throw error;}finally{await browser.close()}
