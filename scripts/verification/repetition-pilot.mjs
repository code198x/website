/** Compare the round/guess explanation and its optional BASIC connection. */
import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
const [base,output,phase='baseline']=process.argv.slice(2);
if(!base||!output||!['baseline','after'].includes(phase))throw Error('Expected base, output and baseline/after');
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext();const page=await context.newPage();
page.setDefaultTimeout(20000);
const route='/foundations/repeating/unit-02/';
const basic='/systems/sinclair-zx-spectrum/basic/meet-basic/unit-07-choose-a-new-secret/';
const report={date:new Date().toISOString(),base,phase,browser:browser.version(),pages:[],checks:[],errors:[]};
page.on('pageerror',e=>report.errors.push(String(e)));
try{
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:900});
  const response=await page.goto(base+route);if(!response?.ok())throw Error('HTTP '+response?.status());
  await page.locator('h1').waitFor();
  const text=await page.locator('main').innerText();
  const oldClaim=text.includes('the secret is different every time');
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  const axe=await new AxeBuilder({page}).include('main').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  report.pages.push({route,width,status:response.status(),oldClaim,overflow,violations:axe.violations.map(v=>v.id),incomplete:axe.incomplete.map(v=>v.id)});
  if(overflow||axe.violations.length)throw Error('Layout/accessibility result failed');
  if(phase==='after'){
   if(oldClaim)throw Error('Original uniqueness promise remains');
   const reveal=page.locator('main details').filter({has:page.getByText('If the last round chose 7, can the next round choose 7 too?',{exact:true})});
   if(await reveal.getAttribute('open')!==null)throw Error('Answer initially open');
   await reveal.locator('summary').focus();await page.keyboard.press('Enter');
   if(await reveal.getAttribute('open')===null)throw Error('Keyboard reveal failed');
   const answer=await reveal.innerText();
   if(!answer.includes('Yes. Both choices are in the range.')||!answer.includes('one fixed answer'))throw Error('Repeat/round explanation missing');
   report.checks.push({check:'closed prediction answer opens by keyboard and distinguishes repeat from moving target',width,passed:true});
  }
  await page.screenshot({path:`${output}/${phase}-${width}.png`,fullPage:true});
  if(phase==='after'){
   const link=page.locator('main a[href="'+basic+'"]').first();await link.focus();await page.keyboard.press('Enter');
   await page.waitForURL(base+basic);
   if(!(await page.locator('main').innerText()).includes('may happen to be the same one'))throw Error('Destination no longer explains repeated choice');
   await page.goBack();await page.waitForURL(base+route);
   await page.waitForFunction(()=>document.querySelector('h1')?.textContent==='Until You Get It');
   await page.evaluate(async()=>{await Promise.allSettled(document.getAnimations().map(animation=>animation.finished));});
   report.checks.push({check:'optional BASIC link and browser return by keyboard',width,passed:true});
  }
 }
 if(report.errors.length)throw Error(report.errors.join('\n'));
 console.log(JSON.stringify({phase,pages:report.pages.length,checks:report.checks.length,browser:report.browser}));
}catch(error){report.failure=String(error);throw error;}
finally{await fs.writeFile(`${output}/${phase}.json`,JSON.stringify(report,null,2)+'\n');await browser.close();}
