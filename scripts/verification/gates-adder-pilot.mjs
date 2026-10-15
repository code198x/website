/** Exercise settled Boolean models by keyboard, independently of authored tables. */
import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
const [base,out,phase='baseline']=process.argv.slice(2);
if(!base||!out||!['baseline','after'].includes(phase))throw Error('Expected base, output, baseline/after');
await fs.mkdir(out,{recursive:true});const browser=await chromium.launch({channel:'chrome',headless:true});const context=await browser.newContext();const page=await context.newPage();page.setDefaultTimeout(20000);
const report={date:new Date().toISOString(),base,phase,browser:browser.version(),pages:[],circuitStates:[],checks:[],errors:[]};page.on('pageerror',error=>report.errors.push(String(error)));
const assert=(v,m)=>{if(!v)throw Error(m);};
const models={
 'and-gate':{inputs:2,result:([a,b])=>({out:Number(Boolean(a)&&Boolean(b))})},
 'or-gate':{inputs:2,result:([a,b])=>({out:Number(Boolean(a)||Boolean(b))})},
 'xor-gate':{inputs:2,result:([a,b])=>({out:Number(a!==b)})},
 'not-gate':{inputs:1,result:([a])=>({out:Number(!a)})},
 'half-adder':{inputs:2,result:bits=>({sum:bits.reduce((a,b)=>a+b,0)%2,carry:Math.floor(bits.reduce((a,b)=>a+b,0)/2)})},
 'full-adder':{inputs:3,result:bits=>({sum:bits.reduce((a,b)=>a+b,0)%2,cout:Math.floor(bits.reduce((a,b)=>a+b,0)/2)})},
};
async function circuits(unit,width){
 const ids=unit==='unit-01/'?['and-gate','or-gate','xor-gate','not-gate']:unit==='unit-02/'?['half-adder']:unit==='unit-03/'?['full-adder']:[];
 for(const id of ids){
  const root=page.locator(`[data-circuit="${id}"]`),model=models[id],pins=root.locator('[data-input][role="button"]');assert(await root.count()===1&&await pins.count()===model.inputs,'Circuit controls missing');
  for(let row=0;row<2**model.inputs;row++){
   const bits=Array.from({length:model.inputs},(_,i)=>(row>>(model.inputs-1-i))&1);
   for(let i=0;i<bits.length;i++){
    const pin=pins.nth(i);if(await pin.getAttribute('aria-pressed')!==String(Boolean(bits[i]))){await pin.focus();await page.keyboard.press((row+i)%2?'Enter':'Space');}
    assert(await pin.getAttribute('aria-pressed')===String(Boolean(bits[i])),'Input state differs');
   }
   const actual=await root.locator('[data-output]').evaluateAll(nodes=>Object.fromEntries(nodes.map(n=>[n.dataset.output,{value:Number(n.querySelector('[data-value]').textContent),lit:n.classList.contains('lc-on')}])));
   const expected=model.result(bits);assert(Object.keys(actual).length===Object.keys(expected).length,'Unexpected output set');for(const [key,value] of Object.entries(expected))assert(actual[key]?.value===value&&actual[key]?.lit===Boolean(value),'Circuit result differs: '+id+' row '+row);
   const synced=page.locator(`[data-sync-with="${id}"]`);assert(await synced.count()===(id==='not-gate'?0:1),'Unexpected sync table count');
   let syncCorrect=true,highlighted=[];
   if(id!=='not-gate'){highlighted=await synced.locator('tr.tt-row-on').evaluateAll(rows=>rows.map(r=>Number(r.dataset.row)));syncCorrect=highlighted.length===1&&highlighted[0]===row;if(phase==='after'||row!==0)assert(syncCorrect,'Highlighted input row differs');}
   report.circuitStates.push({id,width,row,inputs:bits,expected,actual,highlighted,syncCorrect,passed:true});
  }
 }
}
async function tables(unit){
 const tables=await page.locator('main table.truth-table').evaluateAll(ts=>ts.map(t=>({inputs:t.querySelectorAll('th.tt-input').length,columns:t.querySelectorAll('th.tt-output').length,sync:t.closest('figure').dataset.syncWith??null,highlighted:[...t.querySelectorAll('tr.tt-row-on')].map(r=>Number(r.dataset.row)),rows:[...t.querySelectorAll('tbody tr')].map(r=>[...r.cells].map(c=>Number(c.textContent.trim())))})));
 const ids=unit==='unit-01/'?['and-gate','or-gate','xor-gate']:unit==='unit-02/'?['half-adder','half-adder']:unit==='unit-03/'?['full-adder','full-adder']:[];
 assert(tables.length===ids.length,'Expected truth table missing');
 for(const [index,t] of tables.entries()){
  if(!t.sync)assert(t.highlighted.length===0,'Unlinked table gained an initial highlight');
  const model=models[ids[index]];assert(t.inputs===model.inputs&&t.rows.length===2**t.inputs,'Table input count differs');
  for(const [row,values] of t.rows.entries()){
   const bits=Array.from({length:t.inputs},(_,i)=>(row>>(t.inputs-1-i))&1),expected=[...bits,...Object.values(model.result(bits))];assert(t.columns===expected.length-bits.length&&JSON.stringify(values)===JSON.stringify(expected),'Authored table differs from independent oracle');
  }
 }
 return tables;
}
try{
 for(const width of [1440,390])for(const unit of ['', 'unit-01/','unit-02/','unit-03/']){
  await page.setViewportSize({width,height:900});const route='/foundations/gates-and-the-adder/'+unit;const response=await page.goto(base+route);assert(response?.ok(),'HTTP '+response?.status());await page.locator('h1').waitFor();await page.evaluate(async()=>{await document.fonts.ready;await Promise.allSettled(document.getAnimations().map(a=>a.finished));});
  const text=await page.locator('main').innerText(),oldClaim=text.includes('a gate is a truth table and nothing else')||text.includes('it is its truth table')||text.includes('A wrong carry poisons every column');
  const data=await tables(unit);await circuits(unit,width);
  if(unit==='unit-03/'){
   const root=page.locator('[data-circuit="ripple"]');assert(await root.count()===1&&await root.locator('[role="button"]').count()===0,'Ripple overview is not static');for(const ref of ['fa0:carry','fa1:carry'])assert(await root.locator(`[data-wire="${ref}"]`).count()>0,'Carry connection missing');
  }
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);const axe=await new AxeBuilder({page}).include('main').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  report.pages.push({route,width,status:response.status(),oldClaim,tables:data,overflow,violations:axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),incomplete:axe.incomplete.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});assert(!overflow,'Document overflow');
  if(phase==='after'){
   assert(!oldClaim,'Original gate-model claim remains');assert(!axe.violations.length,'Axe failed');
   if(unit==='unit-03/'){
    const trace=await page.locator('main table:not(.truth-table) tbody tr').evaluateAll(rows=>rows.map(r=>[...r.cells].map(c=>c.textContent.trim())));let carry=0;const expected=[];
    for(let bit=0;bit<3;bit++){const a=(7>>bit)&1,b=(1>>bit)&1,total=a+b+carry;expected.push([`${bit} (${['ones','twos','fours'][bit]})`,String(a),String(b),String(carry),String(total%2),String(Math.floor(total/2))]);carry=Math.floor(total/2);}
    assert(JSON.stringify(trace)===JSON.stringify(expected)&&carry===1,'Worked ripple trace differs');report.pages.at(-1).rippleTrace=trace;
   }
   if(unit){
    const question=unit==='unit-01/'?'If a drawing matches':unit==='unit-02/'?'For A = 1 and B = 1':'Does 111 + 001';const reveal=page.locator('main details').filter({has:page.locator('summary').filter({hasText:question})});assert(await reveal.count()===1&&await reveal.getAttribute('open')===null,'Prediction not uniquely closed');await reveal.locator('summary').focus();await page.keyboard.press('Enter');assert(await reveal.getAttribute('open')!==null,'Keyboard reveal failed');const answer=await reveal.innerText();const fragments=unit==='unit-01/'?['Boolean results','time measurement']:unit==='unit-02/'?['SUM is 0','CARRY is 1','two']:['eight','1000','000','final carry is 1'];assert(fragments.every(s=>answer.includes(s)),'Answer distinction missing');report.checks.push({check:'closed prediction opens by keyboard',route,width,passed:true});
   }
   const revealed=await new AxeBuilder({page}).include('main').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();report.pages.at(-1).revealedViolations=revealed.violations.map(v=>v.id);report.pages.at(-1).revealedIncomplete=revealed.incomplete.map(v=>v.id);assert(!revealed.violations.length,'Revealed answer axe failure');
  }
  await page.screenshot({path:`${out}/${phase}-${unit.replaceAll('/','')||'overview'}-${width}.png`,fullPage:true});
  if(phase==='after'&&unit==='unit-03/')for(const [target,fragment,title] of [
   ['/foundations/counting-in-twos/unit-04/','overflow','A Minus With No Minus Sign'],
   ['/systems/sinclair-zx-spectrum/assembly/meet-assembly/unit-01/','port','Change the border']]){
   const link=page.locator(`main a[href="${target}"]`).first();await link.focus();await page.keyboard.press('Enter');await page.waitForURL(base+target);await page.waitForFunction(t=>document.querySelector('h1')?.textContent===t,title);assert((await page.locator('main').innerText()).includes(fragment),'Destination context missing');await page.goBack();await page.waitForURL(base+route);await page.waitForFunction(()=>document.querySelector('h1')?.textContent==='The Full Adder and the Ripple');await page.evaluate(async()=>{await Promise.allSettled(document.getAnimations().map(a=>a.finished));});report.checks.push({check:'optional connection and Back by keyboard',target,width,passed:true});
  }
 }
 assert(report.circuitStates.length===52,'Missing circuit input cases');assert(!report.errors.length,report.errors.join('\n'));report.status=phase==='baseline'&&(report.pages.some(p=>p.violations.length)||report.circuitStates.some(c=>!c.syncCorrect))?'findings':'passed';console.log(JSON.stringify({phase,pages:report.pages.length,circuitStates:report.circuitStates.length,checks:report.checks.length}));
}catch(error){report.status='failed';report.failure=String(error);throw error;}
finally{await fs.writeFile(`${out}/${phase}.json`,JSON.stringify(report,null,2)+'\n');await browser.close();}
