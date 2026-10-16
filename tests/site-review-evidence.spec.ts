import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';

// Bounded review evidence, explicitly authorised 2026-10-06. No baseline exclusions.
const routes = [
 '/', '/start-here/', '/systems/', '/systems/by-region/', '/systems/sinclair-zx-spectrum/',
 '/systems/sinclair-zx-spectrum/basic/', '/systems/sinclair-zx-spectrum/basic/meet-basic/',
 '/systems/sinclair-zx-spectrum/basic/meet-basic/unit-01-make-the-spectrum-answer/',
 '/vault/', '/vault/category/games/', '/vault/category/hardware/', '/vault/games/commando/',
 '/vault/hardware/sid-chip/', '/vault/techniques/screen-memory/', '/vault/systems/sinclair-zx-spectrum/',
 '/patterns/', '/patterns/platform/sinclair-zx-spectrum/', '/patterns/category/rendering/',
 '/patterns/difficulty/beginner/', '/patterns/commodore-64/assembly/rendering/hardware-sprites/',
 '/timeline/', '/timeline/1980s/', '/timeline/1920s/',
 '/setup/', '/setup/roms/', '/setup/sinclair-zx-spectrum/native/', '/setup/commodore-64/native/',
 '/setup/commodore-amiga/native/', '/setup/nintendo-entertainment-system/native/',
 '/systems/sinclair-zx-spectrum/getting-started/', '/foundations/', '/craft/', '/from-the-metal/',
 '/field-notes/', '/updates/', '/family/', '/about/', '/404/'
];
const out = '.impeccable/review/site-review';
const screenshotRoutes = ['/vault/games/commando/', '/vault/techniques/screen-memory/', '/patterns/', '/patterns/commodore-64/assembly/rendering/hardware-sprites/', '/timeline/1980s/', '/setup/', '/setup/commodore-64/native/'];
for (const route of routes) {
 test(`review geometry and accessibility ${route}`, async ({ page }, info) => {
  test.setTimeout(60000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  const response = await page.goto(route);
  await page.evaluate(() => document.fonts.ready);
  // Load lazy images before measuring: the test records intrinsic dimensions.
  await page.locator('img[loading="lazy"]').evaluateAll(images => images.forEach(image => image.setAttribute('loading', 'eager')));
  await page.waitForLoadState('networkidle');
  await page.addStyleTag({content:'*, *::before, *::after {animation: none !important; transition: none !important; scroll-behavior: auto !important}'});
  const imageDecode = await page.locator('main img').evaluateAll(async images => await Promise.all(images.map(async image => { try { await (image as HTMLImageElement).decode(); return null; } catch { return (image as HTMLImageElement).src; } })));
  const geometry = await page.evaluate(() => {
   const visible = (e: Element) => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
   return {
    viewport: innerWidth, document: document.documentElement.scrollWidth, h1: [...document.querySelectorAll('h1')].map(e=>e.textContent),
    overflow: [...document.querySelectorAll('main *')].filter(e=>visible(e) && (e.getBoundingClientRect().right > innerWidth+1 || e.getBoundingClientRect().left < -1)).map(e=>({tag:e.tagName,cls:e.className,text:e.textContent?.slice(0,100),left:e.getBoundingClientRect().left,right:e.getBoundingClientRect().right})).slice(0,30),
    paragraphs: [...document.querySelectorAll('main p')].filter(visible).map(e=>({width:e.getBoundingClientRect().width,font:getComputedStyle(e).fontSize,text:e.textContent?.slice(0,100)})),
    images: [...document.querySelectorAll<HTMLImageElement>('main img')].map(e=>({src:e.getAttribute('src')?.slice(0,200),width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height,nativeWidth:e.naturalWidth,nativeHeight:e.naturalHeight,fit:getComputedStyle(e).objectFit,clip:getComputedStyle(e.parentElement!).overflow,captionWidth:e.closest('figure')?.querySelector('figcaption')?.getBoundingClientRect().width})),
    anchors: [...document.querySelectorAll<HTMLAnchorElement>('main a[href^="#"]')].map(a=>({href:a.getAttribute('href'),exists:!!document.getElementById(decodeURIComponent(a.hash.slice(1)))})),
    smallControls: [...document.querySelectorAll('main button, main input, main select, main summary')].filter(visible).filter(e=>e.getBoundingClientRect().height<24 || e.getBoundingClientRect().width<24).map(e=>({text:e.textContent?.slice(0,100),width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height})),
   };
  });
  const axe = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  const slug = route === '/' ? 'home' : route.replaceAll('/','_');
  await mkdir(out, {recursive:true});
  await writeFile(`${out}/${info.project.name}-${slug}.json`, JSON.stringify({route,project:info.project.name,status:response?.status(),errors,imageDecode,geometry,violations:axe.violations},null,2));
  if (screenshotRoutes.includes(route)) await page.screenshot({path:`${out}/${info.project.name}-${slug}.png`, fullPage:false});
  expect.soft(response?.status(), 'HTML response').toBe(route === '/404/' ? 404 : 200);
  expect.soft(geometry.h1.length, 'One page heading').toBe(1);
  expect.soft(geometry.document, JSON.stringify(geometry.overflow)).toBeLessThanOrEqual(geometry.viewport+1);
  expect.soft(geometry.images.filter(i=>!i.nativeWidth), 'All images decode').toEqual([]);
  expect.soft(geometry.anchors.filter(a=>!a.exists), 'Local links resolve').toEqual([]);
  expect.soft(errors, 'Client exceptions').toEqual([]);
  expect.soft(axe.violations.filter(v=>v.impact==='serious'||v.impact==='critical').map(v=>({id:v.id,nodes:v.nodes.length})), 'WCAG A/AA serious/critical, no debt exemptions').toEqual([]);
 });
}
test('review discovery interactions', async ({page},info)=>{
 await page.goto('/vault/');
 if (info.project.name === 'mobile') {
  await page.locator('[data-vault-subjects] summary').click();
  await expect(page.locator('[data-vault-subjects]')).toHaveAttribute('open','');
 }
 await page.locator('.vault-story-action').click();
 await expect(page).toHaveURL(/\/vault\/games\/commando\/?$/);
 await page.goto('/timeline/1980s/');
 await page.locator('a[href="#year-1985"]').click();
 await expect(page).toHaveURL(/#year-1985$/);
 await page.goto('/setup/');
 // This page intentionally hides its sidebar below 1100px; no mobile ToC control exists.
 await page.goto('/patterns/');
 await page.locator('a[href="/patterns/category/rendering"]').click();
 await expect(page.locator('main h1')).toContainText('Rendering');
 await page.locator('.pattern-card').first().click();
 await expect(page.locator('.pattern-entry')).toBeVisible();
});

test('review production search', async ({page})=>{
 await page.goto('/vault/games/commando/');
 await page.getByRole('button',{name:'Search',exact:true}).click();
 const input = page.locator('.pagefind-ui__search-input');
 await input.fill('SID');
 await expect(page.locator('.pagefind-ui__result-link').first()).toBeVisible({timeout:15000});
 await input.fill('zzzznomatchingterm123');
 await expect(page.locator('.pagefind-ui__message')).toContainText('No results');
 await page.keyboard.press('Escape');
 await expect(page.locator('.search-modal')).not.toBeVisible();

});

for (const platform of ['commodore-64','commodore-amiga','sinclair-zx-spectrum','nintendo-entertainment-system']) {
 test(`review setup tabs direct and followed ${platform}`, async ({page},info)=>{
  const observations = [];
  for (const viaLink of [false,true]) {
   if(viaLink) { await page.goto('/setup/'); await page.locator(`a[href="/setup/${platform}/native"]`).click(); }
   else await page.goto(`/setup/${platform}/native/`);
   const windows = page.getByRole('tab',{name:'Windows',exact:true});
   await windows.click();
   observations.push({viaLink,selected:await windows.getAttribute('aria-selected'),active:await page.locator('.tab-panel.active').getAttribute('id')});
   await expect.soft(windows, `Windows selection viaLink=${viaLink}`).toHaveAttribute('aria-selected','true');
   await page.screenshot({path:`${out}/${info.project.name}-tabs-${platform}-${viaLink}.png`});
  }
  await writeFile(`${out}/${info.project.name}-tabs-${platform}.json`,JSON.stringify(observations,null,2));
 });
}

for (const width of [320,768,1280]) {
 test(`review four-section responsive bounds ${width}`, async ({page},info)=>{
  test.skip(info.project.name !== 'desktop', 'Explicit viewport matrix');
  const rows=[];
  await page.setViewportSize({width,height:900});
  for(const route of ['/vault/games/commando/','/vault/techniques/screen-memory/','/patterns/commodore-64/assembly/rendering/hardware-sprites/','/timeline/1980s/','/setup/','/setup/commodore-64/native/']) {
   await page.goto(route); await page.evaluate(()=>document.fonts.ready);
   const g=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth,overflow:[...document.querySelectorAll('main *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1).map(e=>({tag:e.tagName,cls:e.className,right:e.getBoundingClientRect().right})).slice(0,10)}));
   rows.push({route,...g});
   expect.soft(g.document,`${route} ${JSON.stringify(g.overflow)}`).toBeLessThanOrEqual(g.viewport+1);
  }
  await writeFile(`${out}/responsive-${width}.json`,JSON.stringify(rows,null,2));
 });
}
