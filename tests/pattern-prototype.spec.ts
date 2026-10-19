import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test.skip(process.env.PATTERN_PROTOTYPE !== '1', 'Review-only routes require an opt-in build.');
const root='/catalogue/pattern-library/';
test('find techniques by task and matching implementation',async({page})=>{
 await page.goto(root);await expect(page.locator('[data-technique]:visible')).toHaveCount(4);
 await page.locator('[name=q]').fill('one press');await expect(page.locator('[data-technique]:visible')).toHaveCount(1);
 await page.getByRole('button',{name:'Clear filters'}).click();
 await page.locator('[name=machine]').selectOption('nintendo-nes');await page.locator('[name=language]').selectOption('Assembly');
 await expect(page.locator('[data-technique]:visible')).toHaveCount(3);
 await expect(page.locator('[data-technique]:visible h3 a').first()).toHaveAttribute('href',/nintendo-nes\/$/);
 await page.locator('[name=q]').fill('not-a-technique');await expect(page.locator('[data-technique]:visible')).toHaveCount(0);
 await expect(page.locator('[data-empty]')).toBeVisible();await page.getByRole('button',{name:'Clear filters'}).click();await expect(page.locator('[data-technique]:visible')).toHaveCount(4);
});
test('input flows through history into one sound event per new press',async({page})=>{
 await page.goto(root);await page.locator('.supporting-experiment>summary').last().click();const fire=page.locator('[data-button=fire]'),sample=page.locator('[data-sample]');
 await fire.check();await sample.click();await sample.click();await sample.click();await expect(page.locator('[data-events]')).toHaveText('1');
 await page.locator('[data-button=right]').check();await sample.click();await expect(page.locator('[data-events]')).toHaveText('1');
 await fire.uncheck();await sample.click();await fire.check();await sample.click();await expect(page.locator('[data-events]')).toHaveText('2');
 await page.locator('[data-reset]').click();await fire.check();await page.locator('[data-seed]').click();await sample.click();await expect(page.locator('[data-events]')).toHaveText('0');
 await expect(page.locator('[data-audio]')).toHaveAttribute('aria-pressed','false');await page.locator('[data-audio]').click();await expect(page.locator('[data-audio]')).toHaveAttribute('aria-pressed','true');await page.locator('[data-audio]').click();await expect(page.locator('[data-audio]')).toHaveAttribute('aria-pressed','false');
});
test('pursuit exposes the target decision and legal turns',async({page})=>{
 await page.goto(root+'choose-a-target/');await page.locator('.supporting-experiment>summary').last().click();await expect(page.locator('[data-pursuit-status]')).toContainText('Next turn: Right');
 await page.locator('[data-target]').selectOption('ahead');await expect(page.locator('[data-pursuit-status]')).toContainText('Next turn: Up');
 await page.locator('[data-step]').click();await expect(page.locator('[data-pursuit-status]')).toContainText('Pursuer (3, 2)');
 await page.locator('[data-restart]').click();await expect(page.locator('[data-pursuit-status]')).toContainText('Pursuer (3, 3)');
});
test('prototype pages are readable, accessible and contained',async({page})=>{
 for(const path of ['', 'read-input/','detect-presses/','trigger-sound/','choose-a-target/',...['read-input','detect-presses','trigger-sound'].flatMap(t=>['commodore-64','sinclair-zx-spectrum','commodore-amiga','nintendo-nes'].map(m=>`${t}/${m}/`))]){
  await page.goto(root+path);await expect(page.locator('meta[name=robots]')).toHaveAttribute('content',/noindex/);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width+1);
  expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
 }
});
test('explanations and board survive without JavaScript',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();
 await page.goto('http://localhost:'+ (process.env.PLAYWRIGHT_PORT||4321)+root);await expect(page.locator('[data-technique]')).toHaveCount(4);await expect(page.locator('form[aria-label="Find a technique"]')).toBeHidden();
 await page.goto('http://localhost:'+ (process.env.PLAYWRIGHT_PORT||4321)+root+'choose-a-target/');await expect(page.locator('[data-grid] rect')).toHaveCount(63);await context.close();
});
test('audio schedules one real tone per edge and renders a bounded waveform',async({page})=>{
 await page.addInitScript(()=>{
  const original=AudioContext.prototype.createOscillator;
  (window as any).toneCount=0;
  AudioContext.prototype.createOscillator=function(){(window as any).toneCount++;return original.call(this);};
 });
 await page.goto(root);await page.locator('.supporting-experiment>summary').last().click();await page.locator('[data-audio]').click();await page.locator('[data-button=fire]').check();
 await page.locator('[data-sample]').click();await page.locator('[data-sample]').click();
 expect(await page.evaluate(()=>(window as any).toneCount)).toBe(1);
 await page.locator('[data-audio]').click();await page.locator('[data-button=fire]').uncheck();await page.locator('[data-sample]').click();await page.locator('[data-button=fire]').check();await page.locator('[data-sample]').click();
 expect(await page.evaluate(()=>(window as any).toneCount)).toBe(1);
 const {build}=await import('esbuild');
 const result=await build({entryPoints:['src/lib/pattern-experiment.ts'],bundle:true,format:'iife',globalName:'PatternAudio',write:false});
 await page.addScriptTag({content:result.outputFiles[0].text});
 const rendered=await page.evaluate(async()=>{
  const context=new OfflineAudioContext(1,22050,44100);(window as any).PatternAudio.scheduleTone(context,0.1);
  const buffer=(await context.startRendering()).getChannelData(0);
  const peak=(a:number,b:number)=>Math.max(...buffer.slice(a*44100,b*44100).map(Math.abs));
  return {before:peak(0,0.09),during:peak(0.11,0.18),after:peak(0.21,0.5)};
 });
 expect(rendered.before).toBe(0);expect(rendered.during).toBeGreaterThan(0.03);expect(rendered.after).toBe(0);
});

test('machine code leads, can be copied, and explains how to call it',async({page,context})=>{
 await context.grantPermissions(['clipboard-read','clipboard-write']);
 await page.goto(root+'read-input/');
 await expect(page.locator('.supporting-experiment').last()).not.toHaveAttribute('open');
 await expect(page.locator('.routine-listing .code-container')).toContainText('joy_poll:');
 await expect(page.locator('.caller-contract')).toContainText('joy_init');
 const listing=page.locator('.routine-listing [data-code]');const source=await listing.getAttribute('data-code');
 await listing.locator('.ll-copy').click();expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe(source);
 await page.locator('.machine-choices a').filter({hasText:'ZX Spectrum'}).click();
 await expect(page).toHaveURL(/read-input\/sinclair-zx-spectrum\//);
 await expect(page.locator('.routine-listing .code-container')).toContainText('read_controls:');
 await expect(page.locator('.integration-example')).toContainText('call detect_presses');
 await expect(page.locator('.execution-evidence')).toContainText('39 input stages');
 await page.getByText('Build and run the complete example',{exact:true}).click();
 await expect(page.locator('.integration-example details .code-container')).toContainText('wait_frame:');
 await expect(page.locator('.integration-example details .ll-scroll')).toHaveAttribute('tabindex','0');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width+1);
 await page.locator('.machine-choices a').filter({hasText:'NES'}).click();
 await expect(page.locator('.integration-example')).toContainText('and #$80');
 await expect(page.locator('.caller-contract')).toContainText('DMC');
 await page.locator('.connected-code a').filter({hasText:'Act once'}).click();
 await expect(page).toHaveURL(/detect-presses\/nintendo-nes\//);
 await expect(page.locator('.routine-listing .code-container')).toContainText('eor #$ff');
});
