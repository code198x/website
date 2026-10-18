/** Read-only evidence pass against an explicitly started development server. */
import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
const base=process.env.EDITORIAL_PREVIEW_URL;
if(!base)throw Error('Set EDITORIAL_PREVIEW_URL to this checkout’s development server.');
const out=process.env.EDITORIAL_REVIEW_DIR??'.impeccable/review';
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch();const rows=[];
try{
 for(const width of [1440,390,320]){
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const slug of ['', 'specimen/', 'moving-shot/', 'duel-design/', 'capture-credits/']){
   const route='/catalogue/editorial-study/'+slug;const response=await page.goto(base+route);await page.evaluate(()=>document.fonts.ready);
   await page.locator('astro-dev-toolbar').evaluateAll(es=>es.forEach(e=>e.remove()));
   if(!response?.ok())throw Error(`${route}: ${response?.status()}`);
   await page.locator('.article-figure img').evaluateAll(async es=>Promise.all(es.map(i=>{i.loading='eager';return i.decode()})));
   const record=await page.evaluate(()=>({title:document.querySelector('h1')?.textContent,titles:document.querySelectorAll('h1').length,breadcrumbs:document.querySelectorAll('nav[aria-label="Breadcrumb"]').length,crumbsInOpening:!!document.querySelector('.article-opening .breadcrumbs'),noindex:document.querySelector('meta[name="robots"]')?.getAttribute('content'),overflow:document.documentElement.scrollWidth-innerWidth,images:[...document.querySelectorAll('article img')].map(i=>({src:i.getAttribute('src'),alt:i.alt,loaded:i.complete&&i.naturalWidth>0,width:i.getBoundingClientRect().width,native:i.naturalWidth})),figures:document.querySelectorAll('.article-figure').length,quotes:[...document.querySelectorAll('.article-pullquote')].map(e=>({hidden:e.getAttribute('aria-hidden'),text:e.querySelector('p')?.textContent})),links:[...document.querySelectorAll('main a')].map(a=>({href:a.getAttribute('href'),text:a.textContent})),reading:document.querySelector('.feature-prose>p')?.getBoundingClientRect().width,frame:document.querySelector('main')?.getBoundingClientRect().width}));
   if(record.titles!==1||record.breadcrumbs!==1||!record.crumbsInOpening||record.noindex!=='noindex'||record.overflow>0||!record.images.every(i=>i.loaded))throw Error(JSON.stringify({width,slug,record,errors}));
   if(!slug&&(record.figures!==7||record.images.length!==8||record.quotes.length!==2))throw Error('Missing article composition');
   if(!slug){
    const name=width===1440?'desktop':width===390?'mobile':'user-320';
    await page.screenshot({path:path.join(out,name+'.png'),fullPage:true});
    await page.screenshot({path:path.join(out,name+'-opening.png')});
    await page.locator('.article-figure').first().screenshot({path:path.join(out,name+'-figure.png')});
    await page.locator('.article-pullquote').first().screenshot({path:path.join(out,name+'-quote.png')});
   }else if(slug==='specimen/'&&width!==320)await page.screenshot({path:path.join(out,`specimen-${width}.png`),fullPage:true});
   rows.push({route,width,...record});
  }
  if(errors.length)throw Error(errors.join('\n'));
  await page.close();
 }
 await fs.writeFile(path.join(out,'editorial-checks.json'),JSON.stringify(rows,null,2));
 console.log(`${rows.length} article/companion/specimen views passed at desktop and phone widths.`);
}finally{await browser.close()}
