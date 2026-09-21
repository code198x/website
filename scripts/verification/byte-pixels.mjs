import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const [base='http://127.0.0.1:1986',output='/tmp/byte-pixels-checks']=process.argv.slice(2);
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1280,height:1000}});
const errors=[];page.on('pageerror',error=>errors.push(String(error)));
page.on('requestfailed',request=>console.error('Request failed:',request.url(),request.failure()?.errorText));
const checks=[];
try {
 await page.goto(base+'/systems/sinclair-zx-spectrum/assembly/meet-assembly/unit-02/');
 const root=page.locator('.byte-lesson'),source=root.locator('textarea');
 await root.locator('.assembly-editor-colours span').first().waitFor();
 const original=await source.inputValue();
 async function run(){await root.locator('.sandbox-run').click();await page.waitForFunction(()=>document.querySelector('.sandbox-status').textContent.startsWith('Running'))}
 async function bitmap(value){await page.waitForFunction(v=>document.querySelector('.memory-byte').textContent.includes(v),value)}
 async function attribute(value){await page.waitForFunction(v=>document.querySelector('.attribute-byte').textContent.includes(`attribute: ${v} ·`),value)}
 async function zoom(){return root.locator('.pixel-zoom').evaluate(canvas=>Array.from(canvas.getContext('2d').getImageData(0,0,8,1).data))}
 if(await root.locator('.readings').isVisible())throw Error('Answer exposed before run');
 await root.locator('.save-prediction').click();await run();await bitmap('10101010');
 if(!(await root.locator('.comparison').textContent()).includes('Your prediction was 00000000'))throw Error('Mismatch feedback missing');
 for(const bit of [7,5,3,1])await root.locator(`[data-bit="${bit}"]`).click();
 await root.locator('.save-prediction').click();
 if(!(await root.locator('.comparison').textContent()).includes('match'))throw Error('Prediction match missing');
 const initialZoom=await zoom();
 for(let pixel=0;pixel<8;pixel++)if(initialZoom[pixel*4]!== (pixel%2 ? 0 : 255))throw Error('Actual screen crop misaligned');
 checks.push('prediction mismatch and match; actual screen crop agrees with alternating RAM bits');
 await root.locator('[data-stage="1"]').click();
 await source.fill(original.replace('%10101010','%00011000'));
 if(!(await root.locator('.observation-note').textContent()).includes('Source changed'))throw Error('Stale result not labelled');
 if(!(await root.locator('.memory-byte').textContent()).includes('10101010'))throw Error('Source edit faked machine state');
 await run();await bitmap('00011000');
 await root.locator('[data-stage="2"]').click();
 if(!(await source.inputValue()).includes('%00011000'))throw Error('Stage lost edits');
 await source.fill((await source.inputValue()).replace('ld a,71','ld a,64'));
 await run();await attribute(64);await bitmap('00011000');
 if((await zoom()).some((value,index)=>index%4!==3&&value!==0))throw Error('Invisible pattern still visibly lit');
 await root.locator('.observation').screenshot({path:output+'/invisible-pattern.png'});
 await source.fill((await source.inputValue()).replace('ld a,64','ld a,66'));
 await run();await attribute(66);
 const red=await zoom();
 if(red[3*4]!==255 || red[3*4+1]!==0 || red[3*4+2]!==0)throw Error('Pattern not red');
 checks.push('purposeful pattern edit, stale-result label, source continuity, black-on-black and red restoration');
 await source.fill((await source.inputValue()).replace(' ld ($4000),a',' ld ($4000),a\n ld a,%00001111\n ld ($4000),a'));
 await run();await bitmap('00001111');
 checks.push('second machine write replaces rather than overlays first pattern');
 const downloadPromise=page.waitForEvent('download');await root.locator('.save-source').click();const download=await downloadPromise;await download.saveAs(output+'/one-byte.asm');
 if(await fs.readFile(output+'/one-byte.asm','utf8')!==await source.inputValue())throw Error('Download differs from editor');
 await root.locator('.sandbox-revert').click();if(await source.inputValue()!==original)throw Error('Revert failed');
 await run();await bitmap('10101010');await attribute(71);
 checks.push('current-source download and complete original-source restore');
 await root.screenshot({path:output+'/desktop.png'});
 await page.setViewportSize({width:390,height:844});
 if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Page overflows');
 await root.screenshot({path:output+'/mobile.png'});
 await root.locator('[data-bit="7"]').focus();await page.keyboard.press('Space');
 if(await root.locator('[data-bit="7"]').getAttribute('aria-pressed')!=='false')throw Error('Keyboard prediction toggle failed');
 await page.emulateMedia({forcedColors:'active'});
 if(await root.locator('[data-bit="5"]').evaluate(e=>getComputedStyle(e).outlineStyle)==='none')throw Error('Forced colours selected state lost');
 checks.push('mobile no page overflow, keyboard prediction control and forced-colours selection');
 if(errors.length)throw Error(errors.join('\n'));
 await fs.writeFile(output+'/results.json',JSON.stringify(checks,null,2)+'\n');console.log(checks);
}finally{await browser.close()}
