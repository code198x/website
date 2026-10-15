/** Independently check binary/hex outputs, place values, table and original figure. */
import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
const [base,out,phase='baseline']=process.argv.slice(2);
if(!base||!out||!['baseline','after'].includes(phase))throw Error('Expected base, output, baseline/after');
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});const context=await browser.newContext();const page=await context.newPage();page.setDefaultTimeout(20000);
const report={date:new Date().toISOString(),base,phase,browser:browser.version(),pages:[],checks:[],errors:[]};
page.on('pageerror',error=>report.errors.push(String(error)));
const assert=(v,m)=>{if(!v)throw Error(m);};
const expected={
 'unit-01/':['101','1101','11111111'].map(bits=>String(parseInt(bits,2))),
 'unit-02/':[String(parseInt('1111',2)),[parseInt('11111111',2),parseInt('FF',16)].join('\n'),[parseInt('11110000',2),parseInt('F0',16)].join('\n'),...(phase==='after'?[[parseInt('0F',16)+1,parseInt('FF',16)+1].join('\n')]:[])],
};
try{
 for(const width of [1440,390])for(const unit of ['', 'unit-01/','unit-02/']){
  await page.setViewportSize({width,height:900});const route='/foundations/counting-in-twos/'+unit;
  const response=await page.goto(base+route);assert(response?.ok(),'HTTP '+response?.status());await page.locator('h1').waitFor();await page.evaluate(async()=>{await document.fonts.ready;await Promise.allSettled(document.getAnimations().map(a=>a.finished));});
  const text=await page.locator('main').innerText();
  const oldClaim=text.includes('Current flows, or it does not')||text.includes('You need Working It Out first');
  const outputs=(await page.locator('main .program-output-text').allTextContents()).map(s=>s.trim());assert(JSON.stringify(outputs)===JSON.stringify(unit?expected[unit]:[]),'Worked outputs differ or are missing');
  let table=[],figure=[];
  if(unit==='unit-02/'){
   table=await page.locator('main table tbody tr').evaluateAll(rows=>rows.map(r=>[...r.cells].map(c=>c.textContent.trim())));
   assert(table.length===6,'Conversion table missing rows');
   for(const [i,row] of table.entries()){
    assert(row.length===3&&row[0].length===4&&row[2].length===1,'Unexpected digit width');const value=Number(row[1]);
    assert(value===[0,5,9,10,12,15][i]&&parseInt(row[0],2)===value&&parseInt(row[2],16)===value,'Conversion table disagrees');
   }
   figure=await page.locator('main .hex-byte .nibble').evaluateAll(ns=>ns.map(n=>({positions:[...n.querySelectorAll('.positions span')].map(s=>Number(s.textContent)),bits:n.querySelector('.bits').textContent.trim(),digit:n.querySelector('.digit').textContent.trim(),value:n.querySelector('.value').textContent.trim()})));
   assert(figure.length===2,'Nibble groups missing');
   const bits=parseInt('F0',16).toString(2).padStart(8,'0');
   for(const [i,g] of figure.entries()){
    const part=bits.slice(i*4,i*4+4),n=parseInt(part,2),factor=i===0?16:1;
    assert(g.bits===part&&g.digit===n.toString(16).toUpperCase(),'Figure conversion differs');assert(JSON.stringify(g.positions)===JSON.stringify([7,6,5,4].map(v=>v-i*4)),'Figure position order differs');assert(g.value===`${n} × ${factor} = ${n*factor}`,'Figure weighting differs');
   }
   assert((await page.locator('main .hex-byte figcaption').innerText()).includes('15 × 16 + 0 = 240'),'Figure text equivalent missing');
  }
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  const axe=await new AxeBuilder({page}).include('main').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  report.pages.push({route,width,status:response.status(),oldClaim,outputs,table,figure,overflow,violations:axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),incomplete:axe.incomplete.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});assert(!overflow,'Document overflow');
  if(phase==='after'){
   assert(!oldClaim,'Original notation/physical-state claim remains');assert(!axe.violations.length,'Axe failed');
   if(unit==='unit-01/'){
    const block=page.locator('main pre').filter({hasText:'Places:'});assert(await block.count()===1,'Place-value block missing');const lines=await block.locator('.ll-text').allTextContents();assert(lines.length===2,'Expected exactly two place-value rows');const places=lines[0].match(/\d+/g)?.map(Number),bits=lines[1].match(/\d+/g)?.map(Number);assert(places?.length===8&&bits?.length===8,'Missing place-value digits');
    assert(JSON.stringify(places)===JSON.stringify(Array.from({length:8},(_,i)=>2**(7-i)))&&bits.join('')===(45).toString(2).padStart(8,'0')&&bits.reduce((s,b,i)=>s+b*places[i],0)===45,'Decimal-to-binary reconstruction differs');
   }
   if(unit){
    const question=unit==='unit-01/'?'Does BIN 00000101':'Do HEX 10 and decimal 10';const reveal=page.locator('main details').filter({has:page.locator('summary').filter({hasText:question})});assert(await reveal.count()===1&&await reveal.getAttribute('open')===null,'Prediction not uniquely closed');await reveal.locator('summary').focus();await page.keyboard.press('Enter');assert(await reveal.getAttribute('open')!==null,'Keyboard answer failed');
    const answer=await reveal.innerText(),fragments=unit==='unit-01/'?['5','256','nine binary digits','out-of-range']:['16','255','256','different questions'];assert(fragments.every(s=>answer.includes(s)),'Prediction distinction missing');report.checks.push({check:'closed prediction opens by keyboard',route,width,passed:true});
   }
   const revealed=await new AxeBuilder({page}).include('main').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();report.pages.at(-1).revealedViolations=revealed.violations.map(v=>v.id);report.pages.at(-1).revealedIncomplete=revealed.incomplete.map(v=>v.id);assert(!revealed.violations.length,'Revealed answer axe failure');
  }
  await page.screenshot({path:`${out}/${phase}-${unit.replaceAll('/','')||'overview'}-${width}.png`,fullPage:true});
  if(phase==='after'&&unit==='unit-02/')for(const [target,fragment,title] of [
   ['/systems/sinclair-zx-spectrum/assembly/meet-assembly/unit-02/','define byte','A byte becomes pixels'],
   ['/foundations/counting-in-twos/unit-03/','An address space is not a promise of that much RAM','Two Bytes Together']]){
   const link=page.locator(`main a[href="${target}"]`).first();await link.focus();await page.keyboard.press('Enter');await page.waitForURL(base+target);await page.waitForFunction(t=>document.querySelector('h1')?.textContent===t,title);assert((await page.locator('main').innerText()).includes(fragment),'Destination context missing');await page.goBack();await page.waitForURL(base+route);await page.waitForFunction(()=>document.querySelector('h1')?.textContent==='Four Bits at a Time');await page.evaluate(async()=>{await Promise.allSettled(document.getAnimations().map(a=>a.finished));});report.checks.push({check:'optional connection and Back by keyboard',target,width,passed:true});
  }
 }
 assert(!report.errors.length,report.errors.join('\n'));report.status=phase==='baseline'&&report.pages.some(p=>p.violations.length)?'findings':'passed';console.log(JSON.stringify({phase,pages:report.pages.length,checks:report.checks.length}));
}catch(error){report.status='failed';report.failure=String(error);throw error;}
finally{await fs.writeFile(`${out}/${phase}.json`,JSON.stringify(report,null,2)+'\n');await browser.close();}
