import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
import catalogue from '../public/emulators/catalog.json' with { type: 'json' };
import { playerFirmwareNote } from '../src/lib/player-firmware';

test('browser start precedes optional local setup and Meteor Storm offers the foundation', async ({ page }) => {
  await page.goto('/systems/sinclair-zx-spectrum/assembly/');
  const start = page.getByRole('link', { name: 'Start: Meet Assembly', exact: false });
  await expect(start).toHaveCount(1);
  const startTop = await start.evaluate(link => link.getBoundingClientRect().top);
  expect(startTop).toBeLessThan(900);
  const setup = page.getByRole('link', { name: 'Set up local tools', exact: false });
  expect(startTop).toBeLessThan(await setup.evaluate(link => link.getBoundingClientRect().top));
  await start.click();
  await expect(page).toHaveURL(/meet-assembly\/unit-01\/?$/);
  await page.goto('/systems/sinclair-zx-spectrum/assembly/meteor-storm/');
  await expect(page.locator('header .entry-advice')).toContainText('New to assembly?');
  await page.locator('header .entry-advice a').click();
  await expect(page).toHaveURL(/meet-assembly\/?$/);
});

test('first editor exports edits and takes a readable error back to the correct line', async ({ page }) => {
  await page.goto('/systems/sinclair-zx-spectrum/assembly/meet-assembly/unit-01/');
  const drawer = page.locator('.source-drawer');
  await drawer.locator('summary').click();
  const source = page.locator('.sandbox-source');
  const original = await source.inputValue();
  await source.fill(original.replace('ld a,2', 'ld a,4'));
  const downloading = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download source', exact: true }).click();
  const download = await downloading;
  expect(download.suggestedFilename()).toBe('first-program.asm');
  expect(await fs.readFile((await download.path())!, 'utf8')).toBe(await source.inputValue());
  await source.fill(original.replace('ld a,2', 'ld a,not_a_label'));
  await drawer.locator('summary').click();
  await page.locator('.sandbox-run').click();
  await expect(page.locator('.sandbox-diagnostics')).toHaveText('Line 6: undefined symbol `not_a_label`');
  await expect(page.locator('.sandbox-diagnostics')).not.toContainText('expansion_frames');
  expect((await new AxeBuilder({ page }).include('.sandbox').analyze()).violations).toEqual([]);
  const editLine = page.getByRole('button', { name: 'Edit line 6', exact: true });
  await editLine.focus();
  await page.keyboard.press('Enter');
  await expect(drawer).toHaveAttribute('open', '');
  await expect(source).toBeFocused();
  expect(await source.evaluate((editor: HTMLTextAreaElement) => editor.value.slice(editor.selectionStart, editor.selectionEnd))).toBe(' ld a,not_a_label');
  await page.locator('.sandbox-revert').click();
  await page.locator('.sandbox-run').click();
  await expect(page.locator('.sandbox-status')).toContainText('Running', { timeout: 30000 });
  await expect(page.locator('.sandbox-message--build')).toBeHidden();
  await expect(page.locator('main')).toContainText('Edits are saved in this browser');
});

test('gateway firmware statement follows this build and prediction answers stay folded', async ({ page }) => {
  await page.goto('/systems/sinclair-zx-spectrum/');
  const spectrum = catalogue.find(entry => entry.id === 'sinclair-zx-spectrum')!;
  const launcher = page.locator('section').filter({ has: page.getByRole('heading', { name: 'Try the machine', exact: true }) });
  await expect(launcher.getByText(playerFirmwareNote(spectrum, spectrum.defaultVariant), { exact: true })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Language routes', exact: true }).getByText('Both welcome beginners.', { exact: false })).toBeVisible();
  await page.goto('/systems/sinclair-zx-spectrum/assembly/meteor-storm/unit-01/');
  const question = page.locator('.question').filter({ hasText: 'After changing both patterns' });
  await expect(question.locator('.question-answer')).toBeHidden();
  await question.locator('summary').click();
  await expect(question.locator('.question-answer')).toContainText('$7F,$80');
});


test('changing a byte experiment preserves the open editor and folds its explanation', async ({ page }) => {
  await page.goto('/systems/sinclair-zx-spectrum/assembly/meet-assembly/unit-02/');
  const root = page.locator('.byte-lesson');
  await root.locator('.source-drawer summary').click();
  await root.locator('.experiment-help summary').click();
  await root.locator('[data-stage="1"]').click();
  await expect(root.locator('.source-drawer')).toHaveAttribute('open', '');
  await expect(root.locator('.experiment-help')).not.toHaveAttribute('open', '');
  await expect(root.locator('.sandbox-source')).toBeVisible();
});
