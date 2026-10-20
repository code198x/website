import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('find a technique across combined filters and recover from no results',async({page})=>{
 await page.goto('/patterns/');
 await page.getByRole('combobox',{name:'Machine',exact:true}).selectOption('commodore-64');
 await page.getByRole('combobox',{name:'Subject',exact:true}).selectOption('audio');
 const rows=page.locator('[data-pattern]:visible');
 await expect(rows).toHaveCount(3);
 await expect(rows.filter({hasText:'SID Voice Setup'})).toHaveCount(1);
 await page.getByLabel('Search patterns',{exact:true}).fill('impossible-value-732');
 await expect(rows).toHaveCount(0);
 await expect(page.locator('[data-empty]')).toBeVisible();
 await page.getByRole('button',{name:'Clear filters'}).click();
 await expect(page.locator('[data-empty]')).toBeHidden();
 expect(await rows.count()).toBeGreaterThan(60);
 await expect(page.getByLabel('Search patterns',{exact:true})).toBeFocused();
});

test('facet defaults and shared filter URL survive reload',async({page})=>{
 await page.goto('/patterns/category/rendering/');
 await expect(page.getByRole('combobox',{name:'Subject',exact:true})).toHaveValue('rendering');
 await page.getByRole('combobox',{name:'Machine',exact:true}).selectOption('sinclair-zx-spectrum');
 await page.getByLabel('Search patterns',{exact:true}).fill('progress');
 await expect(page.locator('[data-pattern]:visible')).toHaveCount(1);
 await page.reload();
 await expect(page.locator('[data-pattern]:visible')).toHaveCount(1);
 await page.getByRole('button',{name:'Clear filters'}).click();
 await page.reload();
 await expect(page.getByRole('combobox',{name:'Subject',exact:true})).toHaveValue('');
 expect(await page.locator('[data-pattern]:visible').count()).toBeGreaterThan(60);
});

