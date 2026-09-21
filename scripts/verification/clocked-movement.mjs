import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
const [base='http://127.0.0.1:1986',output='/tmp/clock-checks']=process.argv.slice(2);
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:1280,height:1000}}),page=await context.newPage();
const checks=[],errors=[];page.on('pageerror',e=>errors.push(String(e)));
const assert=(x,msg)=>{if(!x)throw Error(msg)};
try{
 await page.goto(base+'/systems/sinclair-zx-spectrum/assembly/meet-assembly/unit-06/');
 await page.locator('a.nav-next').click();await page.waitForURL('**/unit-07/');
 const root=page.locator('.movement-lesson'),source=root.locator('textarea'),screen=root.locator('.sandbox-screen');
 await root.locator('.assembly-editor-colours span').first().waitFor();
 await page.waitForFunction(()=>document.querySelector('.movement-lesson').dataset.ready==='true');
 await root.evaluate(el=>el.addEventListener('sandbox:memory',e=>window.reading=e.detail));
 const original=await source.inputValue();
 async function read(){return page.evaluate(()=>window.reading)}
 async function run(interval=6){await page.evaluate(()=>window.reading=null);await root.locator('.sandbox-run').click();await page.waitForFunction(n=>window.reading?.named.interval===n,interval)}
 async function rate(n){
  const before=(await read()).named;
  await page.waitForFunction(f=>(window.reading.named.frames-f+256)%256>=60,before.frames);
  const after=(await read()).named,frames=(after.frames-before.frames+256)%256,updates=(after.updates-before.updates+256)%256;
  assert(updates===Math.floor((frames+n-before.remaining)/n),`Wrong ${n}-frame cadence: ${frames} frames, ${updates} updates`);
 }
 await run();await rate(6);assert((await read()).named.position===15,'Idle clock moved position');
 await screen.focus();await page.keyboard.down('KeyO');await page.waitForFunction(()=>window.reading.named.position<=11);await page.keyboard.up('KeyO');
 await page.waitForFunction(()=>window.reading.named.keys===3);let reading=await read();assert(reading.named.moves>=4,'Held input not repeated');
 await root.locator('.clock-inspector').screenshot({path:output+'/six-frames.png'});
 const both=root.locator('[data-keys="KeyO,KeyP"]');await both.focus();await page.keyboard.down('Space');await page.waitForFunction(()=>window.reading.named.keys===0);
 const position=(await read()).named.position;await rate(6);assert((await read()).named.position===position,'Both keys moved');await page.keyboard.up('Space');
 checks.push('Navigation, actual frame/countdown/update cadence, idle clock and held movement, both-key cancellation');
 for(const interval of [12,3]){
  await root.locator(`[data-interval="${interval}"]`).click();assert((await source.inputValue()).includes(`interval: defb ${interval}`),'Button did not edit source');
  assert((await root.locator('.movement-status').textContent()).includes('Source changed'),'Stale state hidden');
  await run(interval);await rate(interval);
 }
 await screen.focus();await page.keyboard.down('KeyP');await page.waitForFunction(()=>window.reading.named.position===31);await page.keyboard.up('KeyP');
 await page.keyboard.down('KeyO');await page.waitForFunction(()=>window.reading.named.position===0);await page.keyboard.up('KeyO');
 reading=await read();const pattern=[24,60,126,219,255,60,102,66];
 for(let row=0;row<8;row++)for(let col=0;col<32;col++)assert(reading.values[row*32+col]===(col===0?pattern[row]:0),'Clocked erase/draw corrupt');
 checks.push('Source interval 12 and 3 produce exact update counts; both edges and clean redraw hold under repetition');
 await source.fill(original.replace('interval: defb 6','interval: defb 0'));await run(0);const start=(await read()).named.updates;
 await page.waitForFunction(u=>window.reading.named.updates!==u,start,{timeout:10000});
 assert((await root.locator('.clock-rate').textContent()).includes('256 frames'),'Zero interval not explained');
 await source.fill(original.replace('\n ei\n','\n di\n'));await run();await page.waitForTimeout(350);assert((await read()).named.frames===0,'DI did not stop HALT loop');
 const stoppedRom=(await read()).values.slice(256,259);await page.waitForTimeout(350);assert(JSON.stringify((await read()).values.slice(256,259))===JSON.stringify(stoppedRom),'ROM clock advanced with DI');
 await root.locator('.clock-inspector').screenshot({path:output+'/disabled-interrupts.png'});
 await root.locator('.sandbox-revert').click();assert(await source.inputValue()===original,'Revert failed');await run();await rate(6);assert((await root.locator('.interval-note').textContent()).includes('Source interval: 6.'),'Interval note not restored');
 checks.push('Zero interval wraps through 256 frames; DI stops program and ROM clocks; restoring EI repairs execution');
 const downloadPromise=page.waitForEvent('download');await root.locator('.download-movement').click();const download=await downloadPromise;await download.saveAs(output+'/clocked-character.asm');assert(download.suggestedFilename()==='clocked-character.asm'&&await fs.readFile(output+'/clocked-character.asm','utf8')===original,'Wrong download');
 await page.setViewportSize({width:390,height:844});assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),'Mobile overflow');
 await page.mouse.move(0,0);await page.waitForTimeout(300);await root.locator('.clock-inspector').screenshot({path:output+'/mobile-clock.png',animations:'disabled'});
 const left=root.locator('[data-keys="KeyO"]');await left.scrollIntoViewIfNeeded();const box=await left.boundingBox();await page.mouse.move(box.x+20,box.y+20);await page.mouse.down();await page.waitForFunction(()=>window.reading.named.position<14);await page.mouse.up();
 const accessibility=await new AxeBuilder({page}).include('.movement-lesson').analyze();assert(accessibility.violations.length===0,'Accessibility failures: '+accessibility.violations.map(v=>v.id));
 checks.push('Clocked source download, mobile layout and held pointer input, zero scoped axe violations');
 assert(!errors.length,errors.join('\n'));await fs.writeFile(output+'/results.json',JSON.stringify(checks,null,2)+'\n');console.log(checks);
}catch(error){await page.screenshot({path:output+'/failure.png'});throw error}finally{await browser.close()}
