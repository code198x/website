import { test, expect } from '@playwright/test';

test('Vault search survives navigation and keeps subject labels', async ({ page }) => {
  await page.goto('/vault/');
  await page.getByLabel('Search article titles').fill('colour clash');
  await expect(page.locator('#vault-results')).toContainText('Colour Clash');
  await expect(page.locator('#vault-results')).toContainText('Techniques');
  await page.locator('#vault-results a').first().click();
  await expect(page.locator('main h1')).toHaveText('Colour Clash');
  await page.goBack();
  await page.getByLabel('Search article titles').fill('no-such-article-xyz');
  await expect(page.locator('#vault-results')).toContainText('No matching titles');
  await page.getByRole('button', { name: 'Clear', exact: true }).click();
  await expect(page.locator('#vault-results')).toBeHidden();
});

test('one lesson machine keeps edits per experiment and runs the selected source', async ({ page }) => {
  await page.goto('/systems/sinclair-zx-spectrum/assembly/meteor-storm/unit-28/');
  const machine = page.locator('#meteor-colour-machine');
  const source = machine.locator('.sandbox-source');
  await machine.locator('.source-drawer summary').click();
  await source.click();
  await source.press('ControlOrMeta+End');
  await source.pressSequentially('\n; retained bands edit\n');
  const clash = page.getByRole('button', { name: 'Try this · One yellow cell', exact: true });
  await clash.scrollIntoViewIfNeeded();
  const before = await clash.evaluate(button => button.getBoundingClientRect().top);
  await clash.click();
  await page.waitForTimeout(350);
  expect(Math.abs((await clash.evaluate(button => button.getBoundingClientRect().top)) - before)).toBeLessThan(3);
  await expect(page.locator('.meteor-experiment')).toHaveCount(1);
  await expect(source).toHaveValue(/ld \(hl\),\$46/);
  await source.click();
  await source.press('ControlOrMeta+End');
  await source.pressSequentially('\n; retained clash edit\n');
  await page.getByRole('button', { name: 'Try this · Colour by place', exact: true }).click();
  await expect(source).toHaveValue(/retained bands edit/);
  await expect(source).not.toHaveValue(/retained clash edit/);
  await clash.click();
  await expect(source).toHaveValue(/retained clash edit/);
  await machine.locator('.sandbox-run').click();
  await expect(machine.locator('.sandbox-status')).toContainText('Running', { timeout: 30000 });
  await expect(machine.locator('[data-machine-poster]')).toBeHidden();
  await machine.locator('.sandbox-revert').click();
  await expect(source).toHaveValue(/ld \(hl\),\$46/);
  await expect(source).not.toHaveValue(/retained clash edit/);
  await machine.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(page.locator('body')).not.toHaveClass(/machine-docked/);
});
