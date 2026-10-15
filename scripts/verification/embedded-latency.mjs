/** Measure one real BASIC task; missing/stale output cannot become a fast timing. */
import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import os from 'node:os';
const [base,out,countText='5']=process.argv.slice(2);
const count=Number(countText);
if(!base||!out||!Number.isInteger(count)||count<1||count>10)throw Error('Expected base URL, evidence directory, 1–10 trials');
await fs.mkdir(out,{recursive:true});
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const assert=(value,message)=>{if(!value)throw Error(message);};
const report={date:new Date().toISOString(),base,count,verifierSha256:hash(await fs.readFile(new URL(import.meta.url))),node:process.version,host:{os:os.platform(),release:os.release(),arch:os.arch(),cpu:os.cpus()[0].model,logicalCpus:os.cpus().length,memoryBytes:os.totalmem()},viewport:{width:1440,height:1000},conditions:{network:'host network, unthrottled; no RTT/bandwidth shaping',cpuThrottleRate:1,cold:'new nonpersistent context; browser HTTP cache cleared and disabled; fresh document/module',warm:'same page/module; new emulated machine each Run; no reload; browser HTTP cache still disabled',uncontrolled:'OS/DNS/TLS/CDN caches, browser-process JIT and other host load',serviceWorkers:'blocked'},trials:[],errors:[]};
const browser=await chromium.launch({channel:'chrome',headless:true});
report.browser=browser.version();
try{
 for(let index=1;index<=count;index++){
  const context=await browser.newContext({viewport:report.viewport,deviceScaleFactor:1,serviceWorkers:'block'});
  const page=await context.newPage();page.setDefaultTimeout(30000);
  const cdp=await context.newCDPSession(page);
  await cdp.send('Network.enable');await cdp.send('Network.clearBrowserCache');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
  await cdp.send('Emulation.setCPUThrottlingRate',{rate:1});
  const trial={index,measurements:[],network:[],assets:[],errors:[]};report.trials.push(trial);
  let phase='navigation';const requests=new Map();const responses=[];
  page.on('pageerror',error=>trial.errors.push(String(error)));
  cdp.on('Network.requestWillBeSent',event=>{requests.set(event.requestId,{url:event.request.url,phase,timestamp:event.timestamp});});
  cdp.on('Network.responseReceived',event=>{
   const request=requests.get(event.requestId);if(!request||!request.url.startsWith(base))return;
   const response=event.response;
   const row={...request,id:event.requestId,status:response.status,type:event.type,fromDiskCache:!!response.fromDiskCache,fromServiceWorker:!!response.fromServiceWorker,protocol:response.protocol,cacheControl:response.headers['cache-control']??response.headers['Cache-Control']??null};
   trial.network.push(row);requests.set(event.requestId,row);
  });
  cdp.on('Network.loadingFinished',event=>{const row=requests.get(event.requestId);if(row)row.encodedDataLength=event.encodedDataLength;});
  page.on('response',response=>{if(response.url().startsWith(base)&&/\.(js|wasm)(\?|$)/.test(response.url()))responses.push(response);});
  try{
   const response=await page.goto(base+'/systems/sinclair-zx-spectrum/basic/meet-basic/unit-01-make-the-spectrum-answer/');
   assert(response?.ok(),`HTTP ${response?.status()}`);
   trial.pageSha256=hash(await response.body());
   const root=page.locator('.basic-playground'),source=root.locator('textarea');
   await source.waitFor();
   const original=await source.inputValue();assert(original.includes('Welcome'),'Unexpected maintained greeting');
   trial.originalSource=original;trial.originalSourceSha256=hash(original);
   trial.navigation=await page.evaluate(()=>{const n=performance.getEntriesByType('navigation')[0];return {responseEndMs:n.responseEnd,domContentLoadedMs:n.domContentLoadedEventEnd,loadEventEndMs:n.loadEventEnd};});
   // Passive page-clock observations; no runner hooks or simulated ROM results.
   await page.evaluate(()=>{
    const root=document.querySelector('.basic-playground'),pre=root.querySelector('.machine-transcript pre');
    const read=()=>pre.textContent.split('\n').map(row=>row.trimEnd());
    const body=rows=>{const result=rows.slice(0,22);while(result[0]==='')result.shift();if(result[0]==='Program: greeting')result.shift();while(result[0]==='')result.shift();return result.filter(Boolean);};
    const complete=m=>{const rows=read();return JSON.stringify(body(rows))===JSON.stringify([m.expected,'to you','from the Spectrum'])&&rows.some(row=>row.startsWith('0 OK, 20:1'));};
    window.latencyArm=(expected,label,timeoutMs)=>{
     window.latencyMeasurement={expected,label,status:'armed',clickAt:null,inputAt:null,endAt:null,incompleteSeen:false,observations:[]};
     window.latencyTimeoutMs=timeoutMs;
    };
    root.querySelector('textarea').addEventListener('input',()=>{const m=window.latencyMeasurement;if(m&&m.status==='armed')m.inputAt=performance.now();},{capture:true});
    root.querySelector('.listing-run').addEventListener('click',()=>{
     const m=window.latencyMeasurement;if(!m||m.status!=='armed')return;
     m.clickAt=performance.now();m.status='running';m.incompleteSeen=!complete(m);
     m.timer=setTimeout(()=>{if(m.status==='running'){m.status='failed';m.failure='Expected complete machine output was not observed';m.timeoutObservedMs=performance.now()-m.clickAt;}},window.latencyTimeoutMs);
    },{capture:true});
    new MutationObserver(()=>{
     const m=window.latencyMeasurement;if(!m||m.status!=='running')return;
     const now=performance.now(),rows=read(),matches=complete(m);
     m.observations.push({atMs:now,complete:matches,rows});
     if(!matches){m.incompleteSeen=true;return;}
     if(!m.incompleteSeen||m.settling)return;
     m.settling=true;m.matchAt=now;
     requestAnimationFrame(()=>requestAnimationFrame(()=>{
      if(m.status!=='running')return;
      if(!complete(m)){m.settling=false;return;}
      const start=performance.now(),canvas=root.querySelector('canvas');
      const data=canvas.getContext('2d').getImageData(48,56,256,48).data;
      let fnv=2166136261;const colours=new Set();
      for(let i=0;i<data.length;i++){fnv=Math.imul(fnv^data[i],16777619)>>>0;if(i%4===0)colours.add(data[i]*65536+data[i+1]*256+data[i+2]);}
      if(colours.size<2||!root.querySelector('dialog').open){m.settling=false;return;}
      m.canvas={fnv:fnv.toString(16),bytes:data.length,colours:colours.size,readbackMs:performance.now()-start};
      m.endAt=performance.now();m.rows=read();m.clickToResultMs=m.endAt-m.clickAt;
      if(m.inputAt!==null)m.inputToResultMs=m.endAt-m.inputAt;
      m.matchToEndMs=m.endAt-m.matchAt;m.status='passed';clearTimeout(m.timer);
     }));
    }).observe(pre,{subtree:true,childList:true,characterData:true});
   });
   const measure=async(label,expected,edited=null,timeoutMs=45000)=>{
    phase=label;
    await page.evaluate(({expected,label,timeoutMs})=>window.latencyArm(expected,label,timeoutMs),{expected,label,timeoutMs});
    if(edited!==null)await source.fill(edited);
    await root.locator('.listing-run').click();
    await page.waitForFunction(()=>['passed','failed'].includes(window.latencyMeasurement?.status),{},{timeout:timeoutMs+10000});
    const m=await page.evaluate(()=>{const {timer,...m}=window.latencyMeasurement;return m;});
    if(label==='missing-result-control')trial.negativeControl=m;else trial.measurements.push(m);
    console.log(JSON.stringify({trial:index,label,status:m.status,clickToResultMs:m.clickToResultMs}));
    return m;
   };
   const cold=await measure('cold-startup','Welcome');assert(cold.status==='passed','Cold startup failed');
   // Fetch hashes after the timed endpoint, not while the machine is starting.
   for(const response of responses){const bytes=await response.body();trial.assets.push({url:response.url(),bytes:bytes.length,sha256:hash(bytes)});}
   if(index===count)await root.locator('canvas').screenshot({path:`${out}/cold.png`});
   await root.getByRole('button',{name:'Back to the listing',exact:true}).click();
   const warm=await measure('warm-unchanged','Welcome');assert(warm.status==='passed','Warm startup failed');
   assert(cold.canvas.fnv===warm.canvas.fnv,'Unchanged greeting canvas differs');
   if(index===count)await root.locator('canvas').screenshot({path:`${out}/warm.png`});
   await root.getByRole('button',{name:'Back to the listing',exact:true}).click();
   const marker=`Hello again ${index}`,edited=original.replace('Welcome',marker);assert(edited!==original,'Source did not change');
   const changed=await measure('warm-edited',marker,edited);assert(changed.status==='passed','Edited run failed');
   assert(changed.canvas.fnv!==warm.canvas.fnv,'Canvas did not change with edited greeting');
   if(index===count){
    await root.locator('canvas').screenshot({path:`${out}/edited.png`});
    await root.getByRole('button',{name:'Back to the listing',exact:true}).click();
    const control=await measure('missing-result-control','THIS RESULT IS NOT IN THE PROGRAM',null,2000);
    assert(control.status==='failed'&&control.endAt===null&&control.clickToResultMs===undefined,'Missing result became a timing');
   }
   assert(!trial.errors.length,trial.errors.join('\n'));trial.status='passed';
  }catch(error){trial.status='failed';trial.failure=String(error);await page.screenshot({path:`${out}/failure-${index}.png`});throw error;}
  finally{await context.close();await fs.writeFile(`${out}/results.json`,JSON.stringify(report,null,2)+'\n');}
 }
 const groups=['cold-startup','warm-unchanged','warm-edited'];report.summary={};
 for(const label of groups){const values=report.trials.flatMap(t=>t.measurements.filter(m=>m.label===label).map(m=>m.clickToResultMs)).sort((a,b)=>a-b);assert(values.length===count&&values.every(v=>Number.isFinite(v)&&v>0),'Missing valid timings');report.summary[label]={count:values.length,minMs:values[0],medianMs:(values[Math.floor((values.length-1)/2)]+values[Math.floor(values.length/2)])/2,maxMs:values.at(-1)};}
 assert(report.trials.length===count,'Missing trial');report.status='passed';console.log(JSON.stringify(report.summary));
}catch(error){report.status='failed';report.failure=String(error);throw error;}
finally{await fs.writeFile(`${out}/results.json`,JSON.stringify(report,null,2)+'\n');await browser.close();}
