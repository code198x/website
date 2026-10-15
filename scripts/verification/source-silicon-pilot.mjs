/** Check translation boundaries and the authored model without claiming native pseudocode. */
import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
const [base,out,phase='baseline']=process.argv.slice(2);
if(!base||!out||!['baseline','after'].includes(phase))throw Error('Expected base, output, baseline/after');
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext();
const page=await context.newPage();page.setDefaultTimeout(20000);
const report={date:new Date().toISOString(),base,phase,browser:browser.version(),pages:[],checks:[],errors:[]};
page.on('pageerror',error=>report.errors.push(String(error)));
const assert=(v,m)=>{if(!v)throw Error(m);};
try {
 for(const width of [1440,390])for(const unit of ['',...Array.from({length:5},(_,i)=>`unit-0${i+1}/`)]) {
  const route='/foundations/from-source-to-silicon/'+unit;
  await page.setViewportSize({width,height:900});const response=await page.goto(base+route);assert(response?.ok(),'HTTP '+response?.status());await page.locator('h1').waitFor();
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.allSettled(document.getAnimations().map(a=>a.finished));});
  const text=await page.locator('main').innerText();const outputs=(await page.locator('main .program-output-text').allTextContents()).map(s=>s.trim());
  const expected=unit==='unit-02/'?['1000']:unit==='unit-03/'?(phase==='after'?['1\n1\n2\n3','Unknown instruction: MYSTERY\nTranslation failed; no code emitted']:['1\n1\n2\n3']):[];
  assert(JSON.stringify(outputs)===JSON.stringify(expected),'Authored output differs');
  const tables=await page.locator('main table').evaluateAll(ts=>ts.map(t=>[...t.querySelectorAll('tbody tr')].map(r=>[...r.cells].map(c=>c.textContent.trim()))));
  if(unit==='unit-01/') {assert(tables.length===2&&tables[0].length===3,'Routes table missing');assert(JSON.stringify(tables[1].map(r=>r.slice(0,2)))===JSON.stringify([['INC','1'],['DOUBLE','2'],['SHOW','3']]),'Model code table differs');}
  if(unit==='unit-03/') {assert(tables.length===2&&JSON.stringify(tables[1])===JSON.stringify([['INC','1'],['DOUBLE','2'],['SHOW','3']]),'Encoding table differs');}
  const trace=await page.locator('main .trace tbody tr').evaluateAll(rs=>rs.map(r=>[...r.cells].map(c=>c.textContent.trim())));
  if(unit==='unit-02/'||unit==='unit-03/') {assert(trace.length===5,'Trace row missing');assert(trace.at(-1).at(-1)==='1000'&&trace.at(-1).includes('999 + 1'),'Loop trace result differs');}
  if(unit==='unit-05/') {assert(tables.length===1,'Deadline table missing');const measured=tables[0].map(r=>r.slice(1).map(c=>Number(c.replace(' ms',''))));assert(JSON.stringify(measured)===JSON.stringify([[8,10],[8,10],[8,10],[16,10]]),'Invented observations differ');const averages=[0,1].map(i=>measured.reduce((sum,r)=>sum+r[i],0)/measured.length);assert(averages.every(v=>v===10)&&measured.filter(r=>r[0]>12).length===1&&!measured.some(r=>r[1]>12),'Deadline invariants differ');assert(text.includes('invented measurements')&&text.includes('not a controlled benchmark')&&text.includes('Guest time'),'Measurement scope missing');}
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  const axe=await new AxeBuilder({page}).include('main').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  report.pages.push({route,width,status:response.status(),outputs,tables,trace,overflow,violations:axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),incomplete:axe.incomplete.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});assert(!overflow,'Document overflow');
  if(phase==='after') {
   assert(!text.includes('This toy does not, which is a good reason'),'Original silent-omission endpoint remains');assert(!text.includes('You need Structure'),'Original attendance prerequisite remains');assert(!axe.violations.length,'Axe failed');
   const questions=unit==='unit-01/'?['Are character codes instructions?']:unit==='unit-03/'?['Does a recognised last word','Follow the compiler']:unit==='unit-04/'?['Compare rules and drawing']:unit==='unit-05/'?['Compare the average']:[];
   for(const question of questions) {const reveal=page.locator('main details').filter({has:page.locator('summary').filter({hasText:question})});assert(await reveal.count()===1&&await reveal.getAttribute('open')===null,'Prediction not uniquely closed');await reveal.locator('summary').focus();await page.keyboard.press('Enter');assert(await reveal.getAttribute('open')!==null,'Keyboard reveal failed');report.checks.push({check:'closed prediction opens by keyboard',question,width,passed:true});}
   if(unit==='unit-03/') {const code=(await page.locator('main pre').allTextContents()).join('\n');assert(['LET pending = []','LET valid = TRUE','LET found = FALSE','APPEND codes[i] TO pending','IF valid THEN','FOR EACH code IN pending'].every(s=>code.includes(s)),'Validation/buffer steps missing');assert(text.includes('empty program'),'Empty-program explanation missing');}
   const revealed=await new AxeBuilder({page}).include('main').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();assert(!revealed.violations.length,'Revealed axe failure');report.pages.at(-1).revealedIncomplete=revealed.incomplete.map(v=>v.id);
  }
  await page.screenshot({path:`${out}/${phase}-${unit.replaceAll('/','')||'overview'}-${width}.png`,fullPage:true});
  if(phase==='after'&&unit==='unit-04/') {const target='/foundations/structure/unit-04/';const link=page.locator(`main a[href="${target}"]`).first();await link.focus();await page.keyboard.press('Enter');await page.waitForURL(base+target);assert((await page.locator('main').innerText()).includes('expected'),'Diagnosis context missing');await page.goBack();await page.waitForURL(base+route);report.checks.push({check:'diagnosis link and Back by keyboard',width,passed:true});}
 }
 assert(report.pages.length===12&&!report.errors.length,'Missing pages or page errors');report.status=report.pages.some(p=>p.violations.length)?'findings':'passed';console.log(JSON.stringify({phase,pages:report.pages.length,checks:report.checks.length,status:report.status}));
} catch(error) {report.status='failed';report.failure=String(error);throw error;}
finally {await fs.writeFile(`${out}/${phase}.json`,JSON.stringify(report,null,2)+'\n');await browser.close();}
