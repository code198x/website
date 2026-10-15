import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
// Baseline audits live routes; after checks only the two corrected Foundations pages.
const [base, output, phase='baseline']=process.argv.slice(2);
if(!base||!output)throw Error('Expected base URL and output directory');
if(!['baseline','after'].includes(phase))throw Error('Expected baseline or after phase');
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext();
const page=await context.newPage();
page.setDefaultTimeout(30000);
const report={date:new Date().toISOString(),base,phase,browser:browser.version(),os:process.platform,pages:[],checks:[],errors:[]};
page.on('pageerror',e=>report.errors.push(String(e)));
const basic='/systems/sinclair-zx-spectrum/basic/meet-basic/unit-02-remember-and-save/';
const assembly='/systems/sinclair-zx-spectrum/assembly/meet-assembly/unit-02/';
const routes=['/start-here/','/foundations/','/foundations/basics/','/foundations/basics/unit-03/','/foundations/basics/unit-04/','/systems/','/systems/sinclair-zx-spectrum/','/systems/sinclair-zx-spectrum/basic/','/systems/sinclair-zx-spectrum/basic/meet-basic/',basic,'/systems/sinclair-zx-spectrum/assembly/','/systems/sinclair-zx-spectrum/assembly/meet-assembly/',assembly,'/vault/techniques/variables-memory/'];
try{
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:900});
  for(const route of (phase==='after'?['/foundations/basics/unit-03/','/foundations/basics/unit-04/']:routes)){
   const response=await page.goto(base+route);
   if(!response?.ok())throw Error(`${route}: HTTP ${response?.status()}`);
   await page.locator('h1').first().waitFor();
   const result=await page.evaluate(()=>({url:location.href,title:document.querySelector('h1')?.textContent.trim(),overflow:document.documentElement.scrollWidth>innerWidth,links:Array.from(document.querySelectorAll('main a[href]')).map(a=>({text:a.textContent.trim().slice(0,100),href:a.getAttribute('href')}))}));
   report.pages.push({route,width,status:response.status(),...result});
   if(result.overflow)throw Error(`Page overflow at ${width}: ${route}`);
   if([basic,assembly,'/foundations/basics/unit-04/'].includes(route)){
    const axe=await new AxeBuilder({page}).include('main').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
    report.checks.push({check:'automated accessibility of main content',route,width,violations:axe.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)})),incomplete:axe.incomplete.map(v=>v.id)});
   }
   if(route==='/foundations/basics/unit-04/'){
    report.checks.push({check:'output does not consume stored value wording',width,oldClaimPresent:await page.locator('main').innerText().then(t=>t.includes('The moment the computer shows a value, it forgets it.'))});
    await page.screenshot({path:`${output}/${phase}-foundations-${width}.png`,fullPage:true});
   }
  }
 }
 if(report.checks.some(c=>c.violations?.length))throw Error('Automated accessibility violations recorded');
 if(phase==='after'){
  await page.goto(base+'/foundations/basics/unit-04/');
  const reveal=page.locator('main details').filter({has:page.getByText('Check your prediction',{exact:true})});
  if(await reveal.getAttribute('open')!==null)throw Error('Answer exposed before prediction');
  const summary=reveal.locator('summary');await summary.focus();await page.keyboard.press('Enter');
  if(await reveal.getAttribute('open')===null)throw Error('Keyboard reveal failed');
  const text=await reveal.innerText();
  if(!text.includes('Score: 0\nScore: 0\nScore: 100'))throw Error('Repeated-read output differs');
  const rows=await reveal.locator('tbody tr').count();
  if(rows!==5)throw Error('Expected five trace rows, got '+rows);
  if(report.checks.some(c=>c.oldClaimPresent))throw Error('Old claim remains');
  report.checks.push({check:'prediction answer starts closed; keyboard opens three output lines and five trace rows',passed:true});
  await reveal.screenshot({path:`${output}/${phase}-revealed-trace.png`});
 }else{
 await page.setViewportSize({width:1440,height:900});
 await page.goto(base+'/foundations/basics/unit-04/');
 const link=page.locator('main a[href="'+basic+'"]').first();
 await link.focus();await page.keyboard.press('Enter');await page.waitForURL(base+basic);
 report.checks.push({check:'keyboard activation of Foundations to BASIC link',passed:true});

 }
 if(report.errors.length)throw Error('Page errors: '+JSON.stringify(report.errors));
 console.log(JSON.stringify({browser:report.browser,pages:report.pages.length,checks:report.checks.length,violations:report.checks.flatMap(c=>c.violations??[])}));
}catch(error){report.failure=String(error);await page.screenshot({path:`${output}/${phase}-failure.png`});throw error;}
finally{await fs.writeFile(`${output}/${phase}.json`,JSON.stringify(report,null,2)+'\n');await browser.close();}
