import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const [base='http://127.0.0.1:1986',output='/tmp/movement-checks']=process.argv.slice(2);
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1280,height:1000}});
const errors=[],checks=[];page.on('pageerror',e=>errors.push(String(e)));
const assert=(ok,msg)=>{if(!ok)throw Error(msg)};
try{
 await page.goto(base+'/systems/sinclair-zx-spectrum/assembly/meet-assembly/unit-05/');
 await page.locator('a.nav-next').click();await page.waitForURL('**/unit-06/');
 const root=page.locator('.movement-lesson'),source=root.locator('textarea'),screen=root.locator('.sandbox-screen');
 await root.locator('.assembly-editor-colours span').first().waitFor();await page.waitForFunction(()=>document.querySelector('.movement-lesson').dataset.ready==='true');
 await root.evaluate(el=>el.addEventListener('sandbox:memory',e=>window.reading=e.detail));
 const original=await source.inputValue();
 async function state(key,value){await page.waitForFunction(([key,value])=>window.reading?.named[key]===value,[key,value])}
 async function run(){await page.evaluate(()=>window.reading=null);await root.locator('.sandbox-run').click();await state('position',15);await state('armed',1)}
 async function key(code,position){await screen.focus();await page.keyboard.down(code);await state('position',position);await page.keyboard.up(code);await state('armed',1)}
 await run();
 let reading=await page.evaluate(()=>window.reading);const patterns=[24,60,126,219,255,60,102,66];
 for(let row=0;row<8;row++)for(let col=0;col<32;col++)assert(reading.values[row*32+col]===(col===15?patterns[row]:0),'Initial row dirty');
 await screen.focus();await page.keyboard.down('KeyO');await state('position',14);await state('keys',1);
 await page.waitForTimeout(400);assert((await page.evaluate(()=>window.reading.named.position))===14,'Held key repeats');
 await page.keyboard.up('KeyO');await state('armed',1);
 reading=await page.evaluate(()=>window.reading);assert(reading.named.previous===15&&reading.named.moves===1,'Wrong previous/move count');
 for(let row=0;row<8;row++)assert(reading.values[row*32+15]===0&&reading.values[row*32+14]===patterns[row],'Erase/draw wrong');
 await root.locator('.movement-inspector').screenshot({path:output+'/one-move.png'});
 checks.push('Navigation, initial clean row, O mask, one step while held, real erased and drawn bytes');
 const both=root.locator('[data-keys="KeyO,KeyP"]');await both.focus();await page.keyboard.down('Space');await state('keys',0);await state('armed',0);
 assert((await page.evaluate(()=>window.reading.named.position))===14,'Both keys moved');
 await page.keyboard.up('Space');await state('armed',1);
 await key('KeyP',15);
 for(let p=14;p>=0;p--)await key('KeyO',p);
 await key('KeyO',0);await key('KeyO',0);assert((await page.evaluate(()=>window.reading.named.moves))===17,'Left edge accepted invalid moves');
 for(let p=1;p<=31;p++)await key('KeyP',p);
 await key('KeyP',31);assert((await page.evaluate(()=>window.reading.named.moves))===48,'Right edge accepted invalid move');
 checks.push('Both keys cancel; release rearms; left and right edges reject movement without wrapping');
 await screen.focus();await page.keyboard.down('KeyO');await state('position',30);await source.focus();await state('keys',3);await page.keyboard.up('KeyO');
 await source.fill(original.replace('ld hl,blank\n call draw_character\n ld a,(next_position)','ld hl,patterns\n call draw_character\n ld a,(next_position)'));
 assert((await root.locator('.movement-status').textContent()).includes('Source changed'),'No stale label');await run();await key('KeyP',16);
 reading=await page.evaluate(()=>window.reading);for(let row=0;row<8;row++)assert(reading.values[row*32+15]===patterns[row]&&reading.values[row*32+16]===patterns[row],'Trail edit hidden');
 await root.locator('.movement-inspector').screenshot({path:output+'/trail-experiment.png'});
 const downloadPromise=page.waitForEvent('download');await root.locator('.download-movement').click();const download=await downloadPromise;await download.saveAs(output+'/move-character.asm');assert(await fs.readFile(output+'/move-character.asm','utf8')===await source.inputValue(),'Download changed source');
 await root.locator('.sandbox-revert').click();assert(await source.inputValue()===original,'Revert failed');await run();
 await page.setViewportSize({width:390,height:844});assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),'Mobile overflow');
 const left=root.locator('[data-keys="KeyO"]');await left.scrollIntoViewIfNeeded();const box=await left.boundingBox();await page.mouse.move(box.x+20,box.y+20);await page.mouse.down();await state('position',14);await page.mouse.up();await state('armed',1);
 await root.locator('.movement-inspector').screenshot({path:output+'/mobile.png'});
 const addressBefore=(await page.evaluate(()=>window.reading.symbols.position));await source.fill(original.replace('start:\n','start:\n nop\n'));await run();assert((await page.evaluate(()=>window.reading.symbols.position))===addressBefore+1,'Symbol addresses not refreshed');await key('KeyP',16);
 checks.push('Blur releases keys, edited erase leaves a visible trail, download/Revert, fresh run and mobile pointer controls');
 assert(!errors.length,errors.join('\n'));await fs.writeFile(output+'/results.json',JSON.stringify(checks,null,2)+'\n');console.log(checks);
}catch(error){await page.screenshot({path:output+'/failure.png'});throw error}finally{await browser.close()}
