/**
 * Checks that the lesson runners' Sound toggle reaches the speakers.
 *
 * Nobody can listen from a script, so this measures what the page hands its
 * AudioWorklet: every Float32Array posted to a worklet port is copied as it
 * goes. It checks that ticking Sound starts a running AudioContext, that the
 * samples during a known sound are not silent, and that their pitch matches
 * the lesson's arithmetic. Pitch is counted from crossings of the square
 * wave's midpoint.
 *
 * Usage: node scripts/verification/lesson-sound.mjs [base-url] [output-dir]
 */
import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const base=process.argv[2]||'http://127.0.0.1:1986',out=process.argv[3]||'/tmp/lesson-sound';
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await (await browser.newContext({viewport:{width:1280,height:1000}})).newPage();
page.setDefaultTimeout(30000);
const errors=[],results={};
page.on('pageerror',error=>errors.push(String(error)));
page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
await page.addInitScript(()=>{
 window.soundCapture=[];window.soundContexts=[];
 const post=MessagePort.prototype.postMessage;
 MessagePort.prototype.postMessage=function(data,...rest){
  if(data instanceof Float32Array)window.soundCapture.push({at:performance.now(),samples:Array.from(data)});
  return post.call(this,data,...rest);
 };
 const Original=window.AudioContext;
 window.AudioContext=class extends Original{constructor(...args){super(...args);window.soundContexts.push(this);}};
 window.meteorReadings=null;document.addEventListener('sandbox:memory',event=>window.meteorReadings=event.detail);
});
const assert=(value,message)=>{if(!value)throw Error(message)};

/** The context's rate and state, and the captured samples since `from`. */
async function captured(from){
 return page.evaluate(from=>({
  rate:window.soundContexts.at(-1)?.sampleRate,state:window.soundContexts.at(-1)?.state,
  contexts:window.soundContexts.length,
  left:window.soundCapture.filter(m=>m.at>=from).flatMap(m=>m.samples.filter((_,i)=>i%2===0)),
 }),from);
}

/** The loudest stretch of sound, its peak-to-peak level and its pitch. */
function measure(left,rate){
 const block=Math.round(rate/100);let best=null,start=-1;
 for(let i=0;i<=left.length;i+=block){
  const slice=left.slice(i,i+block),live=slice.length>0&&Math.max(...slice)-Math.min(...slice)>0.05;
  if(live&&start<0)start=i;
  if(!live&&start>=0){if(!best||i-start>best[1]-best[0])best=[start,i];start=-1;}
 }
 if(!best)return {level:0,hz:0,ms:0};
 const tone=left.slice(best[0],best[1]),high=Math.max(...tone),low=Math.min(...tone),mid=(high+low)/2;
 const band=(high-low)*0.1;let state=tone[0]>mid,edges=[];
 tone.forEach((v,i)=>{if(state&&v<mid-band){state=false;edges.push(i);}else if(!state&&v>mid+band){state=true;edges.push(i);}});
 // Whole cycles between the first and last crossing, so the ends do not count.
 const cycles=(edges.length-1)/2,span=(edges.at(-1)-edges[0])/rate;
 return {level:+(high-low).toFixed(3),hz:+(cycles/span).toFixed(1),ms:Math.round(tone.length/rate*1000),cycles:Math.round(cycles)};
}

