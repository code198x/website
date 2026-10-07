import {test,expect} from '@playwright/test';

test('stories connect reviewed subjects to their articles and the dated chronology',async({page})=>{
 await page.goto('/timeline/');
 await expect(page.locator('[data-story="sound"]')).toBeVisible();
 await page.getByRole('button',{name:'More ways to make games',exact:true}).click();
 await expect(page.locator('[data-story="making"]')).toBeVisible();
 await expect(page.locator('[data-story="sound"]')).toBeHidden();
 await page.reload();
 await expect(page.locator('[data-story="making"]')).toBeVisible();
 await page.locator('[data-story="making"]').getByRole('link',{name:'The Quill',exact:true}).click();
 await expect(page).toHaveURL(/\/vault\/tools\/the-quill\/$/);
 await page.goBack();
 await expect(page.locator('[data-story="making"]')).toBeVisible();
 await page.locator('[data-story="making"]').getByRole('link',{name:'Browse 1983',exact:true}).click();
 await expect(page).toHaveURL(/\/timeline\/1980s\/#year-1983$/);
 await expect(page.locator('#year-1983')).toBeVisible();
});

test('the decade count describes rendered events and filters survive navigation',async({page})=>{
 await page.goto('/timeline/1980s/');
 const total=Number(await page.locator('[data-total]').getAttribute('data-total'));
 expect(total).toBeGreaterThan(100);
 await expect(page.locator('[data-event]')).toHaveCount(total);
 await page.getByRole('combobox',{name:'Subject',exact:true}).selectOption('software');
 await page.getByLabel('Search this decade',{exact:true}).fill('SoundTracker');
 await expect(page.locator('[data-event]:visible').getByRole('link',{name:'SoundTracker',exact:true})).toBeVisible();
 await page.reload();
 await expect(page.getByRole('combobox',{name:'Subject',exact:true})).toHaveValue('software');
 await expect(page.getByLabel('Search this decade',{exact:true})).toHaveValue('SoundTracker');
 await page.getByLabel('Search this decade',{exact:true}).fill('no-such-event-785430');
 await expect(page.locator('[data-empty]')).toBeVisible();
 await expect(page.locator('[data-year]:visible')).toHaveCount(0);
 await page.getByRole('button',{name:'Clear filters'}).click();
 await expect(page.locator('[data-event]:visible')).toHaveCount(total);
 await expect(page.getByLabel('Search this decade',{exact:true})).toBeFocused();
 await page.getByRole('combobox',{name:'Sources',exact:true}).selectOption('world');
 const visible=page.locator('[data-event]:visible');
 expect(await visible.count()).toBeGreaterThan(0);
 expect(await visible.evaluateAll(rows=>rows.every(row=>(row as HTMLElement).dataset.source==='world'))).toBe(true);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
});

test('stories and chronology remain readable without JavaScript',async({browser,baseURL})=>{
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();
 await page.goto(`${baseURL}/timeline/`);
 await expect(page.locator('[data-story]:visible')).toHaveCount(3);
 await expect(page.locator('[data-story-choice]:visible')).toHaveCount(0);
 await page.goto(`${baseURL}/timeline/1980s/`);
 await expect(page.locator('[data-event]')).toHaveCount(Number(await page.locator('[data-total]').getAttribute('data-total')));
 await expect(page.getByRole('search')).toBeHidden();
 expect(await page.getByRole('link',{name:'SoundTracker',exact:true}).count()).toBe(1);
 await context.close();
});
