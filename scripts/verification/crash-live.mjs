import {chromium, webkit, devices, expect} from '@playwright/test';
import {mkdir, writeFile, readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {join} from 'node:path';

const [base='https://code198x.com', output='docs/plans/crash-live-acceptance/live'] = process.argv.slice(2);
await mkdir(output, {recursive:true});
const reports=[];
for (const [name, engine, options] of [
  ['chromium-desktop',chromium,{viewport:{width:1440,height:900}}],
  ['chromium-touch',chromium,devices['Pixel 7']],
  ['webkit-desktop',webkit,{viewport:{width:1440,height:900}}],
  ['webkit-touch',webkit,devices['iPhone 13']],
]) {
 if(process.env.PROFILE && !name.includes(process.env.PROFILE))continue;
 const browser=await engine.launch();
 const context=await browser.newContext({...options,acceptDownloads:true});
 const page=await context.newPage();page.setDefaultTimeout(20000);
 const report={name,browser:browser.version(),base,checks:[],errors:[]};reports.push(report);
 page.on('pageerror',e=>report.errors.push(String(e)));
 const activate=async locator=>options.hasTouch?locator.tap():locator.click();
 const fits=async()=>assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Page overflows horizontally');
 const screen=async text=>expect(page.locator('.machine-transcript pre')).toContainText(text,{timeout:60000});
 try {
  await page.goto(base+'/crash-live/');await fits();
  await page.screenshot({path:join(output,name+'-event.png')});
  await activate(page.getByRole('region',{name:'Start programming'}).getByRole('link',{name:'Try your first assembly lesson',exact:true}));
  await expect(page).toHaveURL(/meet-assembly\/unit-01\/?$/);
  await activate(page.locator('.sandbox-run'));
  await page.waitForFunction(()=>{const c=document.querySelector('.sandbox-screen');const d=c?.getContext('2d').getImageData(0,0,1,1).data;return d&&d[0]>100&&d[1]===0&&d[2]===0;});
  await activate(page.locator('.source-drawer > summary'));
  const assembly=page.locator('.sandbox-source'),originalAsm=await assembly.inputValue();
  assert(originalAsm.includes('ld a,2'));
  await assembly.fill(originalAsm.replace('ld a,2','ld a,4'));
  await activate(page.locator('.sandbox-run'));
  await page.waitForFunction(()=>{const d=document.querySelector('.sandbox-screen').getContext('2d').getImageData(0,0,1,1).data;return d[0]===0&&d[1]>100&&d[2]===0;});
  await assembly.fill(originalAsm.replace('ld a,2','ld a,unknown_label'));
  await activate(page.locator('.sandbox-run'));
  await expect(page.locator('.sandbox-diagnostics')).toContainText('undefined symbol');
  await activate(page.locator('.sandbox-revert'));await activate(page.locator('.sandbox-run'));
  await expect(page.locator('.sandbox-status')).toContainText('Running');await fits();
  await activate(page.locator('a.nav-next'));await expect(page).toHaveURL(/unit-02\/?$/);
  report.checks.push('Event CTA: assembly executes red then edited green border, error/revert recovers, next lesson works');

  await page.goto(base+'/crash-live/');
  await activate(page.getByRole('link',{name:'Seven lines. One screen.',exact:true}));
  await expect(page).toHaveURL(/#spectrum-circles$/);
  const card=page.locator('#spectrum-circles');
  const downloading=page.waitForEvent('download');
  await activate(card.getByRole('link',{name:'Download BASIC listing'}));
  const listingDownload=await downloading;
  const cardSource=await readFile(await listingDownload.path(),'utf8');assert(cardSource.includes('CIRCLE'));
  await activate(card.getByRole('link',{name:'Find your next project',exact:false}));
  await activate(page.getByRole('link',{name:'Start Meet BASIC',exact:false}));
  await activate(page.locator('a[href*="unit-01-make-the-spectrum-answer"]').first());
  await expect(page).toHaveURL(/unit-01-make-the-spectrum-answer\/?$/);await fits();
  if(process.env.EXPECT_TOUCH_GUIDANCE){
   await activate(page.getByRole('link',{name:'Open the editable listing',exact:true}));
   await expect(page).toHaveURL(/#run-an-editable-listing$/);
   await expect(page.getByRole('heading',{name:'Run an editable listing',exact:true})).toBeInViewport();
   report.checks.push('Opening phone/tablet guidance reaches the editable listing');
   await page.screenshot({path:join(output,name+'-editor.png')});
  }
  const root=page.locator('.basic-playground'),source=root.getByRole('textbox',{name:'Your BASIC listing'});
  const original=await source.inputValue();
  await source.fill('10 PRINT "FLYER VISITOR"\n20 INPUT n\n30 PRINT n+1');
  await activate(root.getByRole('button',{name:'Run this code',exact:true}));
  await screen('FLYER VISITOR');
  const modal=root.getByRole('dialog');
  await activate(modal.locator('.machine-input summary'));
  await activate(modal.getByRole('button',{name:'4',exact:true}));
  await activate(modal.getByRole('button',{name:'Enter',exact:true}));
  await screen('5');await screen('0 OK');
  report.checks.push('Printed card: downloads BASIC, leads through catalogue to first lesson, edited program executes and on-screen numeric input works');
  await page.screenshot({path:join(output,name+'-basic.png')});
  await activate(modal.getByRole('button',{name:'Pause',exact:true}));
  await expect(modal.getByRole('button',{name:'Resume',exact:true})).toBeVisible();
  await activate(modal.getByRole('button',{name:'Back to the listing'}));
  await expect(source).toBeFocused();
  await activate(root.getByRole('button',{name:'Return to your Spectrum'}));
  await expect(modal.getByRole('button',{name:'Resume',exact:true})).toBeVisible();
  await activate(modal.getByRole('button',{name:'Resume',exact:true}));
  await activate(modal.getByRole('button',{name:'Restart Spectrum',exact:true}));
  await page.waitForFunction(()=>{const text=document.querySelector('.machine-transcript pre').textContent;return text.includes('FLYER VISITOR')&&!text.includes('0 OK');},{},{timeout:60000});
  await activate(modal.getByRole('button',{name:'6',exact:true}));
  await activate(modal.getByRole('button',{name:'Enter',exact:true}));await screen('7');await screen('0 OK');
  await activate(modal.getByRole('button',{name:'Back to the listing'}));
  await source.fill('PRINT "missing number"');await activate(root.getByRole('button',{name:'Run this code',exact:true}));
  await expect(root.locator('.listing-error')).toBeVisible();await expect(source).toHaveAttribute('aria-invalid','true');
  await activate(root.locator('.listing-options summary'));
  await activate(root.getByRole('button',{name:'Reset to original'}));await expect(source).toHaveValue(original);
  await expect(root.locator('.listing-error')).toBeHidden();
  await source.fill('10 PRINT "TAPE VISITOR"');
  const tapeDownload=page.waitForEvent('download');await activate(root.getByRole('button',{name:'Download tape'}));
  const tape=await readFile(await (await tapeDownload).path());assert(tape.includes(Buffer.from('TAPE VISITOR')));
  let offset=0,blocks=0;while(offset<tape.length){const size=tape.readUInt16LE(offset),block=tape.subarray(offset+2,offset+2+size);assert.equal(block.length,size);assert.equal(block.reduce((a,b)=>a^b,0),0);offset+=size+2;blocks++;}assert.equal(blocks,2);
  await activate(root.getByRole('button',{name:'Run this code',exact:true}));await screen('TAPE VISITOR');
  if(options.hasTouch){await page.setViewportSize({width:844,height:390});assert(await modal.evaluate(d=>d.scrollWidth<=d.clientWidth),'Landscape modal overflows');await page.setViewportSize(options.viewport);}
  await activate(modal.getByRole('button',{name:'Close and return'}));
  const navigating=Date.now();
  await activate(page.getByRole('link',{name:/next unit/i}));await page.waitForURL(/unit-02-remember-and-save\/?$/,{timeout:5000});
  report.nextLessonMs=Date.now()-navigating;
  report.checks.push('Pause, return, resume, restart, error/reset, edited tape checksum/content, landscape and onward navigation');
  assert.deepEqual(report.errors,[]);
 } catch(error) {report.failure=String(error);await page.screenshot({path:join(output,name+'-failure.png')});}
 finally {await browser.close();console.log(JSON.stringify(report));await writeFile(join(output,'results.json'),JSON.stringify(reports,null,2)+'\n');}
}
if(reports.some(r=>r.failure))process.exitCode=1;