try{
 // Assembly: Meteor Storm unit 24, the impact tone. 26n+57 T-states a cycle, n=255.
 await page.goto(base+'/systems/sinclair-zx-spectrum/assembly/meteor-storm/unit-24/');
 await page.waitForFunction(()=>document.querySelector('.sandbox')?.dataset.sandboxReady==='true');
 const toggle=page.getByRole('checkbox',{name:'Sound'});
 assert(!(await toggle.isChecked()),'Sound starts unticked');
 await toggle.focus();await page.keyboard.press('Space');
 assert(await toggle.isChecked(),'Space ticks Sound');
 assert(await page.evaluate(()=>localStorage.getItem('code198x-lesson-sound'))==='on','Choice stored');
 await page.locator('.sandbox-run').click();
 await page.waitForFunction(()=>document.querySelector('.sandbox-status').textContent.startsWith('Running'),{},{timeout:20000});
 await page.waitForFunction(()=>window.meteorReadings,{},{timeout:10000});
 await page.locator('.sandbox-screen').focus();await page.keyboard.down(' ');await page.waitForTimeout(100);await page.keyboard.up(' ');
 await page.waitForFunction(()=>window.meteorReadings.named.phase===1,{},{timeout:10000});
 const launched=await page.evaluate(()=>performance.now());
 await page.waitForFunction(()=>window.meteorReadings.named.phase===2,{},{timeout:10000});
 await page.waitForTimeout(700);
 const impact=await captured(launched);
 assert(impact.contexts===1,`One AudioContext, found ${impact.contexts}`);
 assert(impact.state==='running',`AudioContext ${impact.state}`);
 const tone=measure(impact.left,impact.rate);
 results.impact={rate:impact.rate,state:impact.state,...tone,expectedHz:523.4};
 assert(tone.level>0.5,`Impact is silent: ${JSON.stringify(tone)}`);
 assert(Math.abs(tone.hz-523.4)<10,`Impact pitch ${tone.hz} Hz`);

 // Unticking closes the output; the choice carries to the next lesson.
 await page.goto(base+'/systems/sinclair-zx-spectrum/assembly/meteor-storm/unit-25/');
 await page.waitForFunction(()=>document.querySelector('.sandbox')?.dataset.sandboxReady==='true');
 assert(await page.getByRole('checkbox',{name:'Sound'}).isChecked(),'Choice carried to unit 25');
 results.carried=true;

 // Meteor Storm unit 26: boost plays during the frame waits. One 30-cycle note of
 // n=100 (26n+49 T-states a cycle) fits inside a single wait, so it is heard whole.
 await page.goto(base+'/systems/sinclair-zx-spectrum/assembly/meteor-storm/unit-26/');
 await page.waitForFunction(()=>document.querySelector('.sandbox')?.dataset.sandboxReady==='true'&&document.querySelector('.meteor-experiment')?.dataset.ready==='true');
 assert(await page.getByRole('checkbox',{name:'Sound'}).isChecked(),'Choice carried to unit 26');
 await page.locator('.sandbox-source').evaluate(editor=>{editor.value=editor.value.replace('boost_sound: defb 100,4, 70,6, 0','boost_sound: defb 100,30, 0');editor.dispatchEvent(new Event('input',{bubbles:true}));});
 await page.locator('.sandbox-run').click();
 await page.waitForFunction(()=>document.querySelector('.sandbox-status').textContent.startsWith('Running'),{},{timeout:20000});
 await page.waitForFunction(()=>window.meteorReadings?.named.phase===0,{},{timeout:10000});
 await page.locator('.sandbox-screen').focus();await page.keyboard.down(' ');await page.waitForTimeout(100);await page.keyboard.up(' ');
 await page.waitForFunction(()=>window.meteorReadings.named.phase===1,{},{timeout:10000});
 await page.waitForTimeout(300);
 const pressed=await page.evaluate(()=>performance.now());
 await page.keyboard.down(' ');await page.waitForTimeout(100);await page.keyboard.up(' ');
 await page.waitForTimeout(700);
 const frameWait=await captured(pressed);
 const boost=measure(frameWait.left,frameWait.rate);
 results.frameWaitBoost={rate:frameWait.rate,state:frameWait.state,...boost,expectedHz:1321.2};
 assert(boost.level>0.5,`Unit 26 boost is silent: ${JSON.stringify(boost)}`);
 assert(Math.abs(boost.hz-1321.2)<15,`Unit 26 boost pitch ${boost.hz} Hz`);

 // BASIC: Bright Spark's highest signal, BEEP ...,12, held for a second to measure.
 // The PAUSE outlasts the start-up that runBasic runs before the first frame.
 await page.goto(base+'/systems/sinclair-zx-spectrum/basic/meet-basic/unit-01-make-the-spectrum-answer/');
 const root=page.locator('.basic-playground');
 assert(await root.getByRole('checkbox',{name:'Sound'}).isChecked(),'Choice carried to BASIC');
 await root.locator('textarea').fill('10 PAUSE 50\n20 BEEP 1,12\n');
 const started=await page.evaluate(()=>performance.now());
 await root.locator('[data-action=run]').click();
 await page.waitForFunction(()=>document.querySelector('.basic-status').textContent.startsWith('Program loaded'),{},{timeout:60000});
 await page.waitForTimeout(2500);
 const beep=await captured(started);
 assert(beep.state==='running',`BASIC AudioContext ${beep.state}`);
 const note=measure(beep.left,beep.rate);
 results.basic={rate:beep.rate,state:beep.state,...note,expectedHz:523.25};
 assert(note.level>0.5,`BEEP is silent: ${JSON.stringify(note)}`);
 assert(Math.abs(note.hz-523.25)<10,`BEEP pitch ${note.hz} Hz`);
 assert(note.cycles>480,`BEEP 1 should last about 523 cycles, heard ${note.cycles}`);

 // Stop suspends the output.
 await root.locator('[data-action=stop]').click();
 await page.waitForFunction(()=>window.soundContexts.at(-1).state!=='running',{},{timeout:5000});
 results.stopped=await page.evaluate(()=>window.soundContexts.at(-1).state);
 // Unticking closes it.
 await root.getByRole('checkbox',{name:'Sound'}).uncheck();
 await page.waitForFunction(()=>window.soundContexts.at(-1).state==='closed',{},{timeout:5000});
 assert(await page.evaluate(()=>localStorage.getItem('code198x-lesson-sound'))==='off','Off stored');
 results.unticked='closed';

 assert(!errors.length,errors.join('\n'));
 await fs.writeFile(out+'/results.json',JSON.stringify({base,results,errors},null,2)+'\n');
 console.log(JSON.stringify(results,null,1));
}catch(error){await page.screenshot({path:out+'/failure.png',fullPage:true});console.error(results,errors);throw error;}finally{await browser.close();}
