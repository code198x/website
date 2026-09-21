import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base=process.argv[2]||'http://127.0.0.1:1991',out=process.argv[3]||'/tmp/game-feel-review';
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:1280,height:950},reducedMotion:'reduce'});
const page=await context.newPage(),errors=[],checks=[];
page.on('pageerror',e=>errors.push(String(e)));
try {
 for(const route of ['/craft/','/craft/game-feel/','/experiments/game-feel/index.html']){
  await page.goto(base+route);
  if(route==='/craft/') {assert.equal(await page.locator('.card').count(),2);assert.deepEqual(await page.locator('.card h3').allTextContents(),['Maths for Games','Game Feel']);assert.equal(await page.locator('.question-grid h3').count(),5);assert.equal(await page.locator('.question-grid a').count(),0);assert.match(await page.locator('.card').first().innerText(),/trigonometry/);}
  for(const width of [390,1280]){
   await page.setViewportSize({width,height:950});
   await page.waitForTimeout(200);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,route);
   if(route!=='/experiments/game-feel/index.html') for(const theme of ['light','dark']) {await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);await page.waitForTimeout(400);const result=await new AxeBuilder({page}).include('main').analyze();assert.deepEqual(result.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[],route+theme);}
   else {const result=await new AxeBuilder({page}).analyze();assert.deepEqual(result.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[]);}
   await page.screenshot({path:`${out}/${route.split('/').filter(Boolean).join('-')}-${width}.png`,fullPage:true});
  }
  checks.push(`${route}: responsive layout and accessibility checks`);
 }
 const position=()=>page.locator('#readout-0').textContent();
 await page.locator('#arena').focus();await page.keyboard.down('ArrowRight');await page.waitForTimeout(500);await page.keyboard.up('ArrowRight');await page.waitForTimeout(80);
 assert.match(await position(),/v 0 units/);assert(!((await position()).startsWith('x 140')));assert(!((await page.locator('#readout-1').textContent()).includes('v 0 units')));
 await page.keyboard.down('ArrowRight');await page.waitForTimeout(100);await page.locator('#reset').focus();await page.keyboard.up('ArrowRight');await page.waitForTimeout(80);assert.match(await position(),/v 0 units/);
 await page.locator('#reset').click();assert.match(await position(),/x 140/);
 const button=await page.locator('#right').boundingBox();await page.mouse.move(button.x+20,button.y+20);await page.mouse.down();await page.waitForTimeout(300);await page.mouse.up();await page.waitForTimeout(80);assert.match(await position(),/v 0 units/);
 await page.locator('#demo').click();await page.waitForTimeout(400);assert.match(await page.locator('#status').textContent(),/Comparison:/);await page.locator('#demo').click();assert.match(await page.locator('#status').textContent(),/stopped/);
 await page.locator('#demo').click();await page.waitForTimeout(8400);assert.match(await page.locator('#status').textContent(),/finished/);
 for(let i=0;i<3;i++)assert.match(await page.locator(`#readout-${i}`).textContent(),/v 0 units/);
 await page.locator('#speed').fill('360');await page.locator('#speed').dispatchEvent('input');assert.match(await position(),/x 140/);assert.equal(await page.locator('#speed-value').textContent(),'360');
 checks.push('Keyboard, release, focus loss, pointer hold, reset, comparison stop/completion and speed reset');
 assert.deepEqual(errors,[]);await fs.writeFile(out+'/results.json',JSON.stringify({checks,errors},null,2));
} finally {await browser.close();}
