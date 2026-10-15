/** Bounded first-session publication checks. No learner or universal access claim. */
import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
const [base,out,mode='all']=process.argv.slice(2);
if(!base||!out||!['all','pages','sessions'].includes(mode))throw Error('Expected base, output, all/pages/sessions');
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({acceptDownloads:true});const page=await context.newPage();page.setDefaultTimeout(30000);
const reopenBase=process.env.FIRST_SESSION_REOPEN_BASE||base;
const report={reopenBase,date:new Date().toISOString(),base,browser:browser.version(),mode,pages:[],checks:[],errors:[]};
page.on('pageerror',error=>report.errors.push(String(error)));
const assert=(value,message)=>{if(!value)throw Error(message);};
const basic='/systems/sinclair-zx-spectrum/basic/meet-basic/unit-01-make-the-spectrum-answer/';
const assembly='/systems/sinclair-zx-spectrum/assembly/meet-assembly/unit-01/';
const navigate=async route=>{const response=await page.goto(base+route);assert(response?.ok(),`HTTP ${response?.status()} ${route}`);await page.locator('h1').waitFor();};
const keyboardLink=async href=>{const link=page.locator(`main a[href="${href}"]`).first();await link.focus();await page.keyboard.press('Enter');await page.waitForURL(base+href);await page.locator('h1').waitFor();};
try{
 if(mode!=='sessions'){
  for(const width of [1440,390]){
   await page.setViewportSize({width,height:900});
   for(const slug of ['', 'spectrum-basic/','spectrum-assembly/','parents-and-teachers/','session-sheet/','feedback/']){
    const route='/try/'+slug;await navigate(route);
    assert(await page.locator('h1').count()===1,'Expected one page heading');
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
    const axe=await new AxeBuilder({page}).include('main').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
    report.pages.push({route,width,overflow,violations:axe.violations.map(v=>v.id),incomplete:axe.incomplete.map(v=>v.id)});
    assert(!overflow&&!axe.violations.length,`Layout/axe ${route} ${width}`);
    await page.screenshot({path:`${out}/${slug.replaceAll('/','')||'guide'}-${width}.png`,fullPage:true});
   }
   await navigate('/start-here/');await keyboardLink('/try/');
   await keyboardLink('/try/spectrum-basic/');await keyboardLink(basic);
   await navigate('/try/');await keyboardLink('/try/spectrum-assembly/');await keyboardLink(assembly);
   await navigate('/teaching/');await keyboardLink('/try/parents-and-teachers/');await keyboardLink('/try/session-sheet/');
   await page.evaluate(()=>{window.print=()=>{document.documentElement.dataset.printCalled='yes';};});
   await page.getByRole('button',{name:'Print session sheet',exact:true}).focus();await page.keyboard.press('Enter');
   assert(await page.locator('html').getAttribute('data-print-called')==='yes','Print not called by keyboard');
   report.checks.push({check:'discovery, both activity routes, companion, sheet and print by keyboard',width,passed:true});
  }
  await navigate('/try/session-sheet/');
  for(const format of ['A4','Letter'])await page.pdf({path:`${out}/session-sheet-${format}.pdf`,format,printBackground:true,margin:{top:'12mm',bottom:'12mm',left:'12mm',right:'12mm'}});
 }
 if(mode!=='pages'){
  await page.setViewportSize({width:1440,height:900});await navigate('/try/spectrum-basic/');await keyboardLink(basic);
  const root=page.locator('.basic-playground'),source=root.locator('textarea'),transcript=root.locator('.machine-transcript pre');
  await root.locator('.listing-run').click();await page.waitForFunction(()=>document.querySelector('.machine-transcript pre')?.textContent.includes('Welcome'),{},{timeout:60000});
  assert((await transcript.textContent()).includes('to you'),'Starting greeting incomplete');
  await root.getByRole('button',{name:'Back to the listing',exact:true}).click();
  const original=await source.inputValue();assert(original.includes('Welcome'),'Unexpected maintained source');
  await source.fill(original.replace('Welcome','Hello again'));await root.locator('.listing-run').click();
  await page.waitForFunction(()=>document.querySelector('.machine-transcript pre')?.textContent.includes('Hello again'),{},{timeout:60000});
  await root.locator('.machine-transcript summary').click();
  await page.screenshot({path:`${out}/basic-edited.png`,fullPage:true});
  const expectedPixels=await root.locator('canvas').evaluate(c=>Array.from(c.getContext('2d').getImageData(48,56,256,32).data));
  assert(new Set(expectedPixels.filter((_,i)=>i%4!==3)).size>1,'Expected text region is blank');
  report.checks.push({check:'real ROM output changes from Welcome to Hello again',text:await transcript.textContent(),passed:true});
  await root.getByRole('button',{name:'Back to the listing',exact:true}).click();await root.locator('.listing-options summary').click();
  const pending=page.waitForEvent('download');await root.getByRole('button',{name:'Download tape',exact:true}).click();const tape=await pending;await tape.saveAs(`${out}/greeting.tap`);
  const bytes=await fs.readFile(`${out}/greeting.tap`);assert(bytes.includes(Buffer.from('Hello again')),'Tape missing current edit');
  await root.getByRole('button',{name:'Reset to original',exact:true}).click();assert(await source.inputValue()===original,'BASIC reset failed');
  report.checks.push({check:'download contains edited greeting and reset restores original source',bytes:bytes.length,passed:true});
  await page.goto(reopenBase+'/systems/sinclair-zx-spectrum/basic/meet-basic/unit-02-remember-and-save/');await page.locator('h1').waitFor();
  await page.getByRole('button',{name:'Run it here',exact:false}).click();
  const player=page.locator('emu198x-player');
  await player.locator('#choose-media').waitFor();
  // Start the model before choosing the downloaded tape, as the lesson describes.
  const start=player.locator('#begin');if(await start.isVisible())await start.click();
  await page.waitForFunction(()=>document.querySelector('emu198x-player')?.shadowRoot?.querySelector('#status')?.textContent.startsWith('Running'),{},{timeout:60000});
  await player.locator('input#media').setInputFiles(`${out}/greeting.tap`);
  await page.waitForFunction(()=>document.querySelector('emu198x-player')?.shadowRoot?.querySelector('#status')?.textContent.includes('Media loaded'),{},{timeout:60000});
  await page.waitForFunction(expected=>{const c=document.querySelector('emu198x-player')?.shadowRoot?.querySelector('canvas#screen');if(!c)return false;const pixels=c.getContext('2d').getImageData(48,56,256,32).data;return pixels.length===expected.length&&pixels.every((v,i)=>v===expected[i]);},expectedPixels,{timeout:60000});
  await player.locator('canvas#screen').screenshot({path:`${out}/basic-reopened.png`});
  report.checks.push({check:'downloaded tape reopens with text-region pixels matching the edited greeting',passed:true});

  await navigate('/try/spectrum-assembly/');await keyboardLink(assembly);
  const drawer=page.locator('.sandbox .source-drawer');await drawer.locator('summary').focus();await page.keyboard.press('Enter');
  assert(await drawer.getAttribute('open')!==null,'Source drawer did not open by keyboard');
  const asm=page.locator('.sandbox-source');const starting=await asm.inputValue();
  await page.locator('.sandbox-run').click();
  const colour=async expected=>{await page.waitForFunction(expected=>{const c=document.querySelector('.sandbox-screen');const p=c?.getContext('2d').getImageData(0,0,1,1).data;return p&&(expected==='red'?p[0]>100&&p[1]===0:p[0]===0&&p[1]>100)&&p[2]===0;},expected,{timeout:60000});};
  await colour('red');await asm.fill(starting.replace('ld a,2','ld a,4'));await page.locator('.sandbox-run').click();await colour('green');
  const save=page.waitForEvent('download');await page.getByRole('button',{name:'Download source',exact:true}).click();await(await save).saveAs(`${out}/first-program.asm`);
  assert((await fs.readFile(`${out}/first-program.asm`,'utf8')).includes('ld a,4'),'Saved source lost edit');
  await page.screenshot({path:`${out}/assembly-green.png`,fullPage:true});
  await page.getByRole('button',{name:'Revert',exact:true}).click();assert(await asm.inputValue()===starting,'Assembly revert failed');
  report.checks.push({check:'actual border red to green, source download and revert',passed:true});
 }
 assert(!report.errors.length,report.errors.join('\n'));report.status='passed';console.log(JSON.stringify({status:report.status,pages:report.pages.length,checks:report.checks.length}));
}catch(error){report.status='failed';report.failure=String(error);await page.screenshot({path:`${out}/failure.png`,fullPage:true});throw error;}
finally{await fs.writeFile(`${out}/results.json`,JSON.stringify(report,null,2)+'\n');await browser.close();}
