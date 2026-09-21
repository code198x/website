/** Browser-only keyboard pilot. Reads state each host callback; never writes game state or steps the CPU. */
import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
const base=process.argv[2]||'http://127.0.0.1:1986',out=process.argv[3]||'/tmp/meteor-browser-flight';await fs.mkdir(out,{recursive:true});
const website=path.resolve(import.meta.dirname,'../..'),samples=process.env.CODE_SAMPLES_PATH||path.resolve(website,'../code-samples');
const positions=JSON.parse(await fs.readFile(samples+'/sinclair-zx-spectrum/assembly/meteor-storm/prototype/verification/model-results.json','utf8')).positions;
const bundle=(await fs.readdir(website+'/dist/_astro')).find(name=>/^spectrum-runner\..*\.js$/.test(name));
const browser=await chromium.launch({channel:'chrome',headless:true});const context=await browser.newContext({viewport:{width:1280,height:1000}});const page=await context.newPage();
try{
 await page.goto(base+'/systems/sinclair-zx-spectrum/assembly/meteor-storm/unit-22/');
 await page.evaluate(async({bundle,positions})=>{
  window.flight={};document.addEventListener('sandbox:memory',e=>window.flight.reading=e.detail);
  const exports=await import('/_astro/'+bundle);
  const Runner=Object.values(exports).find(value=>typeof value==='function'&&value.prototype.observeFrame&&value.prototype.setKey);
  const observe=Runner.prototype.observeFrame;
  Runner.prototype.observeFrame=function(callback){
   const runner=this;window.flight.runner=runner;
   observe.call(this,()=>{
    callback();const reading=window.flight.reading;if(!reading||!window.flight.pilot)return;
    const sy=reading.symbols;const phase=runner.readMemory(sy.phase,1)[0];
    if(phase!==1){runner.setKey('KeyO',false);runner.setKey('KeyP',false);runner.setKey('Space',false);return;}
    const bytes=runner.readMemory(sy.ticks,2),tick=bytes[0]+256*bytes[1],x=runner.readMemory(sy.ship_x,1)[0];
    const target=positions[Math.min(tick+1,positions.length-1)];
    runner.setKey('KeyO',target<x);runner.setKey('KeyP',target>x);runner.setKey('Space',true);
   });
  };
 },{bundle,positions});
 await page.locator('.sandbox-run').click();await page.waitForFunction(()=>window.flight.reading?.named.phase===0);
 await page.locator('.sandbox-screen').focus();await page.keyboard.down(' ');await page.waitForTimeout(100);await page.keyboard.up(' ');
 await page.waitForFunction(()=>window.flight.reading?.named.phase===1);await page.evaluate(()=>window.flight.pilot=true);
 await page.waitForFunction(()=>window.flight.reading?.named.phase===2||window.flight.reading?.named.phase===3,{},{timeout:45000});
 const state=await page.evaluate(()=>{
  const {runner,reading}=window.flight,sy=reading.symbols;
  const byte=name=>runner.readMemory(sy[name],1)[0];const word=name=>{const b=runner.readMemory(sy[name],2);return b[0]+256*b[1];};
  return {phase:byte('phase'),hull:byte('hull'),ticks:word('ticks'),elapsed:word('elapsed'),score:byte('score'),bestTime:word('best_time'),bestScore:byte('best_score')};
 });
 await page.waitForTimeout(600);
 await fs.writeFile(out+'/result.png',Buffer.from(await page.locator('.sandbox-screen').evaluate(canvas=>canvas.toDataURL().split(',')[1]),'base64'));
 if(state.phase!==3||state.hull!==1||state.ticks!==1046||state.bestTime!==state.elapsed||state.bestScore!==state.score)throw Error('Pilot outcome: '+JSON.stringify(state));
 // Compare all result score glyphs with actual ROM font bytes, then compare bitmap bits with the canvas.
 const pixels=await page.evaluate(()=>{
  const {runner,reading}=window.flight,sy=reading.symbols,score=runner.readMemory(sy.score,1)[0];
  const text='SCORE '+String(score*10).padStart(4,'0'),canvas=document.querySelector('.sandbox-screen'),ctx=canvas.getContext('2d');
  let checked=0;
  for(let row=0;row<8;row++){
   const y=16+row,address=0x4000|((y&192)<<5)|((y&7)<<8)|((y&56)<<2);
   const bytes=runner.readMemory(address+1,text.length);
   for(let column=0;column<text.length;column++){
    const expected=runner.readMemory(0x3c00+text.charCodeAt(column)*8+row,1)[0];if(bytes[column]!==expected)throw Error('Score bitmap mismatch');
    for(let bit=0;bit<8;bit++){
     const rgb=ctx.getImageData(48+8+column*8+bit,48+y,1,1).data;
     if((rgb[0]>127)!==Boolean(expected&(128>>bit)))throw Error('Canvas/bitmap mismatch');checked++;
    }
   }
  }
  return checked;
 });
 await fs.writeFile(out+'/results.json',JSON.stringify({method:'Real browser runner, ordinary elapsed-time ticks, keyboard feedback pilot and read-only state/bitmap probes. No game-state writes or debugger stepping.',state,scorePixelsChecked:pixels},null,2)+'\n');console.log(state,pixels);
}finally{await browser.close()}
