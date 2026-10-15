import {chromium,devices,expect} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const [base='https://code198x.com',out='docs/plans/crash-live-acceptance/loading']=process.argv.slice(2);
await mkdir(out,{recursive:true});
const browser=await chromium.launch();
const reports=[];
try{
 for(const path of ['/crash-live/','/systems/sinclair-zx-spectrum/basic/meet-basic/unit-01-make-the-spectrum-answer/']){
  const context=await browser.newContext(devices['Pixel 7']);
  const page=await context.newPage();
  const cdp=await context.newCDPSession(page);
  await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
  await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:93750});
  await page.addInitScript(()=>{window.layoutShiftTotal=0;new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.layoutShiftTotal+=e.value;}).observe({type:'layout-shift',buffered:true});});
  const started=Date.now();await page.goto(base+path,{waitUntil:'domcontentloaded'});
  await expect(page.locator('h1')).toBeVisible();const headingMs=Date.now()-started;
  await page.waitForLoadState('load');await page.evaluate(()=>document.fonts.ready);
  const reading=await page.evaluate(()=>({layoutShiftTotal:window.layoutShiftTotal,resources:performance.getEntriesByType('resource').map(r=>({name:r.name,bytes:r.transferSize,duration:r.duration})),overflow:document.documentElement.scrollWidth>innerWidth}));
  assert(!reading.overflow);assert(!reading.resources.some(r=>r.name.includes('emu198x_spectrum_web_bg')&&r.name.includes('.wasm')),'Reading fetched emulator WASM before Run');
  let programMs=null;
  if(path.includes('unit-01')){
   await page.getByRole('textbox',{name:'Your BASIC listing'}).fill('10 PRINT "SLOW CONNECTION"');
   const running=Date.now();await page.getByRole('button',{name:'Run this code',exact:true}).tap();
   await expect(page.locator('.machine-transcript pre')).toContainText('SLOW CONNECTION',{timeout:60000});programMs=Date.now()-running;
  }
  reports.push({path,headingMs,programMs,...reading});await context.close();
 }
}finally{await browser.close();}
await writeFile(out+'/results.json',JSON.stringify({base,profile:'Pixel 7; cold cache; 150ms latency; 1.6Mbit/s download; no CPU throttle',reports},null,2)+'\n');
console.log(reports.map(({resources,...r})=>({...r,transferredBytes:resources.reduce((s,r)=>s+r.bytes,0)})));
