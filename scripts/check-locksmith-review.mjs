import {chromium, devices} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
const output=process.env.LOCKSMITH_REVIEW_OUTPUT || '/private/tmp/locksmith-browser';
const base=process.env.LOCKSMITH_REVIEW_URL || 'http://127.0.0.1:4332/systems/sinclair-zx-spectrum/basic/locksmith/';
const samples=path.resolve(process.env.CODE_SAMPLES_PATH || '../code-samples');
const metadata=yaml.load(readFileSync(new URL('../src/content/units/sinclair-zx-spectrum/basic/locksmith.yaml',import.meta.url),'utf8'));
const units=[{number:0,slug:'index'},...metadata.units];
// Check the editing directions against the executed source transition manifest.
for (const unit of metadata.units) {
 const mdx=readFileSync(new URL('../src/content/curriculum/sinclair-zx-spectrum/basic/locksmith/'+unit.slug+'.mdx',import.meta.url),'utf8');
 const changed=mdx.match(/locksmith\/teaching\/([^/]+)\/changes\.bas/);
 if (!changed) continue;
 const edits=JSON.parse(readFileSync(path.join(samples,'sinclair-zx-spectrum/basic/locksmith/teaching',changed[1],'edits.json'),'utf8'));
 for (const [action,key] of [['Add','add'],['Replace','replace'],['Delete','delete']]) {
  const match=mdx.match(new RegExp(action+' lines ([0-9, ]+)\\.'));
  const found=match ? match[1].split(',').map(x=>Number(x.trim())) : [];
  if(JSON.stringify(found)!==JSON.stringify(edits[key]))throw Error('Editing directions differ: '+unit.slug+' '+action);
 }
}
mkdirSync(output,{recursive:true});
const browser=await chromium.launch({channel:'chrome'});const results=[];const checkedLinks=new Set();let sourceBlocks=0;
try {
 for(const device of ['desktop','mobile']) for(const theme of ['light','dark']) {
  const context=await browser.newContext({...device==='mobile'?devices['Pixel 7']:{viewport:{width:1440,height:1000}},colorScheme:theme});
  await context.addInitScript(t=>localStorage.setItem('theme',t),theme);
  for(const unit of units) {
   const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
   const response=await page.goto(base+(unit.number?unit.slug+'/':''));await page.waitForLoadState('networkidle');
   if(response.status()!==200)throw Error(unit.slug+' HTTP '+response.status());
   const mdx=readFileSync(new URL('../src/content/curriculum/sinclair-zx-spectrum/basic/locksmith/'+unit.slug+'.mdx',import.meta.url),'utf8');
   const rendered=await page.locator('.code-container').evaluateAll(ns=>ns.map(n=>n.getAttribute('data-code')));
   const sources=[...mdx.matchAll(/<CodeFromFile src="([^"]+)"/g)].map(m=>m[1]);
   if(rendered.length!==sources.length)throw Error('Source count '+unit.slug);
   for(const [i,src] of sources.entries())if(rendered[i]!==readFileSync(path.join(samples,src),'utf8'))throw Error('Source differs '+src);
   if(device==='desktop'&&theme==='light')sourceBlocks+=sources.length;
   if(unit.number){const q=page.locator('.question').first();await q.locator('summary').focus();await page.keyboard.press('Enter');if(await q.locator('details').getAttribute('open')===null)throw Error('Question keyboard '+unit.slug);}
   await page.locator('details').evaluateAll(ns=>ns.forEach(n=>n.open=true));
   await page.evaluate(async()=>Promise.all([...document.images].map(async i=>{i.loading='eager';await i.decode();})));
   const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,brokenImages:[...document.images].filter(i=>!i.naturalWidth).length,unavailable:document.body.textContent.includes('Code sample unavailable'),h1:document.querySelectorAll('h1').length}));
   if(state.overflow||state.brokenImages||state.unavailable||state.h1!==1||errors.length)throw Error(JSON.stringify({unit,state,errors}));
   const violations=(await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze()).violations.filter(v=>['serious','critical'].includes(v.impact));
   if(violations.length)throw Error(JSON.stringify({unit,violations}));
   const hrefs=await page.locator('main a[href],.unit-navigation a[href]').evaluateAll(ns=>ns.map(n=>n.getAttribute('href')).filter(h=>h.startsWith('/')||h.startsWith('.')));
   for(const href of new Set(hrefs)){
    const url=new URL(href,page.url());if(checkedLinks.has(url.href))continue;
    const r=await context.request.get(url.href);if(r.status()!==200)throw Error('Broken link '+url.href);
    if(url.hash&&!((await r.text()).includes('id="'+decodeURIComponent(url.hash.slice(1))+'"')))throw Error('Broken anchor '+url.href);
    checkedLinks.add(url.href);
   }
   if([0,1,3,5,6,7,8,9,10].includes(unit.number)){await page.locator('details').evaluateAll(ns=>ns.forEach(n=>n.open=false));await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(output,`${unit.slug}-${device}-${theme}.png`)});}
   results.push({unit:unit.number,slug:unit.slug,device,theme,status:response.status(),sourceBlocks:sources.length,seriousOrCriticalViolations:0,...state});console.log('PASS',unit.slug,device,theme);await page.close();
  }
  await context.close();
 }
 writeFileSync(path.join(output,'results.json'),JSON.stringify({status:'passed',pageChecks:results.length,sourceBlocks,localLinks:checkedLinks.size,checks:results},null,2)+'\n');
} finally {await browser.close();}
