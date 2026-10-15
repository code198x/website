/** Bounded representation-page checks; no learner or hardware claim. */
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
 for(const unit of ['03','04'])for(const width of [1440,390]){
  const route=`/foundations/counting-in-twos/unit-${unit}/`;
  await page.setViewportSize({width,height:900});
  const response=await page.goto(base+route);if(!response?.ok())throw Error('HTTP '+response?.status());
  await page.locator('h1').waitFor();const text=await page.locator('main').innerText();
  const oldClaim=unit==='03'?text.includes('every place two bytes can point at'):text.includes('the overflow tidies itself away');
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  const axe=await new AxeBuilder({page}).include('main').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  report.pages.push({route,width,status:response.status(),oldClaim,overflow,violations:axe.violations.map(v=>v.id),incomplete:axe.incomplete.map(v=>v.id)});
  if(overflow||axe.violations.length)throw Error('Layout/accessibility failed');
  if(phase==='after'){
   if(oldClaim)throw Error('Original representation claim remains');
   const reveal=page.locator('main details').filter({has:page.locator('summary').filter({hasText:unit==='03'?'Does that prove':'does 127'})});
   if(await reveal.count()!==1||await reveal.getAttribute('open')!==null)throw Error('Prediction not uniquely closed');
   await reveal.locator('summary').focus();await page.keyboard.press('Enter');
   if(await reveal.getAttribute('open')===null)throw Error('Keyboard reveal failed');
   const answer=await reveal.innerText();
   if(unit==='03'?!answer.includes('does not tell you how'):!answer.includes('There is no carry'))throw Error('Distinction missing');
   report.checks.push({check:'prediction opens by keyboard with distinction',route,width,passed:true});
  }
  await page.screenshot({path:`${output}/${phase}-${unit}-${width}.png`,fullPage:true});
  if(phase==='after'&&unit==='04'){
   const destination='/systems/sinclair-zx-spectrum/assembly/meet-assembly/unit-02/';
   const link=page.locator(`main a[href="${destination}"]`).first();await link.focus();await page.keyboard.press('Enter');
   await page.waitForURL(base+destination);await page.locator('h1').waitFor();
   if(!(await page.locator('main').innerText()).includes('A 1 selects ink and a 0 selects paper'))throw Error('Pixel interpretation missing');
   await page.goBack();await page.waitForURL(base+route);
   await page.waitForFunction(()=>document.querySelector('h1')?.textContent==='A Minus With No Minus Sign');
   await page.evaluate(async()=>{await Promise.allSettled(document.getAnimations().map(a=>a.finished));});
   report.checks.push({check:'optional assembly link and return by keyboard',route,width,passed:true});
  }
 }
 if(report.errors.length)throw Error(report.errors.join('\n'));
 console.log(JSON.stringify({phase,pages:report.pages.length,checks:report.checks.length,browser:report.browser}));
}catch(error){report.failure=String(error);throw error}
finally{await fs.writeFile(`${output}/${phase}.json`,JSON.stringify(report,null,2)+'\n');await browser.close()}
