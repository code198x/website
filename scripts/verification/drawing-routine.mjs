import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const [base='http://127.0.0.1:1986',output='/tmp/drawing-routine-checks']=process.argv.slice(2);
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1280,height:1000}});
const checks=[],errors=[];page.on('pageerror',e=>errors.push(String(e)));
try{
 await page.goto(base+'/systems/sinclair-zx-spectrum/assembly/meet-assembly/unit-05/');
 const root=page.locator('.routine-lesson'),source=root.locator('textarea');
 await root.locator('.assembly-editor-colours span').first().waitFor();
 await page.waitForFunction(()=>document.querySelector('.routine-lesson').dataset.ready==='true');
 await root.evaluate(el=>el.addEventListener('sandbox:routine',e=>window.captured=e.detail));
 const original=await source.inputValue();
 async function run(){await page.evaluate(()=>window.captured=null);await root.locator('.sandbox-run').click();await page.waitForFunction(()=>window.captured);return page.evaluate(()=>window.captured)}
 function assert(value,message){if(!value)throw Error(message)}
 let capture=await run();let events=capture.trace.events;
 assert(capture.trace.complete&&events.map(e=>e.kind).join(',')===['call',...Array(8).fill('write'),'return','call',...Array(8).fill('write'),'return'].join(','),'Wrong event sequence');
 const patterns=[24,60,126,219,255,60,102,66];
 for(let call=0;call<2;call++){
  const c=events[call*10],r=events[call*10+9];
  assert(c.target===capture.symbols.draw_character&&c.before.hl===capture.symbols.patterns&&c.before.de===0x4000+call,'Wrong routine input');
  assert(c.after.sp===c.before.sp-2&&r.after.sp===c.before.sp,'Unbalanced stack');
  assert(r.target===(call?capture.symbols.hold:capture.symbols.second)&&r.after.hl===capture.symbols.patterns+8&&r.after.de===0x4800+call&&r.after.b===0&&r.after.a===66,'Wrong return state');
  for(let row=0;row<8;row++)assert(events[call*10+1+row].addr===0x4000+row*256+call&&events[call*10+1+row].value===patterns[row],'Wrong actual write');
 }
 await root.locator('.next-return').click();assert(await root.locator('.events li').count()===10,'First return replay');
 await root.locator('.next-return').click();assert(await root.locator('.events li').count()===20,'Second return replay');
 await root.locator('.routine-replay').screenshot({path:output+'/two-calls.png'});
 await root.locator('.live-result').screenshot({path:output+'/live-cells.png'});
 checks.push('Two actual CALLs, sixteen writes, two RETs; routine inputs, advanced registers and balanced stack');
 await source.fill(original.replace('ld de,$4001','ld de,$4002'));capture=await run();
 assert(capture.trace.events[10].before.de===0x4002&&capture.trace.events[18].addr===0x4702,'Destination edit ignored');
 await page.waitForFunction(()=>document.querySelector('[data-byte="2"]').textContent==='00011000');
 assert(await root.locator('[data-byte="1"]').textContent()==='00000000','Middle cell not empty');
 checks.push('Second destination moves the drawing to cell three with cell two untouched');
 await source.fill(original.replace('second:\n ld hl,patterns','second:'));capture=await run();
 assert(capture.trace.events[10].before.hl===capture.symbols.patterns+8&&capture.trace.events[19].after.hl===capture.symbols.patterns+16,'Missing input hidden');
 await root.locator('.next-return').click();await root.locator('.next-event').click();
 await root.locator('.routine-replay').screenshot({path:output+'/missing-input.png'});
 checks.push('Omitting second HL preparation exposes the advanced pointer at the next call');
 await source.fill(original.replace('ld de,$4001','ld de,$4000'));capture=await run();
 assert(capture.trace.events.filter(e=>e.kind==='write').every((e,i)=>e.addr===0x4000+(i%8)*256),'Repeated destination wrong');
 await source.fill(original);await page.evaluate(()=>sessionStorage.setItem('meet-assembly-character',JSON.stringify([128,60,126,219,255,60,102,66])));
 await root.locator('.import-character').click();assert((await source.inputValue()).includes('%10000000'),'Import failed');
 assert((await root.locator('.trace-status').textContent()).includes('Source changed'),'Missing stale marker');
 capture=await run();assert(capture.trace.events[1].value===128&&capture.trace.events[11].value===128,'Imported pattern not executed');
 const downloadPromise=page.waitForEvent('download');await root.locator('.download-source').click();const download=await downloadPromise;await download.saveAs(output+'/draw-routine.asm');
 assert(await fs.readFile(output+'/draw-routine.asm','utf8')===await source.inputValue(),'Download differs');
 await source.fill(original.replace(' ret',' jr draw_character'));capture=await run();assert(!capture.trace.complete,'Infinite routine marked complete');
 assert((await root.locator('.trace-status').textContent()).includes('partial trace'),'Partial trace unlabelled');
 await root.locator('.sandbox-revert').click();assert(await source.inputValue()===original,'Revert failed');await run();
 await page.setViewportSize({width:390,height:844});assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),'Mobile overflow');
 await root.locator('.next-event').focus();await page.keyboard.press('Enter');assert(await root.locator('.events li').count()===1,'Keyboard replay failed');
 await root.locator('.routine-replay').screenshot({path:output+'/mobile.png'});
 checks.push('Overwrite, saved artwork, stale labels, exact source download, bounded incomplete trace, Revert and mobile keyboard replay');
 assert(!errors.length,errors.join('\n'));await fs.writeFile(output+'/results.json',JSON.stringify(checks,null,2)+'\n');console.log(checks);
}catch(error){await page.screenshot({path:output+'/failure.png'});throw error}finally{await browser.close()}
