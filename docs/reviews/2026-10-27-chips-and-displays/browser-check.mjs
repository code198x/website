import { chromium, devices } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import {readFile,writeFile} from 'node:fs/promises';
const dir='docs/reviews/2026-10-27-chips-and-displays';
const entries=JSON.parse(await readFile(`${dir}/entries.json`));
const results=[];const browser=await chromium.launch();
try{
 for(const [profile,options] of [['phone',{...devices['Pixel 7']}],['desktop',{viewport:{width:1440,height:1000},deviceScaleFactor:1}]]){
  const ctx=await browser.newContext(options);const page=await ctx.newPage();
  for(const {slug} of entries){
   const errors=[];const listener=e=>errors.push(String(e));page.on('pageerror',listener);
   const response=await page.goto(`http://127.0.0.1:4327/vault/hardware/${slug}/`,{waitUntil:'networkidle'});
   if(response.status()!==200||await page.locator('main').count()!==1)throw Error(`${slug}: missing article`);
   await page.evaluate(()=>document.fonts.ready);
   await page.locator('main img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));
   const layout=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,images:[...document.querySelectorAll('main img')].map(i=>({src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0,alt:i.alt})),reviewed:document.querySelector('#article-status')?.getAttribute('data-reviewed'),robots:document.querySelector('meta[name=robots]')?.content}));
   const axe=await new AxeBuilder({page}).include('main').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
   if(profile==='phone')await page.screenshot({path:`${dir}/${slug}-phone.png`,fullPage:true});
   if(profile==='desktop'&&layout.images.length)await page.screenshot({path:`${dir}/${slug}-desktop.png`,fullPage:true});
   results.push({slug,profile,status:response.status(),...layout,pageErrors:errors,violations:axe.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}))});
   page.off('pageerror',listener);console.log(profile,slug,'overflow',layout.scroll>layout.width,'axe',axe.violations.length);
  }
  await ctx.close();
 }
}finally{await browser.close();await writeFile(`${dir}/browser-results.json`,JSON.stringify(results,null,2)+'\n');}
if(results.length!==34||results.some(r=>r.scroll>r.width||r.pageErrors.length||r.violations.length||r.images.some(i=>!i.loaded||!i.alt)||r.robots!=='noindex'||r.reviewed!=='false'))process.exitCode=1;
