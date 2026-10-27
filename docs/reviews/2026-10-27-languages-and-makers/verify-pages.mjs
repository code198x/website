import {chromium,devices} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const evidence=path.dirname(new URL(import.meta.url).pathname);
const entries=JSON.parse(fs.readFileSync(path.join(evidence,'entries.json')));
const browser=await chromium.launch();const results=[];
try{
 for(const [name,options] of [['desktop',{viewport:{width:1440,height:1000}}],['phone',devices['Pixel 7']]]){
  const context=await browser.newContext(options);
  for(const entry of entries){
   const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
   const response=await page.goto('http://127.0.0.1:8847/vault/'+entry.path+'/',{waitUntil:'networkidle'});
   assert.equal(response.status(),200,entry.path);assert.equal(await page.locator('main').count(),1);
   await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})))});
   assert.equal(await page.locator('#article-status').getAttribute('data-reviewed'),'false',entry.path);
   assert.match(await page.locator('meta[name="robots"]').getAttribute('content'),/noindex/);
   const layout=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,images:[...document.querySelectorAll('main img')].map(i=>({src:i.getAttribute('src'),alt:i.alt,width:i.naturalWidth})),title:document.querySelector('main h1')?.textContent}));
   assert.equal(layout.overflow,false,entry.path);assert(layout.images.every(i=>i.width>0&&i.alt.length>0),entry.path);
   const axe=await new AxeBuilder({page}).include('main').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
   assert.equal(axe.violations.length,0,JSON.stringify({entry:entry.path,violations:axe.violations}));assert.deepEqual(errors,[]);
   const shot=entry.path.replaceAll('/','-')+'-'+name+'.jpg';fs.mkdirSync(path.join(evidence,'screenshots'),{recursive:true});
   await page.screenshot({path:path.join(evidence,'screenshots',shot),fullPage:true,type:'jpeg',quality:65});
   results.push({entry:entry.path,device:name,status:response.status(),reviewed:false,noindex:true,...layout,axeViolations:axe.violations.length,pageErrors:errors,screenshot:'screenshots/'+shot});
   await page.close();console.log('PASS',name,entry.path);
  }
  await context.close();
 }
}finally{await browser.close();fs.writeFileSync(path.join(evidence,'browser-results.json'),JSON.stringify(results,null,2)+'\n')}
assert.equal(results.length,46);console.log('All 46 page/device checks passed.');
