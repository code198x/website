import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import path from 'node:path';
import {tmpdir} from 'node:os';
const output=process.env.TOUCHDOWN_REVIEW_OUTPUT || path.join(tmpdir(),'touchdown-lesson-review');
mkdirSync(output,{recursive:true});
const roster=JSON.parse(readFileSync(new URL('../src/drafts/touchdown/roster.json',import.meta.url)));
const units=[...new Map(roster.map(u=>[u.unit,{...u,number:u.unit}])).values()];
const base=process.env.TOUCHDOWN_REVIEW_URL || 'http://localhost:4321/systems/sinclair-zx-spectrum/basic/touchdown/review/';
const browser=await chromium.launch();const results=[];
try {
for(const width of [390,1440])for(const theme of ['light','dark']){
 const context=await browser.newContext({viewport:{width,height:1000},colorScheme:theme});
 await context.addInitScript(t=>localStorage.setItem('theme',t),theme);
 for(const unit of [...units,{slug:'overview',number:0}]){
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto(base+(unit.slug ? unit.slug+'/' : ''));await page.waitForLoadState('networkidle');
  if(response.status()!==200)throw Error(`${unit.slug} ${response.status()}`);
  if(unit.number){
   const draft=readFileSync(new URL('../src/drafts/touchdown/'+unit.slug+'.mdx',import.meta.url),'utf8');
   const rendered=await page.locator('pre code').allTextContents();
   const samples=process.env.CODE_SAMPLES_PATH;
   if(!samples)throw Error('CODE_SAMPLES_PATH is required');
   for(const match of draft.matchAll(/<CodeFromFile src="([^"]+)"/g)){
    const expected=readFileSync(path.join(samples,match[1]),'utf8').trim();
    if(!rendered.some(b=>b.trim()===expected))throw Error('Rendered source differs: '+match[1]);
   }
   const inline=await page.locator('code').evaluateAll(es=>es.filter(e=>!e.closest('pre')).map(e=>e.textContent));
   for(const match of draft.matchAll(/`([^`\n]+)`/g))if(!inline.includes(match[1]))throw Error('Missing inline code: '+match[1]);

   if(await page.locator('.game-label').innerText()!=='GAME 3')throw Error('Wrong game');
   const q=page.locator('.question').first();await q.locator('summary').focus();await page.keyboard.press('Enter');
   if(await q.locator('details').getAttribute('open')===null)throw Error('Keyboard question');
  }
  await page.locator('details').evaluateAll(ds=>ds.forEach(d=>d.open=true));
  await page.evaluate(async()=>Promise.all([...document.images].map(async i=>{i.loading='eager';await i.decode();})));
  const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,missing:[...document.images].filter(i=>!i.naturalWidth).length,unavailable:document.body.textContent.includes('Code sample unavailable')}));
  if(state.overflow||state.missing||state.unavailable||errors.length)throw Error(JSON.stringify({unit,state,errors}));
  const violations=(await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa']).analyze()).violations.filter(v=>['serious','critical'].includes(v.impact));
  if(violations.length)throw Error(JSON.stringify({unit,violations}));
  const links=await page.locator('main a[href]').evaluateAll(as=>as.map(a=>a.getAttribute('href')).filter(h=>h.startsWith('/')||h.startsWith('../')));
  for(const href of new Set(links)){const target=new URL(href,page.url());const result=await context.request.get(target.href);if(result.status()!==200)throw Error('Broken link '+target.href+' '+result.status());}
  if(unit.number===7||unit.number===9||unit.number===10){await page.locator('.question').first().scrollIntoViewIfNeeded();await page.screenshot({path:path.join(output,`lesson-${unit.number}-${width}-${theme}.png`)});}
  results.push({unit:unit.number,width,theme,checks:'HTTP, sources, links, keyboard, overflow, images, Axe'});console.log(JSON.stringify(results.at(-1)));await page.close();
 }
 await context.close();
}
writeFileSync(path.join(output,'results.json'),JSON.stringify(results,null,2));
} finally {await browser.close();}
