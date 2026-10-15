/** Inspect Structure outputs and traces independently of authored result text. */
import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
const [base,out,phase='baseline']=process.argv.slice(2);
if(!base||!out||!['baseline','after'].includes(phase))throw Error('Expected base, output, baseline/after');
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext();const page=await context.newPage();page.setDefaultTimeout(20000);
const report={date:new Date().toISOString(),base,phase,browser:browser.version(),pages:[],checks:[],errors:[]};
page.on('pageerror',error=>report.errors.push(String(error)));
const assert=(v,m)=>{if(!v)throw Error(m);};
const original=[10,20,30],changed=[...original];changed[1]=99;changed.push(40);
const grid=[];for(let row=1;row<=3;row++)for(let column=1;column<=3;column++)grid.push(`row ${row} column ${column}`);
const divider='-'.repeat(10);
const expected={
 'unit-01/':[String(original[0]),`${changed[1]} and ${changed[3]}`,changed.join('\n'),...(phase==='after'?[String([].length)]:[]),grid.join('\n')],
 'unit-02/':[[divider,'Top news'].join('\n'),[divider,'Top news',divider,'More news',divider].join('\n')],
 'unit-03/':[['Sam','Ada'].map(who=>'Hello, '+who).join('\n'),String(5*2),...(phase==='after'?[`${5} and ${5*2}`]:[])],
 'unit-04/':[`A number? 5\nDouble it: ${5+2}`],
};
const questions={
 'unit-01/':[['With scores = [10]',['scores[1]','Index zero','no valid index']]],
 'unit-02/':[['Check which callers change',['all three dividers','not the second']]],
 'unit-03/':[['With n = 3',['n = 3','6','separate steps']],['Compare their promises',['No returned value','Twice that number']]],
 'unit-04/':[['Compare the predictions',['Zero and a negative number','cannot tell us']]],
};
try{
 for(const width of [1440,390])for(const unit of ['', 'unit-01/','unit-02/','unit-03/','unit-04/']){
  await page.setViewportSize({width,height:900});const route='/foundations/structure/'+unit;
  const response=await page.goto(base+route);assert(response?.ok(),'HTTP '+response?.status());await page.locator('h1').waitFor();
  const text=await page.locator('main').innerText();
  const oldAttendance=text.includes('Anyone who has finished Repeating');
  const outputs=(await page.locator('main .program-output-text').allTextContents()).map(s=>s.trim());
  assert(JSON.stringify(outputs)===JSON.stringify(unit?expected[unit]:[]),'Worked outputs differ or are missing');
  const tables=await page.locator('main table').evaluateAll(ts=>ts.map(t=>[...t.querySelectorAll('tbody tr')].map(r=>[...r.cells].map(c=>c.textContent.trim()))));
  const tableCounts={'':0,'unit-01/':0,'unit-02/':1,'unit-03/':1,'unit-04/':2};assert(tables.length===tableCounts[unit],'Expected table missing');
  if(unit==='unit-02/')assert(JSON.stringify(tables[0])===JSON.stringify([
   ['1','CALL divider','—'],['2','the SHOW inside the job',divider],['3','the job ends, back to the CALL','—'],['4','SHOW "Top news"','Top news']]),'Call/return trace differs');
  if(unit==='unit-04/'){
   assert(JSON.stringify(tables[0])===JSON.stringify([2,0,-3].map(n=>[String(n),String(n*2),String(n+2)])),'Debug prediction table differs');
   let total=0;const trace=[10,25,5].map((price,i)=>{const before=total;total+=price;return [String(i+1),String(price),String(before),String(total)];});
   assert(JSON.stringify(tables[1])===JSON.stringify(trace)&&total===[10,25,5].reduce((a,b)=>a+b,0),'Running total invariant differs');
  }
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  const axe=await new AxeBuilder({page}).include('main').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  report.pages.push({route,width,status:response.status(),oldAttendance,outputs,tables,overflow,violations:axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),incomplete:axe.incomplete.map(v=>v.id)});
  assert(!overflow,'Document overflow');
  if(phase==='after'){
   assert(!oldAttendance,'Original attendance requirement remains');assert(!axe.violations.length,'Axe failed');
   if(unit==='unit-01/')assert(['An index must be a whole number','An empty list','size fixed'].every(s=>text.includes(s)),'List boundary explanation missing');
   for(const [question,fragments] of questions[unit]||[]){
    const reveal=page.locator('main details').filter({has:page.locator('summary').filter({hasText:question})});
    assert(await reveal.count()===1&&await reveal.getAttribute('open')===null,'Prediction not uniquely closed');
    await reveal.locator('summary').focus();await page.keyboard.press('Enter');assert(await reveal.getAttribute('open')!==null,'Keyboard reveal failed');
    const answer=await reveal.innerText();assert(fragments.every(s=>answer.includes(s)),'Prediction explanation missing');
    report.checks.push({check:'closed prediction opens by keyboard',route,width,passed:true});
   }
   const revealedAxe=await new AxeBuilder({page}).include('main').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
   report.pages.at(-1).revealedViolations=revealedAxe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}));
   report.pages.at(-1).revealedIncomplete=revealedAxe.incomplete.map(v=>v.id);
   assert(!revealedAxe.violations.length,'Revealed answers fail axe');
  }
  await page.screenshot({path:`${out}/${phase}-${unit.replaceAll('/','')||'overview'}-${width}.png`,fullPage:true});
  if(phase==='after'&&['unit-03/','unit-04/'].includes(unit)){
   const target=unit==='unit-03/'?'/systems/sinclair-zx-spectrum/basic/meet-basic/unit-11-write-the-repeated-job-once/':'/systems/sinclair-zx-spectrum/assembly/meet-assembly/unit-08/';
   const link=page.locator(`main a[href="${target}"]`).first();await link.focus();await page.keyboard.press('Enter');await page.waitForURL(base+target);await page.locator('h1').waitFor();
   const targetText=await page.locator('main').innerText();assert(targetText.includes(unit==='unit-03/'?'return point':'debugger'),'Target context missing');
   await page.goBack();await page.waitForURL(base+route);await page.waitForFunction(title=>document.querySelector('h1')?.textContent===title,unit==='unit-03/'?'Telling a Job What to Work On':"When It's Wrong");
   await page.evaluate(async()=>{await Promise.allSettled(document.getAnimations().map(a=>a.finished));});
   report.checks.push({check:'optional connection and Back by keyboard',target,width,passed:true});
  }
 }
 assert(!report.errors.length,report.errors.join('\n'));report.status=phase==='baseline'&&report.pages.some(p=>p.violations.length)?'findings':'passed';console.log(JSON.stringify({phase,pages:report.pages.length,checks:report.checks.length}));
}catch(error){report.status='failed';report.failure=String(error);throw error;}
finally{await fs.writeFile(`${out}/${phase}.json`,JSON.stringify(report,null,2)+'\n');await browser.close();}
