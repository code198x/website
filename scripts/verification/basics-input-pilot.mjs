/** Verify bounded sequence/input explanations and keyboard feedback. */
import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
const [base,out,phase='baseline']=process.argv.slice(2);
if(!base||!out||!['baseline','after'].includes(phase))throw Error('Expected base, output, baseline/after');
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});const context=await browser.newContext();const page=await context.newPage();page.setDefaultTimeout(20000);
const report={date:new Date().toISOString(),base,phase,browser:browser.version(),pages:[],checks:[],errors:[]};page.on('pageerror',error=>report.errors.push(String(error)));
const assert=(v,m)=>{if(!v)throw Error(m);};
const original=['Put your socks on','Put your shoes on','Go outside'];
const swapped=[original[1],original[0],original[2]];
const expected={'unit-01/':['Hello'],'unit-02/':[original.join('\n'),swapped.join('\n')],'unit-05/':['Sam','Ada'].map(name=>'What is your name? '+name+'\nHello, '+name)};
try {
 for(const width of [1440,390])for(const unit of ['', 'unit-01/','unit-02/','unit-05/']) {
  const route='/foundations/basics/'+unit;await page.setViewportSize({width,height:900});const response=await page.goto(base+route);assert(response?.ok(),'HTTP '+response?.status());await page.locator('h1').waitFor();
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.allSettled(document.getAnimations().map(a=>a.finished));});
  const text=await page.locator('main').innerText();const outputs=(await page.locator('main .program-output-text').allTextContents()).map(s=>s.trim());assert(JSON.stringify(outputs)===JSON.stringify(expected[unit]??[]),'Worked output missing or differs');
  const oldClaim=text.includes('Here is the smallest program there is')||text.includes('That is all running a program is')||text.includes('gives a different answer every time');
  const axe=await new AxeBuilder({page}).include('main').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  report.pages.push({route,width,status:response.status(),outputs,oldClaim,overflow,violations:axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),incomplete:axe.incomplete.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});assert(!overflow,'Document overflow');
  if(phase==='after') {
   assert(!oldClaim,'Original sequence/input claim remains');assert(!axe.violations.length,'Axe failed');
   if(unit) {
    const question=page.locator('main [data-question]');assert(await question.count()===1,'Expected one thinking prompt');const details=question.locator('details');assert(await details.getAttribute('open')===null,'Answer not initially closed');
    const prompt=await question.locator('.question-prompt').innerText();assert(prompt.length>30,'Visible prompt missing');await details.locator('summary').focus();await page.keyboard.press('Enter');assert(await details.getAttribute('open')!==null,'Keyboard reveal failed');
    const answer=await question.locator('.question-answer').innerText();const fragments=unit==='unit-01/'?['displays the words','does not carry out']:unit==='unit-02/'?['third','swap','text']:['Hello, Ada','empty line has been submitted','different states'];assert(fragments.every(s=>answer.includes(s)),'Explanation distinction missing');report.checks.push({check:'visible prediction and keyboard explanation',route,width,passed:true});
   }
   if(unit==='unit-05/')assert(['press Enter','text','keep its spaces','empty line','four spaces after the comma','not checking whether','before Enter','empty text value is still a value'].every(s=>text.toLowerCase().includes(s.toLowerCase())),'Input contract missing');
   const revealed=await new AxeBuilder({page}).include('main').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();report.pages.at(-1).revealedIncomplete=revealed.incomplete.map(v=>v.id);assert(!revealed.violations.length,'Revealed answer axe failure');
  }
  await page.screenshot({path:`${out}/${phase}-${unit.replaceAll('/','')||'overview'}-${width}.png`,fullPage:true});
  if(phase==='after'&&['unit-01/','unit-05/'].includes(unit)) {
   const target=unit==='unit-01/'?'/systems/sinclair-zx-spectrum/basic/meet-basic/unit-01-make-the-spectrum-answer/':'/systems/sinclair-zx-spectrum/basic/meet-basic/unit-03-ask-and-use-the-answer/';const link=page.locator(`main a[href="${target}"]`).first();await link.focus();await page.keyboard.press('Enter');await page.waitForURL(base+target);assert((await page.locator('main').innerText()).includes(unit==='unit-01/'?'PRINT':'INPUT'),'Target syntax missing');await page.goBack();await page.waitForURL(base+route);report.checks.push({check:'optional machine link and Back by keyboard',target,width,passed:true});
  }
 }
 assert(report.pages.length===8&&!report.errors.length,'Missing pages or page errors');report.status=report.pages.some(p=>p.violations.length)?'findings':'passed';console.log(JSON.stringify({phase,pages:report.pages.length,checks:report.checks.length,status:report.status}));
} catch(error) {report.status='failed';report.failure=String(error);throw error;}
finally {await fs.writeFile(`${out}/${phase}.json`,JSON.stringify(report,null,2)+'\n');await browser.close();}
