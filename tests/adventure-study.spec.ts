import {expect,test} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const route='/vault/studies/adventure/';
test('Adventure preserves readable diagrams, optional puzzles and source navigation',async({page})=>{
 await page.goto(route);
 await page.evaluate(()=>document.fonts.ready);
 await expect(page.locator('main h1')).toHaveCount(1);
 await expect(page.locator('.article-opening .breadcrumbs')).toHaveCount(0);
 await expect.poll(async()=>(await page.locator('.breadcrumbs').boundingBox())!.y+(await page.locator('.breadcrumbs').boundingBox())!.height).toBeLessThanOrEqual((await page.locator('.article-opening').boundingBox())!.y+1);
 const opening=await page.locator('.article-opening').boundingBox();
 const frame=await page.locator('main').boundingBox();
 expect(opening!.x).toBeCloseTo(frame!.x,1);
 expect(opening!.width).toBeCloseTo(frame!.width,1);
 for(const link of await page.locator('.study-contents a, .feature-prose a[href^="#source-"]').all()){
  const href=await link.getAttribute('href');
  await expect(page.locator(href!)).toHaveCount(1);
 }
 const figures=page.locator('.article-figure');
 await expect(figures).toHaveCount(4);
 for(const image of await figures.locator('img').all()){
  await image.scrollIntoViewIfNeeded();
  await expect.poll(()=>image.evaluate(i=>(i as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  if(await image.locator('..').evaluate(p=>p.tagName==='PICTURE'))expect(await image.evaluate(i=>(i as HTMLImageElement).currentSrc.endsWith('-phone.svg'))).toBe(page.viewportSize()!.width<=760);
  else expect((await image.boundingBox())!.width).toBeLessThanOrEqual(await image.evaluate(i=>(i as HTMLImageElement).naturalWidth));
 }
 const reveals=page.locator('.feature-prose details');
 await expect(reveals).toHaveCount(3);
 for(const reveal of await reveals.all()){
  await expect(reveal).not.toHaveAttribute('open','');
  const summary=reveal.locator('summary');await summary.focus();await page.keyboard.press('Enter');
  await expect(reveal).toHaveAttribute('open','');
 }
 const prose=await page.locator('.feature-prose>p').allTextContents();
 await expect(page.locator('aside.article-pullquote')).toHaveCount(3);
 for(const quote of await page.locator('aside.article-pullquote').all()){
  await expect(quote).toHaveAttribute('aria-hidden','true');
  const text=await quote.locator('p').innerText();
  expect(prose.some(p=>p.includes(text))).toBe(true);
 }
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
 const results=await new AxeBuilder({page}).analyze();
 expect(results.violations).toEqual([]);
 await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content',/noindex/);
});
