// Explicit browser check; uses the site preview and locally built comparison ROMs.
import {chromium,webkit} from 'playwright';
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync} from 'node:fs';
import path from 'node:path';
const base=process.env.SITE_URL || 'http://127.0.0.1:8766';
const output=process.env.OUTPUT_DIR || '/private/tmp/198x-nes-editor';mkdirSync(output,{recursive:true});
const sourceRoot=process.env.CODE_SAMPLES_PATH || path.resolve('../code-samples');
const sourcePath='nintendo-entertainment-system/assembly/meet-the-machine/unit-01/screen.asm';
const reference=readFileSync('public/code-samples/'+sourcePath.replace('.asm','.nes'));
for(const name of (process.env.PLAYER_BROWSERS || 'chrome,webkit').split(',')) {
 const browser=await(name==='chrome'?chromium:webkit).launch(name==='chrome'?{channel:'chrome',headless:true}:{headless:true});
 try {
  const page=await browser.newPage({acceptDownloads:true,reducedMotion:'reduce'});const errors=[],requests=[];
  page.on('pageerror',error=>errors.push(String(error)));page.on('request',request=>requests.push(request.url()));
  await page.goto(base+'/systems/nintendo-entertainment-system/assembly/meet-the-machine/unit-01/');
  const root=page.locator('code198x-nes-editor').first(),editor=root.locator('.nes-source'),status=root.locator('.editor-status');
  const button=name=>root.getByRole('button',{name,exact:true});
  const original=readFileSync(path.join(sourceRoot,sourcePath),'utf8');assert.equal(await editor.inputValue(),original);
  await button('Assemble & run').waitFor();await root.locator('.assembly-editor-colours span').first().waitFor();assert.equal(await root.locator('.emulator-panel').isVisible(),false);assert(!requests.some(url=>url.endsWith('.wasm')),'No assembler or emulator WASM should load until requested');
  assert.equal(await page.locator('.lesson-player').count(),0,'The lesson has one integrated player');
  async function colour(rgb) {
   await page.waitForFunction(rgb=>{
    const canvas=document.querySelector('code198x-nes-editor emu198x-player')?.shadowRoot?.getElementById('screen');if(!canvas)return false;
    const data=canvas.getContext('2d').getImageData(128,120,1,1).data;return rgb.every((v,i)=>v===data[i]);
   },rgb);
  }
  const editorWidth=await editor.evaluate(e=>e.getBoundingClientRect().width);
  await button('Assemble & run').click();await status.filter({hasText:'Running your build'}).waitFor();await colour([181,49,32]);
  assert(await root.locator('.emulator-panel').isVisible());
  assert.equal(await editor.evaluate(e=>e.getBoundingClientRect().width),editorWidth,'Opening overlays without resizing the editor');
  await page.keyboard.press('Escape');assert.equal(await root.locator('.emulator-panel').isVisible(),false);
  await button('Show emulator').click();assert(await root.locator('.emulator-panel').isVisible());
  assert.equal(await root.locator('emu198x-player').locator('#pause').textContent(),'Resume');
  await button('Close emulator').click();
  let pending=page.waitForEvent('download');await button('Download cartridge').click();let download=await pending;
  assert.equal(download.suggestedFilename(),'screen.nes');assert.deepEqual(readFileSync(await download.path()),reference);
  const blue=original.replace('lda #$16','lda #$11');await editor.fill(blue);
  pending=page.waitForEvent('download');await button('Download cartridge').click();download=await pending;const blueBytes=readFileSync(await download.path());
  assert.notDeepEqual(blueBytes,reference);if(process.env.BLUE_CARTRIDGE)assert.deepEqual(blueBytes,readFileSync(process.env.BLUE_CARTRIDGE));
  await colour([181,49,32]); // Downloading a build does not replace the running program.
  await button('Assemble & run').click();await status.filter({hasText:'Running your build'}).waitFor();
  await page.waitForFunction(()=>{const c=document.querySelector('code198x-nes-editor emu198x-player').shadowRoot.getElementById('screen');const p=c.getContext('2d').getImageData(128,120,1,1).data;return p[2]>p[0] && p[2]>p[1];});
  await button('Close emulator').click();
  const before=await root.locator('emu198x-player').locator('#screen').evaluate(c=>Array.from(c.getContext('2d').getImageData(128,120,1,1).data));
  await editor.fill(blue.replace('lda #$11','lda #300'));await button('Assemble & run').click();await status.filter({hasText:'Build failed'}).waitFor();
  assert.equal(await root.locator('.emulator-panel').isVisible(),false);
  assert.match(await root.locator('.editor-diagnostics').textContent(),new RegExp(`Line ${blue.split('\n').findIndex(line=>line.includes('lda #$11'))+1}:.*range`,'i'));
  assert.deepEqual(await root.locator('emu198x-player').locator('#screen').evaluate(c=>Array.from(c.getContext('2d').getImageData(128,120,1,1).data)),before);
  await button('Revert source').click();assert.equal(await editor.inputValue(),original);await button('Assemble & run').click();await status.filter({hasText:'Running your build'}).waitFor();await colour([181,49,32]);
  pending=page.waitForEvent('download');await button('Download source').click();download=await pending;assert.equal(readFileSync(await download.path(),'utf8'),original);
  await page.setViewportSize({width:390,height:844});await root.locator('.emulator-panel').screenshot({path:path.join(output,name+'-mobile.png')});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await button('Close emulator').click();await root.screenshot({path:path.join(output,name+'-editor.png')});await page.setViewportSize({width:1440,height:1000});
  await root.evaluate(el=>{
   const other=el.cloneNode(true);other.dataset.title='Blue screen';
   const source=other.querySelector('textarea');source.defaultValue=source.value.replace('lda #$16','lda #$11');source.value=source.defaultValue;
   other.querySelector('.assembly-editor').replaceWith(source);
   el.after(other);
  });
  const second=page.locator('code198x-nes-editor').nth(1);
  await second.getByRole('button',{name:'Assemble & run',exact:true}).click();
  await second.locator('.editor-status').filter({hasText:'Running your build'}).waitFor();
  assert.match(await second.locator('.panel-source').textContent(),/Sample 2 · Blue screen/);
  await button('Show emulator').click();
  assert.equal(await second.locator('.emulator-panel').isVisible(),false);
  assert.equal(await second.locator('emu198x-player').locator('#pause').textContent(),'Resume');
  assert.equal(await page.locator('.emulator-panel:popover-open').count(),1);
  await colour([181,49,32]);
  assert.match(await root.locator('.panel-source').textContent(),/Sample 1/);
  await button('Close emulator').click();
  await second.getByRole('button',{name:'Show emulator',exact:true}).click();
  const pixel=await second.locator('emu198x-player').locator('#screen').evaluate(c=>Array.from(c.getContext('2d').getImageData(128,120,1,1).data));
  assert(pixel[2]>pixel[0] && pixel[2]>pixel[1],'Switching retains the second sample');
  await page.emulateMedia({reducedMotion:'no-preference'});
  await second.getByRole('button',{name:'Close emulator',exact:true}).click();
  await second.locator('.emulator-panel').waitFor({state:'hidden'});
  await second.getByRole('button',{name:'Show emulator',exact:true}).click();
  await second.locator('.emulator-panel').screenshot({path:path.join(output,name+'-slideover.png')});
  assert.deepEqual(errors,[]);console.log(`${name}: lazy WASM loading, native parity, fresh edited downloads, red/blue execution, line errors, previous-program retention, revert/source downloads and mobile width passed.`);
 }finally{await browser.close();}
}
