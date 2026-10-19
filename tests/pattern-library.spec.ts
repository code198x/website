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
 await expect(rows).toHaveCount(1);
 await rows.getByRole('link',{name:'A game loop using MOS',exact:true}).click();
 await expect(page).toHaveURL(/bbc-micro\/assembly\/framework\/mos-game-loop/);
 await expect(page.locator('.pattern-prose')).toContainText('MODE 6');
 await expect(page.locator('.pattern-prose')).toContainText('OSBYTE');
 await page.getByRole('link',{name:'More BBC Micro patterns'}).click();
 await expect(page).toHaveURL(/patterns\/platform\/bbc-micro/);
 await expect(page.locator('[data-pattern]:visible')).toHaveCount(1);
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
