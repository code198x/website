import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import path from 'node:path';
const output=process.env.SONAR_REVIEW_OUTPUT || '/private/tmp/sonar-browser';
const base=process.env.SONAR_REVIEW_URL || 'http://127.0.0.1:4324/systems/sinclair-zx-spectrum/basic/sonar/';
const samples=path.resolve(process.env.CODE_SAMPLES_PATH || '../code-samples');
const roster=JSON.parse(readFileSync(new URL('../src/drafts/sonar/roster.json',import.meta.url)));
mkdirSync(output,{recursive:true});
const browser=await chromium.launch();const results=[];
try {
for(const width of [390,1440]) for(const theme of ['light','dark']) {
 const context=await browser.newContext({viewport:{width,height:1000},colorScheme:theme});
 await context.addInitScript(t=>localStorage.setItem('theme',t),theme);
 for(const unit of [{unit:0,slug:'index'},...roster].filter(unit => !process.env.SONAR_REVIEW_UNIT || unit.slug === process.env.SONAR_REVIEW_UNIT)) {
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto(base+(unit.unit ? unit.slug+'/' : ''));await page.waitForLoadState('networkidle');
  if(response.status()!==200)throw Error(unit.slug+' HTTP '+response.status());
  const draft=readFileSync(new URL('../src/content/curriculum/sinclair-zx-spectrum/basic/sonar/'+unit.slug+'.mdx',import.meta.url),'utf8');
  const rendered=await page.locator('pre code').allTextContents();
  for(const match of draft.matchAll(/<CodeFromFile src="([^"]+)"/g)) {
   const expected=readFileSync(path.join(samples,match[1]),'utf8').trim();
   if(!rendered.some(block=>block.trim()===expected))throw Error('Source differs: '+match[1]);
  }
  if(unit.unit) {
   const q=page.locator('.question').first();await q.locator('summary').focus();await page.keyboard.press('Enter');
   if(await q.locator('details').getAttribute('open')===null)throw Error('Keyboard question failed');
  }
  await page.locator('details').evaluateAll(ds=>ds.forEach(d=>d.open=true));
  await page.evaluate(async()=>Promise.all([...document.images].map(async i=>{i.loading='eager';await i.decode();})));
  const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,missing:[...document.images].filter(i=>!i.naturalWidth).length,unavailable:document.body.textContent.includes('Code sample unavailable')}));
  if(state.overflow||state.missing||state.unavailable||errors.length)throw Error(JSON.stringify({unit,state,errors}));
  const violations=(await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa']).analyze()).violations.filter(v=>['serious','critical'].includes(v.impact));
  if(violations.length)throw Error(JSON.stringify({unit:unit.unit,violations}));
  const links=await page.locator('main a[href]').evaluateAll(as=>as.map(a=>a.getAttribute('href')).filter(h=>h.startsWith('/')||h.startsWith('../')));
  for(const href of new Set(links)){const target=new URL(href,page.url());const result=await context.request.get(target.href);if(result.status()!==200)throw Error('Broken link '+target.href);}
  if([0,1,5,8].includes(unit.unit)){await page.locator('details').evaluateAll(ds=>ds.forEach(d=>d.open=false));await page.screenshot({path:path.join(output,`${unit.slug}-${width}-${theme}.png`)});}
  results.push({unit:unit.unit,width,theme,checks:'HTTP, source listings, question keyboard, overflow, images, links, serious/critical Axe'});console.log(JSON.stringify(results.at(-1)));await page.close();
 }
 await context.close();
}
writeFileSync(path.join(output,'results.json'),JSON.stringify(results,null,2)+'\n');
} finally {await browser.close();}
