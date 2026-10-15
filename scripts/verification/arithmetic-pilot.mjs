/** Check worked arithmetic results and independent keyboard prediction tasks. */
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
const assert=(v,m)=>{if(!v)throw Error(m)};
// Compute expected arithmetic; never read the authored Output text as the oracle.
const numeric=values=>values.map(String).join('\n');
const expected={
 'unit-01/':['First number? 7\nSecond number? 5\nThe total is '+(7+5),String(2+3*4),String((2+3)*4)],
 'unit-02/':[`Score: ${0}\nScore: ${0+10}`,`Lives: ${3-1}`],
 'unit-03/':[String(7/2),String(Math.floor(7/2)),String(7%2),numeric([8%2,9%2]),numeric([Math.round(3.2),Math.round(3.7)])],
};
try{
 for(const width of [1440,390])for(const unit of ['', 'unit-01/','unit-02/','unit-03/']){
  await page.setViewportSize({width,height:900});const route='/foundations/working-it-out/'+unit;
  const response=await page.goto(base+route);assert(response?.ok(),'HTTP '+response?.status());await page.locator('h1').waitFor();
  const text=await page.locator('main').innerText();
  const oldClaim=text.includes('ROUND DOWN throws away anything after the point')||text.includes('Anyone who has finished The Basics')||text.includes('One of the boxes was still empty when the sum ran');
  const outputs=await page.locator('main .program-output-text').allTextContents();
  const want=unit?(phase==='after'&&unit==='unit-01/'?[...expected[unit],numeric([20/5*2,20/(5*2)])]:expected[unit]):[];
  assert(JSON.stringify(outputs.map(s=>s.trim()))===JSON.stringify(want),'Worked outputs differ or are missing');
  let trace=[];
  if(unit==='unit-02/'){
   trace=await page.locator('main .trace tbody tr').evaluateAll(rows=>rows.map(r=>[...r.cells].map(c=>c.textContent.trim())));
   let score;const calculated=[];
   for(let step=1;step<=4;step++){const before=score;if(step===1)score=0;if(step===3)score+=10;calculated.push([String(step),before===undefined?'—':String(before),String(score),step===2||step===4?`Score: ${score}`:'—']);}
   assert(JSON.stringify(trace)===JSON.stringify(calculated),'Assignment trace differs from executed steps');
  }
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  const axe=await new AxeBuilder({page}).include('main').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  report.pages.push({route,width,status:response.status(),oldClaim,outputs,trace,overflow,violations:axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),incomplete:axe.incomplete.map(v=>v.id)});
  assert(!overflow,'Document overflow');
  if(phase==='after'){
   assert(!oldClaim,'Original arithmetic boundary claim remains');assert(!axe.violations.length,'Axe failed');
   if(unit){
    const question=unit==='unit-01/'?'What will 20 - 5 - 2':unit==='unit-02/'?'With a = 2 and b = 5':'Do 7 / 2, ROUND DOWN';
    const reveal=page.locator('main details').filter({has:page.locator('summary').filter({hasText:question})});
    assert(await reveal.count()===1&&await reveal.getAttribute('open')===null,'Prediction not uniquely closed');
    await reveal.locator('summary').focus();await page.keyboard.press('Enter');assert(await reveal.getAttribute('open')!==null,'Keyboard reveal failed');
    const answer=await reveal.innerText();const fragments=unit==='unit-01/'?['13','17']:unit==='unit-02/'?['both end at 5','spare']:['3.5','3','1','4','halfway rule'];
    assert(fragments.every(s=>answer.includes(s)),'Prediction answer missing');
    report.checks.push({check:'prediction opens by keyboard with explanation',route,width,passed:true});
   }
   if(unit==='unit-03/')assert(['-4','-3.5','positive','including zero','33 becomes 1','halfway'].every(s=>text.includes(s)),'Boundary explanation missing');
  }
  await page.screenshot({path:`${out}/${phase}-${unit.replaceAll('/','')||'overview'}-${width}.png`,fullPage:true});
  if(phase==='after'&&unit==='unit-03/')for(const [target,fragment] of [
   ['/systems/sinclair-zx-spectrum/basic/meet-basic/unit-07-choose-a-new-secret/','INT (RND*10)'],
   ['/patterns/cross-platform/rendering/centre-text-on-a-character-screen/','odd spare column']]){
   const link=page.locator(`main a[href="${target}"]`).first();await link.focus();await page.keyboard.press('Enter');await page.waitForURL(base+target);await page.locator('h1').waitFor();
   assert((await page.locator('main').innerText()).includes(fragment),'Connection context missing');
   await page.goBack();await page.waitForURL(base+route);await page.waitForFunction(()=>document.querySelector('h1')?.textContent==="When It Doesn't Divide Evenly");
   await page.evaluate(async()=>{await Promise.allSettled(document.getAnimations().map(a=>a.finished));});
   report.checks.push({check:'optional connection and Back by keyboard',target,width,passed:true});
  }
 }
 assert(!report.errors.length,report.errors.join('\n'));report.status=phase==='baseline'&&report.pages.some(p=>p.violations.length)?'findings':'passed';console.log(JSON.stringify({phase,pages:report.pages.length,checks:report.checks.length}));
}catch(error){report.status='failed';report.failure=String(error);throw error}
finally{await fs.writeFile(`${out}/${phase}.json`,JSON.stringify(report,null,2)+'\n');await browser.close()}
