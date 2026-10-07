import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir } from 'node:fs/promises';

const machines = ['commodore-64', 'commodore-amiga', 'sinclair-zx-spectrum', 'nintendo-entertainment-system'];

for (const machine of machines) {
  test(`OS instructions survive navigation: ${machine}`, async ({ page }) => {
    for (const viaLink of [false, true, true]) {
      if (viaLink) {
        await page.goto('/setup/');
        await page.locator(`a[href="/setup/${machine}/native"]`).click();
      } else await page.goto(`/setup/${machine}/native/`);
      const tabs = page.getByRole('tab');
      await expect(page.locator('.toc-list')).not.toContainText('Install Homebrew');
      for (const name of ['Windows', 'Linux', 'macOS']) {
        const tab = page.getByRole('tab', { name, exact: true });
        await tab.click();
        await expect(tab).toHaveAttribute('aria-selected', 'true');
        await expect(page.getByRole('tabpanel')).toHaveCount(1);
        await expect(page.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', await tab.getAttribute('id') as string);
      }
      await tabs.first().focus();
      await page.keyboard.press('ArrowRight');
      await expect(tabs.nth(1)).toBeFocused();
      await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
      await page.keyboard.press('End');
      await expect(tabs.last()).toBeFocused();
      await page.keyboard.press('ArrowRight');
      await expect(tabs.first()).toBeFocused();
      await page.keyboard.press('ArrowLeft');
      await expect(tabs.last()).toBeFocused();
      await page.keyboard.press('Home');
      await expect(tabs.first()).toBeFocused();
    }
  });
}

test('browser starts lead to working lesson tools', async ({ page }) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/setup/');
  await page.locator('.setup-content').getByRole('link', { name: 'Write your first Spectrum BASIC program' }).click();
  await page.getByRole('button', { name: 'Run this code', exact: true }).click();
  await expect(page.locator('.machine-status')).toHaveText('Running your code.', { timeout: 30000 });
  await page.getByRole('button', { name: 'Close and return', exact: true }).click();
  await page.goto('/setup/');
  await page.locator('.setup-content').getByRole('link', { name: 'Assemble your first Spectrum program' }).click();
  await page.locator('.sandbox-run').click();
  await expect(page.locator('.sandbox-status')).toContainText('Running', { timeout: 30000 });
  await page.goto('/setup/');
  await page.locator('.setup-content').getByRole('link', { name: 'Make the NES screen change colour' }).click();
  await page.getByRole('button', { name: 'Assemble & run', exact: true }).click();
  await expect(page.locator('.editor-status')).toContainText('Running', { timeout: 30000 });
  expect(errors).toEqual([]);
});

test('setup manuals remain readable and expose local installation', async ({ page }, info) => {
  test.setTimeout(90000);
  const routes = ['/setup/', '/setup/roms/', ...machines.flatMap(machine => [`/systems/${machine}/getting-started/`, `/setup/${machine}/native/`]), '/systems/commodore-amiga/amos/getting-started/', '/systems/commodore-amiga/blitz/getting-started/'];
  const output = '.impeccable/review/setup';
  await mkdir(output, { recursive: true });
  for (const route of routes) {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('.setup-page h1')).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), route).toBe(true);
    expect.soft((await new AxeBuilder({ page }).include('.setup-page').analyze()).violations, route).toEqual([]);
    if (info.project.name === 'mobile') {
      await page.getByRole('button', { name: 'On this page' }).click();
      await expect(page.locator('.toc-list a').first()).toBeVisible();
    }
    const filename = route.replaceAll('/', '_');
    await page.addStyleTag({ content: 'astro-dev-toolbar { display: none !important; }' });
    await page.screenshot({ path: `${output}/${info.project.name}${filename}.png`, fullPage: true, scale: 'css' });
    if (route === '/systems/commodore-64/getting-started/') {
      await page.getByText('Install Build198x', { exact: true }).click();
      const install = page.locator('.tool-install').filter({ hasText: 'Install Build198x' });
      await install.getByRole('tab', { name: 'Windows', exact: true }).click();
      await expect(install.getByRole('tabpanel')).toContainText('PowerShell');
      expect.soft((await new AxeBuilder({ page }).include('.setup-page').analyze()).violations).toEqual([]);
      await page.screenshot({ path: `${output}/${info.project.name}-install.png`, fullPage: true, scale: 'css' });
    }
  }
});

test('OS instructions remain available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const machine of machines) {
    await page.goto(`/setup/${machine}/native/`);
    for (const id of ['macos', 'windows', 'linux']) await expect(page.locator(`#${id}`)).toBeVisible();
  }
  await page.goto('/systems/commodore-64/getting-started/');
  await page.getByText('Install Build198x', { exact: true }).click();
  for (const id of ['macos', 'windows', 'linux']) await expect(page.locator(`#build198x-${id}`)).toBeVisible();
  await context.close();
});
