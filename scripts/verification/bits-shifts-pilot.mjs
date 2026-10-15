/** Bounded bits/shift lesson checks with an actual optional pixel-mask run. */
import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {openSourceEditors} from './source-editors.mjs';
import fs from 'node:fs/promises';
const [base,output,phase='baseline',unit='all']=process.argv.slice(2);
if(!base||!output||!['baseline','after'].includes(phase)||!['all','01','02'].includes(unit))throw Error('Expected base, output, baseline/after and optional all/01/02');
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext();const page=await context.newPage();page.setDefaultTimeout(20000);
const report={date:new Date().toISOString(),base,phase,browser:browser.version(),pages:[],checks:[],errors:[]};
page.on('pageerror',e=>report.errors.push(String(e)));
try{
 for(const number of unit==='all'?['01','02']:[unit])for(const width of [1440,390]){
  const route=`/foundations/working-the-bits/unit-${number}/`;
  await page.setViewportSize({width,height:900});
  const response=await page.goto(base+route);if(!response?.ok())throw Error('HTTP '+response?.status());
  await page.locator('h1').waitFor();const text=await page.locator('main').innerText();
  const oldClaim=number==='01'?text.includes('They take two numbers'):text.includes('Shifting is almost free');
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  const axe=await new AxeBuilder({page}).include('main').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  report.pages.push({route,width,status:response.status(),oldClaim,overflow,violations:axe.violations.map(v=>v.id),incomplete:axe.incomplete.map(v=>v.id)});
  if(overflow||axe.violations.length)throw Error('Layout/accessibility failed');
  if(phase==='after'){
   if(oldClaim)throw Error(`Original bits/shift claim remains in unit ${number}`);
   const reveal=page.locator('main details').filter({has:page.locator('summary').filter({hasText:number==='01'?'Start with 11001010':'Using our eight-bit'})});
   if(await reveal.count()!==1||await reveal.getAttribute('open')!==null)throw Error('Prediction not uniquely closed');
   await reveal.locator('summary').focus();await page.keyboard.press('Enter');
   if(await reveal.getAttribute('open')===null)throw Error('Keyboard reveal failed');
   const answer=await reveal.innerText();
   if(number==='01'?!answer.includes('197')||!answer.includes('202'):!answer.includes('144')||!answer.includes('remainder 1'))throw Error('Prediction distinction missing');
   report.checks.push({check:'closed prediction opens by keyboard with accurate answer',route,width,passed:true});
  }
  await page.screenshot({path:`${output}/${phase}-${number}-${width}.png`,fullPage:true});
  if(phase==='after'&&number==='01'){
   const target='/systems/sinclair-zx-spectrum/assembly/meet-assembly/unit-02/';
   const link=page.locator(`main a[href="${target}"]`).first();await link.focus();await page.keyboard.press('Enter');
   await page.waitForURL(base+target);await openSourceEditors(page);
   const root=page.locator('.byte-lesson'),editor=root.locator('textarea');
   await root.locator('.assembly-editor-colours span').first().waitFor();
   const original=await editor.evaluate(element=>element.defaultValue);
   if(await editor.getAttribute('readonly')!==null){
    await root.locator('.sandbox-draft-restore').click();
    if(!(await editor.inputValue()).includes('and %00001111'))throw Error('Saved mask draft not restored');
    await root.locator('.sandbox-revert').click();
    if(await editor.inputValue()!==original)throw Error('Revert did not restore starter');
    report.checks.push({check:'saved mask draft restored and reverted through controls',route,width,passed:true});
   }
   await root.locator('[data-stage="1"]').click();
   const source=original.replace('%10101010','%11001010').replace('ld a,(pattern)','ld a,(pattern)\n and %00001111');
   if(source===original||!source.includes('and %00001111'))throw Error('Fixture replacement failed');
   await editor.fill(source);await root.locator('.sandbox-run').click();
   await page.waitForFunction(()=>document.querySelector('.sandbox-status').textContent.startsWith('Running'));
   await page.waitForFunction(()=>document.querySelector('.memory-byte').textContent.includes('00001010'));
   const pixels=await root.locator('.pixel-zoom').evaluate(c=>Array.from(c.getContext('2d').getImageData(0,0,8,1).data));
   for(let i=0;i<8;i++){
    const bit=(10>>(7-i))&1;
    if(pixels[i*4]!==bit*255||pixels[i*4+1]!==bit*255||pixels[i*4+2]!==bit*255||pixels[i*4+3]!==255)throw Error('Actual screen pixels disagree with masked byte');
   }
   await root.screenshot({path:`${output}/pixel-mask-${width}.png`});
   report.checks.push({check:'optional link, edit/assemble/run mask, actual bitmap and pixel crop',route,width,input:202,mask:15,result:10,passed:true});
   await page.goBack();await page.waitForURL(base+route);
   await page.waitForFunction(()=>document.querySelector('h1')?.textContent==='Switch by Switch');
   await page.evaluate(async()=>{await Promise.allSettled(document.getAnimations().map(a=>a.finished));});
   report.checks.push({check:'browser return to source lesson',route,width,passed:true});
  }
 }
 if(report.errors.length)throw Error(report.errors.join('\n'));
 console.log(JSON.stringify({phase,pages:report.pages.length,checks:report.checks.length,browser:report.browser}));
}catch(error){report.failure=String(error);throw error}
finally{await fs.writeFile(`${output}/${phase}.json`,JSON.stringify(report,null,2)+'\n');await browser.close()}
