/** Bounded character-code lesson checks; no learner or performance claim. */
import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
const [base,output,phase='baseline']=process.argv.slice(2);
if(!base||!output||!['baseline','after'].includes(phase))throw Error('Expected base, output, baseline/after');
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext();const page=await context.newPage();page.setDefaultTimeout(20000);
const report={date:new Date().toISOString(),base,phase,browser:browser.version(),pages:[],checks:[],errors:[]};
page.on('pageerror',e=>report.errors.push(String(e)));
try{
 for(const width of [1440,390]){
  const route='/foundations/working-the-bits/unit-03/';
  await page.setViewportSize({width,height:900});
  const response=await page.goto(base+route);if(!response?.ok())throw Error('HTTP '+response?.status());
  await page.locator('h1').waitFor();const text=await page.locator('main').innerText();
  const oldClaim=text.includes('it just changes the character to something else');
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  const axe=await new AxeBuilder({page}).include('main').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  report.pages.push({route,width,status:response.status(),oldClaim,overflow,violations:axe.violations.map(v=>v.id),incomplete:axe.incomplete.map(v=>v.id)});
  if(overflow||axe.violations.length)throw Error('Layout/accessibility failed');
  if(phase==='after'){
   if(oldClaim)throw Error('Original character-mask claim remains');
   for(const [question,answers] of [['Does CODE',['55','7']],['What does BITOR 32',['55','96']]]){
    const reveal=page.locator('main details').filter({has:page.locator('summary').filter({hasText:question})});
    if(await reveal.count()!==1||await reveal.getAttribute('open')!==null)throw Error('Prediction not uniquely closed');
    await reveal.locator('summary').focus();await page.keyboard.press('Enter');
    if(await reveal.getAttribute('open')===null)throw Error('Keyboard reveal failed');
    const answer=await reveal.innerText();if(!answers.every(a=>answer.includes(a)))throw Error('Character distinction missing');
    report.checks.push({check:'closed prediction opens by keyboard',question,width,passed:true});
   }
  }
  await page.screenshot({path:`${output}/${phase}-${width}.png`,fullPage:true});
  if(phase==='after')for(const [target,title,content] of [
   ['/systems/sinclair-zx-spectrum/basic/meet-basic/unit-02-remember-and-save/','Remember a name; keep the program','sequence of characters'],
   ['/vault/reference/petscii-chart/','PETSCII Character Chart','Screen codes']]){
   const link=page.locator(`main a[href="${target}"]`).first();await link.focus();await page.keyboard.press('Enter');
   await page.waitForURL(base+target);await page.locator('h1').waitFor();
   if(!(await page.locator('main').innerText()).includes(content)||!(await page.locator('h1').innerText()).includes(title))throw Error('Destination distinction missing');
   await page.goBack();await page.waitForURL(base+route);
   await page.waitForFunction(()=>document.querySelector('h1')?.textContent==='A Letter Is a Number');
   await page.evaluate(async()=>{await Promise.allSettled(document.getAnimations().map(a=>a.finished));});
   report.checks.push({check:'optional source link and return by keyboard',target,width,passed:true});
  }
 }
 if(report.errors.length)throw Error(report.errors.join('\n'));
 console.log(JSON.stringify({phase,pages:report.pages.length,checks:report.checks.length,browser:report.browser}));
}catch(error){report.failure=String(error);throw error}
finally{await fs.writeFile(`${output}/${phase}.json`,JSON.stringify(report,null,2)+'\n');await browser.close()}