test('reading page has conditions, usable contents and no false runnable control',async({page,isMobile})=>{
 await page.goto('/patterns/sinclair-zx-spectrum/basic/rendering/progress-bar/');
 await expect(page.getByRole('heading',{name:'Calling the routine'})).toBeVisible();
 await expect(page.getByRole('button',{name:'Run this code'})).toHaveCount(0);
 const toc=page.getByRole('navigation',{name:'Table of contents'});
 if(isMobile) await toc.getByRole('button',{name:'On this page'}).click();
 await toc.getByRole('link',{name:'Calling the routine'}).click();
 await expect(page).toHaveURL(/#calling-the-routine$/);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await expect(page.locator('header a[aria-current]').filter({hasText:'Systems'})).toHaveCount(0);
});

test('assembly page exposes tools and stays inside viewport',async({page})=>{
 await page.goto('/patterns/commodore-64/assembly/rendering/hardware-sprites/');
 await expect(page.locator('.pattern-reading-notes').getByRole('link',{name:'Asm198x'})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('facet works with JavaScript disabled',async({browser,baseURL})=>{
 const context=await browser.newContext({javaScriptEnabled:false});
 const page=await context.newPage();
 await page.goto(`${baseURL}/patterns/platform/commodore-64/`);
 const rows=page.locator('[data-pattern]:visible');
 expect(await rows.count()).toBeGreaterThan(0);
 for(const value of await rows.evaluateAll(rows=>rows.map(row=>(row as HTMLElement).dataset.platform))) expect(value).toBe('commodore-64');
 await expect(page.getByRole('combobox',{name:'Machine',exact:true})).toBeHidden();
 await context.close();
});

test('code status distinguishes execution evidence from maintained and illustrative listings',async({page})=>{
 for(const [path,status] of [
  ['commodore-64/assembly/rendering/sprite-multiplexing','assembled and emulator-executed'],
  ['sinclair-zx-spectrum/basic/rendering/progress-bar','maintained BASIC subroutine'],
  ['commodore-64/assembly/rendering/hardware-sprites','assembled and emulator-executed'],
  ['commodore-64/assembly/physics/sprite-movement-bounds','assembled and emulator-executed'],
  ['commodore-64/assembly/rendering/raster-splits','assembled and emulator-executed'],
  ['commodore-64/assembly/input/joystick-reading','assembled and emulator-executed'],
  ['commodore-64/assembly/framework/game-loop-basic','assembled and emulator-executed'],
 ]) {
  await page.goto(`/patterns/${path}/`);
  const statement=page.locator('.pattern-prose > p').filter({hasText:'Code status:'});
  await expect(statement).toHaveCount(1);
  await expect(statement).toContainText(status);
  if(status==='assembled and emulator-executed') {
   await expect(statement.getByRole('link',{name:'recorded checks'})).toHaveAttribute('href',/\/blob\/[0-9a-f]{40}\/.*\/verification\/results\.json$/);
   await expect(statement).toContainText(path.includes('game-loop-basic')?'PAL C64':'PAL and NTSC');
  } else {
   await expect(statement.getByRole('link',{name:'recorded checks'})).toHaveCount(0);
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
});


test('next-tier BBC patterns are discoverable without claiming a curriculum track',async({page})=>{
 await page.goto('/patterns/');
 await page.getByRole('combobox',{name:'Machine',exact:true}).selectOption('bbc-micro');
 const rows=page.locator('[data-pattern]:visible');
 await expect(rows).toHaveCount(7);
 await expect(rows.locator('a[href="/patterns/bbc-micro/assembly/framework/collect-and-respond/"]')).toHaveCount(1);
 await expect(rows.locator('a[href="/patterns/bbc-micro/assembly/rendering/tile-map/"]')).toHaveCount(1);
 await expect(rows.getByRole('link',{name:'Masked Sprites with Background Restoration',exact:true})).toHaveCount(1);
 await expect(rows.getByRole('link',{name:'Separate Background Buffers for Overlapping Objects',exact:true})).toHaveCount(1);
 await expect(rows.getByRole('link',{name:'Clip Masked Sprites in BBC MODE4',exact:true})).toHaveCount(1);
 await expect(rows.getByRole('link',{name:'Place BBC MODE4 Sprites at Pixel Positions',exact:true})).toHaveCount(1);
 await rows.getByRole('link',{name:'A game loop using MOS',exact:true}).click();
 await expect(page).toHaveURL(/bbc-micro\/assembly\/framework\/mos-game-loop/);
 await expect(page.locator('.pattern-prose')).toContainText('MODE 6');
 await expect(page.locator('.pattern-prose')).toContainText('OSBYTE');
 await page.getByRole('link',{name:'More BBC Micro patterns'}).click();
 await expect(page).toHaveURL(/patterns\/platform\/bbc-micro/);
 await expect(page.locator('[data-pattern]:visible')).toHaveCount(7);
 await expect(page.locator('[data-pattern]:visible a[href="/patterns/bbc-micro/assembly/rendering/tile-map/"]')).toHaveCount(1);
});

test('loop contracts and maintained callers fit narrow and wide pages',async({page})=>{
 for(const path of ['commodore-64/assembly/framework/game-loop-basic','sinclair-zx-spectrum/assembly/framework/game-loop-halt','commodore-amiga/assembly/framework/vblank-game-loop','nintendo-nes/assembly/framework/nmi-game-loop','bbc-micro/assembly/framework/mos-game-loop','acorn-electron/assembly/framework/mos-game-loop']){
  await page.goto('/patterns/'+path+'/');
  await expect(page.locator('.pattern-prose')).toContainText('wait_frame');
  await expect(page.locator('.pattern-prose')).toContainText('What happens when work runs late');
  await expect(page.locator('.lesson-listing:has(.ll-label:text-is("frame.inc"))')).toContainText('wait_frame:');
  await expect(page.locator('.lesson-listing:has(.ll-label:text-is("demo.asm"))')).toContainText('expensive_work:');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width+1);
 }
});


test('loop pages retain accessible reading and code controls',async({page})=>{
 for(const path of ['commodore-64/assembly/framework/game-loop-basic','sinclair-zx-spectrum/assembly/framework/game-loop-halt','commodore-amiga/assembly/framework/vblank-game-loop','nintendo-nes/assembly/framework/nmi-game-loop','bbc-micro/assembly/framework/mos-game-loop','acorn-electron/assembly/framework/mos-game-loop','cross-platform/framework/game-loop-choices']){
  await page.goto('/patterns/'+path+'/');
  expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
 }
});

// Turn progression and optional time must stay independently reusable.
test('turn callers are discoverable with usable code and explicit timing choices',async({page})=>{
 for(const system of ['sega-master-system','sega-game-gear','sega-sg-1000']) {
  await page.goto('/patterns/');
  await page.getByRole('combobox',{name:'Machine',exact:true}).selectOption(system);
  const rows=page.locator('[data-pattern]:visible');
  await expect(rows).toHaveCount(2);
  await expect(rows.locator(`a[href="/patterns/${system}/assembly/rendering/tile-map/"]`)).toHaveCount(1);
  const turnLink=rows.locator(`a[href="/patterns/${system}/assembly/framework/turn-deadline/"]`);
  await expect(turnLink).toHaveCount(1);
  await turnLink.click();
  await expect(page).toHaveURL(new RegExp(system+'/assembly/framework/turn-deadline'));
  await expect(page.locator('.lesson-listing:has(.ll-label:text-is("turn.inc"))')).toContainText('commit_turn:');
  await expect(page.locator('.lesson-listing:has(.ll-label:text-is("demo.asm"))')).toContainText('read_actions:');
  await expect(page.locator('.lesson-listing:has(.ll-label:text-is("frame.inc"))')).toContainText('wait_frame:');
  await expect(page.locator('.pattern-prose')).toContainText('120 accepted ticks');
  await expect(page.getByRole('link',{name:'retained record'})).toHaveAttribute('href',/\/blob\/[0-9a-f]{40}\/.*\/verification\/results\.json$/);
  await expect(page.locator('.pattern-prose')).toContainText('assembled and emulator-executed');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
 }
 await page.goto('/patterns/cross-platform/framework/game-loop-choices/');
 await expect(page.locator('.pattern-prose')).toContainText('A turn-based game can certainly have a timer');
 await expect(page.locator('.pattern-prose')).toContainText('A display refresh need not advance the rules');
});


test('collection callers expose reusable code, captures and verified sources',async({page})=>{
 for(const system of ['commodore-64','sinclair-zx-spectrum','commodore-amiga','nintendo-nes','bbc-micro']) {
  await page.goto(`/patterns/${system}/assembly/framework/collect-and-respond/`);
  for(const text of ['boxes_overlap:','item_active','draw_screen:','trigger_sound:']) {
   await expect(page.locator('.lesson-listing').filter({hasText:text}).first()).toBeVisible();
  }
  const image=page.locator('.pattern-prose figure img').first();
  await expect(image).toBeVisible();
  expect(await image.evaluate((img:HTMLImageElement)=>img.complete && img.naturalWidth>0)).toBe(true);
  await expect(page.getByRole('link',{name:'Read the execution record',exact:true})).toHaveAttribute('href',/\/blob\/[0-9a-f]{40}\/.*\/verification\/results\.json$/);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
 }
 await page.goto('/patterns/cross-platform/framework/collect-and-respond/');
 await expect(page.locator('.pattern-prose')).toContainText('Spectrum');
 await expect(page.locator('.pattern-prose')).toContainText('BBC');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});

test('audited examples show maintained code, caller contracts and honest limits',async({page})=>{
 for(const [path,code,explanation] of [
  ['commodore-64/assembly/rendering/smooth-scrolling','coarse_left:','does not prove tear-free'],
  ['sinclair-zx-spectrum/assembly/framework/state-machine-loop','state_paused:','history survives transitions'],
  ['sinclair-zx-spectrum/assembly/rendering/character-printing','print_char:','leaves attributes alone'],
  ['commodore-amiga/assembly/audio/four-channel-music','music_init:','MOD'],
  ['nintendo-nes/assembly/physics/sprite-movement-bounds','move_player:','inclusive'],
 ]) {
  await page.goto(`/patterns/${path}/`);
  const article=page.locator('.pattern-prose');
  await expect(article).toContainText(code);
  await expect(article).toContainText(explanation);
  await expect(article).not.toContainText('Code sample unavailable');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 await page.goto('/patterns/nintendo-nes/assembly/rendering/sprite-zero-split/');
 await expect(page.locator('.pattern-prose')).toContainText('no execution record');
 await expect(page.locator('.pattern-prose')).toContainText('missed_split:');
});

test('adventure parser entries expose usable code, boundaries and richer alternatives',async({page})=>{
 for(const track of ['basic','assembly']){
  await page.goto(`/patterns/sinclair-zx-spectrum/${track}/input/two-word-parser/`);
  const prose=page.locator('.pattern-prose');
  await expect(prose).toContainText('noun');
  await expect(prose.getByRole('link',{name:'Parser execution record',exact:true})).toHaveAttribute('href',/\/blob\/[0-9a-f]{40}\/.*\/verification\/results.json$/);
  await expect(prose).not.toContainText('Code sample unavailable');
  await expect(prose.locator('.lesson-listing')).not.toHaveCount(0);
  const capture=prose.locator('img[src*="/images/patterns/adventure-parser/"]');
  await expect(capture).toHaveCount(1);
  await capture.scrollIntoViewIfNeeded();
  await expect.poll(()=>capture.evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth>0)).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  if(track==='basic'){
   await expect(prose).toContainText('READ errors');
   await expect(prose).toContainText('quoted text');
   await expect(prose).toContainText('GO SUB 5000');
  }else{
   await expect(prose).toContainText('borrowed');
   await expect(prose).toContainText('parse_command:');
   await expect(prose).toContainText('342');
  }
 }
});

test('adventure parser pages retain accessible reading and code controls',async({page})=>{
 for(const track of ['basic','assembly']){
  await page.goto(`/patterns/sinclair-zx-spectrum/${track}/input/two-word-parser/`);
  const result=await new AxeBuilder({page}).analyze();
  expect(result.violations).toEqual([]);
 }
});

test('scrolling and sprite families lead to distinct machine implementations',async({page})=>{
 for(const family of ['scrolling','sprites']){
  await page.goto(`/patterns/cross-platform/rendering/${family}/`);
  const prose=page.locator('.pattern-prose');
  for(const system of ['sinclair-zx-spectrum','commodore-64','commodore-amiga','nintendo-nes','bbc-micro']){
   expect(await prose.locator(`a[href^="/patterns/${system}/"]`).count()).toBeGreaterThan(0);
  }
  await expect(prose).toContainText('illustrative');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
});

test('rendering components expose working code, source evidence and loaded captures',async({page})=>{
 for(const path of [
  'sinclair-zx-spectrum/assembly/rendering/software-scrolling',
  'bbc-micro/assembly/rendering/masked-sprites',
  'nintendo-nes/assembly/rendering/nametable-scrolling',
  'nintendo-nes/assembly/rendering/multi-sprite-oam',
 ]){
  await page.goto(`/patterns/${path}/`);
  const prose=page.locator('.pattern-prose');
  await expect(prose).not.toContainText('Code sample unavailable');
  expect(await prose.locator('.lesson-listing').count()).toBeGreaterThan(0);
  await expect(prose.getByRole('link',{name:'Execution record',exact:true})).toHaveAttribute('href',/\/blob\/[0-9a-f]{40}\/docs\/rendering-families\/verification\/results.json$/);
  for(const img of await prose.locator('img[src*="rendering-families"]').all()){
   await img.scrollIntoViewIfNeeded();
   await expect.poll(()=>img.evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth>0)).toBe(true);
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
});

test('rendering families and components remain accessible',async({page})=>{
 for(const colorScheme of ['light','dark'] as const){
 await page.emulateMedia({colorScheme});
 for(const path of ['cross-platform/rendering/scrolling','cross-platform/rendering/sprites','sinclair-zx-spectrum/assembly/rendering/software-scrolling','bbc-micro/assembly/rendering/masked-sprites','nintendo-nes/assembly/rendering/nametable-scrolling','nintendo-nes/assembly/rendering/multi-sprite-oam']){
  await page.goto(`/patterns/${path}/`);
  expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
 }
 }
});


test('sprite lifecycle connects machine-specific reusable implementations',async({page})=>{
 await page.goto('/patterns/cross-platform/rendering/sprite-lifecycle/');
 const prose=page.locator('.pattern-prose');
 for(const system of ['sinclair-zx-spectrum','commodore-amiga','bbc-micro']){
  await expect(prose.locator(`table a[href="/patterns/${system}/assembly/rendering/sprite-lifecycle/"]`)).toHaveCount(1);
 }
 await expect(prose).toContainText('reverse');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('sprite lifecycle routines publish code, pinned evidence and genuine captures',async({page})=>{
 for(const system of ['sinclair-zx-spectrum','commodore-amiga','bbc-micro']){
  await page.goto(`/patterns/${system}/assembly/rendering/sprite-lifecycle/`);
  const prose=page.locator('.pattern-prose');
  await expect(prose).not.toContainText('Code sample unavailable');
  expect(await prose.locator('.lesson-listing').count()).toBeGreaterThanOrEqual(2);
  await expect(prose.getByRole('link',{name:'Execution record',exact:true})).toHaveAttribute('href',/\/blob\/[0-9a-f]{40}\/docs\/sprite-lifecycle\/verification\/results.json$/);
  const img=prose.locator('img[src*="sprite-lifecycle"]');
  await img.scrollIntoViewIfNeeded();
  await expect.poll(()=>img.evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth>0)).toBe(true);
  expect(await img.evaluate((e:HTMLImageElement)=>Number(e.getAttribute('width'))/Number(e.getAttribute('height'))===e.naturalWidth/e.naturalHeight)).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
});

test('sprite lifecycle pages remain accessible with either colour preference',async({page})=>{
 for(const colorScheme of ['light','dark'] as const){
  await page.emulateMedia({colorScheme});
  for(const path of ['cross-platform/rendering/sprite-lifecycle','sinclair-zx-spectrum/assembly/rendering/sprite-lifecycle','commodore-amiga/assembly/rendering/sprite-lifecycle','bbc-micro/assembly/rendering/sprite-lifecycle']){
   await page.goto(`/patterns/${path}/`);
   expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
  }
 }
});


test('clipping connects each distinct machine implementation',async({page})=>{
 await page.goto('/patterns/cross-platform/rendering/clipping/');
 const prose=page.locator('.pattern-prose');
 for(const system of ['sinclair-zx-spectrum','bbc-micro','commodore-amiga']){
  await expect(prose.locator(`table a[href="/patterns/${system}/assembly/rendering/clipped-sprites/"]`)).toHaveCount(1);
 }
 await expect(prose).toContainText('Source skip');
 await expect(prose).toContainText('old clipped rectangle');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('clipped sprites expose reusable code and correctly sized captures',async({page})=>{
 for(const system of ['sinclair-zx-spectrum','bbc-micro','commodore-amiga']){
  await page.goto(`/patterns/${system}/assembly/rendering/clipped-sprites/`);
  const prose=page.locator('.pattern-prose');
  await expect(prose).not.toContainText('Code sample unavailable');
  expect(await prose.locator('.lesson-listing').count()).toBeGreaterThanOrEqual(3);
  await expect(prose.getByRole('link',{name:'Execution record',exact:true})).toHaveAttribute('href',/\/blob\/[0-9a-f]{40}\/docs\/sprite-clipping\/verification\/results.json$/);
  const img=prose.locator('img[src*="sprite-clipping"]');
  await img.scrollIntoViewIfNeeded();
  await expect.poll(()=>img.evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth>0)).toBe(true);
  expect(await img.evaluate((e:HTMLImageElement)=>Number(e.getAttribute('width'))/Number(e.getAttribute('height'))===e.naturalWidth/e.naturalHeight)).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
});

test('clipping pages retain accessible controls and text for either colour preference',async({page})=>{
 for(const colorScheme of ['light','dark'] as const){
  await page.emulateMedia({colorScheme});
  for(const path of ['cross-platform/rendering/clipping','sinclair-zx-spectrum/assembly/rendering/clipped-sprites','bbc-micro/assembly/rendering/clipped-sprites','commodore-amiga/assembly/rendering/clipped-sprites']){
   await page.goto(`/patterns/${path}/`);
   expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
  }
 }
});


test('prepared phases connect real machine code and show memory costs',async({page})=>{
 await page.goto('/patterns/cross-platform/rendering/pre-shifted-sprites/');
 const prose=page.locator('.pattern-prose');
 for(const system of ['sinclair-zx-spectrum','bbc-micro','commodore-amiga']){
  await expect(prose.locator(`table a[href="/patterns/${system}/assembly/rendering/pre-shifted-sprites/"]`)).toHaveCount(1);
 }
 await expect(prose).toContainText('784 bytes');
 await expect(prose).toContainText('2,176 bytes');
 await expect(prose).not.toContainText('Code sample unavailable');
 expect(await prose.locator('.lesson-listing').count()).toBeGreaterThan(0);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('pixel positioning exposes usable routines, callers and captures',async({page})=>{
 for(const system of ['sinclair-zx-spectrum','bbc-micro','commodore-amiga']){
  await page.goto(`/patterns/${system}/assembly/rendering/pre-shifted-sprites/`);
  const prose=page.locator('.pattern-prose');
  await expect(prose).not.toContainText('Code sample unavailable');
  expect(await prose.locator('.lesson-listing').count()).toBeGreaterThanOrEqual(2);
  await expect(prose.getByRole('link',{name:'Execution record',exact:true})).toHaveAttribute('href',/\/blob\/[0-9a-f]{40}\/docs\/sprite-phases\/verification\/results.json$/);
  const img=prose.locator('img[src*="sprite-phases"]');await img.scrollIntoViewIfNeeded();
  await expect.poll(()=>img.evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth>0)).toBe(true);
  expect(await img.evaluate((e:HTMLImageElement)=>Number(e.getAttribute('width'))/Number(e.getAttribute('height'))===e.naturalWidth/e.naturalHeight)).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
});

test('prepared phase pages remain accessible with either colour preference',async({page})=>{
 for(const colorScheme of ['light','dark'] as const){
  await page.emulateMedia({colorScheme});
  for(const path of ['cross-platform/rendering/pre-shifted-sprites','sinclair-zx-spectrum/assembly/rendering/pre-shifted-sprites','bbc-micro/assembly/rendering/pre-shifted-sprites','commodore-amiga/assembly/rendering/pre-shifted-sprites']){
   await page.goto(`/patterns/${path}/`);
   expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
  }
 }
});
