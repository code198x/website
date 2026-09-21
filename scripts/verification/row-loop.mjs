import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const [base='http://127.0.0.1:1986',output='/tmp/row-loop-checks']=process.argv.slice(2);
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1280,height:1000}});
const errors=[];page.on('pageerror',e=>errors.push(String(e)));
const checks=[];
try {
 const route='/systems/sinclair-zx-spectrum/assembly/meet-assembly/';
 const root=page.locator('.byte-lesson'),source=root.locator('textarea');
 async function run(){await root.locator('.sandbox-run').click();await page.waitForFunction(()=>document.querySelector('.sandbox-status').textContent.startsWith('Running'))}
 async function count(n){await page.waitForFunction(n=>document.querySelector('.replay-note').textContent.startsWith(`0 of ${n} captured`),n)}
 async function next(n){for(let i=0;i<n;i++)await root.locator('.replay-next').click()}
 await page.goto(base+route+'unit-03/');await source.waitFor();await root.locator('.assembly-editor-colours span').first().waitFor();await page.waitForFunction(()=>document.querySelector('.byte-lesson').dataset.ready==='true');
 await source.fill((await source.inputValue()).replace('%00011000','%10011000'));
 await root.locator('.transfer-character').click();
 if(!(await root.locator('.transfer-note').textContent()).includes('Run the current'))throw Error('Allowed transfer before execution');
 await run();await page.waitForFunction(()=>document.querySelector('[data-live-row="0"]').textContent==='10011000');
 await root.locator('.transfer-character').click();
 await page.locator('a.nav-next').click();await page.waitForURL('**/unit-04/');
 await root.locator('.assembly-editor-colours span').first().waitFor();
 const original=await source.inputValue();
 await run();await count(8);await next(8);
 let writes=await root.locator('.replay-writes li').allTextContents();
 const expected=[24,60,126,219,255,60,102,66];
 for(let i=0;i<8;i++)if(!writes[i].includes('$'+(0x4000+i*256).toString(16).toUpperCase())||!writes[i].includes(expected[i].toString(2).padStart(8,'0')))throw Error('Incorrect recorded trace '+writes);
 const replayPixels = await root.locator('.replay-pixels').evaluate(c=>Array.from(c.getContext('2d').getImageData(0,0,8,8).data));
 for(let row=0;row<8;row++)for(let x=0;x<8;x++)if(replayPixels[(row*8+x)*4]!==((expected[row]&(128>>x))?255:0))throw Error('Replay reconstruction differs from captured writes');
 if(await root.locator('.row-readings tr[data-replay-current] [data-live-row]').getAttribute('data-live-row')!=='7')throw Error('Current replay row not highlighted');
 if(!await root.locator('.replay-next').isDisabled())throw Error('Replay exceeds capture');
 await root.locator('.replay-reset').click();if(await root.locator('.replay-writes li').count())throw Error('Replay reset failed');
 if(await root.locator('.replay-pixels').evaluate(c=>c.getContext('2d').getImageData(0,0,1,1).data[0])!==136)throw Error('Unwritten rows not distinguished from zero');
 await root.locator('.transfer-character').click();
 if(!(await source.inputValue()).includes('defb %10011000'))throw Error('Character did not cross lesson boundary');
 if(!(await root.locator('.replay-note').textContent()).includes('Source changed'))throw Error('Old trace not labelled');
 await run();await count(8);await next(1);
 if(!(await root.locator('.replay-writes li').first().textContent()).includes('10011000'))throw Error('Imported artwork absent from actual trace');
 checks.push('actual ordered eight-write capture, bounded replay/reset, same-tab artwork transfer, stale trace label');
 await root.locator('[data-stage="1"]').click();
 await source.fill((await source.inputValue()).replace('ld b,8','ld b,4'));
 await run();await count(4);await next(4);
 if(!(await root.locator('.replay-writes li').last().textContent()).includes('$4300'))throw Error('Four-turn loop did not stop at row4');
 checks.push('changing B to 4 captures exactly four writes, ending at $4300');
 await root.locator('[data-stage="2"]').click();
 await source.fill((await source.inputValue()).replace('ld b,4','ld b,8').replace(' inc d\n',''));
 await run();await count(8);await next(8);
 writes=await root.locator('.replay-writes li').allTextContents();
 if(writes.some(text=>!text.includes('$4000')))throw Error('Missing INC D did not keep destination fixed');
 await page.waitForFunction(()=>document.querySelector('[data-live-row="0"]').textContent==='01000010');
 checks.push('missing INC D records eight replacement writes at $4000; last data byte survives');
 await root.locator('.write-replay').screenshot({path:output+'/repeated-address.png'});
 await source.fill((await source.inputValue()).replace(' inc hl\n',' inc hl\n inc d\n'));
 await run();await count(8);await next(8);
 const downloadPromise=page.waitForEvent('download');await root.locator('.save-source').click();const download=await downloadPromise;await download.saveAs(output+'/row-loop.asm');
 if(download.suggestedFilename()!=='row-loop.asm'||await fs.readFile(output+'/row-loop.asm','utf8')!==await source.inputValue())throw Error('Wrong loop download');
 await root.locator('.write-replay').screenshot({path:output+'/eight-writes.png'});
 await root.locator('.sandbox-revert').click();if(await source.inputValue()!==original)throw Error('Revert failed');
 await run();await count(8);
 await page.setViewportSize({width:390,height:844});
 if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Mobile overflow');
 await root.locator('.replay-next').focus();await page.keyboard.press('Enter');
 if(await root.locator('.replay-writes li').count()!==1)throw Error('Keyboard replay failed');
 checks.push('source download, Revert, mobile layout and keyboard replay');
 if(errors.length)throw Error(errors.join('\n'));
 await fs.writeFile(output+'/results.json',JSON.stringify(checks,null,2)+'\n');console.log(checks);
} catch(error){await page.screenshot({path:output+'/failure.png'});throw error}
finally{await browser.close()}
