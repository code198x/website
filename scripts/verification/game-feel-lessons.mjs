import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base=process.argv[2]||'http://127.0.0.1:1993',out=process.argv[3]||'/tmp/game-feel-lessons-check';
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:1280,height:1000},reducedMotion:'reduce'});
const page=await context.newPage(),errors=[],checks=[];page.on('pageerror',e=>errors.push(String(e)));
try {
 await page.goto(base+'/craft/game-feel/');assert.equal(await page.locator('a.unit').count(),4);assert.equal(await page.locator('.planned-topics dt').count(),5);
 for(let n=1;n<=4;n++){
  await page.goto(base+`/craft/game-feel/unit-0${n}/`);
  assert.equal(await page.locator('.nav-prev').count(),Number(n>1));assert.equal(await page.locator('.nav-next').count(),Number(n<4));
  assert.match(await page.locator('[role=progressbar]').getAttribute('aria-label'),new RegExp(`Unit ${n} of 4`));
  const iframe=page.locator('iframe[data-movement]'),frame=page.frameLocator('iframe[data-movement]');
  await iframe.scrollIntoViewIfNeeded();await frame.locator('#setting-value').waitFor();
  await frame.getByText('Inspect one update',{exact:true}).click();await frame.locator('#reset').click();await frame.locator('#step').click();
  assert.equal(await frame.locator('#pause').textContent(),'Resume');
  const expected=[240,4,10,10][n-1];assert.match(await frame.locator('#readout-1').textContent(),new RegExp(`v ${expected.toFixed(2)}$`));
  if(n===1){await frame.locator('#next-input').selectOption('0');await frame.locator('#step').click();assert.equal(await frame.locator('#readout-1').textContent(),'x 124.00 · v 0.00');}
  if(n>=3){for(let i=1;i<24;i++)await frame.locator('#step').click();await frame.locator('#next-input').selectOption(n===3?'0':'-1');await frame.locator('#step').click();assert.match(await frame.locator('#readout-1').textContent(),new RegExp(`v ${n===3?'238':'236'}.00$`));assert.match(await frame.locator('#readout-0').textContent(),new RegExp(`v ${n===3?'0':'230'}.00$`));}
  await frame.locator('#setting').fill(await frame.locator('#setting').getAttribute('min'));await frame.locator('#setting').dispatchEvent('input');assert.equal(await frame.locator('#readout-1').textContent(),'x 120.00 · v 0.00');
  await frame.locator('#arena').focus();await page.keyboard.down('ArrowRight');await page.waitForTimeout(300);await page.keyboard.up('ArrowRight');assert.notEqual(await frame.locator('#readout-1').textContent(),'x 120.00 · v 0.00');
  await frame.locator('#compare').click();await page.waitForTimeout(300);assert.match(await frame.locator('#status').textContent(),/Same input/);await frame.locator('#compare').click();assert.match(await frame.locator('#status').textContent(),/stopped/);await frame.locator('#reset').click();
  assert.equal(await page.getByText('Inspect the JavaScript used by this experiment',{exact:true}).count(),0);
  const sourceLink=page.getByRole('link',{name:'Movement rule source (JavaScript)'});assert.equal(await sourceLink.count(),1);
  const sourceResponse=await page.request.get(base+await sourceLink.getAttribute('href'));assert(sourceResponse.ok());assert.match(await sourceResponse.text(),/export function/);
  for(const theme of ['light','dark']){await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);await page.waitForTimeout(400);const result=await new AxeBuilder({page}).include('main').analyze();assert.deepEqual(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],`Lesson ${n} ${theme}`);}
  for(const width of [390,1280]){await page.setViewportSize({width,height:1000});await iframe.scrollIntoViewIfNeeded();await page.waitForTimeout(200);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.equal(await frame.locator('body').evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);const sizes=await iframe.evaluate(el=>({height:el.clientHeight,content:el.contentDocument.querySelector('main').getBoundingClientRect().height}));assert(Math.abs(sizes.height-sizes.content)<3,JSON.stringify(sizes));await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(250);await page.screenshot({path:`${out}/lesson-${n}-${width}.png`,fullPage:true});}
  checks.push(`Lesson ${n}: navigation, worked trace, setting reset, keyboard, recorded input, source download, themes, responsive iframe and accessibility`);
 }
 assert.deepEqual(errors,[]);await fs.writeFile(out+'/results.json',JSON.stringify({base,checks,errors},null,2));
} finally {await browser.close();}
