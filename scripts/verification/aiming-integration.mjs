import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const base=process.argv[2]||'http://127.0.0.1:1991',out=process.argv[3]||'/tmp/aiming-integrated';
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:1280,height:1000},reducedMotion:'reduce'});
const page=await context.newPage(),errors=[],checks=[];page.on('pageerror',e=>errors.push(String(e)));
const route='/craft/maths-for-games/';
try{
 await page.goto(base+route);
 assert.equal(await page.getByRole('heading',{name:'Chance and samples',exact:true}).count(),1);
 assert.equal(await page.getByRole('heading',{name:'Aiming and movement',exact:true}).count(),1);
 assert.equal(await page.locator('a.begin').count(),0);
 for(const [n,previous,next] of [[1,false,true],[5,true,false],[6,false,true],[11,true,false]]){
  await page.goto(base+route+`unit-${String(n).padStart(2,'0')}/`);
  assert.equal(await page.locator('a.nav-prev').count(),Number(previous));assert.equal(await page.locator('a.nav-next').count(),Number(next));
 }
 checks.push('Both entry routes exist; probability URLs and sequence boundaries remain independent');
 for(let n=6;n<=11;n++){
  await page.goto(base+route+`unit-${String(n).padStart(2,'0')}/`);
  assert(await page.locator('h1').isVisible());
  const iframe=page.locator('iframe[data-aiming]');await iframe.scrollIntoViewIfNeeded();
  const frame=page.frameLocator('iframe[data-aiming]');await frame.locator('#working').waitFor();
  await frame.locator('#controls input').first().waitFor();
  assert.equal(await frame.locator('#teaching').isVisible(),false);
  assert.equal(await frame.locator('#precision').count(),n===11?1:0);
  assert.equal(await frame.locator('#fire').count(),n>=10?1:0);
  const label=await page.locator('[role=progressbar]').getAttribute('aria-label');assert(label.includes(`Unit ${n-5} of 6`),label);
  if(n===6){await frame.locator('#x').fill('-120');await frame.locator('#x').press('Tab');assert.match(await frame.locator('#point-readout').textContent(),/-120.0, 90.0/);}
  if(n===9){await frame.locator('[data-radians=quarter]').click();assert.match(await frame.locator('#working').textContent(),/90.000°/);}
  if(n===10){await frame.locator('#solution').evaluate(el=>el.open=true);await frame.locator('#use-angle').click();await frame.locator('#fire').click();assert.match(await frame.locator('#result').textContent(),/Reference: hit/);}
  if(n===11){await frame.locator('#fire').click();assert.match(await frame.locator('#result').textContent(),/Fixed point: miss/);await frame.locator('#precision').selectOption('256');await frame.locator('#fire').click();assert.match(await frame.locator('#result').textContent(),/Fixed point: hit/);}
  for(const theme of ['light','dark']){
   await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);
   await page.waitForTimeout(400);
   const violations=(await new AxeBuilder({page}).include('main').analyze()).violations;
   await fs.writeFile(`${out}/axe-${n}-${theme}.json`,JSON.stringify(violations,null,2));assert.equal(violations.length,0,JSON.stringify(violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))));
  }
  for(const width of [390,1280]){await page.setViewportSize({width,height:1000});await page.waitForTimeout(150);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.equal(await frame.locator('body').evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);const sizes=await iframe.evaluate(el=>({frame:el.clientHeight,content:el.contentDocument.querySelector('main').getBoundingClientRect().height}));assert(Math.abs(sizes.frame-sizes.content)<3,JSON.stringify(sizes));if(n===6||n===11){await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(250);await page.screenshot({path:`${out}/lesson-${n}-${width}.png`,fullPage:true});}}
  checks.push(`Lesson ${n-5}: embedded experiment, scoped controls, normal navigation, both themes and responsive layout`);
 }
 assert.deepEqual(errors,[]);await fs.writeFile(out+'/results.json',JSON.stringify({base,checks,errors},null,2)+'\n');
}finally{await browser.close();}
