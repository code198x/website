/** Bounded choice-lesson baseline and proposed-correction checks. */
import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
const [base,output,phase='baseline']=process.argv.slice(2);
if(!base||!output||!['baseline','after'].includes(phase))throw Error('Expected base, output and baseline/after');
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext();const page=await context.newPage();
page.setDefaultTimeout(20000);
const route='/foundations/decisions/unit-01/';
const report={date:new Date().toISOString(),base,phase,browser:browser.version(),pages:[],checks:[],errors:[]};
page.on('pageerror',e=>report.errors.push(String(e)));
try{
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:900});
  const response=await page.goto(base+route);if(!response?.ok())throw Error('HTTP '+response?.status());
  await page.locator('h1').waitFor();
  const text=await page.locator('main').innerText();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  if(overflow)throw Error('Document overflow at '+width);
  const axe=await new AxeBuilder({page}).include('main').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  report.pages.push({route,width,status:response.status(),overflow,violations:axe.violations.map(v=>v.id),incomplete:axe.incomplete.map(v=>v.id),claims:{cannotReact:text.includes('cannot react to anything'),negativeGuessAssumption:text.includes('when nobody would guess a negative number')}});
  if(axe.violations.length)throw Error('Accessibility: '+axe.violations.map(v=>v.id));
  if(phase==='after'){
   if(text.includes('cannot react to anything')||text.includes('when nobody would guess a negative number'))throw Error('Original misconception remains');
   const reveal=page.locator('main details').filter({has:page.getByText('Check the three cases',{exact:true})});
   if(await reveal.getAttribute('open')!==null)throw Error('Prediction answer initially open');
   await reveal.locator('summary').focus();await page.keyboard.press('Enter');
   if(await reveal.getAttribute('open')===null)throw Error('Keyboard reveal failed');
   const rows=await reveal.locator('tbody tr').allTextContents();
   if(rows.length!==3)throw Error('Missing comparison cases');
   for(const [i,expected]of ['-1 false','0 false','1 true'].entries()){
    if(rows[i].trim().replace(/\s+/g,' ').toLowerCase()!==expected)throw Error('Unexpected comparison row: '+rows[i]);
   }
   report.checks.push({check:'keyboard reveal of negative/zero/positive boundary predictions',width,passed:true,rows});
  }
  await page.screenshot({path:`${output}/${phase}-${width}.png`,fullPage:true});
 }
 if(report.errors.length)throw Error(report.errors.join('\n'));
 console.log(JSON.stringify({phase,pages:report.pages.length,checks:report.checks.length,browser:report.browser}));
}catch(error){report.failure=String(error);throw error;}
finally{await fs.writeFile(`${output}/${phase}.json`,JSON.stringify(report,null,2)+'\n');await browser.close();}
