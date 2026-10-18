import {expect,test} from '@playwright/test';

const preview='/catalogue/editorial-study/';

test('figures leave the reading column without stretching the capture',async({page})=>{
 await page.goto(preview);
 await expect(page.locator('main h1')).toHaveCount(1);
 await expect(page.locator('nav[aria-label="Breadcrumb"]')).toHaveCount(1);
 await expect(page.locator('.article-opening nav')).toHaveCount(1);
 const figure=page.locator('.article-figure').first();
 const image=figure.locator('img');
 await image.scrollIntoViewIfNeeded();
 await expect(image).toHaveJSProperty('complete',true);
 const imageBox=await image.boundingBox();const captionBox=await figure.locator('figcaption').boundingBox();
 expect(imageBox).not.toBeNull();expect(captionBox).not.toBeNull();
 expect(imageBox!.width).toBeLessThanOrEqual(await image.evaluate(i=>(i as HTMLImageElement).naturalWidth));
 if(page.viewportSize()!.width>760)expect(captionBox!.x).toBeGreaterThanOrEqual(imageBox!.x+imageBox!.width);
 else expect(captionBox!.y).toBeGreaterThanOrEqual(imageBox!.y+imageBox!.height);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('emphasis repeats accessible prose without inventing a historical speaker',async({page})=>{
 await page.goto(preview);
 for(const quote of await page.locator('aside.article-pullquote').all()){
  await expect(quote).toHaveAttribute('aria-hidden','true');
  const text=await quote.locator('p').innerText();
  const paragraphs=await page.locator('.feature-prose>p').allTextContents();
  expect(paragraphs.some(p=>p.includes(text))).toBe(true);
 }
 const href=await page.getByRole('link',{name:'Full credits and capture conditions'}).getAttribute('href');
 expect(href).toBeTruthy();await page.getByRole('link',{name:'Full credits and capture conditions'}).click();
 await expect(page.locator('main h1')).toHaveText('Capture credits and provenance');
 await expect(page.locator('main')).toContainText('Barry Silverman');
});

test('breadcrumb geometry recovers when soft navigation enters and leaves an opening',async({page})=>{
 await page.goto('/vault/games/thrust/');
 const before=await page.locator('.breadcrumbs').evaluate(e=>e.getBoundingClientRect().height);
 const move=async(href:string)=>{
  await page.evaluate(h=>{const a=document.createElement('a');a.id='test-navigation';a.href=h;a.textContent='Test navigation';document.querySelector('main')!.prepend(a)},href);
  await page.locator('#test-navigation').click();await page.waitForURL(`**${href}`);
 };
 await move(preview);
 await expect(page.locator('.article-opening .breadcrumbs')).toHaveCount(1);
 await expect.poll(()=>page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--crumbs-height').trim())).toBe('0px');
 await move('/vault/games/thrust/');
 await expect(page.locator('.breadcrumbs')).toHaveCount(1);
 await expect.poll(()=>page.locator('.breadcrumbs').evaluate(e=>e.getBoundingClientRect().height)).toBe(before);
 await expect.poll(()=>page.evaluate(()=>parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--crumbs-height')))).toBe(before);
});


test('bleed figure reaches the shared frame and preserves native capture size',async({page})=>{
 await page.goto('/catalogue/editorial-study/specimen/');
 const frame=await page.locator('main').boundingBox();
 const figure=page.locator('.article-figure[data-size="bleed"]');
 await figure.scrollIntoViewIfNeeded();
 const box=await figure.boundingBox();
 expect(box!.x).toBeCloseTo(frame!.x,1);
 expect(box!.x+box!.width).toBeCloseTo(frame!.x+frame!.width,1);
 const image=figure.locator('img');
 expect((await image.boundingBox())!.width).toBeLessThanOrEqual(await image.evaluate(i=>(i as HTMLImageElement).naturalWidth));
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
