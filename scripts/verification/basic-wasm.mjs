/** Run against a static website build with the two BASIC playgrounds. Requires installed Chrome. */
import fs from 'node:fs/promises';
import path from 'node:path';
import {chromium} from '@playwright/test';
const [base='http://127.0.0.1:1986', output='/tmp/basic-wasm-checks']=process.argv.slice(2);
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1280,height:1000},acceptDownloads:true});
const errors=[];const reports=[];page.on('pageerror',e=>errors.push(String(e)));
const greeting='/systems/sinclair-zx-spectrum/basic/meet-basic/unit-01-make-the-spectrum-answer/';
const sonar='/systems/sinclair-zx-spectrum/basic/sonar/unit-04-read-the-sonar/';
const root=page.locator('.basic-playground');
const source=root.locator('textarea');
async function screen(text){await page.waitForFunction(t=>document.querySelector('.basic-transcript pre').textContent.includes(t),text,{timeout:60000});}
async function loaded(){await page.waitForFunction(()=>document.querySelector('.basic-status').textContent.startsWith('Program loaded'),{},{timeout:60000});}
async function button(action){await root.locator(`[data-action=${action}]`).click();}
async function tap(key){await root.locator(`[data-key=${key}]`).click();}
async function capture(name){await root.screenshot({path:path.join(output,name+'.png')});}
async function alignment(width){
 await page.setViewportSize({width,height:1000});
 const result=await root.evaluate(root=>{
  const s=root.querySelector('textarea'),m=root.querySelector('.assembly-editor-colours');
  const a=s.getBoundingClientRect(),b=root.querySelector('canvas').getBoundingClientRect(),c=m.getBoundingClientRect();
  return {delta:Math.max(Math.abs(a.y-b.y),Math.abs(a.width-b.width),Math.abs(a.height-b.height)),mirror:Math.max(Math.abs(a.y-c.y),Math.abs(a.height-c.height)),background:getComputedStyle(s).backgroundColor,overflow:document.documentElement.scrollWidth>innerWidth};
 });
 if(result.overflow || result.mirror>1 || (width>=960 && result.delta>1) || result.background!=='rgba(0, 0, 0, 0)')throw Error('Editor geometry/style '+JSON.stringify(result));
}
try{
 await page.goto(base+greeting);await root.locator('.assembly-editor-colours span').first().waitFor();
 const original=await source.inputValue();
 await alignment(1280);
 await page.evaluate(()=>{window.trialFrames=0;window.trialActive=true;const tick=()=>{if(window.trialActive){window.trialFrames++;requestAnimationFrame(tick)}};requestAnimationFrame(tick)});
 await button('run');
 await source.fill(original.replace('Welcome','Edited greeting'));
 await screen('Welcome');await loaded();
 const frames=await page.evaluate(()=>{window.trialActive=false;return window.trialFrames});
 if(frames<2)throw Error('UI did not keep rendering during load');
 if(!(await source.inputValue()).includes('Edited greeting'))throw Error('Edit lost during boot');
 reports.push({check:'editor remains responsive during worker boot',ui_frames:frames});
 await button('run');await screen('Edited greeting');await loaded();
 await capture('greeting-edited');reports.push({check:'source edit changes real ROM output',passed:true});
 // The download must come from current source, even without pressing Run.
 await source.fill('10 PRINT "TAPE COPY"\n');
 const downloadPromise=page.waitForEvent('download');await button('download');
 const download=await downloadPromise;await download.saveAs(path.join(output,'greeting.tap'));
 const tape=await fs.readFile(path.join(output,'greeting.tap'));
 let offset=0,blocks=0;
 while(offset<tape.length){const size=tape.readUInt16LE(offset);const block=tape.subarray(offset+2,offset+2+size);if(block.length!==size||block.reduce((a,b)=>a^b,0)!==0)throw Error('Bad TAP length/checksum');offset+=size+2;blocks++;}
 if(blocks!==2||!tape.includes(Buffer.from('TAPE COPY')))throw Error('Download does not contain current source');
 reports.push({check:'downloaded edited BASIC tape',bytes:tape.length});
 await source.fill('PRINT "missing number"');await button('run');await page.waitForFunction(()=>!document.querySelector('.basic-error').hidden);
 if(!(await root.locator('.basic-error').textContent()).includes('line number'))throw Error('Missing useful error');
 await button('restore');if(await source.inputValue()!==original)throw Error('Restore failed');
 if(await root.locator('.basic-error').isVisible())throw Error('Restore did not clear diagnostic');
 await source.fill('10 PRONT 2\n');await button('run');await screen('Nonsense');
 reports.push({check:'ROM reports syntax mistake without silent source repair',passed:true});
 await button('restore');await button('run');await screen('Welcome');await loaded();
 await page.goto(base+sonar);await root.locator('.assembly-editor-colours span').first().waitFor();
 await button('run');await screen('Row (1-8, Q)');await loaded();
 await tap('Digit3');await tap('Enter');await screen('Column (1-8, Q)');
 await tap('Digit5');await tap('Enter');await screen('Near: 1 or 2');
 await root.locator('canvas').focus();
 await page.keyboard.press('Digit3',{delay:100});await page.keyboard.press('Enter',{delay:100});await screen('Column (1-8, Q)');
 await page.keyboard.press('Digit6',{delay:100});await page.keyboard.press('Enter',{delay:100});await screen('Found!');
 await capture('sonar-found');reports.push({check:'virtual and physical keyboard probes return Near and Found',passed:true});
 // Editor keys do not go to the running Spectrum.
 await source.focus();await page.keyboard.press('End');await page.keyboard.type(' ');
 await page.waitForTimeout(150);
 const before=await root.locator('.basic-transcript pre').textContent();
 await page.keyboard.type('q');await page.waitForTimeout(200);
 if((await root.locator('.basic-transcript pre').textContent()).includes('Finished.'))throw Error('Editor sent Q to Spectrum');
 // New source moves the target, and replacement during boot must win.
 const changed=(await source.inputValue()).replace('LET tr = 3: LET tc = 6','LET tr = 1: LET tc = 1').replace(/ q/,' ');
 await source.fill(changed);await button('run');await button('run');await screen('Row (1-8, Q)');await loaded();
 await tap('Digit1');await tap('Enter');await screen('Column (1-8, Q)');await tap('Digit1');await tap('Enter');await screen('Found!');
 await tap('KeyQ');await tap('Enter');await screen('Finished.');
 reports.push({check:'changed target, restart during boot, quit and focus isolation',passed:true});
 const downloadSonar=page.waitForEvent('download');await button('download');await (await downloadSonar).saveAs(path.join(output,'sonar.tap'));
 await button('restore');await alignment(390);await capture('mobile');
 await page.emulateMedia({forcedColors:'active'});
 if(await source.evaluate(e=>getComputedStyle(e).webkitTextFillColor)==='transparent')throw Error('Source hidden in forced colours');
 reports.push({check:'mobile geometry and forced-colours fallback',passed:true});
 if(errors.length)throw Error(errors.join('\n'));
 await fs.writeFile(path.join(output,'browser-results.json'),JSON.stringify(reports,null,2)+'\n');
 console.log(JSON.stringify(reports,null,2));
} catch(error){await page.screenshot({path:path.join(output,'failure.png')});throw error}
finally{await browser.close()}
