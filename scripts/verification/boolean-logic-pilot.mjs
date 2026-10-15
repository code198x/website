/** Inspect Boolean table results independently of authored column values. */
import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
const [base,out,phase='baseline']=process.argv.slice(2);
if(!base||!out||!['baseline','after'].includes(phase))throw Error('Expected base, output, baseline/after');
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});const context=await browser.newContext();const page=await context.newPage();page.setDefaultTimeout(20000);
const report={date:new Date().toISOString(),base,phase,browser:browser.version(),pages:[],checks:[],errors:[]};
page.on('pageerror',error=>report.errors.push(String(error)));
const assert=(value,message)=>{if(!value)throw Error(message);};
const expected={
 'alive':([a])=>a,'NOT alive':([a])=>Number(!a),
 'A AND B':([a,b])=>Number(Boolean(a)&&Boolean(b)),
 'A OR B':([a,b])=>Number(Boolean(a)||Boolean(b)),
 'A XOR B':([a,b])=>Number(a!==b),
 'NOT (dead OR finished)':([a,b])=>Number(!(Boolean(a)||Boolean(b))),
 'NOT dead AND NOT finished':([a,b])=>Number(!a&&!b),
 'NOT (A AND B)':([a,b])=>Number(!(Boolean(a)&&Boolean(b))),
 'NOT A OR NOT B':([a,b])=>Number(!a||!b),
};
async function tables(){
 const data=await page.locator('main table.truth-table').evaluateAll(tables=>tables.map(t=>({inputs:t.querySelectorAll('th.tt-input').length,labels:[...t.querySelectorAll('th.tt-output')].map(c=>c.textContent.trim().replace(/\s+/g,' ')),rows:[...t.querySelectorAll('tbody tr')].map(r=>[...r.querySelectorAll('td')].map(c=>Number(c.textContent.trim())))})));
 for(const table of data){
  assert(table.labels.length>0,'Truth table has no output columns');
  assert(table.rows.length===2**table.inputs,'Truth table row count differs');
  assert(new Set(table.rows.map(r=>r.slice(0,table.inputs).join(''))).size===table.rows.length,'Duplicate input rows');
  for(const [index,row] of table.rows.entries()){
   const input=Array.from({length:table.inputs},(_,i)=>(index>>(table.inputs-1-i))&1);
   assert(input.every((v,i)=>row[i]===v),'Rendered input order differs');
   for(const [i,label] of table.labels.entries())assert(expected[label]&&expected[label](input)===row[table.inputs+i],`Incorrect rendered output: ${label} row ${index}`);
  }
 }
 return data;
}
async function keyboardScroll(route,width){
 for(const table of await page.locator('main table.truth-table').all()){
  if(!await table.evaluate(t=>t.scrollWidth>t.clientWidth+1))continue;
  assert(await table.getAttribute('tabindex')==='0','Scrollable table is not in keyboard order');
  await table.evaluate(t=>t.scrollLeft=0);await table.focus();await page.keyboard.press('ArrowRight');
  await page.waitForFunction(t=>t.scrollLeft>0,await table.elementHandle());
  const focus=await table.evaluate(t=>({outline:getComputedStyle(t).outlineStyle,scrollLeft:t.scrollLeft}));
  assert(focus.outline!=='none','Table has no focus indicator');
  report.checks.push({check:'overflowing truth table scrolls by keyboard',route,width,...focus,passed:true});
 }
}
try{
 for(const width of [1440,390])for(const unit of ['', 'unit-01/','unit-02/','unit-03/']){
  await page.setViewportSize({width,height:900});const route='/foundations/truth-tables/'+unit;
  const response=await page.goto(base+route);assert(response?.ok(),'HTTP '+response?.status());await page.locator('h1').waitFor();
  const text=await page.locator('main').innerText();
  const oldClaim=text.includes('Every question a program asks has exactly two answers')||text.includes('every AND you add makes a test harder')||text.includes('the two tests cannot be told apart by any program');
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  const axe=await new AxeBuilder({page}).include('main').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  const data=await tables();const counts=unit==='unit-01/'?[1,2]:unit==='unit-02/'?[1,1,2]:unit==='unit-03/'?[2,2]:[];
  assert(data.length===counts.length&&data.every((t,i)=>t.labels.length===counts[i]),'Expected table/column set missing');
  report.pages.push({route,width,status:response.status(),oldClaim,overflow,tables:data,violations:axe.violations.map(v=>v.id),incomplete:axe.incomplete.map(v=>v.id)});
  assert(!overflow,'Document overflow');
  if(phase==='after'){assert(!axe.violations.length,'Axe failed');await keyboardScroll(route,width);}
  if(phase==='after'){
   assert(!oldClaim,'Original Boolean-scope claim remains');
   if(unit){
    const question=unit==='unit-01/'?'Does testing the same unchanged score':unit==='unit-02/'?'Must A AND A':'What if dead is TRUE';
    const reveal=page.locator('main details').filter({has:page.locator('summary').filter({hasText:question})});
    assert(await reveal.count()===1&&await reveal.getAttribute('open')===null,'Prediction not uniquely closed');
    await reveal.locator('summary').focus();await page.keyboard.press('Enter');assert(await reveal.getAttribute('open')!==null,'Keyboard answer failed');
    const answer=await reveal.innerText();const fragments=unit==='unit-01/'?['0,0','1,1']:unit==='unit-02/'?['each equal A','neither removes nor adds']:['FALSE','TRUE','stale flag'];
    assert(fragments.every(s=>answer.includes(s)),'Prediction distinction missing');
    report.checks.push({check:'closed prediction opens by keyboard',route,width,passed:true});
   }
  }
  await page.screenshot({path:`${out}/${phase}-${unit.replaceAll('/','')||'overview'}-${width}.png`,fullPage:true});
  if(phase==='after'&&unit==='unit-03/'){
   for(const [target,content] of [
    ['/systems/sinclair-zx-spectrum/basic/meet-basic/unit-06-keep-guessing/','Enforce the promised range'],
    ['/patterns/cross-platform/framework/state-machine/','Death wins over pause']]){
    const link=page.locator(`main a[href="${target}"]`).first();await link.focus();await page.keyboard.press('Enter');await page.waitForURL(base+target);await page.locator('h1').waitFor();
    assert((await page.locator('main').innerText()).includes(content),'Destination context missing');
    await page.goBack();await page.waitForURL(base+route);await page.waitForFunction(()=>document.querySelector('h1')?.textContent==='Two Guards, One Guard');
    await page.evaluate(async()=>{await Promise.allSettled(document.getAnimations().map(a=>a.finished));});
    report.checks.push({check:'optional connection and Back by keyboard',target,width,passed:true});
   }
  }
 }
 if(phase==='after')for(const route of ['/foundations/gates-and-the-adder/unit-01/','/foundations/gates-and-the-adder/unit-03/']){await page.setViewportSize({width:390,height:900});await page.goto(base+route);await page.locator('h1').waitFor();await keyboardScroll(route,390);}
 assert(!report.errors.length,report.errors.join('\n'));report.status=phase==='baseline'&&report.pages.some(p=>p.violations.length)?'findings':'passed';console.log(JSON.stringify({phase,pages:report.pages.length,checks:report.checks.length}));
}catch(error){report.status='failed';report.failure=String(error);throw error;}
finally{await fs.writeFile(`${out}/${phase}.json`,JSON.stringify(report,null,2)+'\n');await browser.close();}
