import { test, expect, type Page } from '@playwright/test';
import fs from 'node:fs/promises';

const lesson = '/systems/sinclair-zx-spectrum/assembly/meet-assembly/unit-01/';
const draftKeys = (page: Page) => page.evaluate(() => Object.keys(localStorage).filter(key => key.startsWith('code198x:assembly-draft:')));

test('values restored before scripts initialise are saved against the maintained starter', async ({ page }) => {
  let release!: () => void;
  const ready = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/_astro/*.js', async route => { await ready; await route.continue(); });
  await page.goto(lesson, { waitUntil: 'commit' });
  const source = page.locator('.sandbox-source');
  await expect(page.locator('.sandbox-draft-status')).toBeAttached();
  const value = await source.evaluate((editor: HTMLTextAreaElement) => {
    editor.value = `${editor.defaultValue}\n; browser-restored edit\n`;
    return editor.value;
  });
  release();
  await expect(page.locator('.sandbox-draft-status')).toContainText('Draft saved');
  const [key] = await draftKeys(page);
  expect(JSON.parse((await page.evaluate(key => localStorage.getItem(key), key))!).source).toBe(value);
});
async function edit(page: Page, marker = '; my saved experiment') {
  const source = page.locator('.sandbox-source').first();
  await source.locator('xpath=ancestor::details').evaluate((details: HTMLDetailsElement) => { details.open = true; });
  const original = await source.inputValue();
  await source.fill(`${original}\n${marker}\n`);
  await expect(page.locator('.sandbox-draft-status').first()).toContainText('Draft saved');
  return { original, value: await source.inputValue() };
}

test('reload offers explicit recovery, download preserves it, and revert clears it', async ({ page }) => {
  await page.goto(lesson);
  const { original, value } = await edit(page);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Restore draft', exact: true })).toBeVisible();
  await expect(page.locator('.sandbox-source')).toHaveValue(original);
  await expect(page.locator('.sandbox-source')).toHaveAttribute('readonly', '');
  const downloading = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download draft (.json)', exact: true }).click();
  const download = await downloading;
  const saved = JSON.parse(await fs.readFile((await download.path())!, 'utf8'));
  expect(saved.source).toBe(value);
  expect(await draftKeys(page)).toHaveLength(1);
  await page.getByRole('button', { name: 'Restore draft', exact: true }).click();
  await expect(page.locator('.sandbox-source')).toHaveValue(value);
  await expect(page.locator('.sandbox-source')).not.toHaveAttribute('readonly', '');
  await page.locator('.sandbox-revert').click();
  expect(await draftKeys(page)).toEqual([]);
  await page.reload();
  await expect(page.locator('.sandbox-source')).toHaveValue(original);
  await expect(page.getByRole('button', { name: 'Restore draft', exact: true })).toBeHidden();
});

test('navigation retains source and companion edits together', async ({ page }) => {
  const route = '/systems/sinclair-zx-spectrum/assembly/meteor-storm/unit-10/';
  await page.goto(route);
  const { value } = await edit(page);
  const companion = page.locator('.sandbox-companion');
  await expect(companion).toHaveCount(1);
  await page.locator('.sandbox-companions summary').click();
  const data = `${await companion.inputValue()}\n; edited companion\n`;
  await companion.fill(data);
  await page.getByRole('link', { name: '198x family', exact: true }).click();
  await expect(page).toHaveURL(/\/family\/?$/);
  await page.goBack();
  await page.getByRole('button', { name: 'Restore draft', exact: true }).click();
  await expect(page.locator('.sandbox-source')).toHaveValue(value);
  await expect(page.locator('.sandbox-companion')).toHaveValue(data);
});

test('changed starters require a choice and discard leaves the new starter', async ({ page }) => {
  await page.goto(lesson);
  const { original } = await edit(page);
  const [key] = await draftKeys(page);
  await page.evaluate(key => {
    const saved = JSON.parse(localStorage.getItem(key)!);
    saved.revision = 'older-starter';
    localStorage.setItem(key, JSON.stringify(saved));
  }, key);
  await page.reload();
  await expect(page.locator('.sandbox-draft-status')).toContainText('starting source has changed');
  await page.getByRole('button', { name: 'Discard saved draft', exact: true }).click();
  await expect(page.locator('.sandbox-source')).toHaveValue(original);
  expect(await draftKeys(page)).toEqual([]);
});

test('unreadable drafts remain downloadable and cannot be overwritten by typing', async ({ page }) => {
  await page.goto(lesson);
  await edit(page);
  const [key] = await draftKeys(page);
  await page.evaluate(key => localStorage.setItem(key, '{broken draft'), key);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Restore draft', exact: true })).toBeDisabled();
  await expect(page.locator('.sandbox-source')).toHaveAttribute('readonly', '');
  expect(await page.evaluate(key => localStorage.getItem(key), key)).toBe('{broken draft');
  const downloading = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download draft (.json)', exact: true }).click();
  expect(await fs.readFile((await (await downloading).path())!, 'utf8')).toBe('{broken draft');
});

test('changed companion names keep all old files for download', async ({ page }) => {
  await page.goto(lesson);
  await edit(page);
  const [key] = await draftKeys(page);
  await page.evaluate(key => {
    const saved = JSON.parse(localStorage.getItem(key)!);
    saved.files['old-data.inc'] = 'db 17';
    localStorage.setItem(key, JSON.stringify(saved));
  }, key);
  await page.reload();
  await expect(page.locator('.sandbox-draft-status')).toContainText('companion files have changed');
  await expect(page.getByRole('button', { name: 'Restore draft', exact: true })).toBeDisabled();
  expect(JSON.parse((await page.evaluate(key => localStorage.getItem(key), key))!).files).toEqual({ 'old-data.inc': 'db 17' });
});

test('failed storage warns and cancelling reload keeps the edits', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => { throw new DOMException('Quota exceeded', 'QuotaExceededError'); };
  });
  await page.goto(lesson);
  const source = page.locator('.sandbox-source');
  await source.locator('xpath=ancestor::details').evaluate((details: HTMLDetailsElement) => { details.open = true; });
  const value = `${await source.inputValue()}\n; keep me\n`;
  await source.fill(value);
  await expect(page.locator('.sandbox-draft-status')).toContainText('could not be saved');
  const dialogPromise = page.waitForEvent('dialog');
  const reload = page.reload({ timeout: 2000 }).catch(() => null);
  const dialog = await dialogPromise;
  expect(dialog.type()).toBe('beforeunload');
  await dialog.dismiss();
  await reload;
  await expect(source).toHaveValue(value);
  const navigating = page.waitForEvent('dialog');
  const click = page.getByRole('link', { name: '198x family', exact: true }).click();
  const navigationDialog = await navigating;
  expect(navigationDialog.type()).toBe('beforeunload');
  await navigationDialog.dismiss();
  await click;
  await expect(page).toHaveURL(new RegExp(lesson));
});
