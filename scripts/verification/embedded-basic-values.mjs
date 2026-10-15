/** Qualify actual stored-value output and recovery in the maintained BASIC modal. */
import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
const [base,out]=process.argv.slice(2);
if(!base||!out)throw Error('Expected base URL and evidence directory');
await fs.mkdir(out,{recursive:true});
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000}});
const page=await context.newPage();
page.setDefaultTimeout(30000);
const report={date:new Date().toISOString(),base,browser:browser.version(),viewport:{width:1440,height:1000},os:process.platform,checks:[],errors:[],assets:[]};
const pending=[];
page.on('pageerror',error=>report.errors.push(String(error)));
page.on('response',response=>{
 const url=response.url();
 if(url.startsWith(base)&&(/\.(js|wasm)(\?|$)/.test(url))){
  pending.push((async()=>{try{const bytes=await response.body();report.assets.push({url,status:response.status(),bytes:bytes.length,sha256:hash(bytes)});}catch(error){report.assets.push({url,error:String(error)});}})());
 }
});
const assert=(condition,message)=>{if(!condition)throw Error(message);};
const expected=['ONE','ONE','TWO'];
// ROM tape loading leaves a Program header before BASIC's own output.
const outputRows=rows=>{const body=rows.slice(0,22);while(body[0]==='')body.shift();if(body[0]==='Program: greeting')body.shift();while(body[0]==='')body.shift();return body;};
const fixture='10 LET n$="ONE"\n20 PRINT n$\n30 PRINT n$\n40 LET n$="TWO"\n50 PRINT n$\n';
await fs.writeFile(`${out}/repeated-read.bas`,fixture);
const root=page.locator('.basic-playground');
const source=root.locator('textarea');
const transcript=root.locator('.machine-transcript pre');
const canvas=root.locator('canvas');
const rows=async()=>((await transcript.textContent())??'').split('\n').map(row=>row.trimEnd());
const wait=async text=>{await page.waitForFunction(text=>document.querySelector('.basic-playground .machine-transcript pre')?.textContent.includes(text),text,{timeout:60000});};
const capture=async name=>{await root.locator('.machine-transcript summary').evaluate(e=>{e.parentElement.open=true;});await root.locator('dialog').screenshot({path:`${out}/${name}.png`});};
const press=async key=>{await page.keyboard.press(key,{delay:120});};
const record=async name=>{const actual=await rows();report.checks.push({name,rows:actual});return actual;};
try{
 const route='/systems/sinclair-zx-spectrum/basic/meet-basic/unit-02-remember-and-save/';
 const response=await page.goto(base+route);
 assert(response?.ok(),`HTTP ${response?.status()}`);
 const html=await response.body();report.page={url:response.url(),status:response.status(),sha256:hash(html)};
 await source.waitFor();
 const original=await source.inputValue();
 assert(original.includes('Jo')&&original.includes('PRINT'),'Unexpected maintained source');
 report.originalSource=original;report.originalSourceSha256=hash(original);
 await source.fill(fixture);
 await page.evaluate(()=>{
  window.basicObservations=[];
  const pre=document.querySelector('.basic-playground .machine-transcript pre');
  const remember=()=>window.basicObservations.push({text:pre.textContent});
  remember();window.basicObserver=new MutationObserver(remember);
  window.basicObserver.observe(pre,{childList:true,characterData:true,subtree:true});
 });
 await root.locator('.listing-run').click();
 report.earlyObservation={text:await transcript.textContent(),obsoleteSelectorCount:await page.locator('.basic-transcript pre').count(),obsoleteSelectorText:await page.locator('.basic-transcript pre').evaluateAll(nodes=>nodes[0]?.textContent??'')};
 try{assert(report.earlyObservation.text.trim().startsWith('ONE\nONE\nTWO'),'Repeated-read result: '+report.earlyObservation.text.trim());}
 catch(error){report.reconstructedPrematureAssertion={status:'rejected',failure:String(error),historicalCause:'unknown; discarded harness source was not retained'};}
 await wait('0 OK');
 let actual=await record('repeated reads and replacement');
 assert(JSON.stringify(outputRows(actual).slice(0,3))===JSON.stringify(expected),'Repeated-read rows differ: '+JSON.stringify(actual));
 assert(actual.some(row=>row.startsWith('0 OK')),'Missing successful completion report');
 assert((await source.inputValue())===fixture,'Execution changed the source');
 report.startupObservations=await page.evaluate(()=>{window.basicObserver.disconnect();return window.basicObservations;});
 await capture('repeated-read');
 // A known-red result must not pass by collapsing two reads into one.
 try{assert(JSON.stringify(outputRows(actual).slice(0,3))===JSON.stringify(['ONE','TWO']),'One read was lost');}
 catch(error){report.knownRed={rejected:true,failure:String(error)};}
 assert(report.knownRed?.rejected,'Known-red repeated-read control did not fail');
 // The original pilot asks for a wrong name in stored line 30, then that line's repair.
 await root.getByRole('button',{name:'Back to the listing',exact:true}).click();
 const broken=fixture.replace('30 PRINT n$','30 PRINT m$');
 assert(broken!==fixture,'Fault fixture did not change line 30');
 await source.fill(broken);await root.locator('.listing-run').click();
 await wait('2 Variable not found, 30:1');
 actual=await record('stored line 30 wrong-name fault');
 assert(outputRows(actual)[0]==='ONE'&&outputRows(actual).slice(1).every(row=>!row),'Fault did not stop after the first read');
 assert((await source.inputValue())===broken,'Runtime silently repaired the source');
 await capture('stored-wrong-name');
 await root.getByRole('button',{name:'Back to the listing',exact:true}).click();
 await source.fill(broken.replace('30 PRINT m$','30 PRINT n$'));
 assert((await source.inputValue())===fixture,'Repair changed more than the fault');
 await root.locator('.listing-run').click();await wait('0 OK');
 actual=await record('repair stored line 30 only');
 assert(JSON.stringify(outputRows(actual).slice(0,3))===JSON.stringify(expected),'Stored-line repair did not restore all reads');
 await capture('stored-repaired');

 await canvas.focus();
 await press('KeyP');await press('KeyM');await press('Alt+Digit4');await press('Enter');
 await wait('2 Variable not found');
 actual=await record('wrong immediate variable name');
 assert(JSON.stringify(outputRows(actual).slice(0,3))===JSON.stringify(expected),'Error consumed earlier output');
 assert((await source.inputValue())===fixture,'Wrong-name command changed listing');
 await capture('wrong-name');
 await canvas.focus();
 await press('KeyP');await press('KeyN');await press('Alt+Digit4');await press('Enter');
 await wait('0 OK');
 actual=await record('repair immediate command');
 assert(outputRows(actual)[3]==='TWO','Corrected immediate read did not retrieve current TWO: '+JSON.stringify(actual));
 await canvas.focus();await press('KeyR');await press('Enter');
 await page.waitForFunction(()=>{
  const rows=document.querySelector('.machine-transcript pre')?.textContent.split('\n').map(row=>row.trimEnd());
  if(!rows)return false;const body=rows.slice(0,22);while(body[0]==='')body.shift();if(body[0]==='Program: greeting')body.shift();while(body[0]==='')body.shift();
  return body.slice(0,3).join('|')==='ONE|ONE|TWO'&&body.slice(3).every(row=>!row)&&!rows.some(row=>row.trim()==='Program: greeting')&&rows.some(row=>row.startsWith('0 OK'));
 },{},{timeout:60000});
 await record('RUN after error and repair retains program');await capture('recovered-run');
 await root.getByRole('button',{name:'Restart Spectrum',exact:true}).click();
 // Restart leaves stale transcript text until frames arrive; wait for the fresh three-line state.
 await page.waitForFunction(()=>{
  const rows=document.querySelector('.machine-transcript pre')?.textContent.split('\n').map(row=>row.trimEnd());
  if(!rows)return false;const body=rows.slice(0,22);while(body[0]==='')body.shift();if(body[0]==='Program: greeting')body.shift();while(body[0]==='')body.shift();
  return body.slice(0,3).join('|')==='ONE|ONE|TWO'&&body.slice(3).every(row=>!row)&&rows.some(row=>row.trim()==='Program: greeting')&&rows.some(row=>row.startsWith('0 OK'));
 },{},{timeout:60000});
 await record('Restart reloads selected edited program');
 await root.getByRole('button',{name:'Back to the listing',exact:true}).click();
 await root.locator('.listing-options summary').click();
 await root.getByRole('button',{name:'Reset to original',exact:true}).click();
 assert((await source.inputValue())===original,'Reset did not restore maintained listing');
 await root.locator('.listing-run').click();await wait('Hello, Jo');await wait('0 OK');
 actual=await record('source reset and original greeting execution');
 assert(outputRows(actual)[0]==='Hello, Jo'&&outputRows(actual)[1]==='from the Spectrum','Original greeting differs');
 await capture('original-restored');
 const pixels=await canvas.evaluate(c=>{const data=c.getContext('2d').getImageData(48,56,256,32).data;return Array.from(data);});
 assert(new Set(pixels.filter((_,i)=>i%4!==3)).size>1,'Rendered text region is blank');
 report.renderedTextRegionSha256=hash(Buffer.from(pixels));
 assert(report.checks.length===8,'Missing execution/recovery stages');
 assert(!report.errors.length,report.errors.join('\n'));
 report.status='passed';console.log(JSON.stringify({status:report.status,checks:report.checks.length}));
}catch(error){report.status='failed';report.failure=String(error);report.failureRows=await rows().catch(()=>[]);await page.screenshot({path:`${out}/failure.png`,fullPage:true});throw error;}
finally{await Promise.all(pending);await fs.writeFile(`${out}/browser-results.json`,JSON.stringify(report,null,2)+'\n');await browser.close();}
