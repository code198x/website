import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
const [base='http://127.0.0.1:1986',output='/tmp/guided-debugger-checks']=process.argv.slice(2);
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});const context=await browser.newContext({viewport:{width:1280,height:1000}}),page=await context.newPage();
const checks=[],errors=[];page.on('pageerror',e=>errors.push(String(e)));
const assert=(x,msg)=>{if(!x)throw Error(msg)};
try{
 await page.goto(base+'/systems/sinclair-zx-spectrum/assembly/meet-assembly/unit-08/');
 const root=page.locator('.debugger-lesson'),source=root.locator('textarea'),step=root.locator('.debug-step');
 await root.locator('.assembly-editor-colours span').first().waitFor();await page.waitForFunction(()=>document.querySelector('.debugger-lesson').dataset.ready==='true');
 await root.evaluate(el=>{el.addEventListener('sandbox:debug-state',e=>window.debugState=e.detail);el.addEventListener('sandbox:memory',e=>window.memory=e.detail)});
 const faulty=await source.inputValue();assert(faulty.includes('jr nz,wait_frame'),'Case 1 not initially faulty');
 assert(!await root.locator('.investigator').isVisible(),'Debugger shown before symptom');assert(!await root.locator('.repair-guide').isVisible(),'Repair shown early');
 async function run(){await page.evaluate(()=>window.memory=null);await root.locator('.sandbox-run').click();await page.waitForFunction(()=>window.memory)}
 async function action(locator){await page.evaluate(()=>window.debugState=null);await locator.click();await page.waitForFunction(()=>window.debugState);return page.evaluate(()=>window.debugState)}
 async function stage(n){await root.locator(`[data-stage="${n}"]`).click()}
 await run();const left=root.locator('[data-hold="KeyO"]');await left.focus();await page.keyboard.down('Space');await page.waitForTimeout(400);await page.keyboard.up('Space');assert((await page.evaluate(()=>window.memory.named.position))===15,'Left fault not reproduced');
 const right=root.locator('[data-hold="KeyP"]');await right.focus();await page.keyboard.down('Space');await page.waitForFunction(()=>window.memory.named.position>15);await page.keyboard.up('Space');
 await root.locator('.observation').fill('Right works; left stays put.');await stage(1);await root.locator('[value="input"]').check();assert((await root.locator('.hypothesis-note').textContent()).includes('recognised'),'No testable hypothesis feedback');await stage(2);assert(await root.locator('.observation').inputValue()==='Right works; left stays put.','Observation lost');
 await run();let d=await action(root.locator('[data-break="left"]'));assert(d.reached&&d.position===15,'Input breakpoint failed');
 assert(!await root.locator('.z-value').isVisible()&&!await root.locator('.pc-value').isVisible(),'Registers revealed too early');assert(!await root.locator('.step-explanation').isVisible(),'Step answer revealed before stepping');
 assert((await root.locator('.source-context').textContent()).includes('jr nz,wait_frame'),'Not showing assembled faulty source');
 await root.locator('.prediction').fill('A will match position; RAM will stay unchanged.');d=await action(step);assert(d.state.cpu.a==='$0F'&&d.position===15,'Load incorrect');assert((await root.locator('.observed-change').textContent()).includes('position 15 → 15'),'Before/after comparison missing');assert(await root.locator('.z-value').isVisible()&&!await root.locator('.pc-value').isVisible(),'Zero test progression incorrect');
 assert(!await root.locator('.step-explanation').evaluate(e=>e.open),'Explanation automatically opened');await root.locator('.step-explanation summary').click();assert((await root.locator('.step-explanation p').textContent()).includes('reading a byte does not store'),'Missing observed explanation');
 d=await action(step);assert(!d.state.cpu.flags.z&&await root.locator('.pc-value').isVisible(),'Branch progression incorrect');
 await root.locator('.debug-state').screenshot({path:output+'/predict-branch.png'});
 d=await action(step);assert(parseInt(d.state.cpu.pc.slice(1),16)===d.symbols.wait_frame&&d.position===15,'Wrong branch not identified');await root.locator('.step-explanation summary').click();await root.locator('.debug-state').screenshot({path:output+'/compare-evidence.png'});
 checks.push('Initial symptom reproduced with real O/P input; hypothesis and observation retained; registers progressively disclosed; source beside instruction; explanations only after stepping');
 await stage(3);assert(!await root.locator('.repair-guide details').evaluate(e=>e.open),'Repair auto revealed');
 const repaired=faulty.replace('left:\n ld a,(position)\n or a\n jr nz,wait_frame','left:\n ld a,(position)\n or a\n jr z,wait_frame');await source.fill(repaired);assert(await step.isDisabled(),'Stale machine allows stepping');await run();await action(root.locator('[data-break="left"]'));await action(step);await action(step);d=await action(step);assert(d.state.instruction.text.toLowerCase().includes('dec'),'Repair does not fall through');d=await action(step);assert(d.state.cpu.a==='$0E'&&d.position===15,'Candidate/RAM distinction lost');
 await source.fill(repaired.replace('position: defb 15','position: defb 0'));await run();await action(root.locator('[data-break="left"]'));await action(step);d=await action(step);assert(d.state.cpu.flags.z,'Edge zero test wrong');d=await action(step);assert(parseInt(d.state.cpu.pc.slice(1),16)===d.symbols.wait_frame&&d.position===0,'Repaired edge not protected');
 checks.push('Learner repair restores ordinary branch and protects zero edge; edited source requires reassembly');
 await stage(4);await root.locator('.load-challenge').click();const trail=await source.inputValue();assert(trail.includes('jr z,wait_frame'),'Challenge retains first fault');await run();d=await action(root.locator('[data-break="move"]'));assert(d.reached,'Challenge breakpoint failed');
 let found=false;for(let i=0;i<15;i++){const bytes=d.state.instruction.bytes;if(bytes[0]===0xcd&&bytes[1]+256*bytes[2]===d.symbols.draw_character){found=true;break}d=await action(step)}
 assert(found&&parseInt(d.state.cpu.hl.slice(1),16)===d.symbols.patterns&&d.pointerBytes.join(',')==='24,60,126,219,255,60,102,66','Challenge did not expose wrong erase data');
 assert((await root.locator('.source-context').textContent()).includes('ld hl,patterns'),'Erase setup missing from source context');
 await root.locator('.more-state summary').click();await root.locator('.debug-state').screenshot({path:output+'/second-case.png'});
 const fixedTrail=trail.replace('ld hl,patterns\n call draw_character\n ld a,(next_position)','ld hl,blank\n call draw_character\n ld a,(next_position)');await source.fill(fixedTrail);await run();d=await action(root.locator('[data-break="move"]'));for(let i=0;i<15;i++){const b=d.state.instruction.bytes;if(b[0]===0xcd&&b[1]+256*b[2]===d.symbols.draw_character)break;d=await action(step)}assert(d.pointerBytes.every(b=>b===0)&&d.pointerBytes.length===8,'Repair did not point to blank bytes');
 await root.locator('.sandbox-revert').click();assert(await source.inputValue()===faulty,'Revert does not restore faulty case 1');assert((await root.locator('.case-note').textContent()).includes('not a repair'),'Revert semantics unclear');
 checks.push('Second case has working branch and faulty erase; HL and actual pointed bytes identify it; independent repair supplies eight zeros; Revert remains supplied case 1');
 await run();await page.setViewportSize({width:390,height:844});assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),'Mobile overflow');await action(root.locator('[data-break="left"]'));await step.focus();await page.keyboard.press('Enter');assert((await root.locator('[data-register="A"]').textContent())==='$0F','Keyboard step failed');
 await root.locator('.debug-state').screenshot({path:output+'/mobile.png',animations:'disabled'});
 const axe=await new AxeBuilder({page}).include('.debugger-lesson').analyze();assert(!axe.violations.length,'Axe: '+axe.violations.map(v=>v.id));
 assert(!errors.length,errors.join('\n'));checks.push('Mobile layout, keyboard stepping and zero scoped axe violations');await fs.writeFile(output+'/results.json',JSON.stringify(checks,null,2)+'\n');console.log(checks);
}catch(error){await page.screenshot({path:output+'/failure.png'});throw error}finally{await browser.close()}
