/** Bounded representation-page checks; no learner or performance claim. */
import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
const [base,output,phase='baseline',unit='all']=process.argv.slice(2);
if(!base||!output||!['baseline','after'].includes(phase)||!['all','04','05'].includes(unit))throw Error('Expected base, output, baseline/after, optional all/04/05');
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext();const page=await context.newPage();page.setDefaultTimeout(20000);
const report={date:new Date().toISOString(),base,phase,browser:browser.version(),pages:[],checks:[],errors:[]};
page.on('pageerror',e=>report.errors.push(String(e)));
try{
 for(const number of unit==='all'?['04','05']:[unit])for(const width of [1440,390]){
  const route=`/foundations/working-the-bits/unit-${number}/`;
  await page.setViewportSize({width,height:900});
  const response=await page.goto(base+route);if(!response?.ok())throw Error('HTTP '+response?.status());
  await page.locator('h1').waitFor();const text=await page.locator('main').innerText();
  const oldClaim=number==='04'?text.includes('only ever an approximation'):text.includes('Scaling by 256 is not even a multiplication');
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  const axe=await new AxeBuilder({page}).include('main').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  report.pages.push({route,width,status:response.status(),oldClaim,overflow,violations:axe.violations.map(v=>v.id),incomplete:axe.incomplete.map(v=>v.id)});
  if(overflow||axe.violations.length)throw Error('Layout/accessibility failed');
  if(phase==='after'){
   if(oldClaim)throw Error(`Original fractional-representation claim remains in unit ${number}`);
   const reveal=page.locator('main details').filter({has:page.locator('summary').filter({hasText:number==='04'?'Can binary floating-point':'At scale 256'})});
   if(await reveal.count()!==1||await reveal.getAttribute('open')!==null)throw Error('Prediction not uniquely closed');
   await reveal.locator('summary').focus();await page.keyboard.press('Enter');
   if(await reveal.getAttribute('open')===null)throw Error('Keyboard reveal failed');
   const answer=await reveal.innerText();
   if(number==='04'?!answer.includes('Yes for 0.5')||!answer.includes('No for 0.1'):!answer.includes('whole part, 1')||!answer.includes('384/256 = 1.5'))throw Error('Representation distinction missing');
   report.checks.push({check:'closed prediction opens by keyboard with distinction',route,width,passed:true});
  }
  await page.screenshot({path:`${output}/${phase}-${number}-${width}.png`,fullPage:true});
  if(phase==='after'&&number==='05'){
   const target='/systems/sinclair-zx-spectrum/basic/meet-basic/unit-07-choose-a-new-secret/';
   const link=page.locator(`main a[href="${target}"]`).first();await link.focus();await page.keyboard.press('Enter');
   await page.waitForURL(base+target);await page.locator('h1').waitFor();
   if(!(await page.locator('main').innerText()).includes('Whole numbers 0 through 9'))throw Error('Destination conversion table missing');
   await page.goBack();await page.waitForURL(base+route);
   await page.waitForFunction(()=>document.querySelector('h1')?.textContent==='Nailing the Point Down');
   await page.evaluate(async()=>{await Promise.allSettled(document.getAnimations().map(a=>a.finished));});
   report.checks.push({check:'optional BASIC fraction conversion link and return by keyboard',route,width,passed:true});
  }
 }
 if(report.errors.length)throw Error(report.errors.join('\n'));
 console.log(JSON.stringify({phase,pages:report.pages.length,checks:report.checks.length,browser:report.browser}));
}catch(error){report.failure=String(error);throw error}
finally{await fs.writeFile(`${output}/${phase}.json`,JSON.stringify(report,null,2)+'\n');await browser.close()}
