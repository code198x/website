import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
import nodePath from 'node:path';
const samples = process.env.CODE_SAMPLES_PATH || nodePath.resolve(import.meta.dirname, '../../../code-samples');
const base=process.argv[2]||'http://127.0.0.1:1986';
const out=process.argv[3]||'/tmp/meet-assembly-release-overview';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:1280,height:1000}});const page=await context.newPage();const errors=[],checks=[];
page.on('pageerror',error=>errors.push(String(error)));
const assert=(value,message)=>{if(!value)throw Error(message)};
const path='/systems/sinclair-zx-spectrum/assembly/meet-assembly';
try {
 await page.goto(base+'/systems/sinclair-zx-spectrum/assembly/');
 await page.getByRole('link',{name:'Start: Meet Assembly'}).click();
 await page.waitForURL('**/meet-assembly/unit-01/');
 await page.locator('.sandbox-run').click();
 await page.waitForFunction(()=>document.querySelector('.sandbox-status').textContent.startsWith('Running'));
 await page.waitForFunction(()=>{const c=document.querySelector('.sandbox-screen');const rgba=c.getContext('2d').getImageData(0,0,1,1).data;return rgba[0]>100&&rgba[1]===0&&rgba[2]===0});
 const source=page.locator('.sandbox-source');await source.fill((await source.inputValue()).replace('ld a,2','ld a,4'));
 await page.locator('.sandbox-run').click();await page.waitForFunction(()=>document.querySelector('.sandbox-status').textContent.startsWith('Running'));
 await page.waitForFunction(()=>{const c=document.querySelector('.sandbox-screen');const rgba=c.getContext('2d').getImageData(0,0,1,1).data;return rgba[0]===0&&rgba[1]>100&&rgba[2]===0});
 checks.push('Recommended starting link reaches lesson 1; real border changes red to green');
 for(let n=1;n<=8;n++){
  if(n>1){await page.locator('a.nav-next').click();await page.waitForURL(`**/unit-0${n}/`)}
  assert(await page.locator('h1').count()===1,`Lesson ${n} heading`);
  const expected=await fs.readFile(`${samples}/sinclair-zx-spectrum/assembly/meet-assembly/opening/${['first-program','one-byte','eight-rows','row-loop','draw-routine','move-character','clocked-character','debug-branch'][n-1]}.asm`,'utf8');
  if(n>1)assert((await source.inputValue()).trim()===expected.trim(),`Lesson ${n} source differs`);
  if(n===8)assert(await page.locator('a.nav-next').count()===0,'Final lesson next links nowhere');
 }
 checks.push('All eight lessons navigate in order with maintained source and no unavailable next lesson');
 for(const theme of ['light','dark']){
  for(const n of [1,2,3,4,5,6,7,8]){
   await page.goto(base+path+`/unit-0${n}/`);await page.addStyleTag({content:'*, *::before, *::after { transition: none !important; animation: none !important; }'});await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);await page.emulateMedia({colorScheme:theme,reducedMotion:'reduce'});
   const result=await new AxeBuilder({page}).include('main').analyze();await fs.writeFile(out+`/axe-${n}-${theme}.json`,JSON.stringify(result.violations,null,2));assert(!result.violations.length,`Axe ${n} ${theme}: ${result.violations.map(v=>v.id)}`);
  }
 }
 checks.push('All eight lesson main regions pass axe in light and dark themes');
 await page.goto(base+path+'/unit-03/');await page.locator('.sandbox-run').click();await page.waitForFunction(()=>document.querySelector('.sandbox-status').textContent.startsWith('Running'));
 await page.locator('.pixel-zoom').screenshot({path:out+'/experiment.png',animations:'disabled'});
 for(const width of [390,1280,1920]){
  await page.setViewportSize({width,height:1000});
  for(const route of ['/systems/sinclair-zx-spectrum/', '/systems/sinclair-zx-spectrum/assembly/',path+'/',path+'/unit-01/',path+'/unit-08/']){
   await page.goto(base+route);assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),`Overflow ${width} ${route}`);
   if(route.endsWith('/assembly/'))await page.screenshot({path:out+`/track-${width}.png`,fullPage:true});
  }
 }
 checks.push('Entry pages and endpoint lessons fit narrow, desktop and wide layouts');
 await page.goto(base+'/systems/sinclair-zx-spectrum/assembly/meet-the-machine/unit-01/');assert(await page.locator('h1').count()===1,'Old lesson inaccessible');
 assert(!errors.length,errors.join('\n'));await fs.writeFile(out+'/results.json',JSON.stringify({base,checks,errors},null,2)+'\n');console.log(checks);
}finally{await browser.close()}
